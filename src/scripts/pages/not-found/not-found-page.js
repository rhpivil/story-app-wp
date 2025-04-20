export default class NotFoundPage {
  async render() {
    return `
      <section class="container">
      <div class="notfound-container"> 
        <img src="/images/not-found.png" alt="not-found-image">
        <h2>Halaman tidak ditemukan</h2>
        <p>Kembali ke <a href="#/home">beranda</a></p>
      </div>
      </section>
    `;
  }

  async afterRender() {
    console.log('Invalid url');
  }
}
