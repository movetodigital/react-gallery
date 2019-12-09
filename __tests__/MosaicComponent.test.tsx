import {shallow} from 'enzyme';
import * as React from 'react';

import {Mosaic} from '../src/Mosaic';

const hydratedProps = {
  images: [
    {
      src: '/image/name/1',
      width: 500,
      height: 500,
    },
    {
      src: '/image/name/1',
      width: 500,
      height: 500,
    },
    {
      src: '/image/name/1',
      width: 500,
      height: 500,
    },
    {
      src: '/image/name/1',
      width: 500,
      height: 500,
    },
  ],
  gridColumns: 5,
  gridGutter: 1,
};

describe('<Mosaic />', () => {
  it('should render and match snapshot', () => {
    const tree = shallow(<Mosaic {...hydratedProps} />);

    expect(tree).toMatchSnapshot();
  });
});
