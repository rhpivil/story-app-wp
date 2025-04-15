import LoginPresenter from './login-presenter';
import * as StoryAPI from '../../data/api';
import * as AuthModel from '../../utils/auth';
import validation from '../../utils/validation';
import loaderAnimation from '../../utils/animation';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <article class="login-form-container">
          <h1>Masuk</h1>
          
          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input">Email</label>
              <input id="email-input" name="email" type="email" required aria-describedby="emailValidation">
              <p id="emailValidation" class="validation-message" aria-live="polite"></p>
            </div>
            <div class="form-control">
              <label for="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                minlength="8"
                required
                aria-describedby="passwordValidation"
              >
              <p id="passwordValidation" class="validation-message" aria-live="polite"></p>
            </div>
            <div class="login-button-container" id="login-button-container">
              <button type="submit">Masuk</button>
            </div>
            <p>Belum punya akun? <a href="#/register">Daftar disini</a></p>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#validation();
    this.#setupForm();
  }

  #setupForm() {
    const loginFormEl = document.getElementById('login-form');

    loginFormEl.addEventListener('submit', async event => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getLogin(data);
    });
  }

  #validation() {
    validation();
  }

  loginSuccessfully() {
    location.hash = '/home';
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoading() {
    document.getElementById('login-button-container').innerHTML = `
      <button type="submit" disabled>
        <i class="fa-solid fa-circle-notch loader-button"></i>Masuk
      </button>
    `;

    loaderAnimation();
  }

  hideSubmitLoading() {
    document.getElementById('login-button-container').innerHTML = `
      <button type="submit">Masuk</button>
    `;
  }
}
