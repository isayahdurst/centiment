'use strict';

const editProfileBtn = document.querySelector('.edit-profile-button');
const closeEditProfileBtn = document.querySelector('.delete');
const editModalOverlay = document.querySelector('.modal-background');
const editProfileModal = document.getElementById('edit-profile-modal');

// Modal Fields
const bioCount = document.getElementById('bio-character-count');
const firstName = document.getElementById('edit-profile-first-name');
const lastName = document.getElementById('edit-profile-last-name');
const username = document.getElementById('edit-profile-username');
const bio = document.getElementById('edit-profile-bio');
const email = document.getElementById('edit-profile-email');
const password = document.getElementById('edit-profile-password');

// Submit Button
const submitButton = document.getElementById('edit-profile-submit');

const toggleProfileModal = function () {
    editProfileModal.classList.toggle('is-active');
};

const updateProfile = async function (event) {
    event.preventDefault();

    const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            /* username: username.value, */
            // Changing username breaks app. TODO: discover why
            bio: bio.value,
            email: email.value,
            /* password: password.value, */
            // TODO: encrypt password before changing
        }),
    });

    const text = await response.json();
    console.log(text);
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

submitButton.addEventListener('click', updateProfile);
