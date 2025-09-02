const cardPrefab = document.getElementById("card-prefab");
const cardPrefabType1 = document.getElementById("card-prefab-type1");
const cardPrefabType2 = document.getElementById("card-prefab-type2");
const pokemonSpan = document.getElementById("pokemon-span");
const cardPrefabCenterImage = document.getElementById(
  "card-prefab-center-image"
);
const cardsCointainer = document.getElementById("cards-container");

// const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');

// requesting a pokemon.
num = 1000;
for (let i = 0; i < num; i++) {
  const request = "https://pokeapi.co/api/v2/pokemon/" + i + "/";
  const r = fetch(request)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      return data;
    })

    .catch((error) => console.error("Error:", error));

  fetch(request)
    .then((response) => response.json())
    .then((data) => {
      // requesting the pokemon image
      imageURL = data.sprites.front_default;
      cardPrefabCenterImage.src = imageURL;
      console.log(imageURL);

      //request pokemon name
      pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      pokemonSpan.textContent = pokemonName;

      //request pokemon type
      pokemonType1 = data.types[0].type.name;
      pokemonType2 = data.types.length > 1 ? data.types[1].type.name : null;
      cardPrefabType1.textContent = pokemonType1;
      if (pokemonType2) {
        cardPrefabType2.textContent = pokemonType2;
      } else {
        cardPrefabType2.textContent = "";
      }
      console.log(pokemonType1);
      console.log(pokemonType2);
      
      const clonedCard = cardPrefab.cloneNode(true);
      clonedCard.id = "";
      cardsCointainer.appendChild(clonedCard);
      clonedCard.style.visibility = "visible";

    });
 
}


