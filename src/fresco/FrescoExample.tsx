import React from 'react';

interface Props {
  columnsMaxCount: number;
  gutterInPercent: number;
  aspectRatio: number;
  enableDetailView: boolean;
  gridType: 1 | 2 | 3 | 4;
}

import {Fresco} from './Fresco';

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const images = Array.from('x'.repeat(40)).map(() => {
  const width = 400 + getRandomInt(500);
  const height = 400 + getRandomInt(500);

  return {
    src: `https://source.unsplash.com/${width}x${height}`,
    title: 'hello',
    alt: 'hello',
    width,
    height,
  };
});

export const FrescoExample: React.FunctionComponent<Props> = ({
  columnsMaxCount,
  gutterInPercent,
  enableDetailView,
  aspectRatio,
  gridType,
}) => (
  <div style={{width: '1200px'}}>
    <Fresco
      images={images}
      columnsMaxCount={columnsMaxCount}
      gutterInPercent={gutterInPercent}
      enableDetailView={enableDetailView}
      aspectRatio={aspectRatio}
      gridType={gridType}
    />
  </div>
);
