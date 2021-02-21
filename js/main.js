'use strict';

const filterElement = document.querySelector('.js-filter');
const searchElement = document.querySelector('.js-search');
const formElement = document.querySelector('.js-form');

const favoritesListElement = document.querySelector('.js-favoritesList');

let series = [];
let favorites = [];

// API
const url = `//api.tvmaze.com/search/shows?q=`;

function getSeriesFromApi(title) {
  fetch(url + title)
    .then((response) => response.json())
    .then((data) => {
      series = [];
      for (const oneShow of data) {
        series.push(oneShow.show);
      }
      renderSeries();
    });
}
// local storage

function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem('favorite', stringFavorites);
}

function getFromLocalStorage() {
  let localStorageSeries = localStorage.getItem('favorite');
  if (localStorageSeries === null) {
    favorites = [];
  } else {
    const arrayFavSeries = JSON.parse(localStorageSeries);
    favorites = arrayFavSeries;
    renderFavorites();
  }
}

// filter

function handleSearch() {
  let filterValue = filterElement.value;
  getSeriesFromApi(filterValue);
}
searchElement.addEventListener('click', handleSearch);

// submit form

function handleForm(ev) {
  ev.preventDefault();
}

formElement.addEventListener('submit', handleForm);

// listen

function addSerieToFavorites(ev) {
  const favoriteSerie = ev.currentTarget;
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

  renderSeries();
  renderFavorites();
  setInLocalStorage();
}

function listenClickedSeries() {
  const liElements = document.querySelectorAll('.js-serie');
  for (const liElement of liElements) {
    liElement.addEventListener('click', addSerieToFavorites);
  }
}

function handleDeleteFavorite(ev) {
  const XFavorite = ev.currentTarget;
  const clickedXFavorite = parseInt(XFavorite.id);
  const favoriteFound = favorites.findIndex(
    (favorite) => favorite.id === clickedXFavorite
  );
  favorites.splice(favoriteFound, 1);
  renderFavorites();
  renderSeries();
  setInLocalStorage();
}

function listenXIcon() {
  const xElements = document.querySelectorAll('.js-closeIcon');
  for (const xElement of xElements) {
    xElement.addEventListener('click', handleDeleteFavorite);
  }
}

// render

function renderSeries() {
  const seriesListElement = document.querySelector('.js-seriesList');

  let htmlCode = '';

  for (const serie of series) {
    let isSerieClass;
    const serieInFavorites = favorites.findIndex(
      (favorite) => favorite.id === serie.id
    );

    if (serieInFavorites === -1) {
      isSerieClass = 'serie';
    } else {
      isSerieClass = 'selected';
    }

    htmlCode += `<li id ="${serie.id}" class="js-serie li__serie ${isSerieClass} >`;
    htmlCode += `<h3 class="liTitle">${serie.name}</h3>`;
    if (serie.image === null) {
      htmlCode += `<img class="serie__img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${serie.name}" alt="${serie.name} cover not available"/>`;
    } else {
      htmlCode += `<img class="serie__img" src="${serie.image.medium}" title="${serie.name}" alt="${serie.name}  cover"/>`;
    }
    htmlCode += '</li>';
  }

  seriesListElement.innerHTML = htmlCode;

  listenClickedSeries();
  listenXIcon();
}

function renderFavorites() {
  let htmlCode = '';

  for (const fav of favorites) {
    htmlCode += `<li id ="${fav.id}" class="js-serieFav li__fav">`;
    htmlCode += `<i id ="${fav.id}" class="js-closeIcon fa fa-times" aria-hidden="true"></i>`;
    htmlCode += ` <h3 class="favLiTitle">${fav.name}</h3>`;
    if (fav.image === null) {
      htmlCode += `<img class="fav__img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${fav.name}" alt="${fav.name} cover not available"/>`;
    } else {
      htmlCode += `<img class="fav__img" src="${fav.image.medium}" title="${fav.name}" alt="${fav.name}  cover"/>`;
    }
    htmlCode += '</li>';
  }
  favoritesListElement.innerHTML = htmlCode;
  listenXIcon();
}

// start

getFromLocalStorage();
