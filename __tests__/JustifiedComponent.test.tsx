import {shallow} from 'enzyme';
import * as React from 'react';

import {Justified} from '../src/Justified';

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

describe('<Justified />', () => {
  it('should render and match snapshot', () => {
    const tree = shallow(<Justified {...hydratedProps} />);

    expect(tree).toMatchSnapshot();
  });
});
