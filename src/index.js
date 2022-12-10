import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const searchInputField = document.querySelector('#search-box');
const listOfCountries = document.querySelector('.country-list');
const aboutCountry = document.querySelector('.country-info');

let userInput;




//search function
const countrySearch = () => {
  userInput = searchInputField.value.trim();

  if (userInput === '') {
    Notiflix.Notify.info('Please type in a country name');
    listOfCountries.innerHTML = '';
    aboutCountry.innerHTML = '';
  } else {
    fetchCountries(userInput)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          listOfCountries.innerHTML = '';
          aboutCountry.innerHTML = '';
          return;
        }

        if (data.length >= 2 && data.length <= 10) {
          listOfCountries.innerHTML = '';
          countryListMarkup(data);
          aboutCountry.innerHTML = '';
          return;
        }

        if ((data.length = 1)) {
          listOfCountries.innerHTML = '';
          aboutCountry.innerHTML = '';
          countryInfoMarkup(data);

          return;
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        listOfCountries.innerHTML = '';
        aboutCountry.innerHTML = '';
        return;
      });
  }
};
//pick function
const countryPicker = input => {
  fetchCountries(input)
    .then(data => {
      listOfCountries.innerHTML = '';
      aboutCountry.innerHTML = '';
      countryInfoMarkup(data);

      return;
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      listOfCountries.innerHTML = '';
      aboutCountry.innerHTML = '';
      return;
    });
};
//data corrrectness function
const dataCheck = data => {
  if (typeof data === 'object') {
    const newData = data.length >= 1 ? data : `-`;
    return (data = newData);
  }

  if (data === undefined) {
    return '-';
  }

  return data;
};
//input correctness function
const checkIfInputCorrect = data => {
  return /^[a-zA-Z\s\W]*$/.test(data);
};
//input field event listener
searchInputField.addEventListener(
  'input',
  debounce(
    event => {
      if (checkIfInputCorrect(event.target.value) === true) {
        countrySearch();
      } else {
        Notiflix.Notify.failure('Use letters and special characters');
      }
    },

    DEBOUNCE_DELAY
  )
);
//list of countries event listener
listOfCountries.addEventListener('click', event => {
  if (event.target.nodeName === 'LI') {
    searchInputField.value = event.target.textContent;
    countryPicker(event.target.textContent);
   
    return;
  }

  if (event.target.nodeName === 'IMG') {
    searchInputField.value = event.target.parentNode.textContent;
    countryPicker(event.target.parentNode.textContent);
   
    return;
  }
  return;
});


//list of countries markup
function countryListMarkup(data) {
    
 const markup = data
    .map(result => {
      return `<li><img src="${result.flag}">${result.name}</li>`;
    })
    .join('');
  listOfCountries.insertAdjacentHTML('afterbegin', markup)
}
//country info markup with number of languages check
function countryInfoMarkup(data) {
    let lang = "Language"
    
    if (data[0].languages.length > 1) {
        lang = "Languages"
        
    }
  const markup = data
    .map(result => {
      return `<img class="info__flag" src="${result.flag}" alt="Flag of ${result.name}" width="55">
      <span class="info__name">${result.name}</span>
      <p class="info__data"><b>Capital</b>: ${result.capital}</p>
        <p class="info__data"><b>Population</b>: ${result.population}</p>
        <p class="info__data"><b>${lang}</b>: ${result.languages.map(language => ' ' + language.name)}</p>`;
    })
    .join('');
  aboutCountry.innerHTML = markup;
}
