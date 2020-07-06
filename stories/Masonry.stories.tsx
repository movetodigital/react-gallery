import {boolean, number, withKnobs} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import React from 'react';

import {MasonryExample} from '../src/masonry/MasonryExample';

storiesOf('React Masonry', module)
  .addDecorator(withKnobs)
  .add(
    'Default with addons',
    () => {
      return (
        <MasonryExample
          columnsMaxCount={number('Max columns count', 5)}
          gutterInPercent={number('Gutter in %', 0.5)}
          enableDetailView={boolean('Enable detail view', false)}
        />
      );
    },
    {
      notes: ``,
    }
  );
