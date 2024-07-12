const data = [
	{
		year: 2015,
		semester_spring: 2108,
		semester_autumn: 2367,
		diploma: 301,
	},
	{
		year: 2016,
		semester_spring: 2018,
		semester_autumn: 2635,
		diploma: 334,
	},
	{
		year: 2017,
		semester_spring: 2310,
		semester_autumn: 2771,
		diploma: 324,
	},
	{
		year: 2018,
		semester_spring: 2417,
		semester_autumn: 2871,
		diploma: 437,
	},
	{
		year: 2019,
		semester_spring: 2508,
		semester_autumn: 3138,
		diploma: 430,
	},
	{
		year: 2020,
		semester_spring: 2794,
		semester_autumn: 3400,
		diploma: 729,
	},
	{
		year: 2021,
		semester_spring: 3076,
		semester_autumn: 3529,
		diploma: 693,
	},
	{
		year: 2022,
		semester_spring: 3134,
		semester_autumn: 3630,
		diploma: 683,
	},
	{
		year: 2023,
		semester_spring: 3296,
		semester_autumn: 3910,
		diploma: 771,
	},
];

const students = Array();
const diplomas = Array();
const years = Array();

for (const entry of data) {
	students.push((entry.semester_autumn + entry.semester_spring) / 2);
	diplomas.push(entry.diploma);
	years.push(entry.year);
}

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
	return `rgb(${randomBetween(0, 255)}, ${randomBetween(0, 255)}, ${randomBetween(0, 255)})`;
}

new Chart(document.querySelector("#chart"), {
	type: "line",
	data: {
		labels: years,
		datasets: [
			{
				label: "Hallgatók száma",
				data: students,
				borderColor: randomColor(),
			},
			{
				label: "Diplomák száma",
				data: diplomas,
				borderColor: randomColor(),
			},
		],
	},
});
