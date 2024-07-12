//callback, nem fix milyen sorrendben történnek a függvények

const { readdir: readDir, readFile, writeFile } = require("fs");

readDir("./files", (err, names) => {
	console.log(names);

	const output = [];
	const finished = [];

	for (const name of names) {
		readFile("./files/" + name, { encoding: "utf-8" }, (err, file) => {
			console.log(file);
			output.push(file);
			finished.push(name);

			//így már a fajlbairas biztos azután lesz hogy beolvasták mindet
			// de a beolvasás sorrendje még mindig nem fix
			if (finished.length === names.length) {
				writeFile("./concat.txt", output.join("\n"), err => {
					console.log("finished");
				});
			}
		});
	}

	//writeFile("./concat.txt", output.join("\n"), err => {
	//	console.log("finished");
	//});
});
