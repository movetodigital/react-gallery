import {boolean, number, withKnobs} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import React from 'react';

import {MosaicExample} from '../src/mosaic/MosaicExample';

storiesOf('React Mosaic', module)
  .addDecorator(withKnobs)
  .add(
    'Default with addons',
    () => {
      return (
        <MosaicExample
          gridColumns={number('Max columns count', 5)}
          aspectRatio={number('Aspect ratio', 1.7)}
          gridGutter={number('Gutter in %', 1)}
          enableDetailView={boolean('Enable detail view', false)}
        />
      );
    },
    {
      notes: ``,
    }
  );
