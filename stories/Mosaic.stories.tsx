import {storiesOf} from '@storybook/react';
import * as React from 'react';

import {MosaicExample} from '../src/MosaicExample';

storiesOf('React Mosaic', module).add(
  'Default',
  () => {
    return <MosaicExample />;
  },
  {
    notes: ``,
  }
);
