// Document elements
const usernameInput = document.getElementById('username_input_register');
const emailInput = document.getElementById('email_input_register');
const passwordInput = document.getElementById('password_input_register');
const repeatedPasswordInput = document.getElementById('repeated_password_input_register');
const selectCountry = document.getElementById('search_country');
const button = document.getElementById('submit_button');

window.addEventListener('load', () => {
  const countries = ["Afganistán","Albania","Alemania","Andorra","Angola","Antigua y Barbuda","Arabia Saudita","Argelia","Argentina","Armenia","Australia","Austria","Azerbaiyán","Bahamas","Bangladés","Barbados","Baréin","Bélgica","Belice","Benín","Bielorrusia","Birmania","Bolivia","Bosnia y Herzegovina","Botsuana","Brasil","Brunéi","Bulgaria","Burkina Faso","Burundi","Bután","Cabo Verde","Camboya","Camerún","Canadá","Catar","Chad","Chile","China","Chipre","Ciudad del Vaticano","Colombia","Comoras","Corea del Norte","Corea del Sur","Costa de Marfil","Costa Rica","Croacia","Cuba","Dinamarca","Dominica","Ecuador","Egipto","El Salvador","Emiratos Árabes Unidos","Eritrea","Eslovaquia","Eslovenia","España","Estados Unidos","Estonia","Etiopía","Filipinas","Finlandia","Fiyi","Francia","Gabón","Gambia","Georgia","Ghana","Granada","Grecia","Guatemala","Guyana","Guinea","Guinea ecuatorial","Guinea-Bisáu","Haití","Honduras","Hungría","India","Indonesia","Irak","Irán","Irlanda","Islandia","Islas Marshall","Islas Salomón","Israel","Italia","Jamaica","Japón","Jordania","Kazajistán","Kenia","Kirguistán","Kiribati","Kuwait","Laos","Lesoto","Letonia","Líbano","Liberia","Libia","Liechtenstein","Lituania","Luxemburgo","Madagascar","Malasia","Malaui","Maldivas","Malí","Malta","Marruecos","Mauricio","Mauritania","México","Micronesia","Moldavia","Mónaco","Mongolia","Montenegro","Mozambique","Namibia","Nauru","Nepal","Nicaragua","Níger","Nigeria","Noruega","Nueva Zelanda","Omán","Países Bajos","Pakistán","Palaos","Palestina","Panamá","Papúa Nueva Guinea","Paraguay","Perú","Polonia","Portugal","Reino Unido","República Centroafricana","República Checa","República de Macedonia","República del Congo","República Democrática del Congo","República Dominicana","República Sudafricana","Ruanda","Rumanía","Rusia","Samoa","San Cristóbal y Nieves","San Marino","San Vicente y las Granadinas","Santa Lucía","Santo Tomé y Príncipe","Senegal","Serbia","Seychelles","Sierra Leona","Singapur","Siria","Somalia","Sri Lanka","Suazilandia","Sudán","Sudán del Sur","Suecia","Suiza","Surinam","Tailandia","Tanzania","Tayikistán","Timor Oriental","Togo","Tonga","Trinidad y Tobago","Túnez","Turkmenistán","Turquía","Tuvalu","Ucrania","Uganda","Uruguay","Uzbekistán","Vanuatu","Venezuela","Vietnam","Yemen","Yibuti","Zambia","Zimbabue"];
  countries.forEach((country) => {
    selectCountry.innerHTML += `<option value="${country}">${country}</option>`;
  });
});

button.addEventListener('click', async () => {
  if( usernameInput.value &&
    emailInput.value &&
    passwordInput.value &&
    repeatedPasswordInput.value &&
    selectCountry.value
  ) {
    const usernameTrimed = usernameInput.value.trim();
    if (usernameTrimed.includes(' ')) {
      return alert('Username must not contain spaces');
    }
    if (passwordInput.value == repeatedPasswordInput.value) {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          username: usernameTrimed,
          email: emailInput.value,
          password: passwordInput.value,
          country: selectCountry.value
        })
      });
      switch (response.status) {
        case 201:
          window.location.replace('/');
          break;
        case 409:
          alert('Username or email alredy in use! 😯');
          break;
        default:
          alert('Something went wrong. 😥');
          break;
      }
    } else {
      alert('The passwords are not the same!');
    }
  } else {
    alert('The inputs must not be empty!');
  }
});
