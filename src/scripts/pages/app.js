import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {
  transitionHelper,
  setupSkipToMainContent,
  isServiceWorkerAvailable,
} from '../utils/index';
import {
  generateAuthenticatedNavListTemplete,
  generateUnauthenticatedNavListTemplete,
  generateSubscribeButtonTemplete,
  generateUnsubscribeButtonTemplete,
} from '../templete';
import { getAccessToken, getLogout } from '../utils/auth';
import {
  subscribe,
  isCurrentPushSubscriptionAvailable,
  unsubscribe,
} from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

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

  async #setupPushNotification() {
    const isLogin = !!getAccessToken();

    if (isLogin) {
      const pushNotificationTools = document.getElementById(
        'push-notification-tools'
      );
      const isSubscribed = await isCurrentPushSubscriptionAvailable();

      if (isSubscribed) {
        pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplete();
        document
          .getElementById('unsubscribe-button')
          .addEventListener('click', () => {
            unsubscribe().finally(() => {
              this.#setupPushNotification();
            });
          });

        return;
      }

      pushNotificationTools.innerHTML = generateSubscribeButtonTemplete();
      document
        .getElementById('subscribe-button')
        .addEventListener('click', () => {
          subscribe().finally(() => {
            this.#setupPushNotification();
          });
        });
    }

    return;
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = route();

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

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });
  }
}

export default App;
