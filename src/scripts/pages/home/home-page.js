import Camera from '../../utils/camera';
import { HomePresenter } from './home-presenter';
import * as StoryAPI from '../../data/api';
import Map from '../../utils/map';
import loaderAnimation from '../../utils/animation';

export default class HomePage {
  #presenter = null;
  #map = null;

  #form;
  #camera;
  #isCameraOpen = false;
  #takenPhoto = null;

  async render() {
    return `
      <section class="container">
        <div class="homepage-header">
          <div class="header-text">
            <h1>Berbagi story seputar dicoding</h1>
            <p>Bagaimana pengalaman belajarmu di Dicoding? Mari berbagi ceritamu disini</p>
            <ul class="nav-link-list">
              <li><a href="#/login" class="link-button">Masuk</a></li>
              <li><a href="#/register" class="link-button">Daftar</a></li>
            </ul>
          </div>

          <div class="header-image">
            <img src="/images/homepage-header.png" alt="Homepage header image" aria-hidden="true">
          </div>
        </div>

        <div class="guest-story-container">
          <div class="guest-story-title">
            <h1>Atau bagi cerita anda langsung tanpa membuat akun</h1>
          </div>

          <form id="guest-form" class="guest-form">
            <div class="form-control">
              <label for="description">Tulis cerita anda dibawah ini :</label>
              <textarea
                id="description"
                name="description"
                required
              ></textarea>
            </div>

            <div class="form-control">
              <label for="photo-input" hidden>Foto</label>

              <div class="guest-form-photo-container">
                <div class="guest-form-photo-buttons">
                  <button id="photo-input-button" type="button"><i class="fa-solid fa-upload" aria-hidden="true"></i>Upload Foto</button>
                  <input
                    id="photo-input"
                    class="guest-form-photo-input"
                    type="file"
                    accept="image/*"
                    max="1"
                    aria-describedby="upload-photo"
                  >
                  <button id="open-camera-button" type="button"><i class="fa-solid fa-camera" aria-hidden="true"></i>Buka Kamera</button>
                </div>
              </div>
              <div id="camera-container" class="guest-photo-camera-container">
                <video id="camera-video" class="guest-photo-camera-video"></video>
                <canvas id="camera-canvas" class="guest-photo-camera-canvas"></canvas>

                <div class="new-form__camera__tools">
                  <select id="camera-select"></select>
                  <div class="new-form__camera__tools_buttons">
                    <button id="camera-take-button" class="btn" type="button">
                      Ambil Gambar
                    </button>
                  </div>
                </div>
              </div>

              <div id="taken-photo" class="guest-form-photo-outputs"></div>
            </div>
         
            <div class="form-guest-location">
              <div class="form-map-title">Lokasi</div>
                <div class="form-map-container">
                  <div id="map" class="form-map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="guest-form-lat-lng">
                  <input id="latitude" type="number" name="latitude" value="" disabled>
                  <input id="longitude" type="number" name="longitude" value="" disabled>
                </div>
            </div>
            
          
            <div class="sharing-location-container">
              <input
                id="sharingLocation"
                name="sharingLocation"
                type="checkbox"
              ></input>
              <label for="sharingLocation">Tidak ingin berbagi lokasi</label>
            </div>
  

            <div class="form-submit-button" id="form-submit-button">
              <button type="submit">Submit cerita</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    this.#takenPhoto;
    this.#presenter.showFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('guest-form');

    this.#form.addEventListener('submit', async event => {
      event.preventDefault();
      const sharingLoc = document.getElementById('sharingLocation').checked;

      const mandatoryFormData = {
        description: this.#form.elements.namedItem('description').value,
        photo: this.#takenPhoto.blob,
      };

      if (!sharingLoc) {
        await this.#presenter.postGuestStory({
          ...mandatoryFormData,
          lat: this.#form.elements.namedItem('latitude').value,
          lon: this.#form.elements.namedItem('longitude').value,
        });
        return;
      }

      await this.#presenter.postGuestStory(mandatoryFormData);
    });

    document
      .getElementById('photo-input')
      .addEventListener('change', async event => {
        const insertingPicturesPromises = Object.values(event.target.files).map(
          async file => {
            return await this.#addTakenPicture(file);
          }
        );
        await Promise.all(insertingPicturesPromises);

        await this.#populateTakenPicture();
      });

    document
      .getElementById('photo-input-button')
      .addEventListener('click', () => {
        this.#form.elements.namedItem('photo-input').click();
      });

    const cameraContainer = document.getElementById('camera-container');
    document
      .getElementById('open-camera-button')
      .addEventListener('click', async event => {
        cameraContainer.classList.toggle('open');
        this.#isCameraOpen = cameraContainer.classList.contains('open');

        if (this.#isCameraOpen) {
          event.currentTarget.innerHTML =
            '<i class="fa-solid fa-xmark"></i>Tutup Kamera';
          this.#setupCamera();
          this.#camera.launch();

          return;
        }

        event.currentTarget.innerHTML =
          '<i class="fa-solid fa-camera" title="Take Photo"></i>Buka Kamera';
        this.#camera.stop();
      });
  }

  #setupCamera() {
    if (this.#camera) {
      return;
    }

    this.#camera = new Camera({
      video: document.getElementById('camera-video'),
      cameraSelect: document.getElementById('camera-select'),
      canvas: document.getElementById('camera-canvas'),
    });

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPicture();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, 'image/png');
    }

    const newDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };

    this.#takenPhoto = newDocumentation;
  }

  async #populateTakenPicture() {
    if (this.#takenPhoto !== null) {
      const imageUrl = URL.createObjectURL(this.#takenPhoto.blob);
      const html = `
        <h1>Preview<h1>
        <button type="button" data-deletepictureid="${
          this.#takenPhoto.id
        }" class="guest-form-photo-outputs-item__delete-btn">
        <img src="${imageUrl}" alt="Uploaded photo">
        </button>
      `;

      document.getElementById('taken-photo').innerHTML = html;
    }

    document
      .querySelector('button[data-deletepictureid]')
      .addEventListener('click', () => {
        this.#takenPhoto = null;
        this.#removePicture();
      });
  }

  #removePicture() {
    this.#takenPhoto = null;
    document.getElementById('taken-photo').innerHTML = '';
  }

  storeDataSuccessfully(message) {
    alert(message);
    this.#form.reset();
  }

  storeDataFailed(message) {
    alert(message);
  }

  showSubmitLoading() {
    document.getElementById('form-submit-button').innerHTML = `
      <button type="submit" disabled>
        <i class="fa-solid fa-circle-notch loader-button"></i> Submit cerita
      </button>
    `;

    loaderAnimation();
  }

  hideSubmitLoading() {
    document.getElementById('form-submit-button').innerHTML = `
      <button type="submit">Submit cerita</button>
    `;
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

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });

    if (this.#map) {
      const centerCoordinate = this.#map.getCenter();

      this.#updateLatLngInput(
        centerCoordinate.latitude,
        centerCoordinate.longitude
      );

      const draggableMarker = this.#map.addMarker(
        [centerCoordinate.latitude, centerCoordinate.longitude],
        { draggable: 'true' }
      );

      draggableMarker.addEventListener('move', event => {
        const coordinate = event.target.getLatLng();
        this.#updateLatLngInput(coordinate.lat, coordinate.lng);
      });

      this.#map.addMapEventListener('click', event => {
        draggableMarker.setLatLng(event.latlng);

        // Keep center with user view
        event.sourceTarget.flyTo(event.latlng);
      });
    } else {
      document.getElementById('form-guest-location').innerHTML = '';
    }
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('latitude').value = latitude;
    this.#form.elements.namedItem('longitude').value = longitude;
  }
}
