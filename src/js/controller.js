import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import bookmarkView from './views/bookmarkView.js';

// console.log(icons);

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    resultView.update(model.getSearchResultsPage());

    recipeView.renderSpinner();
    // 1) loading data
    await model.loadRecipe(id);
    // 2) rendering data

    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(`This is the error, ${err}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  // resultView.renderSpinner();
  try {
    const query = searchView.getQuery();
    if (!query) return;
    model.state.search.page = 1;
    await model.loadSearchResults(query);

    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  resultView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  model.updateServings(updateTo);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function (recipe) {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerBookmark(controlBookmark);
};
init();

// activation parcel hot module
// if (module.hot) {
//   module.hot.accept();
// }
