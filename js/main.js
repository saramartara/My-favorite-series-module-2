'use strict';

const filterElement = document.querySelector('.js-filter');
const searchElement = document.querySelector('.js-search');
const formElement = document.querySelector('.js-form');
const seriesListElement = document.querySelector('.js-seriesList');

const url = `http://api.tvmaze.com/search/shows?q=`;
let series = [];
let favoriteSeries = {};

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
      for (const oneShow of data) {
        series.push(oneShow.show);
      }
      renderSeries();
    });
}

// paint

function renderSeries() {
  let htmlCode = '';

  for (const serie of series) {
    htmlCode += '<li>';
    // htmlCode += '<div>';
    htmlCode += ` <h4>${serie.name}</h4>`;
    if (serie.image === null) {
      htmlCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
      text=TV" title="${serie.name} series cover not available" alt="serial cover not available"/>`;
    } else {
      htmlCode += `<img src="${serie.image.medium}" title="${serie.name}" alt="${serie.name}  cover"`;
    }
    // htmlCode += '</div>';
    htmlCode += '</li>';
  }

  seriesListElement.innerHTML = htmlCode;
}

searchElement.addEventListener('click', handleSearch);
