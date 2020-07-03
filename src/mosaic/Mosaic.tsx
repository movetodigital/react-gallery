/* eslint-disable @typescript-eslint/no-explicit-any */
import chunk from 'lodash/chunk';
import React, {useState} from 'react';
import styled from 'styled-components';

type FunctionName = (n: object) => any;

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
}

interface ComponentProps {
  images: Array<ImageItemProps>;
  gridColumns: number;
  gridGutter: number;
  aspectRatio?: number;
  imageRenderer?: FunctionName;
  enableDetailView?: boolean;
  detailsViewRenderer?: FunctionName;
}

interface StyleItemProps {
  readonly width: number;
  readonly padding: string;
  readonly ratio: number;
}

interface RendererProps {
  props: ImageItemProps;
}
interface DetailViewRendererProps {
  props: DetailItemProps;
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

const DetailView = styled.div`
  position: relative;
`;

const DefaultDetailContainer = styled.div<DetailItemProps>`
  width: ${props => props.width}%;
  margin-left: auto;
  margin-right: auto;
`;
const defaultRender = ({props: {src, title, alt}}: RendererProps) => {
  return (
    <DefaultImageContainer>
      <DefaultImage key={src} src={src} title={title} alt={alt} />
    </DefaultImageContainer>
  );
};

const defaultDetailsViewRenderer = ({
  props: {src, title, alt, width},
}: DetailViewRendererProps) => {
  return (
    <DefaultDetailContainer width={width}>
      <DefaultImage key={src} src={src} title={title} alt={alt} />
    </DefaultDetailContainer>
  );
};

const Mosaic = ({
  images = [],
  gridColumns = 5,
  gridGutter = 1,
  aspectRatio = 1,
  imageRenderer = defaultRender,
  enableDetailView = false,
  detailsViewRenderer = defaultDetailsViewRenderer,
}): ComponentProps => {
  const gutter = gridGutter / 2;
  const width = (100 - (gridColumns - 1) * gutter * 2) / gridColumns;
  const ratio = 100 / aspectRatio;

  const [selectedImageRow, setSelectedImageRow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const handleSelectImage = ({imageRow, imageId, image}: any) => {
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

  // @ts-ignore
  return chunk(images, gridColumns).map((row: Array<any>, rowIndex: number) => {
    return (
      <div key={`image-row-${rowIndex}`}>
        <Images>
          {row.map((el: any, index: number) => {
            const imageId = `image-${el.src}-${rowIndex}-${index}`;
            return (
              <Item
                key={imageId}
                width={width}
                padding={`${gutter}% ${
                  (index + 1) % gridColumns === 0 ? '0' : gutter
                }% ${gutter}% ${index % gridColumns === 0 ? '0' : gutter}%`}
                ratio={ratio}
                onClick={() =>
                  handleSelectImage({
                    imageRow: rowIndex,
                    imageId,
                    image: el,
                  })
                }
              >
                <div>{imageRenderer({props: el})}</div>
              </Item>
            );
          })}
        </Images>
        <DetailView>
          {enableDetailView &&
            rowIndex === selectedImageRow &&
            detailsViewRenderer({
              props: {
                width,
                // @ts-ignore
                ...selectedImage,
              },
            })}
        </DetailView>
      </div>
    );
  });
};

export {Mosaic};
