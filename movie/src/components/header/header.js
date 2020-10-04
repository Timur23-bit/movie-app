import { Layout, Menu } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const { Header } = Layout;

export default class HeaderMovie extends Component{
  state = {
  };

  render () {
    const {getSearch, getRated } = this.props;

    return (
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" onClick={
          ({key}) => {
            // eslint-disable-next-line eqeqeq
          if (key == 1 ) {
            getSearch();
          } else {
            getRated();
          }
        }}>
          <Menu.Item key="1"> Search</Menu.Item>
          <Menu.Item key="2"> Rated </Menu.Item>
        </Menu>
      </Header>
    )
  }
}

HeaderMovie.defaultProps = {
  getSearch: () => {},
  getRated: () => {}
};

HeaderMovie.propTypes = {
  getSearch: PropTypes.func,
  getRated: PropTypes.func
};