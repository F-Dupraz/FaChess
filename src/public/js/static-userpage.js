// Document elemets
const showUsername = document.getElementById('show-username');
const userLogoutDiv = document.querySelector('.user-logout-div');
const logoutButton = document.getElementById('Logout-button');
const gamesPlayed = document.querySelector('.games-played-stat');
const userFriends = document.getElementById('user-friends-div');
const mainUserSection = document.querySelector('.main');

// Initialises the socket
const socket = io();

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

function handleAccept(newFriend) {
  console.log(newFriend);
  const friendRequestSection = document.querySelector('.friend-request-section__div');
  friendRequestSection.classList.remove('friend-request-section');
  friendRequestSection.classList.add('friend-request-section__div-ready');
}

function handleInvitation() {
  const buttons = document.querySelector('.button');
  socket.emit('message', {
    message: 'Hi, world'
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
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ userUsername: data.username })
  });
  const friendRequestsRes = await friendRequests.json();
  console.log(friendRequestsRes);
  //
  //----- ARREGLAR EL PROBLEMA DE LOS INNER
  //
  if(friendRequestsRes.length) {
    friendRequestsRes.forEach((u) => {
      console.log(u);
      mainUserSection.innerHTML += `
        <section class="friend-request-section">
          <div class="friend-request-section__div">
            <p class="username-friend">${u.from}</p>
            <p class="friend-request-message">Sended you a friend request.</p>
            <button
              id="accept-invitation"
              onclick="handleAccept('${u.from}')" >
                Accept
              </button>
            <button id="reject-invitation">Reject</button>
          </div>
        </section>
      `;
    });
  }
  showUsername.innerHTML = `<strong>${data.username}</strong>`;
  gamesPlayed.textContent = data.gamesPlayed;
  const friends = data.friends;
  friends.forEach((i) => {
    userFriends.innerHTML += `
    <div class="friend-div">
      <h3 class="friend-name">${i.username}</h3> <span class="friend-connected ${i.isOnline ? 'online' : 'offline'}">${i.isOnline ? 'Online' : 'Offline'}</span><br />
      <button class="button" onclick="handleInvitation()">Invite</button>
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