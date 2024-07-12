const progressProperties = [
	{
		id: "group-test",
		backgroundColor: "#FF9B9B",
		motivationalText: "You can do it!",
		motivationalTextHungarian: "Minden kezdet nehéz!",
	},
	{
		id: "react-assignment-1",
		backgroundColor: "#FFC97E",
		motivationalText: "Keep going!",
		motivationalTextHungarian: "Csak így tovább!",
	},
	{
		id: "react-assignment-2",
		backgroundColor: "#A0E7E5",
		motivationalText: "Almost there!",
		motivationalTextHungarian: "Majdnem kész vagy!",
	},
	{
		id: "end-term",
		backgroundColor: "#B5EAD7",
		motivationalText: "You are so close!",
		motivationalTextHungarian: "Már nagyon közel vagy!",
	},
	{
		id: "finish",
		backgroundColor: "#7BFF78",
		motivationalText: "You did it!",
		motivationalTextHungarian: "Tárgy teljesítve!",
	},
];

const milestones = document.querySelectorAll(".milestone");
const motivationTitle = document.querySelector("#motivation");

const milestoneObserver = new IntersectionObserver(milestoneCallback, { threshold: 0.5 });

function milestoneCallback(entries) {
	entries.forEach(element => {
		if (element.isIntersecting) {
			for (const property of progressProperties) {
				if (property.id === element.target.id) {
					const progressProperty = property;
					document.querySelector("body").style.backgroundColor = progressProperty.backgroundColor;
					motivationTitle.innerHTML = progressProperty.motivationalText;
				}
			}
		}
	});
}

for (const milestone of milestones) {
	milestoneObserver.observe(milestone);
}
