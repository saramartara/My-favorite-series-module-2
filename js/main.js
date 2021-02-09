'use strict';

const filterElement = document.querySelector('.js-filter');
const searchElement = document.querySelector('.js-search');
const formElement = document.querySelector('.js-form');
const seriesListElement = document.querySelector('.js-seriesList');
const favoritesListElement = document.querySelector('.js-favoritesList');

const url = `http://api.tvmaze.com/search/shows?q=`;

let series = [];
let favorites = [];

// -------------------SUBMIT FORM ------------

function handleForm(ev) {
  ev.preventDefault();
}

formElement.addEventListener('submit', handleForm);

// ----------------------SEARCH & API---------------
function handleSearch() {
  let filterValue = filterElement.value;
  console.log(filterValue);
  getSeriesFromApi(filterValue);
}

function getSeriesFromApi(title) {
  fetch(url + title)
    .then((response) => response.json())
    .then((data) => {
      for (const oneShow of data) {
        series.push(oneShow.show);
      }
      renderSeries();
    });
}

//------------------------LISTEN -------------

function listenFavoriteSeries(ev) {
  const favoriteSerie = ev.target.parentElement;
  const clickedSerieId = parseInt(favoriteSerie.id);
  const serieFound = series.find(function (serie) {
    return serie.id === clickedSerieId;
  });
  const favoritesFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });
  if (favoritesFoundIndex === -1) {
    favorites.push(serieFound);
  } else {
    favorites.splice(favoritesFoundIndex, 1);
  }
  setInLocalStorage();
  renderFavorites();
}

// ----------------------- LOCAL STORAGE -----------------
function setInLocalStorage() {
  localStorage.setItem('favorite', JSON.stringify(favorites));
}

function getFromLocalStorage() {
  const localStorageSeries = localStorage.getItem('favorite');
  if (localStorageSeries === null) {
    handleSearch();
  } else {
    const arrayFavSeries = JSON.parse(localStorageSeries);
    favorites = arrayFavSeries;
    renderFavorites();
  }
}

//----------------------------- RENDER---------------

function renderSeries(item, items) {
  let htmlCode = '';

  for (const serie of series) {
    htmlCode += `<li id ="${serie.id}" class="js-serie serie">`;
    htmlCode += ` <h4 class="serie__container--title">${serie.name}</h4>`;
    if (serie.image === null) {
      htmlCode += `<img class="serie__container--img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${serie.name}" alt="${serie.name} cover not available"/>`;
    } else {
      htmlCode += `<img src="${serie.image.medium}" title="${serie.name}" alt="${serie.name}  cover"/>`;
    }
    htmlCode += '</li>';
  }
  seriesListElement.innerHTML = htmlCode;
}

function renderFavorites() {
  let htmlCode = '';

  for (const fav of favorites) {
    htmlCode += '<li class="js-serie serie">';
    htmlCode += '<div class="js-container serie__container">';
    htmlCode += ` <h4 class="serie__container--title">${fav.name}</h4>`;
    if (fav.image === null) {
      htmlCode += `<img class="serie__container--img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${fav.name}" alt="${fav.name} cover not available"/>`;
    } else {
      htmlCode += `<img src="${fav.image.medium}" title="${fav.name}" alt="${fav.name}  cover"/>`;
    }
    htmlCode += '</div>';
    htmlCode += '</li>';
  }
  favoritesListElement.innerHTML = htmlCode;
}

seriesListElement.addEventListener('click', listenFavoriteSeries);

searchElement.addEventListener('click', handleSearch);
// ¿tendría sentido meter esto en la línea 72 (sí)? ¿y en la 66?

//--------------START ----------------
getFromLocalStorage();
