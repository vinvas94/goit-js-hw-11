import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImages } from './api';

let page = 1;
let query = null;
let perPage = 40;

let simpleLightbox;

const refs = {
  form: document.querySelector('#search-form'),
  buttonLoad: document.querySelector('.load-more'),
  list: document.querySelector('.gallery'),
};

function createMarkup(arr) {
  if (!refs.list) {
    return;
  }
  const markup = arr
    .map(arr => {
      const {
        id,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = arr;

      return `
      
      <div class="photo-card" id="${id}">
  <a  href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="${largeImageURL}"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>: ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>: ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>: ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>: ${downloads}
    </p>
  </div>
</div>`;
    })

    .join('');
  refs.list.insertAdjacentHTML('beforeend', markup);
}

refs.form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  page = 1;
  refs.list.innerHTML = '';
  query = evt.currentTarget.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.failure('Please specify your search query');
    return;
  }

  getImages(query, page, perPage)
    .then(data => {
      if (data.hits.length * page === data.totalHits) {
        refs.buttonLoad.classList.add('hide');
      } else {
        refs.buttonLoad.classList.remove('hide');
      }
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createMarkup(data.hits);
        simpleLightboxList();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => refs.form.reset());
}

function simpleLightboxList() {
  if (simpleLightbox) {
    simpleLightbox.refresh();
  } else {
    simpleLightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      enableKeyboard: true,
    });
  }
}

refs.buttonLoad.addEventListener('click', onButtonLoad);

function onButtonLoad() {
  page += 1;

  getImages(query, page, perPage)
    .then(data => {
      if (perPage * page >= data.totalHits) {
        refs.buttonLoad.classList.add('hide');
        Notiflix.Notify.success(
          `We're sorry, but you've reached the end of search results.`
        );
      }
      if (data.page === data.totalHits) {
        refs.buttonLoad.classList.add('hide');
      }
      createMarkup(data.hits);
      simpleLightboxList();
    })
    .catch(error => console.log(error));
}

// window.addEventListener('scroll', onScroll);

// function onScroll() {
//   const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight - 200) {
//     onButtonLoad();
//   }
// }

// onScroll();
