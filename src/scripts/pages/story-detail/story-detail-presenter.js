import { storyMapper } from '../../data/api-mapper';

export default class StoryDetailPresenter {
  #storyId;

  #view;
  #model;
  #dbModel;

  constructor(storyId, { view, model, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
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
        console.error('showStoryDetailErr:', response.message);
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

  async saveStory() {
    try {
      const data = await this.#model.getStoryById(this.#storyId);
      await this.#dbModel.putStory(data.story);

      this.#view.saveToBookmarkSuccessfully('Success to save bookmark');
    } catch (error) {
      console.error('saveStoryErr:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeStory() {
    try {
      await this.#dbModel.removeStory(this.#storyId);

      this.#view.removeFromBookmarkSuccessfully(
        'Success to remove from bookmark.'
      );
    } catch (error) {
      console.error('removeStoryErr', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }

  async #isStorySaved() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
