// Document elements
const usernameInput = document.getElementById('username_input_register');
const emailInput = document.getElementById('email_input_register');
const passwordInput = document.getElementById('password_input_register');
const repeatedPasswordInput = document.getElementById('repeated_password_input_register');
const button = document.getElementById('submit_button');

button.addEventListener('click', () => {
  if(passwordInput.value === repeatedPasswordInput.value) {
    console.log('Escuchando!');
    console.log(usernameInput.value);
    console.log(emailInput.value);
    console.log(passwordInput.value);
  } else {
    console.log('No hay coincidencias. 😕');
  }
});