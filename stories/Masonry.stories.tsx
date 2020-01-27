import {storiesOf} from '@storybook/react';
import * as React from 'react';

import {MasonryExample} from '../src/MasonryExample';

storiesOf('React Masonry', module).add(
  'Default',
  () => {
    return <MasonryExample />;
  },
  {
    notes: ``,
  }
);
