import CONFIG from '../config';
import { getActiveRoute } from '../routes/url-parser';

export function storeAccessToken(token) {
  try {
    localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('storeAccessTokenErr:', error);
    return false;
  }
}

export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(CONFIG.ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('getLogout: error:', error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ['/', '/login', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '#/home';
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = '/';
    return null;
  }

  return page;
}

export function getLogout() {
  removeAccessToken();
}
