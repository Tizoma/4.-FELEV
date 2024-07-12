const { readdir: readDir, readFile, writeFile } = require("fs/promises");

//önkioldó függvény
//IIFE ==Immediate Invoked Function Expression
//utana zarojelbe pl parametereket megadhatsz és rögtön meghivja
(() => {
	console.log("hello world");
})();

(async () => {
	const names = await readDir("./files");

	const output = [];
	for (const name of names) {
		const file = await readFile("./files/" + names, { encoding: "utf-8" });
		output.push(file);
	}

	await writeFile("./concat.txt", output.join("\n"));

	console.log("finished");
})();
