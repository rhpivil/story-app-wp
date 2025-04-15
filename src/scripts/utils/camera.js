export default class Camera {
  #currentStream;
  #streaming = false;

  #width = 640;
  #height = 0;

  #videoElement;
  #selectCameraElement;
  #canvasElement;

  #takePictureButton;

  constructor({ video, cameraSelect, canvas, option = {} }) {
    this.#videoElement = video;
    this.#selectCameraElement = cameraSelect;
    this.#canvasElement = canvas;

    this.#initialListener();
  }

  #initialListener() {
    this.#videoElement.oncanplay = () => {
      if (this.#streaming) {
        return;
      }

      this.#height =
        (this.#videoElement.videoHeight * this.#width) /
        this.#videoElement.videoWidth;
      this.#canvasElement.setAttribute('width', this.#width);
      this.#canvasElement.setAttribute('height', this.#height);

      this.#streaming = true;

      this.#selectCameraElement.onchange = async () => {
        await this.stop();
        await this.launch();
      };
    };
  }

  async #populateDeviceList(stream) {
    try {
      if (!(stream instanceof MediaStream)) {
        return Promise.reject(Error('MediaStream not found!'));
      }

      const { deviceId } = stream.getVideoTracks()[0].getSettings();
      const enumeratedDevices = await navigator.mediaDevices.enumerateDevices();
      const list = enumeratedDevices.filter((device) => {
        return device.kind === 'videoinput';
      });

      const html = list.reduce((accumulator, device, currentIndex) => {
        return accumulator.concat(`
          <option
          value="${device.deviceId}"
          ${deviceId === device.deviceId ? 'selected' : ''} 
          >
          ${device.label || `Camera ${currentIndex + 1}`}
          </option>    
        `);
      }, '');

      this.#selectCameraElement.innerHTML = html;
    } catch (error) {
      console.error('#populateDeviceListErr:', error);
    }
  }

  async #getStream() {
    try {
      const deviceId =
        !this.#streaming && !this.#selectCameraElement.value
          ? undefined
          : { exact: this.#selectCameraElement.value };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 4 / 3,
          deviceId,
        },
      });

      await this.#populateDeviceList(stream);

      return stream;
    } catch (error) {
      console.error('#getStreamErr:', error);
      return null;
    }
  }

  async launch() {
    this.#currentStream = await this.#getStream();

    this.#videoElement.srcObject = this.#currentStream;
    this.#videoElement.play();

    this.#clearCanvas();
  }

  async stop() {
    if (this.#videoElement) {
      this.#videoElement.srcObject = null;
      this.#streaming = false;
    }

    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    this.#clearCanvas();
  }

  #clearCanvas() {
    const context = this.#canvasElement.getContext('2d');
    context.fillStyle = '#AAAAAA';
    context.fillRect(
      0,
      0,
      this.#canvasElement.width,
      this.#canvasElement.height
    );
  }

  async takePicture() {
    if (!(this.#width && this.#height)) {
      return null;
    }

    const context = this.#canvasElement.getContext('2d');

    this.#canvasElement.width = this.#width;
    this.#canvasElement.height = this.#height;

    context.drawImage(this.#videoElement, 0, 0, this.#width, this.#height);

    return await new Promise((resolve) => {
      this.#canvasElement.toBlob((blob) => resolve(blob));
    });
  }

  addCheeseButtonListener(selector, callback) {
    this.#takePictureButton = document.querySelector(selector);
    this.#takePictureButton.onclick = callback;
  }
}
