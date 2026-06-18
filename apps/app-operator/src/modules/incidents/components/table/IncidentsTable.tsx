/**
 * Virtual tree-table инцидентов.
 *
 * Разметка: фиксированный header + scrollable body + горизонтальная полоса снизу.
 * Вся логика скролла и загрузки — в {@link useIncidentsTable}.
 */
import { INCIDENTS_ROW_HEIGHT } from '../../constants';
import {
  BodyTable,
  HeaderTable,
  HeaderTableWrap,
  HorizontalScrollContent,
  HorizontalScrollTrack,
  Root,
  ScrollContainer,
  TableFrame,
  Title,
  VirtualInner,
  VirtualSpacer,
} from './IncidentsTable.styles';
import { INCIDENTS_TABLE_HORIZONTAL_SCROLL, useIncidentsTable } from './useIncidentsTable';

export function IncidentsTable() {
  const {
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
  } = useIncidentsTable();

  return (
    <Root>
      <Title>{t('table.title')}</Title>
      <TableFrame>
        {/* Только шапка колонок; dataSource пустой — строки в BodyTable ниже */}
        <HeaderTableWrap ref={headerWrapRef}>
          <HeaderTable
            rowKey="id"
            columns={columns}
            dataSource={[]}
            pagination={false}
            bordered
            tableLayout="fixed"
            scroll={INCIDENTS_TABLE_HORIZONTAL_SCROLL}
            locale={{ emptyText: ' ' }}
          />
        </HeaderTableWrap>

        {/* Внешний vertical scroll; высота = flatRowCount × ROW_HEIGHT */}
        <ScrollContainer ref={scrollContainerRef} onScroll={handleScroll}>
          <VirtualInner style={{ height: virtualWindow.flatRowCount * INCIDENTS_ROW_HEIGHT }}>
            {/* paddingTop/Bottom имитируют невидимые строки выше/ниже viewport */}
            <VirtualSpacer
              style={{
                paddingTop: virtualWindow.paddingTop,
                paddingBottom: virtualWindow.paddingBottom,
              }}
            >
              <div ref={bodyWrapRef}>
                <BodyTable
                  rowKey="id"
                  columns={columns}
                  dataSource={visibleWindowRows}
                  loading={isLoading && !isReady}
                  pagination={false}
                  bordered
                  showHeader={false}
                  tableLayout="fixed"
                  scroll={INCIDENTS_TABLE_HORIZONTAL_SCROLL}
                />
              </div>
            </VirtualSpacer>
          </VirtualInner>
        </ScrollContainer>

        {/* Отдельная полоса: у body overflow-x скрыт, скроллим через sync в хуке */}
        <HorizontalScrollTrack ref={horizontalTrackRef} $visible={showHorizontalScroll} aria-hidden>
          <HorizontalScrollContent style={{ width: horizontalScrollWidth }} />
        </HorizontalScrollTrack>
      </TableFrame>
    </Root>
  );
}
