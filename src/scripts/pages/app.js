import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { transitionHelper } from '../utils/index';
import {
  generateAuthenticatedNavListTemplete,
  generateUnauthenticatedNavListTemplete,
} from '../templete';
import { getAccessToken } from '../utils/auth';
import { getLogout } from '../utils/auth';
import { setupSkipToMainContent } from '../utils/index';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton

    this.#setupDrawer();
    setupSkipToMainContent(this.#skipLinkButton, this.#content);
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', event => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach(link => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navList = this.#navigationDrawer.children.namedItem('nav-list');

    if (!isLogin) {
      navList.innerHTML = generateUnauthenticatedNavListTemplete();
      return;
    }

    navList.innerHTML = generateAuthenticatedNavListTemplete();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', event => {
      event.preventDefault();

      if (confirm('Apakah Anda yakin ingin keluar?')) {
        getLogout();

        location.hash = '/';
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    if (!route) {
      console.error(`Route for "${url}" not found.`);
      return;
    }
  
    const page = route();
  
    if (!page || typeof page.render !== 'function') {
      console.error(`Page object for route "${url}" is invalid:`, page);
      return;
    }

    // const page = route();

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();
    });
  }
}

export default App;
