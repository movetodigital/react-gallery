import * as React from 'react';

interface Props {
  margin?: number;
}

import {Mosaic} from './Mosaic';

const images = Array.from('x'.repeat(40));
export const MosaicExample: React.FunctionComponent<Props> = ({margin}) => (
  <div style={{maxWidth: '400px', margin}}>
    <Mosaic images={images} />
  </div>
);
