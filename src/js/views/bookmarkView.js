import View from './View.js';
import icons from '../../img/icons.svg';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    const hashId = window.location.hash.slice(1);
    // console.log(result);
    return `
      <li class="preview">
        <a class="preview__link ${
          hashId === result.id ? 'preview__link--active' : ''
        }" href="#${result.id}">
        <figure class="preview__fig">
            <img src="${result.imageUrl}" alt="${result.title}" />
        </figure>
        <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            
        </div>
        </a>
    </li>
  `;
  }
}

export default new BookmarkView();
