import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers';
import { RES_PER_PAGE } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  const data = await getJSON(`${API_URL}${id}`);
  try {
    const { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      imageUrl: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
    };
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = state.search.resultsPerPage * page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity / state.recipe.servings) * newServing;
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }
  // console.log(state.recipe);
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.indexOf(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) {
    state.recipe.bookmarked = false;
  }
};
