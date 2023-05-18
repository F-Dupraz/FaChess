// Document elemets
const showUsername = document.getElementById('show-username');
const userLogoutDiv = document.querySelector('.user-logout-div');
const logoutButton = document.getElementById('Logout-button');
const gamesPlayed = document.querySelector('.games-played-stat');
const userFriends = document.getElementById('user-friends-div');
const mainUserSection = document.querySelector('.main');

// Initialises the socket
const socket = io();

// Initialises the socket for games
const gamesSocket = io('/games');

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

function handleAddFriend() {
  window.location.replace('/addfriend');
}

function handleInvitation(friendUsername, username) {
  const buttons = document.querySelector('.button');
  gamesSocket.emit('inviteFriend', {
    friendInvited: username,
    user: username,
  });
  buttons.classList.remove('button');
  buttons.classList.add('button_clicked');
  buttons.innerText = 'Invited';
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
  const friendRequests = await fetch('/api/v1/requests/one', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ userUsername: data.username })
  });
  const friendRequestsRes = await friendRequests.json();
  gamesSocket.emit('joinMyRoom', data.username);
  userNamespace.emit('joinMyRoom', data.username);
  if(friendRequestsRes.length) {
    for(let i = 0; i < friendRequestsRes.length; i++) {
      const friendNotification = friendRequestsRes[i];
      const confirmationValue = confirm(`${friendNotification.from} sended you a friend request!`);
      if(confirmationValue) {
        const addFriendResponse = await fetch('/api/v1/requests/addFriend', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ from: friendNotification.from, to: friendNotification.to })
        });
      } else {
        const dontAddFriendResponse = await fetch('/api/v1/requests/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ from: friendNotification.from, to: friendNotification.to })
        });
      }
    }
  }
  showUsername.innerHTML = `<strong>${data.username}</strong>`;
  gamesPlayed.textContent = data.gamesPlayed;
  const friends = data.friends;
  friends.forEach((i) => {
    userFriends.innerHTML += `
    <div class="friend-div">
      <h3 class="friend-name">${i.username}</h3> <span class="friend-connected ${i.isOnline ? 'online' : 'offline'}">${i.isOnline ? 'Online' : 'Offline'}</span><br />
      <button class="button" onclick="handleInvitation('${i.username}', '${data.username}')">Invite</button>
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