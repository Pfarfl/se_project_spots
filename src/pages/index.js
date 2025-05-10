import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  toggleButtonState,
  resetValidation,
} from "../scripts/validation.js";

//import avatar from "../images/avatar.jpg";
import plus from "../images/plus_symbol.svg";
import pencil from "../images/pencil.svg";
import logo from "../images/logo.svg";
import whitePencil from "../images/white_pencil.svg";

import Api from "../utils/Api.js";

const editModal = document.querySelector("#edit-profile-modal");
const profileFormElement = editModal.querySelector(".modal__form");
const editButton = document.querySelector(".profile__edit-button");

const postModal = document.querySelector("#add-post-modal");
const postForm = postModal.querySelector(".modal__form");
const postSubmitButton = postModal.querySelector(".modal__submit-button");
const postButton = document.querySelector(".profile__post-button");
const postLinkInput = postModal.querySelector("#post-link-input");
const postCaptionInput = postModal.querySelector("#post-caption-input");

const viewModal = document.querySelector("#view-modal");
const viewModalImage = viewModal.querySelector(".modal__image");
const viewModalCaption = viewModal.querySelector(".modal__caption");

const closeButtons = document.querySelectorAll(".modal__close-button");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancel = document.querySelector(".modal__cancel-button");

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarButton = document.querySelector(".profile__avatar-edit-button");
const avatarInput = document.querySelector("#avatar-input");

const profileImage = document.getElementById("profile-image");

const plusSymbol = document.getElementById("plus-symbol");
plusSymbol.src = plus;

const pencilLogo = document.getElementById("pencil");
pencilLogo.src = pencil;

const whitePencilLogo = document.getElementById("white-pencil");
whitePencilLogo.src = whitePencil;

const spotsLogo = document.getElementById("spots-logo");
spotsLogo.src = logo;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a1788072-f30e-44d7-94b0-8722137d993e",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileImage.src = user.avatar;
    profileDescription.textContent = user.about;
    profileName.textContent = user.name;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(viewModal);
    viewModalImage.src = data.link;
    viewModalCaption.textContent = data.name;
    viewModalImage.alt = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEsc);
  modal.addEventListener("mousedown", handleOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEsc);
  modal.removeEventListener("mousedown", handleOverlay);
}

function handleOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleEsc(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    if (modal) {
      closeModal(modal);
    }
  }
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked")
    ? true
    : false;
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      profileImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault(editModal);
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAddPostSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .addNewCard({ name: postCaptionInput.value, link: postLinkInput.value })
    .then((cardData) => {
      // const inputValues = {
      //   name: postCaptionInput.value,
      //   link: postLinkInput.value,
      // };
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(postModal);
      disableButton(postSubmitButton, settings);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

editButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    profileFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal(popup);
  });
});

postButton.addEventListener("click", () => {
  openModal(postModal);
});

avatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});

deleteCancel.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
postForm.addEventListener("submit", handleAddPostSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

enableValidation(settings);
