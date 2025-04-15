import RegisterPresenter from './register-presenter';
import * as StoryAPI from '../../data/api';
import validation from '../../utils/validation';
import loaderAnimation from '../../utils/animation';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <article class="register-form-container">
          <h1>Daftar</h1>
          
          <form id="register-form" class="register-form">
          <div class="form-control">
            <label for="name-input">Nama</label>
            <input id="name-input" name="name" required  aria-describedby="nameValidation">
            <p id="nameValidation" class="validation-message" aria-live="polite"></p>
          </div>
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
            <div class="register-button-container" id="register-button-container">
              <button type="submit">Daftar</button>
            </div>
            <p>Sudah punya akun? <a href="#/login">Masuk</a></p>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#validation();
    this.#setupForm();
  }

  #setupForm() {
    const registerFormEl = document.getElementById('register-form');

    registerFormEl.addEventListener('submit', async event => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  #validation() {
    validation();
  }

  registeredSuccessfully() {
    alert('Pendaftaran akun berhasil. Silahkan login!');
  }

  showSubmitLoading() {
    document.getElementById('register-button-container').innerHTML = `
      <button type="submit" disabled>
        <i class="fa-solid fa-circle-notch loader-button"></i>Daftar
      </button>
    `;

    loaderAnimation();
  }

  hideSubmitLoading() {
    document.getElementById('register-button-container').innerHTML = `
      <button type="submit">Daftar</button>
    `;
  }
}
