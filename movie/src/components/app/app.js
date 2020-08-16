import React from 'react';
import { Layout } from 'antd';
import ItemList from '../item-list/item-list';

const { Content } = Layout;

export default function App() {
  return (
    <Content>
      <ItemList />
    </Content>
  )
}
