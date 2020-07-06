/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import React from 'react';

import isBrowser from './isBrowser';

interface Props {
  tag?: React.ReactElement;
  children: React.ReactElement;
}
const ViewMonitor = ({tag: Tag = 'div', children}: Props): React.ReactNode => {
  if (!isBrowser) {
    // @ts-ignore
    return <Tag>{children(false)}</Tag>;
  }
  return <Tag>{children(true)}</Tag>;
};

export default ViewMonitor;
