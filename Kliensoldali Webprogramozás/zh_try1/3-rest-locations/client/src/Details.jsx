import { useState } from "react";

function Details() {
	const [data, setData] = useState({ name: "", lat: 0, lon: 0 });
	function handleChange(e) {
		const newData = {
			...data,
			[e.target.name]: e.target.value,
		};
		setData(newData);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: data.name, lat: data.lat, lon: data.lon }),
		};
		const response = await fetch("http://localhost:4000/locations", requestOptions);
		const back = await response.json();
		console.log(back);
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Details</h2>
			<div>
				<label htmlFor="name">Name:</label>
				<input type="text" id="name" name="name" value={data.name} onChange={e => handleChange(e)} />
			</div>
			<div>
				<label htmlFor="lat">Latitude:</label>
				<input type="number" id="lat" name="lat" value={data.lat} onChange={e => handleChange(e)} />
			</div>
			<div>
				<label htmlFor="lon">Longitude:</label>
				<input type="number" id="lon" name="lon" value={data.lon} onChange={e => handleChange(e)} />
			</div>
			<button className="waves-effect waves-light btn" type="submit">
				Save new location
			</button>
		</form>
	);
}

export default Details;
