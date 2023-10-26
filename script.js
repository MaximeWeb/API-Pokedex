// Insert your code here
const pokemonContainer = document.querySelector("#pokemonContainer");
const body = document.querySelector("body");
const myInput = document.querySelector("#input");
let btnNext = document.querySelector("#next");
let btnBack = document.querySelector("#retour");

const limit = 12;
let offSet = 0;
pokemonContainer.innerHTML = "";

btnBack.style.opacity = 0;

const renderPokedex = (data) => {
  const html = `
      
      <div class="pokemon ${data.type}" >
          <div class="imgContainer">
              <img src=${data.sprite} alt="${data.name}" />
          </div>
          <div class="info">
              <h3 class="name">${data.name}</h3>
              <span class="type">Type: <span>${data.type}</span></span>
          </div>
      </div>
  
          `;
  pokemonContainer.insertAdjacentHTML("beforeend", html);
};

const getPokemon = (pokemonName) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((res) => res.json())
    .then((data) => {
      return {
        name: data.name[0].toUpperCase() + data.name.slice(1),
        sprite: data.sprites.front_default,
        type: data.types[0].type.name,
      };
    });
};

btnNext.addEventListener("click", async () => {
  btnBack.style.opacity = 1;
  body.style.backgroundSize = "100%";
  pokemonContainer.innerHTML = "";
  btnNext.textContent = "Next";
  const pokeUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offSet}`;
  const pokeList = await fetch(pokeUrl)
    .then((res) => {
      offSet += limit;
      return res.json();
    })
    .then((data) => data.results);
  if (pokeList.length === 0) {
    btnNext.textContent = "Open Pokedex";
    btnBack.style.opacity = 0;
  }
  for (let index = 0; index < pokeList.length; index++) {
    const onePoke = await getPokemon(pokeList[index].name);
    renderPokedex(onePoke);
  }
});

const form = document.getElementById("pokemon-form");
const input = document.getElementById("pokemon-name");
const pokemonInfo = document.getElementById("pokemon-info");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  pokemonContainer.innerHTML = "";
  btnNext.style.opacity = 0;
  btnBack.style.opacity = 1;
  const pokemonName = input.value.toLowerCase();
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();

      pokemonInfo.innerHTML = `
     
      <div class="pokemon ${data.types[0].type.name}" >
      <h2>${data.name}</h2>
      <div class="imgContainer">
      <img src=${data.sprites.front_default} alt="${
        data.name[0].toUpperCase() + data.name.slice(1)
      }" />
  </div>
                        <p>Type(s): ${data.types
                          .map((type) => type.type.name)
                          .join(", ")}</p>

                          
         `;
    } else {
      pokemonInfo.innerHTML = "Pokémon introuvable.";
    }
  } catch (error) {
    pokemonInfo.innerHTML = "Une erreur s'est produite";
  }
});

btnBack.addEventListener("click", async () => {
  pokemonInfo.innerHTML = "";
  pokemonContainer.innerHTML = "";

  btnNext.style.opacity = 1;
  body.style.backgroundSize = "100%";
  const pokeUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offSet}`;
  const pokeList = await fetch(pokeUrl)
    .then((res) => {
      offSet -= limit;
      return res.json();
    })
    .then((data) => data.results);
  if (pokeList.length === 0) {
    btnNext.textContent = "Open Pokedex";
    btnBack.style.opacity = 0;
  }
  console.log(pokeList);
  for (let index = 0; index < pokeList.length; index++) {
    const onePoke = await getPokemon(pokeList[index].name);
    renderPokedex(onePoke);
  }
});
