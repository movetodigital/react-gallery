/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import React, {useEffect, useRef, useState} from 'react';

import {Container} from '../common/nodes';
import {defaultDetailsViewRenderer, defaultRenderer} from '../common/Renderers';
import ViewMonitor from '../common/ViewMonitor';
import Engine, {
  COLUMN_MAX_WIDTH,
  COLUMNS_MAX_COUNT,
  GUTTER_IN_PERCENT,
  PLACEHOLDER_COLOR,
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
  gutterInPercent?: number;
  className?: string;
  columnClassName?: string;
  enableDetailView?: boolean;
  detailsViewRenderer?: FunctionName;
  placeholderColor?: string;
}

const Masonry = ({
  imageRenderer = defaultRenderer,
  images = [],
  columnsMaxCount = COLUMNS_MAX_COUNT,
  columnMaxWidth = COLUMN_MAX_WIDTH,
  gutterInPercent = GUTTER_IN_PERCENT,
  className = '',
  columnClassName = '',
  enableDetailView = false,
  detailsViewRenderer = defaultDetailsViewRenderer,
  placeholderColor = PLACEHOLDER_COLOR,
}: ComponentProps) => {
  const engine = useRef();

  const [selectedImageRow, setSelectedImageRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRowHeight, setSelectedRowHeight] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImageProps, setSelectedImageProps] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    engine.current = new Engine();
    engine.current
      .setImages(images)
      .setMaxColumnsCount(columnsMaxCount)
      .setColumnMaxWidth(columnMaxWidth)
      .setGutterInPercent(gutterInPercent);
    setColumns(engine.current.buildColumns());
  }, []);

  useEffect(() => {
    engine.current
      .setImages(images)
      .setMaxColumnsCount(columnsMaxCount)
      .setColumnMaxWidth(columnMaxWidth)
      .setGutterInPercent(gutterInPercent);
    setColumns(engine.current.buildColumns());
  }, [images, columnsMaxCount, columnMaxWidth, gutterInPercent]);

  const handleSelectImage = ({
    imageRow,
    imageId,
    rowHeight,
    image,
    imageProps,
  }: any) => {
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

  const getColumnWidth = (gutter, count) =>
    (100 - gutter * (count - 1)) / count;

  return (
    <Container className={className}>
      {columns.map((item, columnIndex) => (
        <React.Fragment key={`image-column-${columnIndex}`}>
          <div
            /* eslint-disable-next-line react/no-array-index-key */
            key={`column-${columnIndex}`}
            className={columnClassName}
            style={{
              verticalAlign: 'top',
              position: 'relative',
              display: 'inline-block',
              width: `${getColumnWidth(
                engine.current.getGutterInPercent(),
                engine.current.getMaxColumnsCount()
              )}%`,
              margin: `0 ${
                columnIndex === columns.length - 1
                  ? 0
                  : engine.current.getGutterInPercent()
              }% 0 0`,
            }}
          >
            {item.images.map(
              (
                image: {height?: number; width?: number; src?: string},
                imageIndex: number
              ) => {
                const placeholderHeight =
                  (100 * (image.height || 0)) / (image.width || 1);
                const imageId = `column-${image.src}-${columnIndex}-${imageIndex}`;
                return (
                  <div
                    /* eslint-disable-next-line react/no-array-index-key */
                    key={`image-${image.src}-${columnIndex}-${imageIndex}`}
                    style={{
                      margin: `0 0 ${engine.current.getGutterInPercent() *
                        engine.current.getMaxColumnsCount()}% 0`,
                    }}
                  >
                    <ViewMonitor>
                      {(isViewable: boolean) =>
                        imageRenderer({
                          ...image,
                          placeholderHeight,
                          visible: isViewable,
                          enableMasonry: true,
                          placeholderColor,
                          onClick: () =>
                            handleSelectImage({
                              imageRow: columnIndex,
                              image: image,
                              rowHeight: placeholderHeight,
                              // eslint-disable-next-line
                              imageId,
                              imageProps: {
                                placeholderHeight,
                              },
                            }),
                        })
                      }
                    </ViewMonitor>
                    {enableDetailView &&
                      columnIndex === selectedImageRow &&
                      selectedImageId === imageId && (
                        <div
                          key={`detail-${imageId}`}
                          style={{
                            margin: `${engine.current.getGutterInPercent() *
                              engine.current.getMaxColumnsCount()}% 0 0 0`,
                          }}
                        >
                          {detailsViewRenderer({
                            ...item,
                            visible: columnIndex === selectedImageRow,
                            selectedImage,
                            rowHeight: selectedRowHeight,
                            gutterInPercent: engine.current.getGutterInPercent(),
                            selectedImageId,
                            selectedImageProps,
                          })}
                        </div>
                      )}
                  </div>
                );
              }
            )}
          </div>
        </React.Fragment>
      ))}
    </Container>
  );
};

export {Masonry};
