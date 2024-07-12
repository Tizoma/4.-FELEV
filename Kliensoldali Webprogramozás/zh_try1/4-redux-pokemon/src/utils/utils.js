const pokemonList = ["bulbasaur", "squirtle", "charmander", "mew"];

const forest = [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
                { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
                { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }
            ];

export function getRandomNumber(min = 0, max = 10) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function getRandomPokemon() {
    const chance = getRandomNumber(0, 100);
    if (chance <= 33) {
        return pokemonList[0];
    } else if (chance <= 66) {
        return pokemonList[1];
    } else if (chance <= 99) {
        return pokemonList[2];
    } else {
        return pokemonList[3];
    }
}

export function isForest(position) {
    return forest.some((forestPosition) => {
        return forestPosition.x === position.x && forestPosition.y === position.y;
    });
}
