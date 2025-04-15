export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoading();

    try {
      const response = await this.#model.getLogin({ email, password });

      if (response.error) {
        console.error('getLoginErr:', response.message);
        this.#view.loginFailed(response.message);
        return;
      }

      this.#authModel.storeAccessToken(response.loginResult.token);
      this.#view.loginSuccessfully();
    } catch (error) {
      console.error(error);
    } finally {
      this.#view.hideSubmitLoading();
    }
  }
}
