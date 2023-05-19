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

async function sendEmailToUser(clientUsername, userUsername) {
  const buttons = document.querySelector('.button');
  const responseFriend = await fetch('/api/v1/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ 
      from: clientUsername,
      to: userUsername
    })
  });
  buttons.classList.remove('button');
  buttons.classList.add('button_clicked');
  buttons.innerText = 'Invitation sended';
}

// Listens the window when loading
window.addEventListener('load', async () => {
  // Obtains the user data
  const responseOne = await fetch('/api/v1/users/one', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  });
  // Obtains all users
  const responseAll = await fetch('/api/v1/users/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  });
  // Parse it into json
  const user = await responseOne.json();
  // Emits the socket for joining to my room
  userNamespace.emit('joinMyRoom', user.username);
  // Parse all users into json
  const allUsers = await responseAll.json();
  // Show the username in the section
  showUsername.innerHTML = `<strong>${user.username}</strong>`;
  // Filter the users
  const allUsersExeptsFriends = allUsers.filter(u => {
    if(u.username == user.username) {
      return;
    }
    const myFriends = user.friends.map(fr => fr.username);
    if(myFriends.includes(u.username)) {
      return;
    }
    return u;
  });
  // Writes the html for each one of the users filtered
  allUsersExeptsFriends.forEach(u => {
    userListSection.innerHTML += `
      <div class="user-friend">
        <h3 class="user-friend_name">${u.username}</h3>
        <p><strong>Games played: ${u.gamesPlayed}</strong></p>
        <p><strong>Country: ${u.country}</strong></p>
        <button 
          class="button" 
          onclick="sendEmailToUser('${user.username}','${u.username}')">
            Add Friend
        </button>
      </div>`;
  });
});
