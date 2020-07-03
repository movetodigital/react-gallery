import React from 'react';

interface Props {
  columnsMaxCount: number;
  gutterInPercent: number;
  disableObserver: boolean;
  enableDetailView: boolean;
  disableActualImage: boolean;
  viewportWidth: number;
  viewportHeight: number;
  disableLastRowDetecting: boolean;
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
  disableObserver,
  disableActualImage,
  enableDetailView,
  viewportWidth,
  viewportHeight,
  disableLastRowDetecting,
}) => (
  <div style={{width: '1200px'}}>
    <Justified
      images={images}
      columnsMaxCount={columnsMaxCount}
      gutterInPercent={gutterInPercent}
      disableObserver={disableObserver}
      disableActualImage={disableActualImage}
      viewportWidth={viewportWidth}
      enableDetailView={enableDetailView}
      disableLastRowDetecting={disableLastRowDetecting}
      viewportHeight={viewportHeight}
    />
  </div>
);
