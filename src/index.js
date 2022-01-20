import './sass/main.scss';
import template from '/template.hbs';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import NewApiServer from './request';

const refs = {
    input: document.querySelector('input[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    buttonLoadMore: document.querySelector('.load-more'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    form: document.querySelector('.search-form')
}

const newApiServer = new NewApiServer();

async function onSubmit(e) {
    e.preventDefault();
    refs.buttonLoadMore.setAttribute('disabled', 'disabled');
    try {
        console.log(e.currentTarget.elements);
        newApiServer.query = e.currentTarget.elements.searchQuery.value;
        console.log(newApiServer.query);
        if (newApiServer.query === '') {
            return Notiflix.Notify.failure('Write a word to search')
        }
        const searchResult = await newApiServer.fetchPics();
        newApiServer.resetPage();
        renderFetchPics(searchResult.hits);

    } catch (error) {
        console.log(error)
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}

const renderFetchPics = function (markupList) {
    refs.gallery.insertAdjacentHTML(
        'beforeend', template(markupList));
}

async function onLoadMore() {
    const searchResult = await newApiServer.fetchPics();
    renderFetchPics(searchResult.hits);
    // if (refs.btnSearch.hasAttribute('disabled')) refs.btnSearch.removeAttribute('disabled');
    if (refs.buttonLoadMore.hasAttribute('disabled')) { refs.buttonLoadMore.removeAttribute('disabled'); }



}
// function handleScroll() {
//     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//     if (!isLoading && clientHeight + scrollTop >= scrollHeight - 5 && currentPage < maxPage) {
//         loadingMore();
//     }
// }
window.scrollBy({
    top: 100,
    behavior: 'smooth'

});


refs.form.addEventListener('submit', onSubmit);
refs.buttonLoadMore.addEventListener('click', onLoadMore);
// refs.gallery.addEventListener('click', showLargeImg);