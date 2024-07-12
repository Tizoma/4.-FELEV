const { readdir: readDir, readFile, writeFile } = require("fs/promises");

//objektumot ad vissza
readDir("./files").then(names => {
	console.log(names);

	let output = [];
	for (const name of names) {
		readFile("./files/" + name, { encoding: "utf-8" }).then(file => {
			output.push(file);
		});
	}

	writeFile("./concat.txt", output.join("\n")).then(() => {
		console.log("finished");
	});
});
