export default function validation() {
  const form = document.querySelector('form');
  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const passwordInput = form.elements.password;

  form.addEventListener('submit', event => event.preventDefault());

  const customValidationnameHandler = event => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Nama tidak boleh kosong.');
      return;
    }
  };

  const customValidationemailHandler = event => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Email tidak boleh kosong.');
      return;
    }

    if (event.target.validity.typeMismatch) {
      event.target.setCustomValidity('Masukkan format email yang benar.');
      return;
    }
  };

  const customValidationpasswordHandler = event => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Password tidak boleh kosong.');
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity('Minimal panjang 8 karakter.');
      return;
    }
  };

  if (nameInput) {
    nameInput.addEventListener('change', customValidationnameHandler);
    nameInput.addEventListener('invalid', customValidationnameHandler);

    nameInput.addEventListener('blur', event => {
      const isValid = event.target.validity.valid;
      const errorMessage = event.target.validationMessage;

      const connectedValidationId =
        event.target.getAttribute('aria-describedby');
      const connectedValidationEl = connectedValidationId
        ? document.getElementById(connectedValidationId)
        : null;

      if (connectedValidationEl && errorMessage && !isValid) {
        connectedValidationEl.innerText = errorMessage;
      } else {
        connectedValidationEl.innerText = '';
      }
    });
  }

  emailInput.addEventListener('change', customValidationemailHandler);
  emailInput.addEventListener('invalid', customValidationemailHandler);

  emailInput.addEventListener('blur', event => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = '';
    }
  });

  passwordInput.addEventListener('change', customValidationpasswordHandler);
  passwordInput.addEventListener('invalid', customValidationpasswordHandler);

  passwordInput.addEventListener('blur', event => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = '';
    }
  });
}
