import React, { Component } from 'react';
import { List, Input, Pagination } from 'antd';
import PropTypes from 'prop-types';
import movies from '../../services/movie-service';
import Spinn from '../spin';
import ErrorMessag from '../errorMessage';
import Item from '../item';
import { MovieConsumer } from '../movie-genres/Movie-genres'


export default class ItemList extends Component{

  state = {
    returnMovie: [],
    rated:[],
    loading: false,
    error: false,
    netWork:true,
    pageTotal: null,
    page: 1,
    search: true
  };

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

  getSearchFilm = (find='', page=1) => {
    this.setState({
      loading: true
    });
    if (find.length !== 0) {
      movies
        // eslint-disable-next-line no-param-reassign
        .getSearchFilm(find, page)
        .then((film) => {
          if (film.results.length === 0 || film.errorCode) {
            throw new Error('art');
          } else {
            this.setState({
              returnMovie: film.results,
              loading: false,
              error: false,
              pageTotal: film.total_pages,
              page: film.page
            })
          }
        })
        .catch(this.onError)
    }
  };



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
          aria-label='String for search'
        />
      </div>
    )
  }

  // eslint-disable-next-line react/sort-comp
  content (state) {
    const { returnMovie, error, loading, pageTotal, page} = state;
    const { rated, pages, pagesTotal } = this.props;

    let data = returnMovie;

    if (rated && pages && pagesTotal) {
      data = rated;
    }

    const pagination = (!error && !loading && returnMovie.length !== 0) ? <Pagination
      defaultCurrent={1}
      current={page}
      showSizeChanger={false}
      pageSize={1}
      /* eslint-disable-next-line no-shadow */
      onChange={pagese => {
        this.searchLine(pagese)
      }
      }
      total={pageTotal}
    /> : null;

    return (
      <div>
        <MovieConsumer>
          { (genres) => {
            return (
              <div>
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
                        returnMovie={data}
                        getGenresName={this.getGenresNames}
                      />
                    )
                  }
                  }/>
                <div
                  className='pagination'>
                  {pagination}
                </div>
              </div>
            )
          }
          }
        </MovieConsumer>
      </div>
    )
  }

  render () {
    const {loading, error, netWork} = this.state;
    // eslint-disable-next-line react/prop-types
    const {rate} = this.props;
    const hasData = !(loading || error);

    const input = (!rate) ? this.SearchInput() : null;
    const errorMessage = error ? <ErrorMessag netWork={netWork}/> : null;
    const spinner = loading && !error ? <Spinn/> : null;
    const content = hasData ? this.content(this.state) : null;

    return (
      <div>
        {input}
        {errorMessage}
        {spinner}
        {content}
      </div>
    )
  }
}

ItemList.defaultProps = {
  pages: 1,
  pagesTotal: 0,
  rated: []
};

ItemList.propTypes = {
  pages: PropTypes.number,
  pagesTotal: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  rated: PropTypes.array
};