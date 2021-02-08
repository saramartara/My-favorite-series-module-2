'use strict';

const filterElement = document.querySelector('.js-filter');
const searchElement = document.querySelector('.js-search');
const formElement = document.querySelector('.js-form');

const url = `http://api.tvmaze.com/search/shows?q=f`;
let series = [];
let favoriteSeries = [];

//submit form

function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener('submit', handleForm);

// search
function handleSearch() {
  let filterValue = filterElement.value;
  console.log(filterValue);
  searchSerie(filterValue);
}

function searchSerie(title) {
  fetch(url + title)
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data[0].show);
      for (const dataShow of data) {
        series = dataShow;
        console.log(dataShow);
      }
    });
}

// paint

searchElement.addEventListener('click', handleSearch);
