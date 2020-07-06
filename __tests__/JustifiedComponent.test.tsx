import {mount} from 'enzyme';
import * as React from 'react';

import {Justified} from '../src/justified/Justified';

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
    const tree = mount(<Justified {...hydratedProps} />);

    expect(tree).toMatchSnapshot();
  });
});
