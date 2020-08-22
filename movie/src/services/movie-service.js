
export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3';

  async getResource (url) {
    // eslint-disable-next-line no-underscore-dangle
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`)
    }
    const body = await res.json();
    return body;
  };

  async getSearchFilm (find) {
    const res = await this.getResource(`/search/movie?api_key=5db9ecacd3b131726f122eeed53145c2&query=${find}`);
    return res.results;
  }

  async getGenres () {
    const res = await this.getResource(`/genre/movie/list?api_key=5db9ecacd3b131726f122eeed53145c2`);
    return res;
  }
}