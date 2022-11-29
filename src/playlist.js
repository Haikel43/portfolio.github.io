const API = 'https://spotify81.p.rapidapi.com/';
const content = null || document.getElementById('content');
const searchText = document.getElementById('search-music');
const form = document.querySelector('form');
let typeSearch;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '04fa129d7emsh4e3cea0bb001a4bp11a481jsnc2c82cef223c',
		'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
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
    const urlPre = `${API}search?q=${search}&type=${searchOptions}&offset=0&limit=1&numberOfTopResults=5`;
    const urlSearch = urlPre.replaceAll(' ', '%20');
    return urlSearch;
}

async function fetchData(urlApi, options) {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
}

function controlDisplay(display, format, view) {
    document.getElementById('content').className = '';
    content.classList.add(display, format, view);
}

async function viewResults() {
    try {
        let textRequest = searchText.value;
        const urlRequest = requestUrl(textRequest, typeSearch);
        const dataRequest = await fetchData(urlRequest, options);
        let view;
        switch (typeSearch) {
            case 'artists':
                const artistId = dataRequest.artists.items[0].data.uri.replace('spotify:artist:', '');
                console.log(dataRequest);
                controlDisplay('gridMode', 'full','artist');
                view = `${dataRequest.artists.items.map(artist => 
                    `
                    <div class="artista">
                        <img src="${artist.data.visuals.avatarImage.sources[0].url}" alt="">
                        <p class="p inactive>${artist.data.profile.name}</p>
                    </div>
                    `).join('')}`;
                content.innerHTML = view;
                document.querySelector('.artista').onclick = openArtist;
                function openArtist() {
                lookArtist(artistId);
                } 
                break;
            case 'albums':
                console.log(dataRequest);
                controlDisplay('gridMode', 'full', 'album');
                const albumId = dataRequest.albums.items[0].data.uri.replace('spotify:album:', '');
                view = `
                    <div class="disc">
                        <img src="${dataRequest.albums.items[0].data.coverArt.sources[0].url}" alt="">
                        <p class="p inactive>Album: ${dataRequest.albums.items[0].data.name}</p>
                        <p class="p inactive> Year: ${dataRequest.albums.items[0].data.date.year} </p>
                    </div>
                    `;
                content.innerHTML = view;
                document.querySelector('.disc').onclick = openAlbum;
                function openAlbum() {
                    lookAlbum(albumId);
                }
                break;
            case 'tracks':
                console.log(dataRequest);

                view = `
                <div class="disc">
                    <img src="${dataRequest.tracks[0].data.albumOfTrack.coverArt.sources[0].url}" alt="">
                    <p class="p inactive>Album: ${dataRequest.albums.items[0].data.name}</p>
                    <p class="p inactive> Year: ${dataRequest.albums.items[0].data.date.year} </p>
                </div>
                `;
            break;
            default:
                break;
        }
        
    } catch (error) {
        
    }
}

async function lookAlbum(id) {
    const albumTracksUrl = `${API}album_tracks?id=${id}&offset=0&limit=300`;
    const albumTracksRequest = await fetchData(albumTracksUrl, options);
    controlDisplay('gridMode', 'three-columns', 'tracks');
    console.log(albumTracksRequest);
    view = `
        ${albumTracksRequest.data.album.tracks.items.map(track => 
        `
            <div class="track-box">
                <div>
                    <img src="../src/assets/images/music.png" alt="">
                </div>    
                <div>
                    <p class="p track-info">${track.track.trackNumber} - ${track.track.name}</p>
                </div>
            </div>
        `).join('')}`;
    content.innerHTML = view;
}

async function lookArtist(id) {
    const artistAlbumsUrl = `${API}artist_albums?id=${id}&offset=0&limit=100`;
    const artistAlbumsRequest = await fetchData(artistAlbumsUrl, options);
    controlDisplay('gridMode', 'three-columns', 'albums');
    console.log(artistAlbumsRequest);
    view = `
    ${artistAlbumsRequest.data.artist.discography.albums.items.map(album=> 
    `
        <div id="${album.releases.items[0].id}" class="albums">
            <div>
                <img src="${album.releases.items[0].coverArt.sources[0].url}" alt="">
            </div>
            <div class="albums-info">
                <p class="p inactive">Album: ${album.releases.items[0].name}</p>
                <p class="p inactive">Year: ${album.releases.items[0].date.year}</p>
                <p class="p inactive">Tracks: ${album.releases.items[0].tracks.totalCount}</p>
            </div>
        </div>
    `).join('')}`;
    content.innerHTML = view;
    artistAlbumsRequest.data.artist.discography.albums.items.map(
        album => {
            const albumId = `${album.releases.items[0].id}`;
            document.getElementById(albumId).onclick = openAlbum;          
            function openAlbum() {
                lookAlbum(albumId);
                }
            }
        );
}



document.querySelector('.icon').onclick = submitSearch;
document.querySelector('form').onsubmit = submitSearch;

//SELECTOR DE OPCIONES

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

// DISPLAY OPTIONS

const displayGrid = () => {
    console.log('esto es una grid');
    if (content.classList.contains('artist') == false && content.classList.contains('album') == false) { 
        if (content.classList.contains('albums') == true) {
            controlDisplay('gridMode', 'three-columns', 'albums');
            const p = document.querySelectorAll('p');
            const pArray = Array.apply(null,p);
            pArray.forEach(p => {
                p.classList.add('inactive')
            });
        } else {
            controlDisplay('gridMode', 'three-columns', 'tracks');
        }
    }
}

const displayList = () => {
    if (content.classList.contains('artist') == false && content.classList.contains('album') == false){
        if (content.classList.contains('albums') == true) {
            controlDisplay('listMode', 'three-columns', 'albums');
            const p = document.querySelectorAll('p');
            const pArray = Array.apply(null,p);
            pArray.forEach(p => {
                p.classList.remove('inactive')
            });
        } else {
            controlDisplay('listMode', 'three-columns', 'tracks');
            const p = document.querySelectorAll('p');
            const pArray = Array.apply(null,p);
            pArray.forEach(p => {
                p.classList.remove('inactive')
            });
        }
        
        

    }
}


document.getElementById('op1').onclick = displayGrid;
document.getElementById('op2').onclick = displayList;