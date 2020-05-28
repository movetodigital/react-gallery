import * as React from 'react';

import {Story} from './Story';

interface Props {
  margin?: number;
  gridGutter: number;
  rowHeight?: string;
  align?: 'center' | 'left' | 'right';
}

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

export const StoryExample: React.FunctionComponent<Props> = ({
  margin,
  rowHeight = '300px',
  gridGutter,
  align = 'center',
}) => (
  <div style={{width: '1200px', margin}}>
    <Story
      gridGutter={gridGutter}
      albums={albums}
      align={align}
      rowHeight={rowHeight}
    />
  </div>
);
