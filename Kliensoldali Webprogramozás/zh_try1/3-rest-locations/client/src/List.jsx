/* eslint-disable react/prop-types */
export default function List({ locations }) {
	return (
		<div>
			<h2>Locations</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{locations.map(location => (
						<tr key={location.id}>
							<td>{location.name}</td>
							<td>
								<button className="waves-effect waves-light btn">Details</button>
								<button className="waves-effect waves-light btn">Delete</button>
							</td>
						</tr>
					))}
					<tr>
						<td>Riverside</td>
						<td>
							<button className="waves-effect waves-light btn">Details</button>
							<button className="waves-effect waves-light btn">Delete</button>
						</td>
					</tr>
					<tr>
						<td>Columbus</td>
						<td>
							<button className="waves-effect waves-light btn">Details</button>
							<button className="waves-effect waves-light btn">Delete</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
