import {mount} from 'enzyme';
import * as React from 'react';

import {Masonry} from '../src/masonry/Masonry';

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

describe('<Masonry />', () => {
  it('should render and match snapshot', () => {
    const tree = mount(<Masonry {...hydratedProps} />);

    expect(tree).toMatchSnapshot();
  });
});
