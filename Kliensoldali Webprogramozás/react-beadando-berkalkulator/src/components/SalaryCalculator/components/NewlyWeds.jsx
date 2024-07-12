import PropTypes from "prop-types";

export function NewlyWeds({ hazas, handler }) {
	if (hazas) {
		return (
			<>
				<div className="ui input mr-1">
					<input type="text" name="datum" id="datum" placeholder="YYYYMM/DD" onChange={e => handler(e.target.value)}></input>
				</div>
				<label className="mr-4 text-zinc-500" htmlFor="datum">
					Házasságkötés dátuma
				</label>
			</>
		);
	} else {
		return null;
	}
}

NewlyWeds.propTypes = {
	hazas: PropTypes.bool,
	handler: PropTypes.func,
};
