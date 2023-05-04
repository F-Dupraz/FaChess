// Document elements
const emailInput = document.getElementById('email_input');
const passwordInput = document.getElementById('password_input');
const button = document.getElementById('submit_button');

button.addEventListener('click', async () => {
  if(passwordInput.value && emailInput.value) {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
      });
      switch (response.status) {
        case 200:
          window.location.replace('userpage')
          break;
        case 401:
          alert('Username or password are incorrect!');
          break;
        default:
          alert('WTF did you just do?');
          break;
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    alert('You must provide both password and email!');
  }
});
