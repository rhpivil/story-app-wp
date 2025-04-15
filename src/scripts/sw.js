self.addEventListener('push', event => {
  console.log('Service worker is pushing...');

  async function chainPromise() {
    await self.registration.showNotification('Testing', {
      body: 'Mencoba push..',
    });
  }

  event.waitUntil(chainPromise());
});
