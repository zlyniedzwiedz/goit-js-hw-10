import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const searchInputField = document.querySelector('#search-box');
const listOfCountries = document.querySelector('.country-list');
const aboutCountry = document.querySelector('.country-info');

let userInput;

//info about countries

let flag, header, countryCapital, countryPopulation, countryLanguage;

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

const checkIfInputCorrect = data => {
  return /^[a-zA-Z\s\W]*$/.test(data);
};

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

function countryListMarkup(data) {
  const markup = data
    .map(result => {
      return `<li class="list__item"> 
        <img class="list__flag" src="${result.flag}" alt="Flag of ${result.name}" width="55" >
        <p class="list__name">${result.name}</p></li>`;
    })
    .join('');
  listOfCountries.innerHTML = markup;
}

function countryInfoMarkup(data) {
  const markup = data
    .map(result => {
      return `<img class="info__flag" src="${result.flag}" alt="Flag of ${
        result.name
      }" width="55" >
      <span class="info__name">${result.name}</span>
      <p class="info__data"><b>Capital</b>: ${result.capital}</p>
      <p class="info__data"><b>Population</b>: ${result.population}</p>
      <p class="info__data"><b>Languages</b>: ${result.languages.map(
        language => ' ' + language.name
      )}</p>`;
    })
    .join('');
  aboutCountry.innerHTML = markup;
}
