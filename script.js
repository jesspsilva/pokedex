// Number of pokemons
const pokemonsNumber = 893;
let pokemonsToShow = 101;
let pokemonsOnScreen = 0;

// Pokemon background colors
const colors = {
	fire: '#FDDFDF',
	grass: '#DEFDE0',
	electric: '#FCF7DE',
	water: '#DEF3FD',
	ground: '#f4e7da',
	rock: '#d5d5d4',
	fairy: '#fceaff',
	poison: '#98d7a5',
	bug: '#f8d5a3',
	dragon: '#96ACB7',
	psychic: '#eaeda1',
	flying: '#F5F5F5',
	fighting: '#E6E0D4',
    normal: '#F5F5F5',
    dark: '#b3b1b1',
    ice: '#C1EDCC',
    steel: '#B0C0BC',
    ghost: '#DAE2DF'
};

// Pokemon type colors
const typeColors = {
	fire: '#fd7d24',
	grass: '#9bcc50',
	electric: '#eed535',
	water: '#4592c4',
	ground: '#ab9522',
	rock: '#a38c21',
	fairy: '#FF7B9C',
	poison: '#b97fc9',
	bug: '#729f3f',
	dragon: '#033F63',
	psychic: '#f366b9',
	flying: '#3dc7ef',
	fighting: '#d56723',
    normal: '#a4acaf',
    dark: '#4d4b4b',
    ice: '#2B4141',
    steel: '#453F3C',
    ghost: '#171D1C'
};

const mainTypes = Object.keys(colors);

// DOM Elements
const pokeContainer = document.getElementById('poke-container');
const pokeInfoCard = document.getElementById('info-card');
const loadingScreen = document.querySelector('.loading');
const loadBtn = document.querySelector('.load-button');

// Load more Pokémons button
loadBtn.addEventListener('click', e => {
    e.preventDefault();
    showHiddenPokemons();
    if(pokemonsOnScreen < pokemonsNumber){
        pokemonsOnScreen += 102;
        pokemonsToShow += 102;
        showPokemon(pokemonInfo, pokemonsToShow, pokemonsOnScreen);
    }
});

// Show all pokemons (remove filters)
const showHiddenPokemons = () => {
    const pokemons = document.querySelectorAll('.pokemon');
    noPokemonContainer.classList.remove("show");
    pokemons.forEach(pokemon => {
        pokemon.style.display = 'block';
    });
}

// Get all pokemons from api
const fetchPokemonsFromAPI = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonsNumber}`;
    return fetch(url)
    .then(response => response.json())
    .then(function(allpokemon){
        allpokemon.results.forEach(function(pokemon){
            fetchPokemonIndividualData(pokemon); 
        })
    })

}

let pokemonInfo = [];
let iteration = 0;

// Get Pokemon Data
const fetchPokemonIndividualData = async (pokemons) => {
    let url = pokemons.url;
    url = url.slice(0, url.lastIndexOf('/'));
    return fetch(url) 
    .then(response => response.json())
    .then(pokeData => {
        iteration++;
        pokemonInfo.push(pokeData);
        pokemonInfo.sort((a,b)=>{
            return parseFloat(a.id) - parseFloat(b.id);
        })
        if(iteration === pokemonsNumber) {
            iteration = 0;
            showPokemon(pokemonInfo, pokemonsToShow, pokemonsOnScreen);
        }
    })
}

// Call fetch Pokemon function
fetchPokemonsFromAPI();

function showPokemon(pokemonInfo, pokemonsToShow, pokemonsOnScreen) {
    for(let i = pokemonsOnScreen; i <= pokemonsToShow; i++){
        if(i < pokemonsNumber){
            const pokemonName = pokemonInfo[i].name[0].toUpperCase() + pokemonInfo[i].name.slice(1);
            const pokemonId = pokemonInfo[i].id;
            const pokemonTypes = pokemonInfo[i].types.map( el => el.type.name);
            const defaultImage = pokemonInfo[i].sprites.front_default; 
            createPokemonCard(pokemonName, pokemonId, pokemonTypes, defaultImage);
            if(i == pokemonsToShow){
                loadingScreen.style.display = "none";
            }
        } else {
            loadBtn.style.display = "none";
        }
    }
    const moreInfoBtns = document.querySelectorAll('.poke-info');

    moreInfoBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const pokemonId = e.target.parentNode.parentNode.getAttribute('data-id');
            pokemonData(pokemonInfo, pokemonId);
            btn.classList.add('disableClick');
        });
    });
}

// Create pokemon cards
function createPokemonCard(pokeName, pokeId, pokeType, defaultImage) {
    const type = mainTypes.find( 
        type => pokeType.indexOf(type) > -1
    );

    const color = colors[type];

    const pokemonElement = document.createElement('div');
    pokemonElement.classList.add('pokemon');
    pokemonElement.setAttribute("data-id", pokeId);
    pokemonElement.setAttribute("data-name", pokeName);
    pokemonElement.setAttribute("data-type", type);

    pokemonElement.style.backgroundColor = color;

    const pokeText = `
        <div class='image-container'>
            <img src='https://pokeres.bastionbot.org/images/pokemon/${pokeId}.png' onerror="this.src='${defaultImage}'"/>
        </div>
        <div class='info'>
            <span class='number'>#${pokeId.toString().padStart(3, '0')}</span>
            <h3 class='name'>${pokeName}</h3>
            <button class="poke-info">More info</button>
        </div>
    `;

    pokemonElement.innerHTML = pokeText;
    pokeContainer.appendChild(pokemonElement);
}

const overlay = document.querySelector('.overlay');

// Create pokemon more info Card
function pokemonCardInfo(pokemonName, pokemonId, pokemonTypes, pokemonAbilites, pokemonHeight, pokemonWeight, pokemonMoves, defaultImage) {

    const infoElement = document.createElement('div');
    infoElement.classList.add('info');

    const type = mainTypes.find( 
        type => pokemonTypes.indexOf(type) > -1
    );
    
    // Handle information to display
    const abilities = pokemonAbilites.map(item => item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()).join(", ");
    let moves = pokemonMoves.slice(0,3);
    moves = moves.map(item => item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()).join(", ");
    const typeName = type[0].toUpperCase() + type.slice(1);
    const color = colors[type];
    const typeColor = typeColors[type];
    const height = pokemonHeight / 10 + "m";
    const weight = pokemonWeight / 10 + "kg";

    infoElement.style.backgroundColor = color;

    let infoText;
    if(abilities.length != 0 && moves.length != 0) {
        infoText = `
            <a href="javascript:" class="close"></a>
            <div class="top-info">
                <div class='image-container'>
                    <img src='https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png' onerror="this.src='${defaultImage}';"/>
                </div>
            </div>
            <h2 style="background-color:${typeColor}">${pokemonName}</h2>
            <div class="text-info">
                <h3>${weight}</h3>
                <h3>${height}</h3>
            </div>
            <div class="text-info">
                <h4>Weight</h4>
                <h4>Height</h4>
            </div>
            <div class="aditional-info">
                <h3 style="color:${typeColor}">Abilities</h3>
                <h4>${abilities}</h4>
                <h3 style="color:${typeColor}">Moves</h3>
                <h4>${moves}</h4>
            </div>
        `;
    } else {
        infoText = `
            <a href="javascript:" class="close"></a>
            <div class="top-info">
                <div class='image-container'>
                    <img src='https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png' onerror="this.src='${defaultImage}';"/>
                </div>
            </div>
            <h2 style="background-color:${typeColor}">${pokemonName}</h2>
            <div class="text-info">
                <h3>${weight}</h3>
                <h3>${height}</h3>
            </div>
            <div class="text-info">
                <h4>Weight</h4>
                <h4>Height</h4>
            </div>
        `;
    }
    infoElement.innerHTML += infoText;
    pokeInfoCard.appendChild(infoElement);
    pokeInfoCard.style.display = 'block';
    overlay.style.display = 'block';
    closeBtn();
}

// Create pokemon card info
function pokemonData(pokemonInfo, id){
    let pokemon = pokemonInfo[id-1];
    const pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const pokemonId = pokemon.id;
    const pokemonTypes = pokemon.types.map( el => el.type.name); 
    const pokemonAbilites = pokemon.abilities.map( el => el.ability.name); 
    const pokemonHeight = pokemon.height;
    const pokemonWeight = pokemon.weight;
    const pokemonMoves = pokemon.moves.map( el => el.move.name);
    const defaultImage = pokemon.sprites.front_default;

    pokemonCardInfo(pokemonName, pokemonId, pokemonTypes, pokemonAbilites, pokemonHeight, pokemonWeight, pokemonMoves, defaultImage);
}

// Close button
function closeBtn() {
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', e => {
        e.preventDefault();
        pokeInfoCard.style.display = 'none';
        pokeInfoCard.innerHTML = '';
        overlay.style.display = 'none';

        const moreInfoBtns = document.querySelectorAll('.poke-info');
        moreInfoBtns.forEach(btn => {
            btn.classList.remove('disableClick');
        });

    });
}

// Search bar
const searchInput = document.querySelector('.search-pokemon');
const noPokemonContainer = document.querySelector('.no-pokemon');

searchInput.addEventListener('keyup', event => {  
    const input = event.target.value;
    const value = input.toLowerCase();

    const pokemons = document.querySelectorAll('.pokemon');

    let counter = 0;

    pokemons.forEach(pokemon => {
        const pokemonName = pokemon.getAttribute('data-name').toLowerCase();
        const pokemonId = pokemon.getAttribute('data-id');
        const regex = /\d/g;

        // If the input is numeric check the id
        if (regex.test(value)) {
            if (pokemonId !== value ) {
                pokemon.style.display = 'none';
                counter++;
            } else {
                pokemon.style.display = 'block';
            }
        // If the input is not numeric check the data name
        } else {
            if (!pokemonName.includes(value)) {
                pokemon.style.display = 'none';
                counter++;
            } else {
                pokemon.style.display = 'block';
            }
        }
    });

    // If there's no pokemons to display show message
    if (counter == pokemonsToShow) {
        noPokemonContainer.classList.add("show");
        counter = 0;
    } else {
        noPokemonContainer.classList.remove("show");
    }
});

// Add pokemon type buttons
const buttonsContainer = document.querySelector('.type-buttons');
const typesOfPokemon = Object.keys(typeColors);

typesOfPokemon.forEach(type => {
    const typeName = type[0].toUpperCase() + type.slice(1);
    const html = `
        <button style="background-color: ${typeColors[type]}" class="type-button">${typeName}</button>
    ` 
    buttonsContainer.innerHTML += html;
});

// Handle type button click
const typeButtons = document.querySelectorAll('.type-button');

typeButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        const buttonValue =  e.target.innerHTML.toLowerCase();
        filterType(buttonValue);
    })
});

let numberOfHiddenPokemons = 1;

function filterType(buttonVal) {
    const pokemons = document.querySelectorAll('.pokemon');
    pokemons.forEach((pokemon, index, array) => {
        const pokemonType = pokemon.getAttribute('data-type');
        if (buttonVal == pokemonType) {
            pokemon.style.display = 'block';
        } else {
            // In the last iteration, if all pokemons are hidden, display message
            if (index === (array.length -1)) {
                if(numberOfHiddenPokemons > pokemonsToShow){
                    noPokemonContainer.classList.add("show");
                } else {
                    noPokemonContainer.classList.remove("show");
                }
                numberOfHiddenPokemons = 0;
            }
            pokemon.style.display = 'none';
            numberOfHiddenPokemons++;
        }
    });
}

// Go to top button
const goToTopBtn = document.querySelector(".top-button");

// When scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goToTopBtn.style.display = "block";
    } else {
        goToTopBtn.style.display = "none";
    }
}

// When click on the button, scroll to the top of the document
goToTopBtn.addEventListener('click', e => {
    e.preventDefault();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});


