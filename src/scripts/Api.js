// utils/Api.js

class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "a1788072-f30e-44d7-94b0-8722137d993e",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

// export the class
