import {boolean, number, select, text, withKnobs} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import * as React from 'react';

import {StoryExample} from '../src/story/StoryExample';

storiesOf('React Story', module)
  .addDecorator(withKnobs)
  .add(
    'Default with addons',
    () => {
      const gridGutter = number('Grid gutter', 1);
      const aligns = {
        Left: 'left',
        Center: 'center',
        Right: 'right',
      };
      const align = select('Align', aligns, 'center');
      const rowHeight = number('Row height in px', 300);
      const rowSpacing = text('Row spacing', '30px');
      const enableDetailView = boolean('Enable detail view', false);

      return (
        <StoryExample
          gridGutter={gridGutter}
          align={align as 'center' | 'left' | 'right'}
          rowHeight={rowHeight}
          rowSpacing={rowSpacing}
          enableDetailView={enableDetailView}
        />
      );
    },
    {
      notes: ``,
    }
  );
