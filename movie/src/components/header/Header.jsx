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

  getRatedGuestSession () {
    movies
      .getRatedGuestSession(sessionStorage.sessionId)
      .then((res) => {
        this.setState({
          rated: res.results,
          pageTotal: res.total_pages,
          page: res.page
        })
      })
  };

  Rated () {
    const {rated, page, pageTotal } = this.state;
    if (!rated) {
      this.getRatedGuestSession();
      return <ItemList rated={rated} pages={page} pagesTotal={pageTotal} rate/>
    }
    return <ItemList rated={rated} pages={page} pagesTotal={pageTotal} rate/>
  }

  render() {
    const rated = this.Rated(true);

    return (
      <Tabs defaultActiveKey="1" onChange={() => {}} centered>
        <TabPane tab="Search" key="1">
          <ItemList/>
        </TabPane>
        <TabPane tab="Rated" key="2">
          {rated}
        </TabPane>
      </Tabs>
    )
  }
}