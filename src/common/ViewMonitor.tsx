/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import isBrowser from './isBrowser';

if (isBrowser) {
  require('intersection-observer');
}

import Observer from '@researchgate/react-intersection-observer';
import React, {useState} from 'react';

interface Props {
  tag?: React.ReactElement;
  children: React.ReactElement;
  disableActualImage: boolean;
  disableObserver: boolean;
}
const ViewMonitor = ({
  tag: Tag = 'div',
  children,
  disableActualImage,
  disableObserver,
}: Props): React.ReactNode => {
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = ({isIntersecting}: any) => {
    if (!isVisible) {
      setIsVisible(isIntersecting);
    }
  };

  if (disableObserver) {
    // @ts-ignore
    return <Tag>{children(!disableActualImage)}</Tag>;
  }
  if (!isBrowser) {
    // @ts-ignore
    return <Tag>{children(false)}</Tag>;
  }
  return (
    <Observer onChange={handleChange}>
      <Tag>{children(isVisible)}</Tag>
    </Observer>
  );
};

export default ViewMonitor;
