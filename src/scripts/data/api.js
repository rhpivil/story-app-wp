import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORY: `${CONFIG.BASE_URL}/stories`,
  GUEST_STORY: `${CONFIG.BASE_URL}/stories/guest`,
  DETAIL_STORY: id => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.STORY);
  return await fetchResponse.json();
}

export async function storeGuestStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.set('description', description);
  formData.set('photo', photo);

  if (lat && lon) {
    formData.set('lat', lat);
    formData.set('lon', lon);
  }

  const options = {
    method: 'POST',
    body: formData,
  };

  const fetchResponse = await fetch(ENDPOINTS.GUEST_STORY, options);
  const responseJson = await fetchResponse.json();

  return { ...responseJson, statusCode: fetchResponse.status };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  };

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, options);
  const responseJson = await fetchResponse.json();

  return responseJson;
}

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  };

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, options);
  const responseJson = await fetchResponse.json();

  return responseJson;
}

export async function getStories() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const responseJson = await fetchResponse.json();

  return responseJson;
}

export async function getStoryById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.DETAIL_STORY(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const responseJson = await fetchResponse.json();

  return responseJson;
}

export async function storeNewStory({ description, photo, lat, lon }) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.set('description', description);
  formData.set('photo', photo);

  if (lat && lon) {
    formData.set('lat', lat);
    formData.set('lon', lon);
  }

  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  };

  const fetchResponse = await fetch(ENDPOINTS.STORY, options);
  const responseJson = await fetchResponse.json();

  return responseJson;
}

export async function subscribePushNotification({
  endpoint,
  keys: { p256dh, auth },
}) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  };

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, options);
  const responseJson = await fetchResponse.json();

  return responseJson;
}

export async function unsubscribePushNotifications({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  };

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, options);
  const responseJson = await fetchResponse.json();

  return responseJson;
}
