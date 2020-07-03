import * as React from 'react';

interface Props {
  margin?: number;
  enableDetailView?: boolean;
  gridColumns: number;
  gridGutter: number;
  aspectRatio?: number;
}

import {Mosaic} from './Mosaic';

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const images = Array.from('x'.repeat(40)).map(() => ({
  src: `https://source.unsplash.com/800x${800 + getRandomInt(100)}`,
  title: 'hello',
  alt: 'hello',
}));

export const MosaicExample: React.FunctionComponent<Props> = ({
  gridColumns,
  gridGutter,
  aspectRatio,
  enableDetailView,
  margin,
}) => (
  <div style={{width: '1200px', margin}}>
    <Mosaic
      aspectRatio={aspectRatio}
      gridColumns={gridColumns}
      gridGutter={gridGutter}
      // @ts-ignore
      images={images}
      enableDetailView={enableDetailView}
    />
  </div>
);
