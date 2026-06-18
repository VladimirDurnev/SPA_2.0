/**
 * Хук виртуальной tree-table: скролл, окно строк и догрузка chunk'ов.
 *
 * ## Вертикальный скролл (два независимых scrollTop)
 *
 * - `scrollTop` — обновляется на каждый scroll-событие → UI (padding, ~15–19 строк в Ant Table).
 * - `fetchScrollTop` — обновляется только после остановки скролла → HTTP-запросы chunk'ов.
 *
 * Так UI остаётся отзывчивым, а сеть не получает десятки запросов при перетаскивании ползунка.
 *
 * ## Горизонтальный скролл
 *
 * Header и body — две отдельные Ant Table. Их `.ant-table-content` синхронизируются
 * с нижней полосой `HorizontalScrollTrack`, чтобы широкие колонки скроллились вместе.
 */
import { AntdApp, useTranslation } from '@org/core';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import { ensureFlatRangeLoadedThunk } from '../../api/incidentsThunks';
import { INCIDENTS_SCROLL_FETCH_DELAY_MS, INCIDENTS_TABLE_SCROLL_X } from '../../constants';
import { useIncidentsTableColumns } from '../../hooks/useIncidentsTableColumns';
import { selectIncidentsState } from '../../selectors/incidentsSelectors';
import { selectIsTableReady, selectVirtualWindow } from '../../selectors/tableSelectors';

/** Внутренний scroll-контейнер Ant Table (версии/темы отличаются по классу). */
function getTableScrollElement(root: HTMLElement | null): HTMLElement | null {
  return root?.querySelector<HTMLElement>('.ant-table-content')
    ?? root?.querySelector<HTMLElement>('.ant-table-body')
    ?? null;
}

/** Фиксированный scroll.x — header и body считают colgroup одинаково */
export const INCIDENTS_TABLE_HORIZONTAL_SCROLL = { x: INCIDENTS_TABLE_SCROLL_X };

/** Всё состояние и side-effects таблицы; `IncidentsTable` остаётся чистой разметкой. */
export function useIncidentsTable() {
  const dispatch = useAppDispatch();
  const { notification } = AntdApp.useApp();
  const { t } = useTranslation('incidents');
  const columns = useIncidentsTableColumns();

  // --- Вертикальный скролл: UI vs fetch ---
  const scrollTopRef = useRef(0);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  /** Позиция для virtual window и paddingTop/Bottom */
  const [scrollTop, setScrollTop] = useState(0);
  /** Позиция для ensureFlatRangeLoadedThunk — отстаёт от scrollTop до остановки скролла */
  const [fetchScrollTop, setFetchScrollTop] = useState(0);

  // --- Горизонтальный скролл ---
  const [horizontalScrollWidth, setHorizontalScrollWidth] = useState(0);
  const [showHorizontalScroll, setShowHorizontalScroll] = useState(false);
  const headerWrapRef = useRef<HTMLDivElement>(null);
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  /** Предотвращает цикл scrollLeft → event → scrollLeft при синхронизации трёх элементов */
  const isSyncingHorizontalScrollRef = useRef(false);

  const isReady = useAppSelector(selectIsTableReady);
  const { isLoading, error } = useAppSelector(selectIncidentsState);
  const virtualWindow = useAppSelector(state => selectVirtualWindow(state, scrollTop));
  const fetchVirtualWindow = useAppSelector(state => selectVirtualWindow(state, fetchScrollTop));

  const visibleWindowRows = virtualWindow.rows.map(({ tableRow }) => tableRow);

  // Ошибки API (init, filter, chunk) — toast с i18n-ключом из slice
  useEffect(() => {
    if (!error) {
      return;
    }

    notification.error({
      description: t(error),
      message: t('errors.notificationTitle'),
    });
  }, [error, notification, t]);

  // Догрузка chunk'ов для placeholder-строк в «устоявшемся» окне (fetchScrollTop)
  useEffect(() => {
    if (!isReady) {
      return;
    }

    void dispatch(ensureFlatRangeLoadedThunk({
      firstVisibleFlatRowIndex: fetchVirtualWindow.firstVisibleFlatRowIndex,
      lastVisibleFlatRowIndex: fetchVirtualWindow.lastVisibleFlatRowIndex,
    }));
  }, [
    dispatch,
    isReady,
    fetchVirtualWindow.lastVisibleFlatRowIndex,
    fetchVirtualWindow.firstVisibleFlatRowIndex,
  ]);

  /** Фиксирует текущую позицию скролла как точку для сетевых запросов */
  const commitFetchScrollPosition = useCallback(() => {
    setFetchScrollTop(scrollTopRef.current);
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const nextScrollTop = event.currentTarget.scrollTop;
    scrollTopRef.current = nextScrollTop;
    setScrollTop(nextScrollTop);

    // Fallback, если браузер не поддерживает scrollend
    clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(
      commitFetchScrollPosition,
      INCIDENTS_SCROLL_FETCH_DELAY_MS,
    );
  }, [commitFetchScrollPosition]);

  // scrollend — сразу после отпускания ползунка / окончания инерции
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const handleScrollEnd = () => {
      clearTimeout(scrollEndTimerRef.current);
      commitFetchScrollPosition();
    };

    scrollContainer.addEventListener('scrollend', handleScrollEnd);

    return () => {
      scrollContainer.removeEventListener('scrollend', handleScrollEnd);
      clearTimeout(scrollEndTimerRef.current);
    };
  }, [commitFetchScrollPosition]);

  // Синхронизация scrollLeft: header ↔ body ↔ нижняя полоса; пересчёт ширины при resize
  useEffect(() => {
    const headerScrollElement = getTableScrollElement(headerWrapRef.current);
    const bodyScrollElement = getTableScrollElement(bodyWrapRef.current);
    const horizontalScrollTrackElement = horizontalTrackRef.current;

    if (!headerScrollElement || !bodyScrollElement || !horizontalScrollTrackElement) {
      return;
    }

    const updateHorizontalScrollMetrics = () => {
      const tableScrollWidth = bodyScrollElement.scrollWidth;
      const tableClientWidth = bodyScrollElement.clientWidth;
      setHorizontalScrollWidth(tableScrollWidth);
      setShowHorizontalScroll(tableScrollWidth > tableClientWidth + 1);
      horizontalScrollTrackElement.scrollLeft = bodyScrollElement.scrollLeft;
    };

    const syncHorizontalScroll = (scrollSource: HTMLElement) => {
      if (isSyncingHorizontalScrollRef.current) {
        return;
      }

      isSyncingHorizontalScrollRef.current = true;
      const { scrollLeft } = scrollSource;

      if (scrollSource !== headerScrollElement) {
        headerScrollElement.scrollLeft = scrollLeft;
      }

      if (scrollSource !== bodyScrollElement) {
        bodyScrollElement.scrollLeft = scrollLeft;
      }

      if (scrollSource !== horizontalScrollTrackElement) {
        horizontalScrollTrackElement.scrollLeft = scrollLeft;
      }

      requestAnimationFrame(() => {
        isSyncingHorizontalScrollRef.current = false;
      });
    };

    const handleHeaderScroll = () => syncHorizontalScroll(headerScrollElement);
    const handleBodyScroll = () => syncHorizontalScroll(bodyScrollElement);
    const handleHorizontalTrackScroll = () => syncHorizontalScroll(horizontalScrollTrackElement);

    headerScrollElement.addEventListener('scroll', handleHeaderScroll, { passive: true });
    bodyScrollElement.addEventListener('scroll', handleBodyScroll, { passive: true });
    horizontalScrollTrackElement.addEventListener('scroll', handleHorizontalTrackScroll, { passive: true });

    const resizeObserver = new ResizeObserver(updateHorizontalScrollMetrics);
    resizeObserver.observe(bodyScrollElement);
    resizeObserver.observe(headerScrollElement);
    updateHorizontalScrollMetrics();

    return () => {
      headerScrollElement.removeEventListener('scroll', handleHeaderScroll);
      bodyScrollElement.removeEventListener('scroll', handleBodyScroll);
      horizontalScrollTrackElement.removeEventListener('scroll', handleHorizontalTrackScroll);
      resizeObserver.disconnect();
    };
    // visibleWindowRows.length — ширина таблицы меняется при подгрузке данных
  }, [columns, visibleWindowRows.length, isReady]);

  return {
    t,
    columns,
    headerWrapRef,
    bodyWrapRef,
    scrollContainerRef,
    horizontalTrackRef,
    handleScroll,
    virtualWindow,
    visibleWindowRows,
    isLoading,
    isReady,
    horizontalScrollWidth,
    showHorizontalScroll,
  };
}
