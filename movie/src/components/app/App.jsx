import React, { Component } from 'react';
import HeaderMovie from '../header';
import { MovieProvider } from '../movie-genres/Movie-genres'
import movies from '../../services/movie-service';

export default class App extends Component {

  state = {
    genres:[]
  };

  constructor() {
    super();
    this.getGenres();
    this.getGuestSession();
  }

  getGuestSession = () => {
    if (sessionStorage.sessionId) {

    } else {
      movies
        .getGuestSession()
        .then((res) => {
          sessionStorage.sessionId = res.guest_session_id;
        })
    }
  };


  getGenres () {
    movies
      .getGenres()
      .then((genre) => {
        this.setState({
          genres: genre.genres
        })
      })
  }

  render () {
    const {genres} = this.state;

    return (
      <div>
        <MovieProvider value={genres}>
          <HeaderMovie />
        </MovieProvider>
      </div>
    )
  }
}