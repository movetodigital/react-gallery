import * as React from 'react';

interface Props {
  margin?: number;
}

import {Story} from './Story';

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getImages = () =>
  Array.from('x'.repeat(getRandomInt(10))).map(() => {
    const width = 400 + getRandomInt(500);
    const height = 400 + getRandomInt(500);

    return {
      src: `https://source.unsplash.com/${width}x${height}`,
      title: 'hello',
      alt: 'hello',
      aspectRatio: width / height,
    };
  });

const albums = Array.from('x'.repeat(20)).map(() => ({
  title: 'Title ' + getRandomInt(20),
  photos: getImages(),
}));
export const StoryExample: React.FunctionComponent<Props> = ({margin}) => (
  <div style={{width: '1200px', margin}}>
    <Story gridGutter={1} albums={albums} />
  </div>
);
