'use strict';

const editProfileBtn = document.querySelector('.edit-profile-button');
const closeEditProfileBtn = document.querySelector('.delete');
const editModalOverlay = document.querySelector('.modal-background');
const editProfileModal = document.getElementById('edit-profile-modal');

// Modal Fields
const bio = document.getElementById('edit-profile-bio');
const bioCount = document.getElementById('bio-character-count');

const toggleProfileModal = function () {
    editProfileModal.classList.toggle('is-active');
};

const updateCharacterCount = function () {
    const bioLength = bio.value.length;
    bioCount.textContent = `${bioLength}/140`;

    if (bio.value) {
        bio.classList.add('is-success');
    } else {
        bio.classList.remove('is-success');
    }

    if (bioLength <= 79) {
        bioCount.classList.remove('is-danger', 'is-warning');
        bioCount.classList.add('is-success');
    } else if (bioLength <= 139) {
        bioCount.classList.remove('is-success', 'is-danger');
        bioCount.classList.add('is-warning');
    } else {
        bioCount.classList.remove('is-success', 'is-warning');
        bioCount.classList.add('is-danger');
    }
};

bio.addEventListener('input', updateCharacterCount);

[editProfileBtn, closeEditProfileBtn, editModalOverlay].forEach((item) =>
    item.addEventListener('click', toggleProfileModal)
);
