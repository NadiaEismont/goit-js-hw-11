import './sass/main.scss';
import template from '/template.hbs';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const refs = {
    input: document.querySelector('input[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    buttonLoadMore: document.querySelector('.load-more')
}

async function onSubmit(e) {
    e.preventDefault
    try {
        const picList = await fetchPic();
        renderFetchPics(picList);
    } catch (error) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}


const pixabayKey = '25251532-72426a9e0e55162032e249781';
const searchParams = new URLSearchParams({
    key: pixabayKey,
    q: refs.input.value,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true
})
async function fetchPics() {
    try {
        const aPic = await fetch(`https://pixabay.com/api/?${searchParams}`)
        if (!aPic.ok) {
            throw new Error(aPic.status);
        }
        return aPic.json();
    } catch (error) {
        console.log(error.message);
    }
}

const renderFetchPics = function (markupList) {
    refs.gallery.insertAdjacentHTML(
        'beforeend', template(markupList));
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

refs.input.addEventListener('input', debounce(onSubmit, 300));
