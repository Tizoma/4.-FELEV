//szinkronizalva

const { readdirSync: readDirSync, readFileSync, writeFileSync } = require("fs");

// readDirSync :-al más néven húzzuk be
const names = readDirSync("./files");
console.log(names);

const output = [];
for (const name of names) {
	const file = readFileSync(`./files/${name}`, "utf8");
	//const file = readFileSync("./files/" + name, 'utf8')
	//ugyanazok
	output.push(file);
}

console.log(output);
//egymas utan rakva kiirja a fileba
writeFileSync("./concat.txt", output.join("\n"));
