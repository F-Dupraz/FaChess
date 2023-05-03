// Document elemets
const showUsername = document.getElementById('show-username');
const userLogoutDiv = document.querySelector('.user-logout-div');
const logoutButton = document.getElementById('Logout-button');
const gamesPlayed = document.querySelector('.games-played-stat');

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

//
//----- Hacer dinámica la lista de amigos -----
//

window.addEventListener('load', async () => {
  const token = getCookie('session');
  const response = await fetch('/api/v1/users/one', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  console.log(data);
  showUsername.innerHTML = `<strong>${data.username}</strong>`;
  gamesPlayed.textContent = data.gamesPlayed;
});

showUsername.addEventListener('mouseover', () => {
  userLogoutDiv.classList.remove('hide');
  userLogoutDiv.classList.add('show');
});

showUsername.addEventListener('mouseout', () => {
  setTimeout(() => {
    userLogoutDiv.classList.remove('show');
    userLogoutDiv.classList.add('hide');
  }, 3000);
});

logoutButton.addEventListener('click', () => {
  console.log('Log out 😠');
});