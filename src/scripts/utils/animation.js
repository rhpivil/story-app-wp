export default function loaderAnimation() {
  const loader = document.querySelector('.loader-button');

  if (loader) {
    loader.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
      {
        duration: 1000,
        iterations: Infinity,
        easing: 'linear',
      }
    );
  }
}
