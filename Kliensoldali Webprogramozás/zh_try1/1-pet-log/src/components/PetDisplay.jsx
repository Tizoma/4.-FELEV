import AddWeightEntry from "./AddWeightEntry";
import WeightDiagram from "./WeightDiagram";

const PetDisplay = ({ petData, onAddWeight }) => {
	//console.log(petData);
	return (
		<div className="rounded-lg flex flex-col gap-8 mb-8 items-center border-2 w-1/2 border-gray-200 p-4">
			<h1 className="text-3xl font-bold">{petData.name}</h1>
			<div className="flex">
				<img className="w-52 h-52 object-cover" src={petData.pictureURL} />
				<table>
					<tbody className="text-lg text-gray-600">
						<tr>
							<td className="px-4">Species:</td>
							<td className="px-4">{petData.details.species}</td>
						</tr>
						<tr>
							<td className="px-4">Breed:</td>
							<td className="px-4">{petData.details.breed}</td>
						</tr>
						<tr>
							<td className="px-4">Favorite Food:</td>
							<td className="px-4">{petData.details.favoriteFood}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="w-full text-center">{Object.keys(petData.weightHistory).length > 0 ? <WeightDiagram weightHistory={petData.weightHistory} /> : "No weight history available"}</div>
			{<AddWeightEntry onAddWeight={onAddWeight} />}
		</div>
	);
};

export default PetDisplay;
