import * as React from 'react';
import styled from 'styled-components';

interface Props {
  images: Array<string>;
  gridColumns: number;
  gridGutter: number;
}

const Images = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

interface ItemProps {
  readonly width: number;
  readonly padding: string;
  readonly height: number;
}

const Item = styled.div<ItemProps>`
  color: white;
  position: relative;
  box-sizing: border-box;
  width: ${props => props.width}%;
  margin: ${props => props.padding};

  > div {
    height: ${props => props.height}px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover !important;
      overflow: hidden !important;
    }
  }
`;

export const Mosaic: React.FunctionComponent<Props> = ({
  images,
  gridColumns,
  gridGutter,
}) => {
  const gutter = gridGutter / 2;
  const width = (100 - (gridColumns - 1) * gutter * 2) / gridColumns;
  const height = 1200 / gridColumns;

  return (
    <Images>
      {images.map((el, index) => (
        <Item
          width={width}
          padding={`${gutter}% ${
            (index + 1) % gridColumns === 0 ? '0' : gutter
          }% ${gutter}% ${index % gridColumns === 0 ? '0' : gutter}%`}
          height={height}
        >
          <div>
            <img
              key={`https://source.unsplash.com/800x${800 + index}`}
              src={`https://source.unsplash.com/800x${800 + index}`}
              title="Image title"
              alt={'image alt'}
            />
          </div>
        </Item>
      ))}
    </Images>
  );
};
