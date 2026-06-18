import { INCIDENTS_ROOT_PARENT_ID } from '../../constants';

/** Строит id дочернего узла по parentId и индексу среди сиблингов (как в mock). */
export function buildSiblingId(parentId: string, siblingIndex: number): string {
  if (parentId === INCIDENTS_ROOT_PARENT_ID) {
    return `r-${siblingIndex}`;
  }

  return `${parentId}-c${siblingIndex}`;
}
