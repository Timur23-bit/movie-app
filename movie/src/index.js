import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import App from './components/app';
import HeaderMovie from './components/header';

ReactDOM.render(
  <Layout className="layout">
    <HeaderMovie/>
    <App/>
  </Layout>
  ,
  document.getElementById('root')
);
