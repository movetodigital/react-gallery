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
  imageRenderer?: FunctionName;
}

interface ImagesComponentProps {
  gridGutter: number;
  gridColumns: number;
}

interface StyleItemProps {
  gridGutter: number;
}

const Images = styled.div<ImagesComponentProps>`
  column-count: ${props => props.gridColumns};
  margin: 0 auto;
  column-gap: ${props => props.gridGutter}%;
`;

const Item = styled.div<StyleItemProps>`
  margin: 0 0 ${props => props.gridGutter}em;
`;

const DefaultImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

interface RendererProps {
  props: ImageItemProps;
  key: number;
}

const defaultRender = ({props: {src, title, alt}, key}: RendererProps) => {
  return <DefaultImage key={src} src={src} title={title} alt={alt} />;
};

const Masonry: React.FunctionComponent<ComponentProps> = ({
  images,
  gridColumns,
  gridGutter,
  imageRenderer = defaultRender,
}) => {
  return (
    <Images gridColumns={gridColumns} gridGutter={gridGutter}>
      {images.map((el, index) => (
        <Item key={`${index}_${gridGutter}`} gridGutter={gridGutter}>
          <div>{imageRenderer({props: el, key: index})}</div>
        </Item>
      ))}
    </Images>
  );
};

export {Masonry};
