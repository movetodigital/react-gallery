import React from 'react';

interface Props {
  columnsMaxCount: number;
  gutterInPercent: number;
  enableDetailView: boolean;
}

import {Justified} from './Justified';

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

export const JustifiedExample: React.FunctionComponent<Props> = ({
  columnsMaxCount,
  gutterInPercent,
  enableDetailView,
}) => (
  <div style={{width: '1200px'}}>
    <Justified
      images={images}
      columnsMaxCount={columnsMaxCount}
      gutterInPercent={gutterInPercent}
      enableDetailView={enableDetailView}
    />
  </div>
);
