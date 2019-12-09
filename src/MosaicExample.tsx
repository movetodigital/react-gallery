import * as React from 'react';

interface Props {
  margin?: number;
}

import {Mosaic} from './Mosaic';

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const images = Array.from('x'.repeat(40)).map(item => ({
  src: `https://source.unsplash.com/800x${800 + getRandomInt(100)}`,
  title: 'hello',
  alt: 'hello',
}));
export const MosaicExample: React.FunctionComponent<Props> = ({margin}) => (
  <div style={{maxWidth: '1200px', margin}}>
    <Mosaic gridColumns={5} gridGutter={1} images={images} />
  </div>
);
