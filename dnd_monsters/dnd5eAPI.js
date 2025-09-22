const container = document.getElementById("monster-container");
const prefab = document.getElementById("statblock-prefab");

let allMonsters = [];
let currentIndex = 0;
const pageSize = 10; // how many monsters to load per batch

function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

async function loadMonsterList() {
  const res = await fetch("https://www.dnd5eapi.co/api/monsters");
  const data = await res.json();
  allMonsters = data.results.sort((a, b) => a.name.localeCompare(b.name));

  // load first batch
  loadNextBatch();
}

async function loadNextBatch() {
  const end = Math.min(currentIndex + pageSize, allMonsters.length);

  for (let i = currentIndex; i < end; i++) {
    await addMonster(allMonsters[i].index);
  }

  currentIndex = end;

  // reattach observer to the new sentinel if there are more
  if (currentIndex < allMonsters.length) {
    observeSentinel();
  }
}

async function addMonster(index) {
  const res = await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`);
  if (!res.ok) return;
  const m = await res.json();

  const card = prefab.cloneNode(true);
  card.id = "";
  card.style.display = "block";

  // heading
  card.querySelector("h1").textContent = m.name;
  card.querySelector("h2").textContent = `${m.size} ${m.type}, ${m.alignment}`;

  // armor class
  const ac =
    Array.isArray(m.armor_class) && m.armor_class.length > 0
      ? m.armor_class.map((x) => x.value).join(", ")
      : m.armor_class;
  card.querySelector(".property-line:nth-of-type(1) p").textContent = ac;

  // hit points
  card.querySelector(".property-line:nth-of-type(2) p").textContent =
    `${m.hit_points} (${m.hit_points_roll || ""})`;

  // speed
  card.querySelector(".property-line:nth-of-type(3) p").textContent =
    m.speed.walk || "—";

  // abilities
  const abilities = card.querySelectorAll(".abilities > div p");
  abilities[0].textContent = `${m.strength} (${mod(m.strength)})`;
  abilities[1].textContent = `${m.dexterity} (${mod(m.dexterity)})`;
  abilities[2].textContent = `${m.constitution} (${mod(m.constitution)})`;
  abilities[3].textContent = `${m.intelligence} (${mod(m.intelligence)})`;
  abilities[4].textContent = `${m.wisdom} (${mod(m.wisdom)})`;
  abilities[5].textContent = `${m.charisma} (${mod(m.charisma)})`;

  // damage immunities
  card.querySelector(".property-line:nth-of-type(4) p").textContent =
    m.damage_immunities.join(", ") || "—";

  // condition immunities
  card.querySelector(".property-line:nth-of-type(5) p").textContent =
    m.condition_immunities.map((ci) => ci.name).join(", ") || "—";

  // senses
  card.querySelector(".property-line:nth-of-type(6) p").textContent =
    Object.entries(m.senses)
      .map(([k, v]) => `${k} ${v}`)
      .join(", ") || "—";

  // languages
  card.querySelector(".property-line:nth-of-type(7) p").textContent =
    m.languages || "—";

  // challenge rating
  card.querySelector(".property-line:nth-of-type(8) p").textContent =
    `${m.challenge_rating} (${m.xp} XP)`;

  container.appendChild(card);
}

// 🔎 Infinite Scroll using IntersectionObserver
function observeSentinel() {
  let sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  container.appendChild(sentinel);

  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      obs.disconnect(); // stop observing until batch loaded
      sentinel.remove();
      loadNextBatch();
    }
  });
  observer.observe(sentinel);
}

loadMonsterList();
