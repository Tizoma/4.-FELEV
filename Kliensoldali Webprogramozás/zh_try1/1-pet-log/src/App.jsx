import { useState } from "react";
import PetDisplay from "./components/PetDisplay";
import PetList from "./components/PetList";
import data from "./data/petData.json";

function App() {
	const handleAddWeight = weight => {
		const newWeightHistory = {
			...currentPet.weightHistory,
			[new Date().toISOString()]: weight,
		};
		const newDataList = [...dataList];
		newDataList[currentPet.id - 1].weightHistory = newWeightHistory;
		setPetList(newDataList);
	};

	const dataList = [];
	data.map(e => {
		dataList.push(e);
	});

	const [petList, setPetList] = useState(dataList);
	const [currentPet, setCurrentPet] = useState(petList[0]);

	return (
		<>
			<header className="flex flex-col items-center text-center mb-10">
				<span aria-hidden className="text-4xl">
					🐾
				</span>
				<h1 className="text-4xl font-bold">Pet Log</h1>
				<h2 className="text-xl">Track, Care, and Love Your Pets</h2>
			</header>
			<main className="items-center flex flex-col">
				<PetDisplay petData={currentPet} onAddWeight={handleAddWeight} />
				<PetList petListData={petList} setter={setCurrentPet} />
			</main>
		</>
	);
}

export default App;
