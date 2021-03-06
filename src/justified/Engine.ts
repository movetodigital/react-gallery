/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/array-type */
// eslint-disable @typescript-eslint/no-explicit-any
export const COLUMNS_MAX_COUNT = 5;
export const COLUMN_MAX_WIDTH = 200;
export const COLUMN_MAX_HEIGHT = 200;
export const GUTTER_IN_PERCENT = 0.5;
export const PLACEHOLDER_COLOR = '#f0f0f0';
export const VIEWPORT_WIDTH = 0;
export const VIEWPORT_HEIGHT = 0;

const getMinHeight = (items: Array<any>) => {
  return Math.min.apply(null, items.map(item => item.height));
};

const getRowWidth = (items: Array<any>) => {
  return items.map(item => item.width).reduce((a, b) => a + b, 0);
};

const resizeByHeight = (
  item: {width: number; height: number},
  newHeight: number
) => {
  const aspectRatio = item.width / item.height;
  return {
    ...item,
    width: aspectRatio * newHeight,
    height: newHeight,
    aspectRatio,
    originalHeight: item.height,
    originalWidth: item.width,
  };
};

const resizeByWidth = (
  item: {width: number; height: number},
  newWidth: number
) => {
  const aspectRatio = item.width / item.height;
  return {
    ...item,
    width: newWidth,
    height: newWidth / aspectRatio,
  };
};

class Engine {
  private images: Array<any>;
  private gutterInPercent: number;
  private maxColumnsCount: number;
  private columnMaxWidth: number;
  private columnMaxHeight: number;
  private scrollTop: number;
  private parentWidth: number;

  public setImages(images: Array<any>) {
    if (!images) {
      images = [];
    }
    this.images = images;
    return this;
  }

  public setGutterInPercent(gutterInPercent: number) {
    if (!gutterInPercent || gutterInPercent < 0) {
      gutterInPercent = 0;
    }
    this.gutterInPercent = gutterInPercent;
    return this;
  }

  public getGutterInPercent() {
    return this.gutterInPercent;
  }

  public setMaxColumnsCount(maxColumnsCount: number) {
    if (!maxColumnsCount || maxColumnsCount < 0) {
      maxColumnsCount = COLUMNS_MAX_COUNT;
    }
    this.maxColumnsCount = maxColumnsCount;
    return this;
  }

  public getMaxColumnsCount() {
    return this.maxColumnsCount;
  }

  public setColumnMaxWidth(columnMaxWidth: number) {
    if (!columnMaxWidth || columnMaxWidth < 0) {
      columnMaxWidth = COLUMN_MAX_WIDTH;
    }
    this.columnMaxWidth = columnMaxWidth;
    return this;
  }

  public getColumnsMaxWidth() {
    return this.columnMaxWidth;
  }

  public setColumnMaxHeight(columnMaxHeight: number) {
    if (!columnMaxHeight || columnMaxHeight < 0) {
      columnMaxHeight = COLUMN_MAX_HEIGHT;
    }
    this.columnMaxHeight = columnMaxHeight;
    return this;
  }

  public setScrollTop(scrollTop: number) {
    this.scrollTop = scrollTop;
    return this;
  }

  public getScrollTop() {
    return this.scrollTop;
  }

  public setParentWidth(parentWidth: number) {
    this.parentWidth = parentWidth;
    return this;
  }

  public getParentWidth() {
    return this.parentWidth;
  }

  public getGutterInPx() {
    if (this.parentWidth) {
      return (this.gutterInPercent * this.parentWidth) / 100;
    }
    return 0;
  }

  public normalizeByHeight(items: Array<any>) {
    const minHeight = this.columnMaxHeight;
    const result: Array<{width: number; height: number}> = [];
    items.forEach(el => {
      result.push(resizeByHeight(el, minHeight));
    });
    return result;
  }

  public normalizeByWidth() {
    const calculateWidth = (item: {width: any; height?: number}) => {
      return item.width > this.columnMaxWidth
        ? this.columnMaxWidth
        : item.width;
    };
    const calculateHeight = (item: {width: number; height: number}) => {
      const itemAfterResize = resizeByWidth(item, calculateWidth(item));
      return itemAfterResize.height;
    };
    const result: Array<any> = [];
    this.images.forEach(el => {
      result.push({
        ...el,
        height: calculateHeight(el),
        width: calculateWidth(el),
      });
    });
    return result;
  }
  public buildRow(items: Array<any>) {
    const row = [];
    let columnsCount = 0;
    const isIncompleteRow = () => {
      return columnsCount < this.maxColumnsCount;
    };
    while (items.length > 0 && isIncompleteRow()) {
      const column = items.shift();
      row.push(column);
      columnsCount++;
    }
    return {
      row,
      isIncomplete: isIncompleteRow(),
    };
  }

  public getNormalizedItems(items: Array<any>) {
    items = items.map(item => {
      return {
        ...item,
        height: item.height,
        width: item.width,
        src: item.src,
      };
    });
    return this.normalizeByHeight(items);
  }

  public calculateHeight(item: any, row: Array<any>, isLastRow: any) {
    const rowWidth = getRowWidth(row);
    const ratio = (this.maxColumnsCount * this.columnMaxWidth) / rowWidth;
    const newHeight =
      (getMinHeight(row) *
        ratio *
        (100 - (row.length - 1) * this.gutterInPercent)) /
      100;
    if (isLastRow) {
      return newHeight > this.columnMaxHeight
        ? this.columnMaxHeight
        : newHeight;
    }
    return newHeight;
  }

  public calculateWidth(
    item: {width: number; height: number},
    row: Array<any>,
    isLastRow: any
  ) {
    const itemAfterResize = resizeByHeight(
      item,
      this.calculateHeight(item, row, isLastRow)
    );
    return itemAfterResize.width;
  }

  public getNewWidthInPercent = (newWidth: number) =>
    (100 * newWidth) / (this.getMaxColumnsCount() * this.getColumnsMaxWidth());

  public getNewRowHeight = (row: any) => {
    const item = row.row[0] || {};
    const isIncomplete = row.isIncomplete;
    const originalHeight = row.row[0].originalHeight;
    const originalWidth = row.row[0].originalWidth;

    const widthInPercent = this.getNewWidthInPercent(
      this.calculateWidth(item, row.row, isIncomplete)
    );
    const newWidth = (widthInPercent * this.parentWidth) / 100;

    const aspectRatio = originalWidth / originalHeight;
    return newWidth / aspectRatio;
  };

  public buildFastRows() {
    const rows = [];
    const items = this.getNormalizedItems(this.images);
    while (items.length > 0) {
      const row = this.buildRow(items);
      rows.push(row);
    }
    return rows;
  }

  public buildRows() {
    const rows = [];
    const items = this.getNormalizedItems(this.images);

    while (items.length > 0) {
      const row = this.buildRow(items);
      rows.push(row);
    }
    return rows;
  }
}

export default Engine;
