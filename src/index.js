import './sass/main.scss';
import template from '/template.hbs';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import NewApiServer from './request';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    input: document.querySelector('input[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    buttonLoadMore: document.querySelector('.load-more'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    form: document.querySelector('.search-form'),
    loading: document.querySelector('.js-sentanil')
}

const newApiServer = new NewApiServer();



async function onSubmit(e) {
    e.preventDefault();
    refs.loading.style.display = 'none';
    refs.gallery.innerHTML = '';
    try {
        newApiServer.query = e.currentTarget.elements.searchQuery.value;
        if (newApiServer.query === '') {
            return Notiflix.Notify.failure('Write a word to search');

        }
        newApiServer.resetPage();
        const searchResult = await newApiServer.fetchPics();
        renderFetchPics(searchResult.hits);
        refs.loading.style.display = 'block';
    } catch (error) {
        console.log(error)
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}
var galleryLightBox = new SimpleLightbox('.gallery__item', {
    captionsData: "alt",
    captionDelay: 250
});
const renderFetchPics = function (hits) {

    refs.gallery.insertAdjacentHTML(
        'beforeend', template(hits));
    galleryLightBox.refresh()
}

async function onLoadMore() {
    const searchResult = await newApiServer.fetchPics();
    renderFetchPics(searchResult.hits);
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}
function onInput() {
    if (refs.input.value === '') {
        refs.gallery.innerHTML = '';
        refs.loading.style.display = 'none';
    }
}





const btn = document.querySelector('#button');
// btn.style.display = 'none';
// window.scroll(function () {
//     if (document.body.scrollTop > 300) {
//         btn.style.display = 'block';
//     } else {
//         btn.style.display = 'none';
//     }
// });
btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});



refs.form.addEventListener('submit', onSubmit);
refs.buttonLoadMore.addEventListener('click', onLoadMore);
refs.input.addEventListener('input', onInput)
