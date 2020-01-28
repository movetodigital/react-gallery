import * as React from 'react';

interface Props {
  margin?: number;
}

import {Justified} from './Justified';

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const images = Array.from('x'.repeat(40)).map(item => ({
  src: `https://source.unsplash.com/800x${800 + getRandomInt(100)}`,
  title: 'hello',
  alt: 'hello',
}));
export const JustifiedExample: React.FunctionComponent<Props> = ({margin}) => (
  <div style={{width: '1200px', margin}}>
    <Justified
      aspectRatio={16 / 9}
      gridColumns={5}
      gridGutter={1}
      images={images}
    />
  </div>
);
