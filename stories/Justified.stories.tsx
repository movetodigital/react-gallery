import {boolean, number, withKnobs} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import React from 'react';

import {JustifiedExample} from '../src/justified/JustifiedExample';

storiesOf('React Justified', module)
  .addDecorator(withKnobs)
  .add(
    'Default with addons',
    () => {
      return (
        <JustifiedExample
          columnsMaxCount={number('Max columns count', 5)}
          gutterInPercent={number('Gutter in %', 0.5)}
          disableObserver={boolean('Disable Intersection Observer', false)}
          disableActualImage={boolean('Disable actual images', false)}
          enableDetailView={boolean('Enable detail view', false)}
          disableLastRowDetecting={boolean('Disable LastRow Detecting', false)}
          viewportWidth={number('Viewport width in px', 0)}
          viewportHeight={number('Viewport height in px', 400)}
        />
      );
    },
    {
      notes: ``,
    }
  );
