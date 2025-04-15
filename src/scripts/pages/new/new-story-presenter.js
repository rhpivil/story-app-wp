export default class NewStoryPresenter {
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

  async postNewStory({ description, photo, lat, lon }) {
    try {
      const data = {
        description: description,
        photo: photo,
        lat: lat,
        lon: lon,
      };

      console.log(data);
      const response = await this.#model.storeNewStory(data);

      if (response.error) {
        console.error('postNewStoryErr:', response);
        return;
      }

      this.#view.storeDataSuccessfully(response.message);
    } catch (error) {
      console.error(error.message);
    }
  }
}
