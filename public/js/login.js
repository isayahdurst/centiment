const loginFormHander = async(event) => {

  event.preventDefault();

  let username = document.getElementById("username").value.trim();
  // convert username to lowercase to match value in db
  username.toLowerCase();
  const password = document.getElementById("password").value.trim();
  
  let login_info = document.getElementById("login_info");
  // clean up the login form when it's submitted
  login_info.textContent = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  await fetch("/api/user/login", {
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
      login_info.textContent = "Unable to login";
    } else {
      window.location.replace('/');
    }
  });

}

const signupFormHandler = async(event) => {
  event.preventDefault();

  const first_name = document.getElementById("first_name_signup").value.trim();
  const last_name = document.getElementById("last_name_signup").value.trim();
  // update username to save in lowercase
  const username = document.getElementById("username_signup").value.trim().toLowerCase();
  const email = document.getElementById("email_signup").value.trim();
  const password = document.getElementById("password_signup").value.trim();
  const avatar = document.getElementById("avatar").value;

  // clean up the signup form when it's submitted
  document.getElementById("signup_info").textContent = "";
  document.getElementById("first_name_signup").value = "";
  document.getElementById("last_name_signup").value = "";
  document.getElementById("username_signup").value = "";
  document.getElementById("email_signup").value = "";
  document.getElementById("password_signup").value = "";

  await fetch("/api/user", {
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
      document.getElementById("signup_info").textContent = "Unable to create user";
    } else {
      document.getElementById("signup_info").textContent = "User created, please login";
    }
  });
}

document.getElementById("login_form").addEventListener("submit", loginFormHander);
document.getElementById("signup_form").addEventListener("submit", signupFormHandler);

