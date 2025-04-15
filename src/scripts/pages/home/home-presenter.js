export class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showFormMapErr:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postGuestStory({ description, photo, lat, lon }) {
    this.#view.showSubmitLoading();
    try {
      const data = {
        description: description,
        photo: photo,
        lat: lat,
        lon: lon,
      };

      const response = await this.#model.storeGuestStory(data);

      if (response.error) {
        console.error('storeGuestStoryErr:', response);
        if (response.statusCode == 413) {
          this.#view.storeDataFailed('Ukuran foto maksimal 1MB');
          return;
        }
        this.#view.storeDataFailed(response.message);
        return;
      }

      this.#view.storeDataSuccessfully(response.message);
    } catch (error) {
      console.error(error.message);
      this.#view.storeDataFailed(response.message);
    } finally {
      this.#view.hideSubmitLoading();
    }
  }
}
