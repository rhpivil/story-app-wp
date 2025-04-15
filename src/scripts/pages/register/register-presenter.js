export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    this.#view.showSubmitLoading();

    try {
      const response = await this.#model.getRegistered({
        name,
        email,
        password,
      });

      if (response.error) {
        console.error('getRegisteredErr:', response.message);
        return;
      }

      this.#view.registeredSuccessfully();
    } catch (error) {
      console.error(error);
    } finally {
      this.#view.hideSubmitLoading();
    }
  }
}
