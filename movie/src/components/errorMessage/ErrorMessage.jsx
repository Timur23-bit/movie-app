import { Alert } from 'antd';
import React from 'react';

export default function ErrorMessag (netWork) {
  let art;
  if (netWork.netWork) {
    art = <Alert
      message='Not found'
      description='Not found films for this keyword'
      type="error"
      showIcon
    />
  } else {
    art = <Alert
      message='No internet'
      description='Not internet line'
      type="error"
      showIcon
    />
  }

  return art;
}