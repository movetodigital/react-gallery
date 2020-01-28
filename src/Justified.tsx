import * as React from 'react';
import styled from 'styled-components';

type FunctionName = (n: object) => any;

interface ImageItemProps {
  src?: string;
  title?: string;
  alt?: string;
}

interface ComponentProps {
  images: Array<ImageItemProps>;
  gridColumns: number;
  gridGutter: number;
  aspectRatio?: number;
  imageRenderer?: FunctionName;
}

interface StyleItemProps {
  readonly width: number;
  readonly padding: string;
  readonly ratio: number;
}

interface RendererProps {
  props: ImageItemProps;
  key: number;
}

const Images = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Item = styled.div<StyleItemProps>`
  color: white;
  position: relative;
  box-sizing: border-box;
  width: ${props => props.width}%;
  margin: ${props => props.padding};

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

const defaultRender = ({props: {src, title, alt}, key}: RendererProps) => {
  return (
    <DefaultImageContainer>
      <DefaultImage key={src} src={src} title={title} alt={alt} />
    </DefaultImageContainer>
  );
};

const Justified: React.FunctionComponent<ComponentProps> = ({
  images,
  gridColumns,
  gridGutter,
  aspectRatio = 1,
  imageRenderer = defaultRender,
}) => {
  const gutter = gridGutter / 2;
  const width = (100 - (gridColumns - 1) * gutter * 2) / gridColumns;
  const ratio = 100 / aspectRatio;

  return (
    <Images>
      {images.map((el, index) => (
        <Item
          key={`${index}_${gutter}`}
          width={width}
          padding={`${gutter}% ${
            (index + 1) % gridColumns === 0 ? '0' : gutter
          }% ${gutter}% ${index % gridColumns === 0 ? '0' : gutter}%`}
          ratio={ratio}
        >
          <div>{imageRenderer({props: el, key: index})}</div>
        </Item>
      ))}
    </Images>
  );
};

export {Justified};
