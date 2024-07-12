import PropTypes from "prop-types";

export function Entitled({ hazas, jogosult }) {
	if (hazas) {
		if (jogosult) {
			return (
				<>
					<h4 className="ui left aligned header">Jogosult</h4>
				</>
			);
		} else {
			return (
				<>
					<h4 className="ui left aligned header">Nem jogosult</h4>
				</>
			);
		}
	} else {
		return null;
	}
}

Entitled.propTypes = {
	jogosult: PropTypes.bool,
	hazas: PropTypes.bool,
};
