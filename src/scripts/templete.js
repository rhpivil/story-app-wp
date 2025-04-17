import { showFormattedDate } from './utils';

export function generateUnauthenticatedNavListTemplete() {
  return `
    <li><a href="#/login">Masuk</a></li>
    <li><a href="#/register">Daftar</a></li>
  `;
}

export function generateAuthenticatedNavListTemplete() {
  return `
    <li><a href="#/home"><i class="fa-solid fa-house" aria-hidden="true"></i></i>Beranda</a></li>
    <li><a href="#/new-story"><i class="fa-solid fa-circle-plus" aria-hidden="true"></i>Tambah cerita</a></li>
    <li><a href="#/"><i class="fa-solid fa-box" aria-hidden="true"></i>Cerita Tersimpan</a></li>
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="logout-button" href="#/logout"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>Logout</a></li>
  `;
}

export function generateSubscribeButtonTemplete() {
  return `
    <button id="subscribe-button" class="subscribe-button">
      <i class="fa-solid fa-bell" aria-hidden="true"></i>Subscribe
    </button>
  `;
}

export function generateUnsubscribeButtonTemplete() {
  return `
    <button id="unsubscribe-button" class="unsubscribe-button">
      <i class="fa-solid fa-bell-slash"></i></i>Unsubscribe
    </button>
  `;
}

export function generateStoryItemTemplete({
  id,
  name,
  description,
  photoUrl,
  createdAt,
}) {
  return `
    <div class="story-item" data-reportid="${id}">
      <div class="story-item-image">
        <img src="${photoUrl}" alt="Foto story ${name}">
      </div>
      
      <h2 class="story-item-name"><i class="fa-solid fa-circle-user" aria-hidden="true"></i>${name}</h2>
      <p class="story-item-description">${description}</p>
      <p class="story-item-date">${showFormattedDate(createdAt, 'id-ID')}</p>
      <a class="detail-story-btn" href="#/stories/${id}">Selengkapnya</a>
    </div>
    `;
}

export function generateStoryDetailTemplete({
  name,
  description,
  photoUrl,
  createdAt,
  placeName,
}) {
  return `
    <div class="story-detail-image">
      <img src="${photoUrl}" alt="Foto story ${name}">
    </div>

    <div class="story-detail-text">
      <div class="story-detail-text">
        <div class="story-detail-additional-data">
          <div class="story-detail-date"><i class="fa-solid fa-calendar" aria-hidden="true"></i>${showFormattedDate(
            createdAt,
            'id-ID'
          )}
          </div>
          <div class="story-detail-placename"><i class="fa-solid fa-location-dot"></i>${placeName}</div>
        </div>

        <h2 class="story-detail-name"><i class="fa-solid fa-circle-user" aria-hidden="true"></i>${name}</h2>
        <p class="story-detail-description">${description}</p>
      </div>
    </div>
  `;
}
