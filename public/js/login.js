const loginButton = document.getElementById('nav_login'); //navbar login button
const signUpButton = document.getElementById('nav_sign-up'); // navbar signup button

const modalSignupBtn = document.getElementById('submit-signup');
const modalLoginBtn = document.getElementById('submit-login');

const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

const modalCloseBtns = document.querySelectorAll('.delete');
const modalCancelBtns = document.querySelectorAll('.cancel');
const modalOverlays = document.querySelectorAll('.modal-background');

const loginFormHander = async (event) => {
    console.log('login attempt');
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

    const first_name = document
        .getElementById('first_name_signup')
        .value.trim();
    const last_name = document.getElementById('last_name_signup').value.trim();
    // update username to save in lowercase
    const username = document
        .getElementById('username_signup')
        .value.trim()
        .toLowerCase();
    const email = document.getElementById('email_signup').value.trim();
    const password = document.getElementById('password_signup').value.trim();
    const avatar = document.getElementById('avatar').value;

    // clean up the signup form when it's submitted
    document.getElementById('signup_info').textContent = '';
    document.getElementById('first_name_signup').value = '';
    document.getElementById('last_name_signup').value = '';
    document.getElementById('username_signup').value = '';
    document.getElementById('email_signup').value = '';
    document.getElementById('password_signup').value = '';

    await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name,
            last_name,
            username,
            email,
            password,
            avatar,
        }),
    }).then((result) => {
        if (!result.ok) {
            document.getElementById('signup_info').textContent =
                'Unable to create user';
        } else {
            document.getElementById('signup_info').textContent =
                'User created, please login';
        }
    });
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
};

loginButton.addEventListener('click', showLoginModal);
signUpButton.addEventListener('click', showSignupModal);

modalLoginBtn.addEventListener('click', loginFormHander);
modalSignupBtn.addEventListener('click', signupFormHandler);

// Selects all close, cancel, or out-of-bounds elements on both signup and login modals and allows the modals to be closed.
[...modalCloseBtns, ...modalCancelBtns, ...modalOverlays].forEach((button) => {
    button.addEventListener('click', closeModal);
});
