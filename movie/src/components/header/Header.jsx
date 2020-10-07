import { Tabs } from 'antd';
import React, { Component } from 'react';
import ItemList from '../item-list';
import movies from '../../services/movie-service';

const { TabPane } = Tabs;

export default class HeaderMovie extends Component {
  state = {
    rated: null,
    pageTotal: 0,
    page: 1
  };

  constructor() {
    super();
    this.getRatedGuestSession();
  }

  getRatedGuestSession () {
    movies
      .getRatedGuestSession(sessionStorage.sessionId)
      .then((res) => {
        this.setState({
          rated: res.results,
          pageTotal: res.total_pages,
          page: res.page,
          flag: true
        })
      })
  };

  render() {
    const {rated, page, pageTotal, flag} = this.state;
    const rateds = <ItemList rated={rated} pages={page} pagesTotal={pageTotal} rate/>;

    return (
      <Tabs defaultActiveKey="1" onChange={(key) => {
        if (key == 2) {
          this.getRatedGuestSession();
        }
      }} centered>
        <TabPane tab="Search" key="1">
          <ItemList/>
        </TabPane>
        <TabPane tab="Rated" key="2">
          {rateds}
        </TabPane>
      </Tabs>
    )
  }
}