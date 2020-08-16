import React, { Component } from 'react';
import { List } from 'antd';
import { format } from 'date-fns'
import MovieService from '../../services/movie-service';


export default class ItemList extends Component{

  movieService = new MovieService();

  state = {
    returnMovie: [],
    genres: []
  };

  constructor() {
    super();
    this.getGenres();
    this.getSearchFilm();
  }

  getSearchFilm () {
    this.movieService
      .getSearchFilm('return')
      .then((film) => {
        this.setState({
          returnMovie: film
        })
      });
  }


  getGenres () {
    this.movieService
      .getGenres()
      .then((genre) => {
        this.setState({
          genres: genre.genres
        })
      })
  }

  getGenresNames = (ids=[], genres=[]) => {
    const arr = [];
    ids.map((item) => {
      return genres.map((genre) =>
      {
        if (item === genre.id ) {
          return arr.push(genre.name)
        }
        return '+';
      })
    });
    return arr;
  };

  minify(text, length) {
    return `${text.slice(0, text.indexOf(' ', length))  }...`;
  }

  genres (arrGenres) {
    return arrGenres.map( xing => {
      return (
        <div
          key={Math.floor(Math.random()*23*1000)}
          className='genre'>
          {xing}
        </div>
      )
    })
  }

  render () {
    const { returnMovie, genres} = this.state;
    const arrGenres = [];
    returnMovie.forEach((item) => {
      arrGenres.push(this.getGenresNames(item.genre_ids, genres))
    });

    return (
      <List
        itemLayout="vertical"
        size="default"
        pagination={{
          pageSize: 6,
          size: 'default'
        }}
        dataSource={returnMovie}
        renderItem={(item, i) => (
          <div
            className='card-film card__film'>
            <div
              className='card-film__poster'>
              <img
                width={183}
                height={279}
                alt="logo"
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              />
            </div>
            <div
              className='card-film__owerview owerview'>
              <div
                className='owerview__title'>
                  <h1>{item.title}</h1>
              </div>
              <div
                className='owerview__date'>
                {format(new Date(item.release_date), 'MMMM d, yyyy')}
              </div>
              <div
                className='owerview__genre'>
                {this.genres(arrGenres[i])}
              </div>
              <div
                className='owerview__decription'>
                {this.minify(item.overview,150)}
              </div>
            </div>
          </div>
        )}
      />
    )
  }
}
