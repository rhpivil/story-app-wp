import { parseActivePathname } from '../../routes/url-parser';
import StoryDetailPresenter from './story-detail-presenter';
import * as StoryAPI from '../../data/api';
import { generateStoryDetailTemplete } from '../../templete';
import Map from '../../utils/map';
import loaderAnimation from '../../utils/animation';
export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <div id="story-loading-container"></div>
        <div class="story-detail-container">
          <div class="story-detail" id="story-detail"></div>
          <h1 class="header-title">Peta Lokasi</h1>
          <div id="map" class="story-detail-map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      model: StoryAPI,
    });

    this.#presenter.showStoryDetail();
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  async populateStoryDetail(story) {
    document.getElementById('story-detail').innerHTML =
      generateStoryDetailTemplete({
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        placeName: story.lat ? story.placeName : 'Lokasi tidak dibagi',
      });

    if (this.#map && story.lat) {
      const coordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.placeName };
      this.#map.changeCamera(coordinate);
      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    }
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
}
