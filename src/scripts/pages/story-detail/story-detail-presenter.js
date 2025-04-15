import { storyMapper } from '../../data/api-mapper';

export default class StoryDetailPresenter {
  #storyId;

  #view;
  #model;

  constructor(storyId, { view, model }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryDetailMapErr:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryLoading();
    try {
      this.showStoryDetailMap();

      const response = await this.#model.getStoryById(this.#storyId);

      if (response.error) {
        console.error('showStoryDetailErr', response.message);
        return;
      }

      const story = await storyMapper(response.story);

      this.#view.populateStoryDetail(story);
    } catch (error) {
      console.error('showStoryDetailErr:', error);
    } finally {
      this.#view.hideStoryLoading();
    }
  }
}
