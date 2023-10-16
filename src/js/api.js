import axios from 'axios';
import Notiflix from 'notiflix';
const API_KEY = '40010712-6d7af93e262d6e116d716f3d5';

axios.defaults.baseURL = 'https://pixabay.com/api/';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  }
);

async function getImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}

export { getImages };
