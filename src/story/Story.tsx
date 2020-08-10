/* eslint-disable */
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

type FunctionName = (n: object) => any;

interface ImageItemProps {
  aspectRatio: number;
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
  align?: string;
}

interface AlbumProps {
  title: string;
  photos: Array<ImageItemProps>;
}

interface ComponentProps {
  albums: Array<AlbumProps>;
  gridGutter: number;
  rowHeight?: number;
  imageRenderer?: FunctionName;
  albumTitleRenderer?: FunctionName;
  align?: 'center' | 'left' | 'right';
  rowSpacing?: string;
  enableDetailView?: boolean;
  detailsViewRenderer?: FunctionName;
}

interface StyleItemProps {
  readonly height: string;
  readonly width: string;
  readonly padding: string;
  readonly ratio: number;
  readonly aspectRatio: number;
}

interface StyleAlbumProps {
  readonly align: string;
}

interface RendererProps {
  props: ImageItemProps;
  key: number;
}
interface RendererTitleProps {
  props: AlbumProps;
}
interface DetailViewRendererProps {
  props: DetailItemProps;
}

const Images = styled.div<StyleAlbumProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: ${props => props.align};
`;

const AlbumTitle = styled.div`
  text-align: left;
  color: #bdbdbd;
  font-size: 16px;
  margin-top: 5px;
  line-height: 1.43em;
  width: max-content;
`;

const Item = styled.div<StyleItemProps>`
  color: white;
  position: relative;
  box-sizing: border-box;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  margin: ${props => props.padding};

  > div:first-child {
    width: 100%;
    height: ${props => props.height}px;
  }
`;

const DefaultImage = styled.img`
  width: 100%;
  object-fit: contain;
`;

const DefaultImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const DetailView = styled.div`
  position: relative;
`;

const DefaultDetailContainer = styled.div<DetailItemProps>`
  display: flex;
  justify-content: ${props =>
    props.align !== 'right' ? props.align : 'flex-end'};
  > div {
    width: ${props => props.width}px;
  }
`;

const defaultRender = ({props: {src, title, alt}}: RendererProps) => {
  return (
    <DefaultImageContainer>
      <DefaultImage key={src} src={src} title={title} alt={alt} />
    </DefaultImageContainer>
  );
};

const defaultTitleRender = ({props: {title}}: RendererTitleProps) => {
  return <AlbumTitle>{title}</AlbumTitle>;
};

const defaultDetailsViewRenderer = ({
  props: {src, title, alt, width, align},
}: DetailViewRendererProps) => {
  return (
    <DefaultDetailContainer width={width} align={align}>
      <div>
        <DefaultImage key={src} src={src} title={title} alt={alt} />
      </div>
    </DefaultDetailContainer>
  );
};

const Story: React.FunctionComponent<ComponentProps> = ({
  albums,
  rowHeight = 300,
  gridGutter,
  align = 'center',
  rowSpacing,
  imageRenderer = defaultRender,
  albumTitleRenderer = defaultTitleRender,
  enableDetailView = false,
  detailsViewRenderer = defaultDetailsViewRenderer,
}) => {
  const container = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  const [rows, setRows] = useState([]);

  const resize = () => {
    // @ts-ignore
    setContainerWidth(container.current.offsetWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();

    return () => removeEventListener('resize', resize);
  }, []);

  const gutter = gridGutter / 2;

  const getRows = () => {
    const rows: Array<any> = [];
    let totalWidth = 0;
    let row: Array<any> = [];
    albums.map((album, albumInd) => {
      album.photos.map((el, index) => {
        const ratio = 100 / el.aspectRatio;
        const isFirstPhoto = index === 0;
        const isLastPhoto = index === album.photos.length - 1;
        const isLastAlbum = albumInd === albums.length - 1;
        const isFirstAlbum = albumInd === 0;
        const paddingTop = gutter;
        const paddingBottom = rowSpacing || `${gridGutter * 2.25}%`;

        const width = el.aspectRatio * rowHeight;

        const paddingRight = isLastPhoto && isLastAlbum ? 0 : gutter;
        let paddingLeft =
          isFirstPhoto && !isFirstAlbum ? gridGutter * 3.25 : gutter;
        if (isFirstPhoto && isFirstAlbum) {
          paddingLeft = 0;
        }

        const padding = ((paddingLeft + paddingRight) * containerWidth) / 100;

        totalWidth += width + padding;
        const item = {
          height: rowHeight,
          width,
          ratio,
          isFirstPhoto,
          paddingTop,
          paddingBottom,
          paddingRight,
          paddingLeft,
          album,
          image: el,
        };
        if (totalWidth < containerWidth) {
          row.push({
            ...item,
            paddingLeft,
            paddingRight,
          });
          if (isLastPhoto && isLastAlbum) {
            rows.push(row);
          }
        } else {
          totalWidth = width + padding;
          rows.push(row);
          row = [
            {
              ...item,
              paddingLeft: gutter,
              paddingRight: gutter,
            },
          ];
          if (isLastPhoto && isLastAlbum) {
            rows.push(row);
          }
        }
      });
    });
    return rows;
  };
  useEffect(() => {
    setRows(getRows() as Array<never>);
  }, [albums, containerWidth]);
  const [selectedImageRow, setSelectedImageRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const handleSelectImage = ({imageRow, imageId, image}: {imageRow: any, imageId: any, image : any}) => {
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


  return (
    // @ts-ignore
    <div ref={container}>
      {rows.map((row: Array<any>, rowIndex: number) => (
        <React.Fragment key={`image-row-${rowIndex}`}>
          <Images
            align={align !== 'right' ? align : 'flex-end'}
          >
            {row.map(
              (
                {
                  height,
                  width,
                  ratio,
                  isFirstPhoto,
                  paddingTop,
                  paddingBottom,
                  paddingRight,
                  paddingLeft,
                  album,
                  image,
                },
                index: number
              ) => {
                const imageId = `image-${image.src}-${rowIndex}-${index}`;
                return (
                  <Item
                    key={imageId}
                    height={height}
                    width={width}
                    padding={`${paddingTop}% ${paddingRight}% ${paddingBottom} ${paddingLeft}%`}
                    aspectRatio={image.aspectRatio}
                    ratio={ratio}
                    onClick={() =>
                      handleSelectImage({
                        imageRow: rowIndex,
                        imageId,
                        image: {
                          ...image,
                          width,
                          height,
                        },
                      })
                    }
                  >
                    <div>{imageRenderer({props: image, key: index})}</div>
                    {isFirstPhoto && albumTitleRenderer({props: album})}
                  </Item>
                );
              }
            )}
          </Images>
          {enableDetailView && rowIndex === selectedImageRow && (
            <DetailView key={`detail-${rowIndex}`}>
              {detailsViewRenderer({
                props: {
                  id: selectedImageId,
                  align,
                  // @ts-ignore
                  ...selectedImage,
                },
              })}
            </DetailView>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export {Story};
