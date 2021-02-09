'use strict';

const filterElement = document.querySelector('.js-filter');
const searchElement = document.querySelector('.js-search');
const formElement = document.querySelector('.js-form');
const seriesListElement = document.querySelector('.js-seriesList');

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

function listenFavoritesSeries(ev) {
  const favoriteSerie = ev.target.parentElement;

  // si favoriteSerie está en favorites
  if (favoriteSerie)
    // añado al array de favoritos si no está ya

    favorites.push(favoriteSerie);

  //guardo en localStorage y pinto en listado favoritos
  // renderFavorites();

  setInLocalStorage();

  //aplico clase en listado búsqueda: fondo + color de letra
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
    console.log(`cojo esto de local storage ${favorites}`);
  }
}

//----------------------------- RENDER---------------

function renderSeries() {
  let htmlCode = '';

  for (const serie of series) {
    htmlCode += '<li class="js-serie serie">';
    htmlCode += '<div class="js-container serie__container">';
    htmlCode += ` <h4 class="serie__container--title">${serie.name}</h4>`;
    if (serie.image === null) {
      htmlCode += `<img class="serie__container--img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" title="${serie.name}" alt="${serie.name} cover not available"/>`;
    } else {
      htmlCode += `<img src="${serie.image.medium}" title="${serie.name}" alt="${serie.name}  cover"/>`;
    }
    htmlCode += '</div>';
    htmlCode += '</li>';
  }

  seriesListElement.innerHTML = htmlCode;
}

// function renderFavorites() {
//   let fav = getLocalStorage();
//   let htmlCode = '';
//   for (const favorite of favorites) {
//     console.log(favorite);
//   }
// }

seriesListElement.addEventListener('click', listenFavoritesSeries);
searchElement.addEventListener('click', handleSearch);

//--------------START ----------------
getFromLocalStorage();
