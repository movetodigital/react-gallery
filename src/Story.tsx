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
  aspectRatio?: number;
  imageRenderer?: FunctionName;
  align?: 'center' | 'left';
}

interface StyleItemProps {
  readonly height: string;
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
  width: ${props => `calc(${props.aspectRatio} * ${props.height})`};
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

const Story: React.FunctionComponent<ComponentProps> = ({
  albums,
  rowHeight = '300px',
  gridGutter,
  align = 'center',
  imageRenderer = defaultRender,
}) => {
  const gutter = gridGutter / 2;
  return (
    <Images align={align}>
      {albums.map(({photos, title}, albumInd) =>
        photos.map((el, index) => {
          const ratio = 100 / el.aspectRatio;
          const isFirstPhoto = index === 0;
          const isFirstAlbum = albumInd === 0;
          return (
            <>
              <Item
                key={`${index}_${gutter}`}
                height={rowHeight}
                padding={`${gutter}% ${gutter}% ${gridGutter * 2.25}% ${
                  isFirstPhoto && !isFirstAlbum ? gridGutter * 3.25 : gutter
                }%`}
                aspectRatio={el.aspectRatio}
                ratio={ratio}
              >
                <div>{imageRenderer({props: el, key: index})}</div>
                {isFirstPhoto && <AlbumTitle>{title}</AlbumTitle>}
              </Item>
            </>
          );
        })
      )}
    </Images>
  );
};

export {Story};
