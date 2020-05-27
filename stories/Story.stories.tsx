import {storiesOf} from '@storybook/react';
import * as React from 'react';

import {StoryExample} from '../src/StoryExample';

storiesOf('React Story', module).add(
  'Default',
  () => {
    return <StoryExample />;
  },
  {
    notes: ``,
  }
);
