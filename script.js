// Number of pokemons
const pokemonsNumber = 893;

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
	ground: '#ab9842',
	rock: '#a38c21',
	fairy: '#FFACE4',
	poison: '#b97fc9',
	bug: '#729f3f',
	dragon: '#53a4cf',
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


//Fade in effect - pokemon cards
function hideElements(){
    const callback = function(entries) {
        entries.forEach(entry => {
            entry.target.classList.toggle("appear");
        });
    };

    const observer = new IntersectionObserver(callback);
    const targets = document.querySelectorAll(".pokemon");
    targets.forEach(function(target) {
        observer.observe(target);
    });
}

const loadingScreen = document.querySelector('.loading');

// Get all pokemons from api
const fecthAllPokemons = async () => {
    for(let i = 1; i <= pokemonsNumber; i++){
        // Get pokemon info from API
        const url = `//pokeapi.co/api/v2/pokemon/${i}`;
        const result = await fetch(url);
        const pokemon = await result.json();

        const pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
        const pokemonId = pokemon.id;
        const pokemonTypes = pokemon.types.map( el => el.type.name);
        const defaultImage = pokemon.sprites.front_default; 
        createPokemonCard(pokemonName, pokemonId, pokemonTypes, defaultImage);
        if(i == pokemonsNumber){
            loadingScreen.style.display = "none";
        }
    }
    const moreInfoBtns = document.querySelectorAll('.poke-info');
    moreInfoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pokemonId = e.target.parentNode.parentNode.getAttribute('data-id');
            getPokemonInfo(pokemonId);
        });
    });

    hideElements();
}

let visiblePokemons = 0;

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

    // toggle class to fade in effect
    if(visiblePokemons >= 18) {
        pokemonElement.classList.add('fade-in', 'appear');
    }

    const pokeText = `
        <div class='image-container'>
            <img src='//pokeres.bastionbot.org/images/pokemon/${pokeId}.png' onerror="this.src='${defaultImage}';"/>
        </div>
        <div class='info'>
            <span class='number'>#${pokeId.toString().padStart(3, '0')}</span>
            <h3 class='name'>${pokeName}</h3>
            <button class="poke-info">More info</button>
        </div>
    `;

    pokemonElement.innerHTML = pokeText;
    pokeContainer.appendChild(pokemonElement);
    visiblePokemons++;
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
function pokemonData(pokemon){
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

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        pokeInfoCard.style.display = 'none';
        pokeInfoCard.innerHTML = '';
        overlay.style.display = 'none';
    });
}

// Get pokemon info to display on pokemon card
getPokemonInfo = async (id) =>{
    // Get pokemon info from API
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const result = await fetch(url);
    const pokemon = await result.json();
    pokemonData(pokemon);
}

// Search bar
const searchInput = document.querySelector('.search-pokemon');
const noPokemonContainer = document.querySelector('.no-pokemon');

searchInput.addEventListener('keyup', (event) => {  
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
    if (counter == pokemonsNumber) {
        noPokemonContainer.style.display = 'block';
        counter = 0;
    } else {
        noPokemonContainer.style.display = 'none';
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
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const buttonValue =  e.target.innerHTML.toLowerCase();
        filterType(buttonValue);
    })
});

function filterType(buttonVal) {
    const pokemons = document.querySelectorAll('.pokemon');

    pokemons.forEach(pokemon => {
        const pokemonType = pokemon.getAttribute('data-type');
        if (buttonVal == pokemonType) {
            pokemon.style.display = 'block';
        } else {
            pokemon.style.display = 'none';
        }
    });
}

// Call the function to fetch all pokemons
fecthAllPokemons();

