/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import chunk from 'lodash/chunk';
import get from 'lodash/get';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

type FunctionName = (n: object) => any;
type GridType = 1 | 2 | 3 | 4;

interface ImageItemProps {
  src?: string;
  title?: string;
  alt?: string;
}

interface DetailItemProps {
  src?: string;
  title?: string;
  alt?: string;
  id?: string;
  width?: number;
  itemWidth: number;
  rowHeight: number;
}
interface StyleDetailItemProps {
  width?: number;
  height?: number;
}

interface ComponentProps {
  images: Array<ImageItemProps>;
  gridType?: GridType;
  gutterInPercent?: number;
  aspectRatio?: number;
  columnsMaxCount?: number;
  imageRenderer?: FunctionName;
  enableDetailView?: boolean;
  detailsViewRenderer?: FunctionName;
}

interface StyleItemProps {
  height?: number;
  width?: string;
  padding?: string;
  ratio?: number;
}

interface StyleRowProps {
  padding?: string;
}
interface StyleColumnProps {
  width?: number;
}

interface RendererProps {
  props: ImageItemProps;
}

interface DetailViewRendererProps {
  props: DetailItemProps;
}

const Item = styled.div<StyleItemProps>`
  color: white;
  position: relative;
  box-sizing: border-box;
  width: ${props => props.width}%;
  margin: ${props => props.padding};
  height: ${props => props.height}px;

  > div {
    width: 100%;
    padding-top: ${props => props.ratio}%;
  }
`;

const DefaultImage = styled.img`
  width: 100%;
  height: 100%;
  object-position: 50% 50%;
  object-fit: cover;
`;

const DefaultImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const DefaultDetailContainer = styled.div<StyleDetailItemProps>`
  display: flex;
  justify-content: center;
  > div {
    width: ${props => props.width}px;
    height: ${props => props.height}px;
  }
`;

const Row = styled.div<StyleRowProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: ${props => props.padding};
`;

const Column = styled.div<StyleColumnProps>`
  width: ${props => (props.width ? props.width * 6.25 : 6.25)}%;
  display: flex;
  flex-direction: column;
`;
const defaultRender = ({props: {src, title, alt}}: RendererProps) => {
  return (
    <DefaultImageContainer>
      <DefaultImage key={src} src={src} title={title} alt={alt} />
    </DefaultImageContainer>
  );
};

const defaultDetailsViewRenderer = ({
  props: {src, title, alt, itemWidth, rowHeight},
}: DetailViewRendererProps) => (
  <DefaultDetailContainer width={itemWidth} height={rowHeight}>
    <div>
      <DefaultImage key={src} src={src} title={title} alt={alt} />
    </div>
  </DefaultDetailContainer>
);

const Fresco: React.FunctionComponent<ComponentProps> = ({
  images = [],
  gridType = 5,
  gutterInPercent = 1,
  aspectRatio = 1.7,
  columnsMaxCount = 3,
  imageRenderer = defaultRender,
  enableDetailView = false,
  detailsViewRenderer = defaultDetailsViewRenderer,
}) => {
  const container: React.MutableRefObject<
    HTMLDivElement | undefined
  > = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [clientColumnMaxCount, setClientColumnMaxCount] = useState(0);

  const [selectedImageRow, setSelectedImageRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const calculateColumnsCount = () => {
    if (container.current) {
      setClientColumnMaxCount(
        // @ts-ignore-start
        container.current.offsetWidth > 480
          ? container.current.offsetWidth > 768
            ? columnsMaxCount
            : Math.min(columnsMaxCount, 3)
          : 1
      );
    }
  };
  const resize = () => {
    // @ts-ignore
    setContainerWidth(container.current.offsetWidth);
    calculateColumnsCount();
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();

    return () => removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    calculateColumnsCount();
  }, [columnsMaxCount]);

  const gutter = gutterInPercent / 2;
  const ratio = 100 / aspectRatio;
  const rowHeight = containerWidth / aspectRatio;
  const gutterInPx = (containerWidth * gutter) / 100;
  const thinColumnWidth = 16 / clientColumnMaxCount;

  const handleSelectImage = ({
    imageRow,
    imageId,
    image,
  }: {
    imageRow: any;
    imageId: any;
    image: any;
  }) => {
    if (selectedImageRow !== imageRow || imageId !== selectedImageId) {
      setSelectedImageRow(imageRow);
      setSelectedImage(image);
      setSelectedImageId(imageId);
    } else {
      setSelectedImageRow(null);
      setSelectedImage(null);
      setSelectedImageId(null);
    }
  };

  const getDetailRow = ({
    rowIndex,
    height,
  }: {
    rowIndex: number;
    height: number;
  }) => {
    const width = rowHeight * aspectRatio;
    return (
      enableDetailView &&
      rowIndex === selectedImageRow && (
        <Row padding={`${gutterInPx * 2}px 0`}>
          <Column width={16}>
            {detailsViewRenderer({
              props: {
                id: selectedImageId,
                aspectRatio,
                itemWidth: width,
                rowHeight: height,
                // @ts-ignore
                ...selectedImage,
              },
            })}
          </Column>
        </Row>
      )
    );
  };

  const getItem = ({
    height,
    item,
    rowIndex,
    padding = '0',
  }: {
    height: number;
    item: ImageItemProps;
    rowIndex: number;
    padding: string;
  }) => {
    if (!item) {
      return null;
    }
    return (
      <Item
        height={height}
        padding={padding}
        ratio={ratio}
        onClick={() =>
          handleSelectImage({
            imageRow: rowIndex,
            imageId: `image-${item.src}-${rowIndex}`,
            image: item,
          })
        }
      >
        <div>{imageRenderer({props: item})}</div>
      </Item>
    );
  };

  const getWideSingleRow = ({
    item,
    rowIndex,
  }: {
    item: ImageItemProps;
    rowIndex: number;
  }) => {
    return (
      <React.Fragment key={`wide-single-row-${rowIndex}`}>
        <Row padding={`${gutterInPx * 2}px 0`}>
          <Column width={16}>
            {getItem({padding: '0', height: rowHeight, rowIndex, item})}
          </Column>
        </Row>
        {getDetailRow({rowIndex, height: rowHeight})}
      </React.Fragment>
    );
  };

  const getWideLeftRow = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => {
    if (items.length) {
      if (clientColumnMaxCount <= 2) {
        const row = getWideSingleRow({item: items[0], rowIndex});
        return {
          row,
          newItems: items.slice(1),
        };
      } else {
        const columnCount = clientColumnMaxCount - 1;
        const itemsCount = 2 * clientColumnMaxCount - 3;
        const itemsToRow = items.slice(0, itemsCount);
        const wideColumnWidth = 16 - thinColumnWidth * (columnCount - 1);
        const itemsToThinRow = chunk(itemsToRow.slice(1), 2);
        const row = (
          <React.Fragment key={`wide-left-row-${rowIndex}`}>
            <Row padding={`${gutterInPx * 2}px 0`}>
              <Column width={wideColumnWidth}>
                {getItem({
                  height: rowHeight,
                  rowIndex,
                  item: itemsToRow[0],
                  padding: `0 ${gutterInPx}px 0 0`,
                })}
              </Column>
              {itemsToThinRow.map((item, index) => (
                <Column
                  width={thinColumnWidth}
                  key={`wide-left-row-${rowIndex}-${index}`}
                >
                  {getItem({
                    height: rowHeight / 2 - gutterInPx,
                    rowIndex,
                    item: item[0],
                    padding: `0 
                       ${
                         index === itemsToThinRow.length - 1 ? 0 : gutterInPx
                       }px 
                       ${gutterInPx}px 
                       ${gutterInPx}px`,
                  })}
                  {getItem({
                    height: rowHeight / 2 - gutterInPx,
                    rowIndex,
                    item: item[1],
                    padding: `${gutterInPx}px
                        ${
                          index === itemsToThinRow.length - 1 ? 0 : gutterInPx
                        }px
                        0 ${gutterInPx}px`,
                  })}
                </Column>
              ))}
            </Row>
            {getDetailRow({rowIndex, height: rowHeight})}
          </React.Fragment>
        );
        return {
          row,
          newItems: items.slice(itemsCount),
        };
      }
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const getWideRightRow = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => {
    if (items.length) {
      if (clientColumnMaxCount <= 2) {
        const row = getWideSingleRow({item: items[0], rowIndex});
        return {
          row,
          newItems: items.slice(1),
        };
      } else {
        const columnCount = clientColumnMaxCount - 1;
        const itemsCount = 2 * clientColumnMaxCount - 3;
        const itemsToRow = items.slice(0, itemsCount);
        const wideColumnWidth = 16 - thinColumnWidth * (columnCount - 1);
        const itemsToThinRow = chunk(
          itemsToRow.length === itemsCount
            ? itemsToRow.slice(0, itemsToRow.length - 1)
            : itemsToRow,
          2
        );
        const row = (
          <React.Fragment key={`wide-right-row-${rowIndex}`}>
            <Row padding={`${gutterInPx * 2}px 0`}>
              {itemsToThinRow.map((item, index) => {
                return (
                  <Column
                    width={thinColumnWidth}
                    key={`wide-right-row-${rowIndex}-${index}`}
                  >
                    {getItem({
                      height: rowHeight / 2 - gutterInPx,
                      rowIndex,
                      item: item[0],
                      padding: `0 ${gutterInPx}px ${gutterInPx}px ${
                        index === 0 ? 0 : gutterInPx
                      }px`,
                    })}
                    {getItem({
                      height: rowHeight / 2 - gutterInPx,
                      rowIndex,
                      item: item[1],
                      padding: `${gutterInPx}px ${gutterInPx}px 0 ${
                        index === 0 ? 0 : gutterInPx
                      }px`,
                    })}
                  </Column>
                );
              })}
              {itemsToRow.length === itemsCount && (
                <Column width={wideColumnWidth}>
                  {getItem({
                    height: rowHeight,
                    rowIndex,
                    item: itemsToRow[itemsToRow.length - 1],
                    padding: `0 0 0 ${gutterInPx}px`,
                  })}
                </Column>
              )}
            </Row>
            {getDetailRow({rowIndex, height: rowHeight})}
          </React.Fragment>
        );
        return {
          row,
          newItems: items.slice(itemsCount),
        };
      }
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const getRightDoubleRow = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => {
    const height =
      clientColumnMaxCount > 2
        ? rowHeight * 0.8 - gutterInPx
        : rowHeight - gutterInPx;
    if (items.length) {
      if (clientColumnMaxCount >= 2) {
        const columnCount =
          clientColumnMaxCount <= 3 ? 2 : clientColumnMaxCount - 1;
        const itemsToRow = items.slice(0, columnCount);
        const wideColumnWidth = 16 - thinColumnWidth * (columnCount - 1);
        const itemsToThinRow =
          itemsToRow.length === columnCount
            ? itemsToRow.slice(0, itemsToRow.length - 1)
            : itemsToRow;

        const row = (
          <React.Fragment key={`wide-right-row-${rowIndex}`}>
            <Row padding={`${gutterInPx * 2}px 0`}>
              {itemsToThinRow.map((item, index) => {
                return (
                  <Column
                    width={thinColumnWidth}
                    key={`wide-right-row-${rowIndex}-${index}`}
                  >
                    {getItem({
                      height,
                      rowIndex,
                      item: item,
                      padding: `0 ${gutterInPx}px 0 ${
                        index === 0 ? 0 : gutterInPx
                      }px`,
                    })}
                  </Column>
                );
              })}
              {itemsToRow.length === columnCount && (
                <Column width={wideColumnWidth}>
                  {getItem({
                    height,
                    rowIndex,
                    item: itemsToRow[itemsToRow.length - 1],
                    padding: `0 0 0 ${gutterInPx}px`,
                  })}
                </Column>
              )}
            </Row>
            {getDetailRow({rowIndex, height: rowHeight})}
          </React.Fragment>
        );
        return {
          row,
          newItems: items.slice(columnCount),
        };
      } else {
        const row = getWideSingleRow({item: items[0], rowIndex});
        return {
          row,
          newItems: items.slice(1),
        };
      }
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const getRightDoubleRowTypeTwo = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => {
    const height =
      clientColumnMaxCount >= 2
        ? rowHeight * 0.8 - gutterInPx
        : rowHeight - gutterInPx;
    if (items.length) {
      if (clientColumnMaxCount >= 2) {
        const columnCount =
          clientColumnMaxCount <= 3 ? 2 : clientColumnMaxCount - 1;
        const itemsToRow = items.slice(0, columnCount);
        const wideColumnWidth =
          16 - thinColumnWidth * (clientColumnMaxCount - 2);
        const firstItemWidth = wideColumnWidth * 0.631;
        const secondItemWidth =
          thinColumnWidth + (wideColumnWidth - firstItemWidth);
        const itemsToWideRow = itemsToRow.slice(0, 2);
        const itemsToThinRow = itemsToRow.slice(2);

        const row = (
          <React.Fragment key={`triple-row-${rowIndex}`}>
            <Row padding={`${gutterInPx * 2}px 0`}>
              <Column width={firstItemWidth}>
                {getItem({
                  height,
                  rowIndex,
                  item: itemsToWideRow[0],
                  padding: `0 ${gutterInPx}px 0 0`,
                })}
              </Column>
              <Column width={secondItemWidth}>
                {getItem({
                  height,
                  rowIndex,
                  item: itemsToWideRow[1],
                  padding: `0 ${gutterInPx}px 0 ${gutterInPx}px`,
                })}
              </Column>
              {itemsToThinRow.map((item, index) => {
                return (
                  <Column
                    width={thinColumnWidth}
                    key={`triple-row-${rowIndex}-${index}`}
                  >
                    {getItem({
                      height,
                      rowIndex,
                      item: item,
                      padding: `0 
                      ${
                        index === itemsToThinRow.length - 1 ? 0 : gutterInPx
                      }px 0 ${gutterInPx}px`,
                    })}
                  </Column>
                );
              })}
            </Row>
            {getDetailRow({rowIndex, height: rowHeight})}
          </React.Fragment>
        );
        return {
          row,
          newItems: items.slice(clientColumnMaxCount),
        };
      } else {
        const row = getWideSingleRow({item: items[0], rowIndex});
        return {
          row,
          newItems: items.slice(1),
        };
      }
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const getLeftDoubleRow = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => {
    const height =
      clientColumnMaxCount > 1
        ? rowHeight * 0.8 - gutterInPx
        : rowHeight - gutterInPx;
    if (items.length) {
      if (clientColumnMaxCount >= 2) {
        const columnCount =
          clientColumnMaxCount <= 3 ? 2 : clientColumnMaxCount - 1;
        const itemsToRow = items.slice(0, columnCount);
        const wideColumnWidth = 16 - thinColumnWidth * (columnCount - 1);
        const itemsToThinRow = itemsToRow.slice(1);

        const row = (
          <React.Fragment key={`wide-right-row-${rowIndex}`}>
            <Row padding={`${gutterInPx * 2}px 0`}>
              <Column width={wideColumnWidth}>
                {getItem({
                  height,
                  rowIndex,
                  item: itemsToRow[0],
                  padding: `0 ${gutterInPx}px 0 0`,
                })}
              </Column>
              {itemsToThinRow.map((item, index) => {
                return (
                  <Column
                    width={thinColumnWidth}
                    key={`wide-right-row-${rowIndex}-${index}`}
                  >
                    {getItem({
                      height,
                      rowIndex,
                      item: item,
                      padding: `0 
                      ${
                        index === itemsToThinRow.length - 1 ? 0 : gutterInPx
                      }px 0 ${gutterInPx}px`,
                    })}
                  </Column>
                );
              })}
            </Row>
            {getDetailRow({rowIndex, height: rowHeight})}
          </React.Fragment>
        );
        return {
          row,
          newItems: items.slice(columnCount),
        };
      } else {
        const row = getWideSingleRow({item: items[0], rowIndex});
        return {
          row,
          newItems: items.slice(1),
        };
      }
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const getTripleRow = ({
    items,
    rowIndex,
    isThinItemFirst,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
    isThinItemFirst: boolean;
  }) => {
    const height =
      clientColumnMaxCount > 2
        ? rowHeight / 2 - gutterInPx
        : rowHeight - gutterInPx;
    if (items.length) {
      if (clientColumnMaxCount >= 2) {
        const itemsToRow = items.slice(0, clientColumnMaxCount);
        const wideColumnWidth =
          16 - thinColumnWidth * (clientColumnMaxCount - 2);
        const firstItemWidth =
          wideColumnWidth * (isThinItemFirst ? 0.369 : 0.631);
        const secondItemWidth = wideColumnWidth - firstItemWidth;
        const itemsToWideRow = itemsToRow.slice(0, 2);
        const itemsToThinRow = itemsToRow.slice(2);

        const row = (
          <React.Fragment key={`triple-row-${rowIndex}`}>
            <Row padding={`${gutterInPx * 2}px 0`}>
              <Column width={firstItemWidth}>
                {getItem({
                  height,
                  rowIndex,
                  item: itemsToWideRow[0],
                  padding: `0 ${gutterInPx}px 0 0`,
                })}
              </Column>
              <Column width={secondItemWidth}>
                {getItem({
                  height,
                  rowIndex,
                  item: itemsToWideRow[1],
                  padding: `0 ${gutterInPx}px 0 ${gutterInPx}px`,
                })}
              </Column>
              {itemsToThinRow.map((item, index) => {
                return (
                  <Column
                    width={thinColumnWidth}
                    key={`triple-row-${rowIndex}-${index}`}
                  >
                    {getItem({
                      height,
                      rowIndex,
                      item: item,
                      padding: `0 
                      ${
                        index === itemsToThinRow.length - 1 ? 0 : gutterInPx
                      }px 0 ${gutterInPx}px`,
                    })}
                  </Column>
                );
              })}
            </Row>
            {getDetailRow({rowIndex, height: rowHeight})}
          </React.Fragment>
        );
        return {
          row,
          newItems: items.slice(clientColumnMaxCount),
        };
      } else {
        const row = getWideSingleRow({item: items[0], rowIndex});
        return {
          row,
          newItems: items.slice(1),
        };
      }
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const getRightTripleRow = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => getTripleRow({items, rowIndex, isThinItemFirst: true});
  const getJustifiedRow = ({
    items,
    rowIndex,
  }: {
    items: Array<ImageItemProps>;
    rowIndex: number;
  }) => {
    const height =
      clientColumnMaxCount > 2
        ? rowHeight / 2 - gutterInPx
        : rowHeight - gutterInPx;
    const itemsToRow = items.slice(0, clientColumnMaxCount);
    if (items.length) {
      const row = (
        <React.Fragment key={`justified-row-${get(items, '[0].src')}`}>
          <Row padding={`${gutterInPx * 2}px 0`}>
            {itemsToRow.map((item, index) => {
              return (
                <Column
                  width={thinColumnWidth}
                  key={`justified-row-${rowIndex}-${index}`}
                >
                  {getItem({
                    height: height,
                    rowIndex,
                    item,
                    padding: `0 
                        ${
                          index === itemsToRow.length - 1 &&
                          itemsToRow.length === clientColumnMaxCount
                            ? 0
                            : gutterInPx
                        }px 
                        0 ${index === 0 ? 0 : gutterInPx}px`,
                  })}
                </Column>
              );
            })}
          </Row>
          {getDetailRow({rowIndex, height: rowHeight})}
        </React.Fragment>
      );
      return {
        row,
        newItems: items.slice(clientColumnMaxCount),
      };
    }
    return {
      row: null,
      newItems: [],
    };
  };

  const pageOneStructure = [
    getWideLeftRow,
    getWideRightRow,
    getJustifiedRow,
    getWideLeftRow,
    getJustifiedRow,
  ];

  const pageTwoStructure = [
    getWideRightRow,
    getLeftDoubleRow,
    getJustifiedRow,
    getRightDoubleRow,
    getWideLeftRow,
  ];

  const pageThreeStructure = [
    getLeftDoubleRow,
    getTripleRow,
    getRightDoubleRowTypeTwo,
    getTripleRow,
    getLeftDoubleRow,
    getRightTripleRow,
  ];

  const pageFourStructure = [
    getLeftDoubleRow,
    getRightDoubleRow,
    getJustifiedRow,
  ];

  const pageTypeStructures = [
    {
      type: 1,
      structure: pageOneStructure,
    },
    {
      type: 2,
      structure: pageTwoStructure,
    },
    {
      type: 3,
      structure: pageThreeStructure,
    },
    {
      type: 4,
      structure: pageFourStructure,
    },
  ];

  const getPageStructure = () =>
    (pageTypeStructures.find(el => el.type === gridType) || {}).structure ||
    pageOneStructure;

  const buildRows = () => {
    let items = images;
    const rows = [];

    const structure = getPageStructure();

    while (items.length > 0) {
      for (const rowFunc of structure) {
        if (items.length <= clientColumnMaxCount) {
          const {row, newItems} = getJustifiedRow({
            items,
            rowIndex: rows.length,
          });
          rows.push(row);
          items = newItems;
        } else {
          const {row, newItems} = rowFunc({
            items,
            rowIndex: rows.length,
          });
          rows.push(row);
          items = newItems;
        }
      }
    }
    return rows;
  };
  return (
    // @ts-ignore
    <div ref={container}>{buildRows()}</div>
  );
};

export {Fresco};
