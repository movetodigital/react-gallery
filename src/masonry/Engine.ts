/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/array-type */
// eslint-disable @typescript-eslint/no-explicit-any
export const COLUMNS_MAX_COUNT = 5;
export const COLUMN_MAX_WIDTH = 200;
export const GUTTER_IN_PERCENT = 0.5;
export const PLACEHOLDER_COLOR = '#f0f0f0';

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

  public buildColumns() {
    const columns = [];
    let order;
    const items = this.normalizeByWidth() as Array<any>;
    for (let i = 0; i < this.maxColumnsCount; i++) {
      columns.push({images: [], order: i});
    }
    for (let i = 0; i < items.length; i++) {
      order =
        (i + 1) % this.maxColumnsCount === 0
          ? this.maxColumnsCount
          : (i + 1) % this.maxColumnsCount;
      columns[order - 1].images.push(items[i] as never);
      items[i].order = order;
    }
    return columns;
  }
}

export default Engine;
