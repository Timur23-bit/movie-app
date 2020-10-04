
export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3';

  async getResource (url) {
    // eslint-disable-next-line no-underscore-dangle
    const res = await fetch(`${this._apiBase}${url}`);
    if (res.status !== 200) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`)
    }
    const body = await res.json();
    return body;
  };

  async getSearchFilm (find, page) {
    const res = await this.getResource(`/search/movie?api_key=5db9ecacd3b131726f122eeed53145c2&query=${find}&page=${page}`);
    console.log(res);
    return res;
  }

  async getGenres () {
    const res = await this.getResource(`/genre/movie/list?api_key=5db9ecacd3b131726f122eeed53145c2`);
    return res;
  }

  async getGuestSession () {
    const res = await this.getResource('/authentication/guest_session/new?api_key=5db9ecacd3b131726f122eeed53145c2');
    return res;
  }

  async getRatedGuestSession (sessionId) {
    const res = await this.getResource(`/guest_session/${sessionId}/rated/movies?api_key=5db9ecacd3b131726f122eeed53145c2&language=en-US&sort_by=created_at.asc`);
    return res;
  }
}