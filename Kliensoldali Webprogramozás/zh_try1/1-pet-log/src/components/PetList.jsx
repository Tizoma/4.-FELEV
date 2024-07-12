const PetList = ({ petListData, setter }) => {
	const handleClick = pet => {
		if (pet.nodeName != "DIV") {
			pet = pet.parentElement;
			setter(petListData[pet.id - 1]);
		} else {
			setter(petListData[pet.id - 1]);
		}
	};
	return (
		<section className="flex flex-wrap gap-4 justify-center">
			{petListData.map(pet => {
				return (
					<div
						id={pet.id}
						onClick={e => handleClick(e.target)}
						className="border-2 border-gray-300 text-gray-600 cursor-pointer p-2 flex flex-col gap-2 rounded-xl hover:scale-105 transition-transform shadow-md "
						key={pet.id}
					>
						<h2>{pet.name}</h2>
						<img className="w-36 h-36 object-cover rounded-lg" src={pet.pictureURL} />
					</div>
				);
			})}
		</section>
	);
};

export default PetList;
