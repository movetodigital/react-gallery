import * as React from 'react';
import styled from 'styled-components';

type FunctionName = (n: object) => any;

interface ImageItemProps {
  src: string;
  title?: string;
  alt?: string;
}

interface ComponentProps {
  images: Array<ImageItemProps>;
  gridColumns: number;
  gridGutter: number;
  imageRenderer?: FunctionName;
}

const Images = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

interface StyleItemProps {
  readonly width: number;
  readonly padding: string;
  readonly height: number;
}

const Item = styled.div<StyleItemProps>`
  color: white;
  position: relative;
  box-sizing: border-box;
  width: ${props => props.width}%;
  margin: ${props => props.padding};

  > div {
    height: ${props => props.height}px;
  }
`;

const DefaultImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  overflow: hidden !important;
`;

interface RendererProps {
  props: ImageItemProps;
  key: number;
}

const defaultRender = ({props: {src, title, alt}, key}: RendererProps) => {
  return <DefaultImage key={src} src={src} title={title} alt={alt} />;
};

const Mosaic: React.FunctionComponent<ComponentProps> = ({
  images,
  gridColumns,
  gridGutter,
  imageRenderer = defaultRender,
}) => {
  const gutter = gridGutter / 2;
  const width = (100 - (gridColumns - 1) * gutter * 2) / gridColumns;
  const height = 1200 / gridColumns;

  return (
    <Images>
      {images.map((el, index) => (
        <Item
          key={`${index}_${gutter}`}
          width={width}
          padding={`${gutter}% ${
            (index + 1) % gridColumns === 0 ? '0' : gutter
          }% ${gutter}% ${index % gridColumns === 0 ? '0' : gutter}%`}
          height={height}
        >
          <div>{imageRenderer({props: el, key: index})}</div>
        </Item>
      ))}
    </Images>
  );
};

export {Mosaic};
