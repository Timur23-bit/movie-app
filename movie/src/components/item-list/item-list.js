import React, { Component } from 'react';
import { List, Input, Rate, Pagination } from 'antd';
import { format } from 'date-fns'
import MovieService from '../../services/movie-service';
import Spinn from '../spin';
import logoKenny from '../logo/Кени.png';
import ErrorMessag from '../errorMessage';

export default class ItemList extends Component{

  movieService = new MovieService();

  state = {
    returnMovie: [],
    genres: [],
    loading: true,
    error: false,
    netWork:true,
    pageTotal: null
  };

  constructor() {
    super();
    this.getGenres();
    this.getSearchFilm();
  }

  onError = (e) => {
    if (e.message === "Failed to fetch" || e.message === "NetworkError when attempting to fetch resource") {
      this.setState({
        error: true,
        netWork: false,
        loading: false
      });
    } else {
      this.setState({
        error: true,
        loading: false,
        netWork: true
      });
    }
  };

  getSearchFilm = (find='return', page=1) => {
    this.movieService
      // eslint-disable-next-line no-param-reassign
      .getSearchFilm(find,page)
      .then((film) => {
        if (film.results.length === 0 || film.errorCode) {
          throw new Error('art');
        } else {
          this.setState({
            returnMovie: film.results,
            loading: false,
            error: false,
            pageTotal: film.total_pages
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
    if (!date){
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
      if (window.innerWidth < 1147) {
        return (
          <img
            width={60}
            height={91}
            alt="logo"
            src={logoKenny}
          />
        )
      }
      return (
        <img
          width={183}
          height={279}
          alt="logo"
          src={logoKenny}
        />
      )

    } if (window.innerWidth < 1147) {
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

  // eslint-disable-next-line consistent-return
  searchLine (page=1) {
    const input = document.querySelector('.input');
    if (input.value) {
      this.getSearchFilm(input.value, page)
    } else {
      this.setState({
        error: true,
        loading: false,
        netWork: true
      });
    }
  }

  debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
      const context = this;
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;

      // eslint-disable-next-line func-names
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  }
  
  SearchInput () {
    return (
      <div
        className="container_input">
        <Input
          className="input"
          placeholder="Search"
          onChange={()=>{}}
          onKeyUp={this.debounce(this.searchLine.bind(this), 1000)}
        />
      </div>
    )
  }

  // eslint-disable-next-line react/sort-comp
  Content (state) {
    const { returnMovie, genres} = state;
    // eslint-disable-next-line no-use-before-define
    const itemLi = new ItemList();

    const arrGenres = [];
    returnMovie.forEach((item) => {
      arrGenres.push(itemLi.getGenresNames(item.genre_ids, genres))
    });

    return (
      <div>
        <List
          itemLayout="vertical"
          size="default"
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
                  <div
                    className='stars-container'>
                    <Rate allowHalf defaultValue={item.vote_average} count={10}/>
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
    const {loading, error, netWork, pageTotal} = this.state;

    const hasData = !(loading || error);

    const input = this.SearchInput();
    const errorMessage = error ? <ErrorMessag netWork={netWork}/> : null;
    const spinner = loading && !error ? <Spinn/> : null;
    const content = hasData ? this.Content(this.state) : null;
    const pagination = !error ? <Pagination
                          defaultCurrent={1}
                          showSizeChanger={false}
                          pageSize={1}
                          onChange={page => {
                            this.searchLine(page)
                          }
                          }
                          total={pageTotal}
                        /> : null;
    return (
      <div>
        {input}
        {errorMessage}
        {spinner}
        {content}
       <div
         className='pagination'>
         {pagination}
       </div>
      </div>
    )
  }
}
