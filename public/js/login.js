const loginButton = document.getElementById('nav_login'); //navbar login button
const signUpButton = document.getElementById('nav_sign-up'); // navbar signup button

const modalSignupBtn = document.getElementById('submit-signup');
const modalLoginBtn = document.getElementById('submit-login');

const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

const modalCloseBtns = document.querySelectorAll('.delete');
const modalCancelBtns = document.querySelectorAll('.cancel');
const modalOverlays = document.querySelectorAll('.modal-background');

const signupForm = document.getElementById('signup_form');
const signupInfo = document.getElementById('signup_info');
const firstName = document.getElementById('first_name_signup');
const lastName = document.getElementById('last_name_signup');
const username = document.getElementById('username_signup');
const email = document.getElementById('email_signup');
const password = document.getElementById('password_signup');

// Mobile Menu
const burger = document.querySelector('.navbar-burger');
const mobileMenu = document.querySelector('.navbar-menu');

const toggleMobileMenu = function () {
    burger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-active');
};

const loginFormHander = async (event) => {
    event.preventDefault();

    let username = document.getElementById('username').value.trim();
    // convert username to lowercase to match value in db
    username.toLowerCase();
    const password = document.getElementById('password').value.trim();

    let login_info = document.getElementById('login_info');
    // clean up the login form when it's submitted
    login_info.textContent = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    await fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then((result) => {
        console.log(result);
        if (!result.ok) {
            login_info.textContent = 'Unable to login';
        } else {
            window.location.replace('/');
        }
    });
};

const signupFormHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);

    await fetch('/api/user/register', {
        method: 'POST',
        body: formData,
    }).then((result) => {
        console.log(result);
        if (!result.ok) {
            signupInfo.textContent = 'Unable to create user.';
        } else {
            window.location.replace('/');
        }
    });
};

const clearForm = function () {
    const firstName = document.getElementById('first_name_signup');
    const firstNameCheck = document.getElementById('first-name-check');
    const lastName = document.getElementById('last_name_signup');
    const lastNameCheck = document.getElementById('last-name-check');
    const username = document.getElementById('username_signup');
    const usernameHelp = document.getElementById('username-help');
    const usernameCheck = document.getElementById('username-check');
    const email = document.getElementById('email_signup');
    const emailHelp = document.getElementById('email-help');
    const emailCheck = document.getElementById('email-check');
    const password = document.getElementById('password_signup');
    const passwordHelp = document.getElementById('password-help');
    const passwordCheck = document.getElementById('password-check');

    [
        firstName,
        lastName,
        username,
        usernameHelp,
        email,
        emailHelp,
        password,
        passwordHelp,
    ].forEach((field) => {
        field.value = '';
        field.classList.remove('is-danger', 'is-success');
        field.textContent = '';
    });

    [
        firstNameCheck,
        lastNameCheck,
        usernameCheck,
        emailCheck,
        passwordCheck,
    ].forEach((item) => item.classList.remove('fa-check'));
};

const validateForm = async function () {
    document.getElementById('signup_info').textContent;
    const firstName = document.getElementById('first_name_signup');
    const firstNameCheck = document.getElementById('first-name-check');
    const lastName = document.getElementById('last_name_signup');
    const lastNameCheck = document.getElementById('last-name-check');
    const username = document.getElementById('username_signup');
    const usernameHelp = document.getElementById('username-help');
    const usernameCheck = document.getElementById('username-check');
    const email = document.getElementById('email_signup');
    const emailHelp = document.getElementById('email-help');
    const emailCheck = document.getElementById('email-check');
    const password = document.getElementById('password_signup');
    const passwordHelp = document.getElementById('password-help');
    const passwordCheck = document.getElementById('password-check');

    // Checks that first name has valid input
    if (firstName.value) {
        firstName.classList.add('is-success');
        firstNameCheck.classList.add('fa-check');
    } else {
        firstName.classList.remove('is-success');
        firstNameCheck.classList.remove('fa-check');
    }

    // Checks that last name has valid input
    if (lastName.value) {
        lastName.classList.add('is-success');
        lastNameCheck.classList.add('fa-check');
    } else {
        lastName.classList.remove('is-success');
        lastNameCheck.classList.remove('fa-check');
    }

    // Checks that a username isn't taken
    if (username.value) {
        const response = await fetch(`/api/user/check/${username.value}`);
        const { usernameAvailable } = await response.json();

        if (usernameAvailable) {
            username.classList.add('is-success');
            username.classList.remove('is-danger');
            usernameHelp.classList.add('is-success');
            usernameHelp.classList.remove('is-danger');

            usernameCheck.classList.add('fa-check');
            usernameHelp.textContent = 'Username is available.';
        } else {
            username.classList.add('is-danger');
            username.classList.remove('is-success');
            usernameHelp.classList.add('is-danger');
            usernameHelp.classList.remove('is-success');
            usernameCheck.classList.remove('fa-check');
            usernameHelp.textContent = 'Username is unavailable.';
        }
    } else {
        username.classList.remove('is-success', 'is-danger');
        usernameHelp.classList.remove('is-success', 'is-danger');
        usernameCheck.classList.remove('fa-check');
        usernameHelp.textContent = '';
    }

    // Uses a regular expression to determine whether an email address is valid:
    function isValidEmail(email) {
        // Regular expression to check for a valid email address
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Check if the email address matches the regular expression
        return emailRegex.test(email);
    }

    if (email.value) {
        if (isValidEmail(email.value)) {
            email.classList.remove('is-danger');
            email.classList.add('is-success');
            emailCheck.classList.add('fa-check');
            emailHelp.textContent = '';
        } else {
            email.classList.remove('is-success');
            email.classList.add('is-danger');
            emailCheck.classList.remove('fa-check');
            emailHelp.textContent = 'Email is invalid.';
        }
    } else {
        email.classList.remove('is-danger');
        emailHelp.textContent = '';
    }

    function checkPassword(password) {
        // Regular expression to check for a valid password

        const passwordRegex =
            /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.{12,})/;

        // TODO: REMOVE FOR PRODUCTION
        if (password === 'test')
            return {
                valid: true,
            };

        // Check if the password is at least 12 characters long
        if (password.length < 8) {
            return {
                valid: false,
                message: 'Password must be at least 12 characters long',
            };
        }

        // Check if the password contains any spaces
        if (/\s/.test(password)) {
            return {
                valid: false,
                message: 'Password must not contain any spaces',
            };
        }

        // Check if the password contains at least one number
        if (!/[0-9]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain at least one number',
            };
        }

        // Check if the password contains at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain at least one lowercase letter',
            };
        }

        // Check if the password contains at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain at least one uppercase letter',
            };
        }

        // Check if the password contains at least one special character
        if (!/[!@#$%^&*]/.test(password)) {
            return {
                valid: false,
                message: 'Password must contain at least one special character',
            };
        }

        // If the password passes all checks, return valid: true
        return { valid: true };
    }

    if (password.value) {
        const { valid, message } = checkPassword(password.value);
        if (valid) {
            password.classList.remove('is-danger');
            password.classList.add('is-success');
            passwordHelp.textContent = '';
            passwordCheck.classList.add('fa-check');
        } else {
            password.classList.add('is-danger');
            password.classList.remove('is-success');
            passwordHelp.textContent = message;
            passwordCheck.classList.remove('fa-check');
        }
    } else {
        password.classList.remove('is-danger', 'is-success');
        passwordHelp.textContent = '';
        passwordCheck.classList.remove('fa-check');
    }
};

const showLoginModal = function () {
    loginModal.classList.toggle('is-active');
};

const showSignupModal = function () {
    signupModal.classList.toggle('is-active');
};

const closeModal = function () {
    loginModal.classList.remove('is-active');
    signupModal.classList.remove('is-active');
    clearForm();
};

loginButton.addEventListener('click', showLoginModal);
signUpButton.addEventListener('click', showSignupModal);

modalLoginBtn.addEventListener('click', loginFormHander);
modalSignupBtn.addEventListener('click', signupFormHandler);

// Selects all close, cancel, or out-of-bounds elements on both signup and login modals and allows the modals to be closed.
[...modalCloseBtns, ...modalCancelBtns, ...modalOverlays].forEach((button) => {
    button.addEventListener('click', closeModal);
});

[firstName, lastName, username, email, password].forEach((field) =>
    field.addEventListener('input', validateForm)
);

burger.addEventListener('click', toggleMobileMenu);

// function to preview uploaded avatar image
let loadFile = function (event) {
    var image = document.getElementById('preview');
    image.src = URL.createObjectURL(event.target.files[0]);
};
