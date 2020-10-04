import React, { Component } from 'react';
import { Layout } from 'antd';
import ItemList from '../item-list/item-list';
import HeaderMovie from '../header';
import { MovieProvider } from '../movie-genres/movie-genres'
import MovieService from '../../services/movie-service';

const { Content } = Layout;

export default class App extends Component {
  movieService = new MovieService();

  state = {
    search: true,
    rated: [],
    genres:[]
  };

  constructor() {
    super();
    this.getGenres();
  }

  getSearch = () => {
    this.setState({
      search: true,
    });
    console.log(this.state);
  };

  getRated = () => {
    this.setState({
      search: false,
    });
    console.log(this.state);
  };

  getGenres () {
    this.movieService
      .getGenres()
      .then((genre) => {
        this.setState({
          genres: genre.genres
        })
      })
  }

  render () {
    const {search, genres} = this.state;

    return (
      <Content>
        <MovieProvider value={genres}>
        <HeaderMovie
          getSearch={this.getSearch}
          getRated={this.getRated}
        />
        <ItemList search={search}/>
        </MovieProvider>
      </Content>
    )
  }
}
