import {shallow} from 'enzyme';
import * as React from 'react';

import {Mosaic} from '../src/Mosaic';

const hydratedProps = {
  images: [
      'x',
      'x',
      'x',
      'x'
  ]
};

describe('<Mosaic />', () => {
  it('should render and match snapshot', () => {
    const tree = shallow(<Mosaic {...hydratedProps} />);

    expect(tree).toMatchSnapshot();
  });
});
