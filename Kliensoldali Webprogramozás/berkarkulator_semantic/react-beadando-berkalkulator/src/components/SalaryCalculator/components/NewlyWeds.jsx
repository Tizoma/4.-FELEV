import PropTypes from "prop-types";

export function NewlyWeds({ hazas, handler }) {
	if (hazas) {
		return (
			<>
				<div className="ui input">
					<input type="text" name="datum" id="datum" placeholder="YYYYMM/DD" onChange={e => handler(e.target.value)}></input>
				</div>
				<div className="ui label">
					<label htmlFor="datum">Házasságkötés dátuma</label>
				</div>
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
