import List from "./List";
import Details from "./Details";
import { useEffect, useState } from "react";

function App() {
	async function getLocations() {
		const response = await fetch("http://localhost:4000/locations");
		const locations = await response.json();
		return locations;
	}
	function handleNewLocation() {
		setNewLocation(true);
	}
	useEffect(() => {
		async function fetchData() {
			const result = await getLocations();
			setLocations(result);
		}
		fetchData();
	}, []);

	const [newLocation, setNewLocation] = useState(false);
	const [locations, setLocations] = useState([]);
	return (
		<div>
			<div className="row">
				<div className="col s6">
					<List locations={locations}></List>
				</div>
				{newLocation ? (
					<>
						<div className="col s6">
							<Details></Details>
						</div>
					</>
				) : (
					<div></div>
				)}
			</div>
			<span>
				<button onClick={() => handleNewLocation()} className="waves-effect waves-light btn">
					New location
				</button>
			</span>
		</div>
	);
}

export default App;
