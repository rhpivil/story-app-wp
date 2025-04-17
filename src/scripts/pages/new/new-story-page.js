import NewStoryPresenter from './new-story-presenter';
import * as StoryAPI from '../../data/api';
import Camera from '../../utils/camera';
import Map from '../../utils/map';
import loaderAnimation from '../../utils/animation';

export default class NewStoryPage {
  #presenter = null;
  #map = null;

  #form;
  #camera;
  #isCameraOpen = false;
  #takenPhoto = null;

  async render() {
    return `
     <div class="new-header-title">  
       <h1>Tambah Cerita</h1>
     </div>

      <section class="container">
        <div class="new-story-container">
          <form id="new-form" class="new-form">
            <div class="form-control">
              <label for="description">Detail Cerita</label>
              <textarea
                id="description"
                name="description"
                required
              ></textarea>
            </div>

            <div class="form-control">
              <label for="photo-input" hidden>Foto</label>

              <div class="new-form-photo-container">
                <div class="new-form-photo-buttons">
                  <button id="photo-input-button" type="button"><i class="fa-solid fa-upload" aria-hidden="true"></i>Upload Foto</button>
                  <input
                    id="photo-input"
                    class="new-form-photo-input"
                    type="file"
                    accept="image/*"
                    max="1"
                    aria-describedby="upload-photo"
                  >
                  <button id="open-camera-button" type="button"><i class="fa-solid fa-camera" aria-hidden="true"></i>Buka Kamera</button>
                </div>
              </div>

              <div id="camera-container" class="new-photo-camera-container">
                <video id="camera-video" class="new-photo-camera-video"></video>
                <canvas id="camera-canvas" class="new-photo-camera-canvas"></canvas>

                <div class="new-form__camera__tools">
                  <select id="camera-select"></select>
                  <div class="new-form__camera__tools_buttons">
                    <button id="camera-take-button" class="btn" type="button">
                      Ambil Gambar
                    </button>
                  </div>
                </div>
              </div>

              <div id="taken-photo" class="new-form-photo-outputs"></div>
            </div>
         
            <div class="form-new-location">
              <div class="new-form-map-title">Lokasi</div>
                <div class="form-map-container">
                  <div id="map-loading-container"></div>
                  <div id="map" class="form-map"></div>
                </div>
                <div class="new-form-lat-lng">
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
              <label for="sharingLocation" id="new-sharing-label">Tidak ingin berbagi lokasi</label>
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
    this.#presenter = new NewStoryPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#takenPhoto;
    this.#presenter.showFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('new-form');

    this.#form.addEventListener('submit', async event => {
      event.preventDefault();
      const sharingLoc = document.getElementById('sharingLocation').checked;

      const mandatoryFormData = {
        description: this.#form.elements.namedItem('description').value,
        photo: this.#takenPhoto.blob,
      };

      if (!sharingLoc) {
        await this.#presenter.postNewStory({
          ...mandatoryFormData,
          lat: this.#form.elements.namedItem('latitude').value,
          lon: this.#form.elements.namedItem('longitude').value,
        });
        return;
      }
      await this.#presenter.postNewStory(mandatoryFormData);
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
      blob = await convertBase64ToBlob(image, 'image/png'); // functionnya gada loh
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
          }" class="new-form-photo-outputs-item__delete-btn">
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

    location.hash = '/home';
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

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
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
      document.getElementById('form-new-location').innerHTML = '';
    }
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('latitude').value = latitude;
    this.#form.elements.namedItem('longitude').value = longitude;
  }
}
