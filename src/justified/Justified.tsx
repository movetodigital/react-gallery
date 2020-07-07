/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Container} from '../common/nodes';
import {defaultDetailsViewRenderer, defaultRenderer} from '../common/Renderers';
import ViewMonitor from '../common/ViewMonitor';
import Engine, {
  COLUMN_MAX_HEIGHT,
  COLUMN_MAX_WIDTH,
  COLUMNS_MAX_COUNT,
  GUTTER_IN_PERCENT,
  PLACEHOLDER_COLOR,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from './Engine';

type FunctionName = (n: object) => any;

interface ImageItemProps {
  src?: string;
  title?: string;
  alt?: string;
}

interface ComponentProps {
  imageRenderer?: FunctionName;
  images?: Array<ImageItemProps>;
  columnsMaxCount?: number;
  columnMaxWidth?: number;
  columnMaxHeight?: number;
  gutterInPercent?: number;
  className?: string;
  columnClassName?: string;
  rowClassName?: string;
  fixedBottom?: number;
  enableDetailView?: boolean;
  detailsViewRenderer?: FunctionName;
  placeholderColor?: string;
  fixedBottomGutterInPercent?: number;
  fixedImagePlaceholderColor?: string;
}

const Justified = ({
  imageRenderer = defaultRenderer,
  images = [],
  columnsMaxCount = COLUMNS_MAX_COUNT,
  columnMaxWidth = COLUMN_MAX_WIDTH,
  columnMaxHeight = COLUMN_MAX_HEIGHT,
  gutterInPercent = GUTTER_IN_PERCENT,
  className = '',
  columnClassName = '',
  rowClassName = '',
  enableDetailView = false,
  detailsViewRenderer = defaultDetailsViewRenderer,
  placeholderColor = PLACEHOLDER_COLOR,
}: ComponentProps) => {
  const engine = useRef<any>();
  const container: React.MutableRefObject<
    HTMLDivElement | undefined
  > = useRef();
  const wheelRef = useRef<any>();

  const [selectedImageRow, setSelectedImageRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRowHeight, setSelectedRowHeight] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImageProps, setSelectedImageProps] = useState({});
  const [rows, setRows] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const resize = () => {
    if (container.current) {
      setContainerWidth(container.current.offsetWidth);
    }
  };

  const onWheel = useCallback(
    e => {
      const amount = e.deltaY ? e.deltaY : e.deltaX;
      const newScrollTop = Math.max(scrollTop + amount, scrollTop);
      setScrollTop(newScrollTop);
    },
    [scrollTop, setScrollTop]
  );

  useEffect(() => {
    wheelRef.current = onWheel;
  }, [onWheel]);

  useEffect(() => {
    // Create event listener that calls handler function stored in ref
    const eventListener = (event: any) => wheelRef.current(event);
    if (container.current) {
      container.current.addEventListener('wheel', eventListener, {
        passive: false,
      });
    }

    return () => {
      if (container.current) {
        container.current.removeEventListener('wheel', eventListener);
      }
    };
  }, [container]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    engine.current = new Engine();
    engine.current
      .setImages(images)
      .setMaxColumnsCount(columnsMaxCount)
      .setColumnMaxWidth(columnMaxWidth)
      .setColumnMaxHeight(columnMaxHeight)
      .setGutterInPercent(gutterInPercent)
      .setScrollTop(scrollTop)
      .setParentWidth((container.current || {}).offsetWidth);

    setRows(engine.current.buildFastRows());

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    engine.current
      .setImages(images)
      .setMaxColumnsCount(columnsMaxCount)
      .setColumnMaxWidth(columnMaxWidth)
      .setColumnMaxHeight(columnMaxHeight)
      .setGutterInPercent(gutterInPercent)
      .setScrollTop(scrollTop)
      .setParentWidth(containerWidth);
    setRows(engine.current.buildFastRows());
  }, [
    images,
    columnsMaxCount,
    columnMaxWidth,
    columnMaxHeight,
    gutterInPercent,
    scrollTop,
    containerWidth,
  ]);

  const handleSelectImage = ({
    imageRow,
    imageId,
    rowHeight,
    image,
    imageProps,
  }: {
    imageRow: any;
    imageId: any;
    rowHeight: any;
    image: any;
    imageProps: any;
  }) => {
    if (selectedImageRow !== imageRow || imageId !== selectedImageId) {
      setSelectedImageRow(imageRow);
      setSelectedImage(image);
      setSelectedRowHeight(rowHeight);
      setSelectedImageId(imageId);
      setSelectedImageProps(imageProps);
    } else {
      setSelectedImageRow(null);
      setSelectedImage(null);
      setSelectedRowHeight(0);
      setSelectedImageId(null);
      setSelectedImageProps({});
    }
  };

  return (
    <Container
      // @ts-ignore
      ref={container}
      className={className}
      onWheel={onWheel}
    >
      {rows.map((el: any, rowIndex: number) => {
        const row = el.row;
        // @ts-ignore
        return (
          /* eslint-disable-next-line react/no-array-index-key */
          <React.Fragment key={`row-${rowIndex}`}>
            <div className={rowClassName}>
              {row.map((column: any, columnIndex: number) => {
                const newWidth = engine.current.calculateWidth(
                  column,
                  row,
                  el.isIncomplete
                );
                const newHeight = engine.current.calculateHeight(
                  column,
                  row,
                  el.isIncomplete
                );
                const newWidthInPercent = engine.current.getNewWidthInPercent(
                  newWidth
                );
                const placeholderHeight = (100 * newHeight) / newWidth;

                return (
                  <div
                    /* eslint-disable-next-line react/no-array-index-key */
                    key={`column-${column.src}-${rowIndex}-${columnIndex}`}
                    className={columnClassName}
                    // @ts-ignore
                    style={{
                      verticalAlign: 'top',
                      position: 'relative',
                      display: 'inline-block',
                      width:
                        el.isIncomplete && !el.isIncomplete
                          ? `${newWidth}px`
                          : `${newWidthInPercent}%`,
                      maxWidth:
                        el.isIncomplete && !el.isIncomplete
                          ? `${newWidthInPercent}%`
                          : null,
                      margin:
                        row.length === columnIndex + 1
                          ? `0 0 ${engine.current.getGutterInPercent()}% 0`
                          : `0 ${engine.current.getGutterInPercent()}% ${engine.current.getGutterInPercent()}% 0`,
                    }}
                  >
                    <ViewMonitor>
                      {(isViewable: any) =>
                        imageRenderer({
                          ...column,
                          newWidth,
                          newHeight,
                          newWidthInPercent,
                          placeholderHeight,
                          placeholderColor,
                          visible: isViewable,
                          enableMasonry: false,
                          onClick: () =>
                            handleSelectImage({
                              imageRow: rowIndex,
                              image: column,
                              rowHeight: newHeight,
                              // eslint-disable-next-line
                              imageId: `column-${column.src}-${rowIndex}-${columnIndex}`,
                              imageProps: {
                                placeholderHeight,
                                newWidthInPercent,
                                newWidth,
                                newHeight,
                              },
                            }),
                        }) as React.ReactElement
                      }
                    </ViewMonitor>
                  </div>
                );
              })}
            </div>
            <div key={`detail-${rowIndex}`}>
              {enableDetailView &&
                detailsViewRenderer({
                  ...row,
                  visible: rowIndex === selectedImageRow,
                  selectedImage,
                  rowHeight: selectedRowHeight,
                  gutterInPercent: engine.current.getGutterInPercent(),
                  selectedImageId,
                  selectedImageProps,
                })}
            </div>
          </React.Fragment>
        );
      })}
    </Container>
  );
};

export {Justified};
