export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ model, view }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoryListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryListMapErr:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialStoryItem() {
    this.#view.showStoryLoading();
    try {
      await this.showStoryListMap();

      const response = await this.#model.getAllStories();

      this.#view.populateStoryItem(response);
    } catch (error) {
      console.error('initialStoryItemErr:', error);
    } finally {
      this.#view.hideStoryLoading();
    }
  }
}
