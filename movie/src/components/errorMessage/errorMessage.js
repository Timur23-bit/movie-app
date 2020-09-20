import { Alert } from 'antd';
import React from 'react';

export default function ErrorMessag (netWork) {
  let art;
  console.log(netWork);
  if (netWork.netWork) {
    console.log('+');
    art = <Alert
      message='Not found'
      description='Not found films for this keyword'
      type="error"
      showIcon
    />
  } else {
    console.log('-');
    art = <Alert
      message='No internet'
      description='Not internet line'
      type="error"
      showIcon
    />
  }

  return art;
}