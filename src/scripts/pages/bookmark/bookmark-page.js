import Database from '../../data/database';
import BookmarkPresenter from './bookmark-presenter';
import Map from '../../utils/map';
import loaderAnimation from '../../utils/animation';
import {
  generateBookmarkEmptyTemplate,
  generateStoryItemTemplete,
} from '../../templete';

export default class BookmarkPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <div class="userhome-header-title">  
        <h1>List Cerita Tersimpan</h1>
      </div>
    
      <section class="container">
        <div id="story-loading-container"></div>
        <div class="story-list-container" id="story-list-container"></div>
        <div class="home-map-container">
          <h2 class="header-title">Lokasi Pengguna</h2>
          <div id="map-loading-container"></div>
          <div id="map" class="home-header-map"></div>
          <p class="additional-note">Hanya menampilkan pengguna yang berbagi lokasinya</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    this.#presenter.initialStoryItem();
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = `
        <div class="loader"><i class="fa-solid fa-circle-notch loader-button"></i>Loading</div>
      `;

    loaderAnimation();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showStoryLoading() {
    document.getElementById('story-loading-container').innerHTML = `
        <div class="loader"><i class="fa-solid fa-circle-notch loader-button"></i>Loading</div>
      `;

    loaderAnimation();
  }

  hideStoryLoading() {
    document.getElementById('story-loading-container').innerHTML = '';
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 5,
    });
  }

  populateStoryItem(stories) {
    if (stories.length <= 0) {
      this.populateBookmarkedListEmpty();
      return
    }

    const html = stories.reduce((accumulator, story) => {
      if (this.#map && story.lat) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: 'Lokasi: ' + story.name };

        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(generateStoryItemTemplete(story));
    }, '');

    document.getElementById('story-list-container').innerHTML = `
          <div class="story-list">${html}</div>
        `;
  }

  populateBookmarkedListEmpty() {
    document.getElementById('story-list-container').innerHTML =
      generateBookmarkEmptyTemplate();
  }
}
