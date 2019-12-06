import * as React from 'react';

interface Props {
  images: Array<string>;
}

export const Mosaic: React.FunctionComponent<Props> = ({images}) => (
  <div>
    {images.map((el, i) => [
      <img
        style={{
          width: '100%',
        }}
        src={`https://source.unsplash.com/1600x${900 + i}`}
        title="Sample title"
        alt={'hello'}
      />,
      <br />,
    ])}
  </div>
);
