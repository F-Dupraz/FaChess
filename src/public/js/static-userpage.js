// Document elemets
const showUsername = document.getElementById('show-username');
const userLogoutDiv = document.querySelector('.user-logout-div');
const logoutButton = document.getElementById('Logout-button');
const gamesPlayed = document.querySelector('.games-played-stat');
const userFriends = document.getElementById('user-friends-div');

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

window.addEventListener('load', async () => {
  const response = await fetch('/api/v1/users/one', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  showUsername.innerHTML = `<strong>${data.username}</strong>`;
  gamesPlayed.textContent = data.gamesPlayed;
  const friend = {
    username: 'Fabricio',
    gamesPlayed: 53,
    isOnline: true
  }
  const friends = [friend, friend, friend, friend];
  friends.forEach((i) => {
    userFriends.innerHTML += `
    <div class="friend-div">
      <h3 class="friend-name">${i.username}</h3> <span class="friend-connected ${i.isOnline ? 'online' : 'offline'}">${i.isOnline ? 'Online' : 'Offline'}</span>
      <p>Games played: <span id="friend-games-played">${i.gamesPlayed}</span></p>
      <button>Invitar</button>
    </div>
    `;
  });
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

logoutButton.addEventListener('click', async () => {
  const token = getCookie('session');
  const response = await fetch('/api/v1/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  })
  switch (response.status) {
    case 200:
      window.location.replace('/');
      break;
    default:
      alert('I do not know what happend. 😗');
      break;
  }
});