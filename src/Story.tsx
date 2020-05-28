import * as React from 'react';
import styled from 'styled-components';

type FunctionName = (n: object) => any;

interface ImageItemProps {
  aspectRatio: number;
  src?: string;
  title?: string;
  alt?: string;
}

interface AlbumProps {
  title: string;
  photos: Array<ImageItemProps>;
}

interface ComponentProps {
  albums: Array<AlbumProps>;
  gridGutter: number;
  rowHeight?: string;
  imageRenderer?: FunctionName;
  albumTitleRenderer?: FunctionName;
  align?: 'center' | 'left' | 'right';
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
  height: ${props => props.height};
  width: ${props => props.width};
  margin: ${props => props.padding};

  > div:first-child {
    width: 100%;
    height: ${props => props.height};
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

const Story: React.FunctionComponent<ComponentProps> = ({
  albums,
  rowHeight = '300px',
  gridGutter,
  align = 'center',
  imageRenderer = defaultRender,
  albumTitleRenderer = defaultTitleRender,
}) => {
  const gutter = gridGutter / 2;

  return (
    <Images align={align !== 'right' ? align : 'flex-end'}>
      {albums.map((album, albumInd) =>
        album.photos.map((el, index) => {
          const ratio = 100 / el.aspectRatio;
          const isFirstPhoto = index === 0;
          const isLastPhoto = index === album.photos.length - 1;
          const isLastAlbum = albumInd === albums.length - 1;
          const isFirstAlbum = albumInd === 0;

          const paddingTop = gutter;
          const paddingBottom = gridGutter * 2.25;
          const paddingRight =
            align !== 'right'
              ? isLastPhoto && !isLastAlbum
                ? gridGutter * 3.25
                : gutter
              : gutter;
          const paddingLeft =
            align !== 'right'
              ? gutter
              : isFirstPhoto && !isFirstAlbum
              ? gridGutter * 3.25
              : gutter;

          return (
            <>
              <Item
                key={`${index}_${gutter}`}
                height={rowHeight}
                width={`calc(${el.aspectRatio} * ${rowHeight})`}
                padding={`${paddingTop}% ${paddingRight}% ${paddingBottom}% ${paddingLeft}%`}
                aspectRatio={el.aspectRatio}
                ratio={ratio}
              >
                <div>{imageRenderer({props: el, key: index})}</div>
                {isFirstPhoto && albumTitleRenderer({props: album})}
              </Item>
            </>
          );
        })
      )}
    </Images>
  );
};

export {Story};
