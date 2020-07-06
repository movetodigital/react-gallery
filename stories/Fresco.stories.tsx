import {boolean, number, withKnobs} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import React from 'react';

import {FrescoExample} from '../src/fresco/FrescoExample';

storiesOf('React Fresco', module)
  .addDecorator(withKnobs)
  .add(
    'Default with addons',
    () => {
      return (
        <FrescoExample
          columnsMaxCount={number('Max columns count', 3)}
          gutterInPercent={number('Gutter in %', 1)}
          enableDetailView={boolean('Enable detail view', false)}
          aspectRatio={number('Aspect ratio', 3)}
        />
      );
    },
    {
      notes: ``,
    }
  );
