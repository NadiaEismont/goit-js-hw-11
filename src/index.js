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
    loading: document.querySelector('.js-sentanil'),
    spinner: document.querySelector('#spinner'),
    isVisible: document.querySelector('isVisible')
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

        if (searchResult.totalHits === 0) {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        refs.loading.style.display = 'block'; //намалювали кнопку "завантажити ще"
        renderFetchPics(searchResult.hits); //малює картинки. які повернув сервер(hits)
        countOfImages(searchResult.hits.length); //перевіряємо: чи дійшли до кінця результату пошуку
    } catch (error) {
        console.log(error)
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}
function countOfImages(thisPageImagesNumber) {
    const quantityImagesOnPage = newApiServer.perPage;
    const currentImages = newApiServer.page * newApiServer.perPage - 2 * newApiServer.perPage + thisPageImagesNumber;
    const totalImages = newApiServer.totalImages;

    if (newApiServer.page === 2) {
        Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
    }

    if (currentImages >= totalImages && totalImages !== 0) {
        refs.loading.style.display = 'none';
        Notiflix.Notify.info(`We're sorry, but you've reached the end of search ${totalImages} results`);
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
    refs.spinner.hidden = false;
    await new Promise(r => setTimeout(r, 1000));
    const searchResult = await newApiServer.fetchPics();
    renderFetchPics(searchResult.hits);
    countOfImages(searchResult.hits.length);
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
    refs.spinner.hidden = true;

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
