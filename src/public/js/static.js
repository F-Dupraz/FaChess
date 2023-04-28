// Document elements
const emailInput = document.getElementById('email_input');
const passwordInput = document.getElementById('password_input');
const button = document.getElementById('submit_button');

button.addEventListener('click', () => {
  console.log('Escuchando!');
  console.log(emailInput.value);
  console.log(passwordInput.value);
});
