// Document elemets
const showUsername = document.getElementById('show-username');
const userLogoutDiv = document.querySelector('.user-logout-div');
const logoutButton = document.getElementById('Logout-button');

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