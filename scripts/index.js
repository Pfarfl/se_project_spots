const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },

  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const editModal = document.querySelector("#edit-profile-modal");
const profileFormElement = editModal.querySelector(".modal__form");
const editButton = document.querySelector(".profile__edit-button");
const editCloseButton = document.querySelector(".modal__close-button");

const postModal = document.querySelector("#add-post-modal");
const postForm = postModal.querySelector(".modal__form");
const postSubmitButton = postModal.querySelector(".modal__submit-button");
const postButton = document.querySelector(".profile__post-button");
const postCloseButton = postModal.querySelector(".modal__close-button");
const postLinkInput = postModal.querySelector("#post-link-input");
const postCaptionInput = postModal.querySelector("#post-caption-input");

const viewModal = document.querySelector("#view-modal");
const viewModalImage = viewModal.querySelector(".modal__image");
const viewModalCaption = viewModal.querySelector(".modal__caption");
const viewModalCloseButton = viewModal.querySelector(".modal__close-button");

const closeButtons = document.querySelectorAll(".modal__close-button");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

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

function handleProfileFormSubmit(evt) {
  evt.preventDefault(editModal);
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: postCaptionInput.value,
    link: postLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(postModal);
  disableButton(postSubmitButton, settings);
  evt.target.reset();
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

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
postForm.addEventListener("submit", handleAddPostSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
