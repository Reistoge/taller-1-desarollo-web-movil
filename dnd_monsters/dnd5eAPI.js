const container = document.getElementById("statblock-container");
const prefab = document.getElementById("statblock-prefab");

async function loadMonsters() {
  try {
    // 1. Get all monsters
    const listResponse = await fetch("https://www.dnd5eapi.co/api/monsters/");
    const listData = await listResponse.json();

    // 2. Loop through each monster
    for (const monster of listData.results) {
      const detailResponse = await fetch("https://www.dnd5eapi.co" + monster.url);
      const data = await detailResponse.json();

      // 3. Clone prefab
      const clone = prefab.cloneNode(true);
      clone.id = ""; // remove duplicate id
      clone.style.visibility = "visible";

      // --- Fill prefab fields ---

      // Name
      const nameEl = clone.querySelector("h1.text-2xl");
      if (nameEl) nameEl.textContent = data.name;

      // Type, size, alignment
      const typeEl = clone.querySelector("h3.italic");
      if (typeEl) typeEl.textContent = `${capitalize(data.type)}, ${data.size}, ${data.alignment}`;

      // Big image (use API image if available, else fallback)
      const baseUrl = "https://www.dnd5eapi.co";
const fallbackImg = "fallback_img.png";

const imgEl = clone.querySelector("img.p-2");
if (imgEl) {
  if (data.image) {
    imgEl.src = baseUrl + data.image;
  } else {
    imgEl.src = fallbackImg;
  }

  // Extra safety: if loading fails (404), switch to fallback
  imgEl.onerror = () => {
    imgEl.src = fallbackImg;
  };
}

      // AC
      const acEl = clone.querySelector("div:nth-child(2) > div > h1.text-lg");
      if (acEl) acEl.textContent = Array.isArray(data.armor_class) ? data.armor_class[0].value : data.armor_class;

      // HP
      const hpEl = clone.querySelector("div:nth-child(2) > div:nth-child(2) > h1.text-lg");
      if (hpEl) hpEl.textContent = data.hit_points;

      // CR
      const crEl = clone.querySelector("div:nth-child(2) > div:nth-child(3) > h1.text-lg");
      if (crEl) {
        let cr = data.challenge_rating;

        // Map decimals to fractions
        const crMap = {
          0.5: "1/2",
          0.25: "1/4",
          0.125: "1/8"
        };

        crEl.textContent = crMap[cr] || cr; // fallback to raw number if not mapped
      }

      // Stats (STR, DEX, CON, INT, WIS, CHA)
      const stats = [data.strength, data.dexterity, data.constitution, data.intelligence, data.wisdom, data.charisma];
      const statBlocks = clone.querySelectorAll(".flex.flex-col.flex-1");
      statBlocks.forEach((block, i) => {
        const mod = getModifier(stats[i]);
        const modEl = block.querySelector("h1.text-lg");
        const statEl = block.querySelector("h3");
        if (modEl) modEl.textContent = (mod >= 0 ? "+" : "") + mod;
        if (statEl) statEl.textContent = stats[i];
      });

      // Append clone
      container.appendChild(clone);
    }
  } catch (err) {
    console.error("Error loading monsters:", err);
  }
}

// Utility: calculate D&D modifier
function getModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

// Utility: capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Run
loadMonsters();