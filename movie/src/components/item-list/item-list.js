import React, { Component } from 'react';
import { List, Input, Pagination } from 'antd';
import PropTypes from 'prop-types';
import MovieService from '../../services/movie-service';
import Spinn from '../spin';
import ErrorMessag from '../errorMessage';
import Item from '../item';
import { MovieConsumer } from '../movie-genres/movie-genres'


export default class ItemList extends Component{

  movieService = new MovieService();

  state = {
    returnMovie: [],
    rated:[],
    loading: true,
    error: false,
    netWork:true,
    pageTotal: null,
    sessionId: null,
  };

  constructor() {
    super();
    this.getSearchFilm();
    this.getGuestSession();
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

  getRatedGuestSession (sessionId) {
    this.movieService
      .getRatedGuestSession(sessionId)
      .then((res) => {
        this.setState({
          rated: res.results,
          loading: false,
          error: false,
          pageTotal: res.total_pages
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

  // eslint-disable-next-line consistent-return,react/sort-comp
  searchLine (page= 1) {
    const input = document.querySelector('.input');
    if (input.value) {
      this.getSearchFilm(input.value, page)
    } else {
      this.setState({
        error: true,
        loading: false,
        netWork: true,
      });
    }
  }

  getGuestSession = () => {
    this.movieService
      .getGuestSession()
      .then((res) => {
        this.setState({
          sessionId: res.guest_session_id,
        });
      })
  };

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
  content (state, search) {
    const { returnMovie, rated, sessionId } = state;
    // eslint-disable-next-line no-use-before-define
    let data = returnMovie;
    if (!search) {
      this.getRatedGuestSession(sessionId);
      data = rated;
    }

    return (
      <div>
        <MovieConsumer>
          { (genres) => {
            return (
            <List
              itemLayout="vertical"
              size="default"
              dataSource={data}
              renderItem={(item, i) => {
                return (
                  <Item
                    item={item}
                    i={i}
                    genres={genres}
                    returnMovie={returnMovie}
                    getGenresName={this.getGenresNames}
                    sessionId={sessionId}
                  />
                )
              }
              }/>
            )
          }

          }
        </MovieConsumer>
      </div>
    )
  }

  render () {
    const {loading, error, netWork, pageTotal} = this.state;
    const {search} = this.props;
    const hasData = !(loading || error);

    const input = search ? this.SearchInput(): null;
    const errorMessage = error ? <ErrorMessag netWork={netWork}/> : null;
    const spinner = loading && !error ? <Spinn/> : null;
    const content = hasData ? this.content(this.state, search) : null;
    const pagination = !(error && loading) ? <Pagination
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

ItemList.defaultProps = {
  search: true
};

ItemList.propTypes = {
  search: PropTypes.bool,
};