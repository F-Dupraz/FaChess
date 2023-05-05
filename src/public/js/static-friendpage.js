const userListSection = document.getElementById('users-list_section');
const showUsername = document.getElementById('show-username');

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

const token = getCookie('session');
token ? true : window.location.replace('/');

function sendEmailToUser(username) {
  console.log('🤣😊🙄');
}

window.addEventListener('load', () => {
  showUsername.innerHTML = `<strong>Fabriii</strong>`
  console.log('Listening, all right!');
});
