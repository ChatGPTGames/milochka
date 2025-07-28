const field = document.getElementById("field");
const harvestCounter = document.getElementById("harvest");
const coinsCounter = document.getElementById("coins");
const animalsCounter = document.getElementById("animals");
const chickensCounter = document.getElementById("chickens");
const eggsCounter = document.getElementById("eggs");
const breadCounter = document.getElementById("bread");
const seasonDisplay = document.getElementById("seasonDisplay");
const honeyCounter = document.getElementById("honey");
const hivesCounter = document.getElementById("hives");
const questDisplay = document.getElementById("currentQuestText");

let harvest = 0;
let coins = 0;
let animals = 0;
let chickens = 0;
let eggs = 0;
let bread = 0;
let honey = 0;
let hives = 0;
let tiles = [];

const seasons = ["весна 🌸", "лето ☀️", "осень 🍂", "зима ❄️"];
let currentSeason = 0;

function updateSeason() {
  currentSeason = (currentSeason + 1) % 4;
  seasonDisplay.textContent = `сейчас ${seasons[currentSeason]}`;
}

setInterval(updateSeason, 60000);

function getSeasonBonus() {
  switch (currentSeason) {
    case 0: return 1.2;
    case 1: return 1;
    case 2: return 2;
    case 3: return 0.5;
  }
}

function createTile() {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.addEventListener("click", () => {
    if (
      !tile.classList.contains("plant") &&
      !tile.classList.contains("harvested") &&
      !tile.classList.contains("animal") &&
      !tile.classList.contains("fed-animal") &&
      !tile.classList.contains("chicken") &&
      !tile.classList.contains("egg") &&
      !tile.classList.contains("hive") &&
      !tile.classList.contains("honey")
    ) {
      if (currentSeason !== 3) tile.classList.add("plant");
    } else if (tile.classList.contains("plant")) {
      tile.classList.remove("plant");
      tile.classList.add("harvested");
      harvest += Math.round(1 * getSeasonBonus());
      harvestCounter.textContent = harvest;
      checkQuestProgress("harvest");
    }
  });
  field.appendChild(tile);
  tiles.push(tile);
}

for (let i = 0; i < 25; i++) createTile();

function sellHarvest() {
  if (harvest > 0) {
    let multiplier = currentSeason === 3 ? 2 : 1;
    coins += harvest * 5 * multiplier;
    harvest = 0;
    harvestCounter.textContent = harvest;
    coinsCounter.textContent = coins;
    tiles.forEach((tile) => tile.classList.remove("harvested"));
    checkQuestProgress("sellHarvest");
  }
}

function sellEggs() {
  if (eggs > 0) {
    coins += eggs * 3;
    eggs = 0;
    eggsCounter.textContent = eggs;
    coinsCounter.textContent = coins;
    tiles.forEach((tile) => tile.classList.remove("egg"));
    checkQuestProgress("sellEggs");
  }
}

function sellBread() {
  if (bread > 0) {
    coins += bread * 15;
    bread = 0;
    breadCounter.textContent = bread;
    coinsCounter.textContent = coins;
    tiles.forEach((tile) => tile.classList.remove("bread"));
    checkQuestProgress("sellBread");
  }
}

function sellHoney() {
  if (honey > 0) {
    coins += honey * 12;
    honey = 0;
    honeyCounter.textContent = honey;
    coinsCounter.textContent = coins;
    tiles.forEach((tile) => tile.classList.remove("honey"));
    checkQuestProgress("sellHoney");
  }
}

function buyAnimal() {
  if (coins >= 50) {
    coins -= 50;
    animals++;
    coinsCounter.textContent = coins;
    animalsCounter.textContent = animals;
    for (let tile of tiles) {
      if (
        !tile.className.includes("plant") &&
        !tile.className.includes("animal") &&
        !tile.className.includes("fed-animal") &&
        !tile.className.includes("chicken")
      ) {
        tile.classList.add("animal");
        break;
      }
    }
    checkQuestProgress("buyAnimal");
  }
}

function feedAnimals() {
  if (harvest >= animals && animals > 0) {
    let fed = 0;
    for (let tile of tiles) {
      if (tile.classList.contains("animal") && fed < animals) {
        tile.classList.remove("animal");
        tile.classList.add("fed-animal");
        fed++;
      }
    }
    harvest -= animals;
    coins += animals * 10;
    harvestCounter.textContent = harvest;
    coinsCounter.textContent = coins;
    checkQuestProgress("feedAnimals");
  }
}

function buyChicken() {
  if (coins >= 30) {
    coins -= 30;
    chickens++;
    coinsCounter.textContent = coins;
    chickensCounter.textContent = chickens;
    for (let tile of tiles) {
      if (
        !tile.classList.contains("plant") &&
        !tile.classList.contains("harvested") &&
        !tile.classList.contains("animal") &&
        !tile.classList.contains("fed-animal") &&
        !tile.classList.contains("chicken") &&
        !tile.classList.contains("egg")
      ) {
        tile.classList.add("chicken");
        break;
      }
    }
    checkQuestProgress("buyChicken");
  }
}

function collectEggs() {
  let count = 0;
  for (let tile of tiles) {
    if (tile.classList.contains("chicken")) {
      tile.classList.remove("chicken");
      tile.classList.add("egg");
      count++;
    }
  }
  eggs += count;
  eggsCounter.textContent = eggs;
  checkQuestProgress("collectEggs");
}

function bakeBread() {
  if (harvest >= 3) {
    harvest -= 3;
    bread++;
    harvestCounter.textContent = harvest;
    breadCounter.textContent = bread;
    checkQuestProgress("bakeBread");
  }
}

function buyHive() {
  if (coins >= 40) {
    coins -= 40;
    hives++;
    coinsCounter.textContent = coins;
    hivesCounter.textContent = hives;
    for (let tile of tiles) {
      if (
        !tile.className.includes("plant") &&
        !tile.className.includes("animal") &&
        !tile.className.includes("chicken") &&
        !tile.className.includes("hive") &&
        !tile.className.includes("egg")
      ) {
        tile.classList.add("hive");
        break;
      }
    }
    checkQuestProgress("buyHive");
  }
}

function collectHoney() {
  let count = 0;
  for (let tile of tiles) {
    if (tile.classList.contains("hive")) {
      tile.classList.remove("hive");
      tile.classList.add("honey");
      count++;
    }
  }
  honey += count;
  honeyCounter.textContent = honey;
  checkQuestProgress("collectHoney");
}

function expandField() {
  if (coins >= 100) {
    coins -= 100;
    coinsCounter.textContent = coins;
    for (let i = 0; i < 5; i++) createTile();
    checkQuestProgress("expandField");
  }
}

// квесты >w<
const quests = [
  {
    description: "собери 10 морковок",
    progress: 0,
    goalCount: 10,
    type: "harvest",
    reward: 50,
  },
  {
    description: "накормить 3 коровок",
    progress: 0,
    goalCount: 3,
    type: "feedAnimals",
    reward: 40,
  },
  {
    description: "собрать 5 яиц",
    progress: 0,
    goalCount: 5,
    type: "collectEggs",
    reward: 30,
  },
  {
    description: "испечь 2 хлеба",
    progress: 0,
    goalCount: 2,
    type: "bakeBread",
    reward: 60,
  },
];

let currentQuest = null;

function newQuest() {
  currentQuest = quests[Math.floor(Math.random() * quests.length)];
  currentQuest.progress = 0;
  updateQuestDisplay();
  alert(`новый квест: ${currentQuest.description} 💖`);
}

function updateQuestDisplay() {
  if (currentQuest) {
    questDisplay.textContent = `${currentQuest.description} (${currentQuest.progress} / ${currentQuest.goalCount}) 💖`;
  } else {
    questDisplay.textContent = "нет активных квестов :(";
  }
}

function checkQuestProgress(action) {
  if (!currentQuest) return;

  if (action === currentQuest.type) {
    currentQuest.progress++;
    updateQuestDisplay();

    if (currentQuest.progress >= currentQuest.goalCount) {
      coins += currentQuest.reward;
      coinsCounter.textContent = coins;
      alert(`квест выполнен! получено монет: ${currentQuest.reward} 🎉`);
      currentQuest = null;
      updateQuestDisplay();
      newQuest();
    }
  }
}

// старт игры и квеста
newQuest();
updateQuestDisplay();

