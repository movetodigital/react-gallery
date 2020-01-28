import {storiesOf} from '@storybook/react';
import * as React from 'react';

import {JustifiedExample} from '../src/JustifiedExample';

storiesOf('React Justified', module).add(
  'Default',
  () => {
    return <JustifiedExample />;
  },
  {
    notes: ``,
  }
);
