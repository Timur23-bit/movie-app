import { Layout, Menu } from 'antd';
import React, { Component } from 'react';

const { Header } = Layout;

export default class HeaderMovie extends Component{

  state = {

  };

  render () {
  return (
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1"> Фильмы </Menu.Item>
          <Menu.Item key="2"> Сериалы </Menu.Item>
        </Menu>
      </Header>
    )
  }
}
