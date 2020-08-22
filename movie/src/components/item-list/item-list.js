import React, { Component } from 'react';
import { List, Alert, Input } from 'antd';
import { format } from 'date-fns'
import MovieService from '../../services/movie-service';
import Spinn from '../spin';
import logo from '../logo/star.png';

const { Search } = Input;

function ErrorMessag () {
  return (
    <Alert
      message="NOT FOUND"
      description="Not found this keyword"
      type="error"
      showIcon
    />
  )
}

export default class ItemList extends Component{

  movieService = new MovieService();

  state = {
    returnMovie: [],
    genres: [],
    loading: true,
    error: false
  };

  constructor() {
    super();
    this.getGenres();
    this.getSearchFilm();
  }

  onError = () => {
    this.setState({
      error: true,
      loading:false
    });
  };

  getSearchFilm = (find='return') => {
    this.movieService
      .getSearchFilm(find)
      .then((film) => {
        if (film.length === 0) {
          throw new Error();
        } else {
          this.setState({
            returnMovie: film,
            loading: false
          })
        }
      })
      .catch(this.onError)
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

  releaseDate (date) {
    if (date.length === 0){
      return 'Фильм ещё неышел';
    }
      return format(new Date(date), 'MMMM d, yyyy');
  }

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

  imgPoster (item) {
    if (item.poster_path === null) {
      return (
        <div
          className='no-poster'>
          <h1>Нет обложки</h1>
        </div>
      )
    } else if (window.innerWidth < 1147) {
      return (
        <img
          width={60}
          height={91}
          alt="logo"
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        />
      )
    }

      return (
        <img
        width={183}
        height={279}
        alt="logo"
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        />
      )
  }

  rangeSlider (value) {

  }

  // eslint-disable-next-line react/sort-comp
  conten (state) {
    const { returnMovie, genres} = state;
    console.log(returnMovie);
    // eslint-disable-next-line no-use-before-define
    const itemLi = new ItemList();

    const arrGenres = [];
    returnMovie.forEach((item) => {
      arrGenres.push(itemLi.getGenresNames(item.genre_ids, genres))
    });


    return (
      <div>
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={value => {
            this.getSearchFilm(value)
          }}
        />
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
                {this.imgPoster(item)}
              </div>
              <div
                className='card-film__owerview owerview'>
                <div
                  className='owerview__title'>
                  <h1>{item.title}</h1>
                </div>
                <div
                  className='owerview__date'>
                  {this.releaseDate(item.release_date)}
                  <div className='vote'>
                    {item.vote_average}
                  </div>
                </div>
                <div
                  className='owerview__genre'>
                  {this.genres(arrGenres[i])}
                </div>
                <div
                  className='owerview__decription'>
                  {this.minify(item.overview,150)}
                </div>
                <div className='overview__rating'>
                  <input
                    style={{
                      background: `linear-gradient(90deg, gold ${item.vote_average * 10}%, white ${item.vote_average * 10}%)`,
                    }}
                    className='range'
                    type='range'
                    min='0'
                    max='100'
                    step='1'
                    value={item.vote_average*10}
                    onChange={this.rangeSlider}
                  />
                  <div
                    className='stars-container'>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                    <img className='star' src={logo} alt='art'/>
                  </div>
                </div>

              </div>
            </div>
          )}
        />
      </div>
    )
  }

  render () {
    const { loading, error} = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorMessag /> : null;
    const spinner = loading && !error ? <Spinn/> : null;
    const content = hasData ? this.conten(this.state) : null;


    return (
      <div>
        {errorMessage}
        {spinner}
        {content}
      </div>
    )
  }
}
