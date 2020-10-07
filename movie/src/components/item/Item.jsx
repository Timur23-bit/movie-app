import { Rate } from 'antd';
import React, {Component} from 'react';
import { format } from "date-fns";
import PropTypes from 'prop-types';
import logoKenny from '../logo/Кени.png';

export default class Item extends Component{

  state={};

  // eslint-disable-next-line react/sort-comp
  imgPoster (item) {
    if (item.poster_path === null) {
      if (window.innerWidth <= 1010) {
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

    } if (window.innerWidth <= 1010) {
      return (
        <img
          width={60}
          height={91}
          alt="logo"
          src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
        />
      )
    }

    return (
      <img
        width={183}
        height={279}
        alt="logo"
        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
      />
    )
  }

  releaseDate (date) {
    if (!date){
      return 'Фильм ещё не вышел';
    }
    return format(new Date(date), 'MMMM d, yyyy');
  }

  minify(text) {
    if (window.innerWidth < 1011) {
      return `${text.slice(0, text.indexOf(' ', 400))}...`;
    }
    return `${text.slice(0, text.indexOf(' ', 150))}...`;
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

  // eslint-disable-next-line consistent-return
  getColor (vote) {
    if (vote >= 0 && vote < 3) {
      return 'red'
    } if (vote >= 3 && vote < 5) {
      return 'orange'
    } if (vote >= 5 && vote < 7) {
      return 'yellow'
    } if (vote > 7) {
      return 'green'
    }
  }

  render () {
    const { item, i, genres, returnMovie, getGenresName } = this.props;

    const arrGenres = [];

    // eslint-disable-next-line no-shadow
    returnMovie.forEach((item) => {
      arrGenres.push(getGenresName(item.genre_ids, genres))
    });

    return (
      <li
        className='card-film card__film'>
        <div
          className='card-film__poster'>
          {this.imgPoster(item)}
        </div>
        <div
          className='card-film__overview overview'>
          <div
            className='overview__title'>
            <h5>{item.title}</h5>
            <div
              className={`vote ${this.getColor(item.vote_average)}`}
            >
              {item.vote_average}
            </div>
          </div>
          <div
            className='overview__date'>
            {this.releaseDate(item.release_date)}
          </div>
          <div
            className='overview__genre'>
            {this.genres(arrGenres[i])}
          </div>
          <div
            className='overview__description'>
            {this.minify(item.overview)}
          </div>
          <div className='overview__rating'>
            <Rate
              allowHalf
              count={10}
              onChange={(e) => {
                fetch(`https://api.themoviedb.org/3/movie/${item.id}/rating?api_key=5db9ecacd3b131726f122eeed53145c2&guest_session_id=${sessionStorage.sessionId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                  },
                  body: JSON.stringify({
                    value: e
                  })
                });
              }}
            />
          </div>
        </div>
      </li>
    )
  }
}

Item.defaultProps = {
  item: {},
  i: 0,
  genres: [],
  returnMovie: [],
  getGenresName: () => {},
};

Item.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object,
  i: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  genres: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  returnMovie: PropTypes.array,
  getGenresName: PropTypes.func,
};
