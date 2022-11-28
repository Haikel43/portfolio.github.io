//Artista, album,track
const API = 'https://spotify23.p.rapidapi.com/';
const content = null || document.getElementById('content');
const searchText = document.getElementById('search-music');
const option1 = document.getElementById('searchChoice1');
const form = document.querySelector('form');
let typeSearch;

document.querySelector('.icon').onclick = submitSearch

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

function requestUrl(search, searchOptions ) {
    const urlPre = `${API}search/?q=${search}&type=${searchOptions}&offset=0&limit=1&numberOfTopResults=5`;
    const urlSearch = urlPre.replaceAll(' ', '%20');
    return urlSearch;
}

async function fetchData(urlApi, options) {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
}

async function viewResults() {
    try {
        let textRequest = searchText.value;
        const urlRequest = requestUrl(textRequest, typeSearch);
        const dataRequest = await fetchData(urlRequest, options);
        console.log(dataRequest);
        let view;
  
        switch (typeSearch) {
            case 'artists':
                const artistId = dataRequest.artists.items[0].data.uri.replace('spotify:artist:', '');
                view = `${dataRequest.artists.items.map(artist => 
                    `
                    <div class="artist">
                        <img src="${artist.data.visuals.avatarImage.sources[0].url}" alt="">
                    </div>
                    `).join('')}`;
                content.innerHTML = view;
                content.classList.add('listMode');
                content.classList.remove('gridMode')
                document.querySelector('.artist').onclick = openArtist;
                function openArtist() {
                    lookArtist(artistId);
                } 
                break;
            case 'albums':
                console.log(dataRequest);
                const albumId = dataRequest.albums.items[0].data.uri.replace('spotify:album:', '');
                view = `
                    <div class="album">
                        <img src="${dataRequest.albums.items[0].data.coverArt.sources[0].url}" alt="">
                    </div>
                    `
                content.innerHTML = view;
                document.querySelector('.album').onclick = openAlbum;
                function openAlbum() {
                    lookAlbum(albumId);
                }
                break;
            case 'tracks':
                console.log('es una cancion');
            break;
            default:
                break;
        }
        
    } catch (error) {
        
    }
}

async function lookAlbum(id) {
    const albumTracksUrl = `${API}album_tracks/?id=${id}&offset=0&limit=300`;
    const albumTracksRequest = await fetchData(albumTracksUrl, options);
    view = `
        ${albumTracksRequest.data.album.tracks.items.map(track => 
        `
            <div class="track-box">
                <img src="../src/assets/images/music.png" alt="">
                <p class="track-info">${track.track.trackNumber} - ${track.track.name}</p>
            </div>
        `).join('')}`;
    content.innerHTML = view;
}

async function lookArtist(id) {
    const artistAlbumsUrl = `${API}artist_albums/?id=${id}&offset=0&limit=100`;
    const artistAlbumsRequest = await fetchData(artistAlbumsUrl, options);
    console.log(artistAlbumsRequest);
    view = `
    ${artistAlbumsRequest.data.artist.discography.albums.items.map(album=> 
    `
        <div id="${album.releases.items[0].id}" class="album">
            <img src="${album.releases.items[0].coverArt.sources[0].url}" alt="">
        </div>
    `).join('')}`;
    content.innerHTML = view;
    content.classList.remove('listMode');
    content.classList.add('gridMode');
    artistAlbumsRequest.data.artist.discography.albums.items.map(
    album => {
        const albumId = `${album.releases.items[0].id}`;
        document.getElementById(albumId).onclick = openAlbum;          
        function openAlbum() {
            lookAlbum(albumId);
            }
        }
    )
}

const alternar = document.querySelectorAll('.alternar');
const alternarToArray = Array.apply(null, alternar);
const alaternarArrayPorPar = [];

function altenarImagen(arr) {
   arr.forEach(function(element) {
    if (arr.indexOf(element) % 2 == 0) {
        alaternarArrayPorPar.push([element, arr[arr.indexOf(element)+1]])
    }
   });
   alaternarArrayPorPar.forEach(function(par) {
    par.forEach(function(item) {
        item.addEventListener('click', retro);
        function retro(){
            selectSelector(alaternarArrayPorPar);
            toggle(par);            
        } 
        function selectSelector(arr){
            arr.forEach(par => {
                if (par[0].classList.contains('select') == true) {
                    par[0].classList.add('inactive')
                    par[1].classList.remove('inactive');
                    par[0].classList.remove('select')
                }
            })
        }
    })
})
}

function toggle(arr) {
    arr.forEach(function(item) {
        arr[0].classList.remove('inactive')
        arr[1].classList.add('inactive');
        arr[0].classList.add('select')
    })
}

altenarImagen(alternarToArray);