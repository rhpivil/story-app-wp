import { storyMapper } from '../../data/api-mapper';

export default class UserHomepagePresenter {
  #view;
  #model;

  constructor({ view, model }) {
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

      const response = await this.#model.getStories();

      if (response.error) {
        console.error('initialStoryItem:', response.message);
        return;
      }

      this.#view.populateStoryItem(response.listStory);
    } catch (error) {
      console.error(error);
    } finally {
      this.#view.hideStoryLoading();
    }
  }
}
