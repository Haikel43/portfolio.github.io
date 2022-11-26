const API = 'https://api.giphy.com/v1/gifs';
const apiKey = 'cHMw81ECLSsZ7Xb17ZAWJLGBHG543m5t';
const content = null || document.getElementById('content');

document.getElementById('app-search').oninput = giphySearch;


function requestUrl(search) {
    const urlPre = `${API}/search?api_key=${apiKey}&q=${search}&limit=25&rating=g&lang=es`;
    const urlBusqueda = urlPre.replaceAll(' ', '+');
    console.log(urlBusqueda);
    return urlBusqueda;
}

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
    const data = await response.json();
    return data;
}

(async () => {
    try {
        const imageRandom = await fetchData(`${API}/trending?api_key=${apiKey}&limit=25&rating=g`);
        let view = `${imageRandom.data.map(image => 
            `
            <div>
                <img src="${image.images.downsized.url}" alt="">
            </div>
            `).join('')}`;
        content.innerHTML = view;
        } catch (error) {
            console.error(error);
        }
})();

async function giphySearch(e) {
    let search = e.target.value;
    if (search.length > 2) {
        const urlSearch = requestUrl(search);
        const imageSearch = await fetchData(urlSearch);
        let view = `${imageSearch.data.map(image => 
            `
            <div>
                <img src="${image.images.downsized.url}" alt="">
            </div>
            `).join('')}`;
        content.innerHTML = view;
    }
}