const cardPrefab = document.getElementById("card-prefab");
const cardsCointainer = document.getElementById("cards-container");

// const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
// const request = 'https://pokeapi.co/api/v2/pokemon/ditto';

// await fetch(request)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));


 

for (let i = 0; i < 10; i++) {
    cardPrefab.style.visibility = "visible"
    const clonedCard = cardPrefab.cloneNode(true);
    clonedCard.id = "";
    cardsCointainer.appendChild(clonedCard);
}