//Artista, album,track
const API = 'https://spotify23.p.rapidapi.com/search/?';
const content = null || document.getElementById('content');
const searchText = document.getElementById('search-music');
const option1 = document.getElementById('searchChoice1');
const form = document.querySelector('form');
let typeSearch;

form.addEventListener("submit", submitSearch);

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '04fa129d7emsh4e3cea0bb001a4bp11a481jsnc2c82cef223c',
		'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
	}
};

function submitSearch(event) {
    const data = new FormData(form);
    for (const entry of data) {
        typeSearch = `${entry[1]}`;
    }
    event.preventDefault()
    viewResults();
  }

  function requestMusic(){
    let textRequest = searchText.value;
    return textRequest;
}

function requestUrl(search, searchOptions ) {
    const urlPre = `${API}q=${search}&type=${searchOptions}&offset=0&limit=9&numberOfTopResults=5`;
    const urlSearch = urlPre.replaceAll(' ', '%20');
    console.log(urlSearch);
    return urlSearch;
}

async function fetchData(urlApi, options) {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
}

async function viewResults() {
    const categorySearch = requestMusic();
    console.log(categorySearch);
    const urlRequest = requestUrl(categorySearch, typeSearch);
    console.log(urlRequest);
    const dataRequest = await fetchData(urlRequest, options);
    console.log(dataRequest);
}