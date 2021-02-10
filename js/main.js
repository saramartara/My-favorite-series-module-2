'use strict';

const filterElement = document.querySelector('.js-filter');
const searchElement = document.querySelector('.js-search');
const formElement = document.querySelector('.js-form');
let seriesListElement = document.querySelector('.js-seriesList');
const favoritesListElement = document.querySelector('.js-favoritesList');

const url = `http://api.tvmaze.com/search/shows?q=`;

let series = [];
let favorites = [];

// ---------------------API---------------

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
// ----------------------- LOCAL STORAGE -----------------
function setInLocalStorage() {
  localStorage.setItem('favorite', JSON.stringify(favorites));
}

function getFromLocalStorage() {
  let localStorageSeries = localStorage.getItem('favorite');
  if (localStorageSeries === null) {
    handleSearch();
  } else {
    const arrayFavSeries = JSON.parse(localStorageSeries);
    favorites = arrayFavSeries;
    renderFavorites();
  }
}

//-----------------FILTER --------------

function handleSearch() {
  seriesListElement.innerHTML = '';
  let filterValue = filterElement.value;
  getSeriesFromApi(filterValue);
}
searchElement.addEventListener('click', handleSearch);

// -------------------SUBMIT FORM ------------

function handleForm(ev) {
  ev.preventDefault();
}

formElement.addEventListener('submit', handleForm);

// ------------------ FILTER-------------

// funcion hadleFilter(){
//   console.log(filtrando...)
//   renderFavorites()
// }

//------------------------LISTEN -------------

function listenFavoriteSeries(ev) {
  const favoriteSerie = ev.target.parentElement;
  const clickedSerieId = parseInt(favoriteSerie.id);
  const serieFound = series.find((serie) => serie.id === clickedSerieId);

  const favoritesFoundIndex = favorites.findIndex(
    (favorite) => favorite.id === clickedSerieId
  );

  if (favoritesFoundIndex === -1) {
    favorites.push(serieFound);
  } else {
    favorites.splice(favoritesFoundIndex, 1);
  }
  setInLocalStorage();
  renderFavorites();
}

//----------------------------- RENDER---------------

function renderSeries(item, items) {
  // let seriesListElement = document.querySelector('.js-seriesList');
  seriesListElement.innerHTML = '';
  let htmlCode = '';

  for (const serie of series) {
    let isSerieClass;

    if (favorites.indexOf(serie.id) === -1) {
      isSerieClass = 'serie';
    } else {
      isSerieClass = '';
    }
    let isSelectedClass;
    if (favorites.indexOf(serie.id) === -1) {
      isSelectedClass = '';
    } else {
      isSelectedClass = 'selected';
    }

    // seriesListElement.innerHTML = '';
    htmlCode += `<li id ="${serie.id}" class="js-serie li__serie ${isSerieClass} ${isSelectedClass} >`;
    htmlCode += `<h3 class="liTitle">${serie.name}</h3>`;
    if (serie.image === null) {
      htmlCode += `<img class="serie__img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${serie.name}" alt="${serie.name} cover not available"/>`;
    } else {
      htmlCode += `<img class="serie__img" src="${serie.image.medium}" title="${serie.name}" alt="${serie.name}  cover"/>`;
    }
    htmlCode += '</li>';
  }
  seriesListElement.innerHTML = htmlCode;
}

function renderFavorites() {
  let htmlCode = '';

  for (const fav of favorites) {
    htmlCode += `<li class="js-serie li__fav">`;
    htmlCode += `<i class="fa fa-times" aria-hidden="true"></i>`;
    htmlCode += ` <h3 class="favLiTitle">${fav.name}</h3>`;
    if (fav.image === null) {
      htmlCode += `<img class="fav__img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${fav.name}" alt="${fav.name} cover not available"/>`;
    } else {
      htmlCode += `<img class="fav__img" src="${fav.image.medium}" title="${fav.name}" alt="${fav.name}  cover"/>`;
    }
    htmlCode += '</li>';
  }
  favoritesListElement.innerHTML = htmlCode;
}

seriesListElement.addEventListener('click', listenFavoriteSeries);

searchElement.addEventListener('click', handleSearch);
// ¿tendría sentido meter esto en la línea 72 (sí)? ¿y en la 66?

//--------------START ----------------
getFromLocalStorage();
