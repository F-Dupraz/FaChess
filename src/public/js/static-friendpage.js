const userListSection = document.getElementById('users-list_section');
const showUsername = document.getElementById('show-username');

// Initialises the socket
const socket = io();

// Initialises the socket on the users namespaces
const userNamespace = io('/users');

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

function sendEmailToUser(clientUuid, clientUsername, userUuid, userUsername) {
  const buttons = document.querySelector('.button');
  userNamespace.emit('addFriendRequest', {
    fromUuid: clientUuid,
    fromUsername: clientUsername,
    toUuid: userUuid,
    toUsername: userUsername
  });
  buttons.classList.remove('button');
  buttons.classList.add('button_clicked');
  buttons.innerText = 'Invitation sended';
}

window.addEventListener('load', async () => {
  const responseOne = await fetch('/api/v1/users/one', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  });
  const responseAll = await fetch('/api/v1/users/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
  const user = await responseOne.json();
  userNamespace.emit('joinMyRoom', user.uuid);
  const allUsers = await responseAll.json();
  showUsername.innerHTML = `<strong>${user.username}</strong>`;
  allUsers.forEach(u => {
    if(u.username === user.username) {
      userListSection.innerHTML += ``;
    } else {
      userListSection.innerHTML += `
      <div class="user-friend">
        <h3 class="user-friend_name">${u.username}</h3>
        <p><strong>Games played: ${u.gamesPlayed}</strong></p>
        <p><strong>Country: ${u.country}</strong></p>
        <button 
          class="button" 
          onclick="sendEmailToUser('${user.uuid}', '${user.username}', '${u.uuid}', '${u.username}')">
            Add Friend
          </button>
      </div>
      `;
    }
  });
});

userNamespace.on('friendRequest', (data) => {
  console.log(data);
});
