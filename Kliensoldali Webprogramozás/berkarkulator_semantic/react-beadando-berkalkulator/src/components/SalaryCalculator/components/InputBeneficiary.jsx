import PropTypes from "prop-types";

export function InputBeneficiary({ csaladi, eltartott, handleEltartott, kedvezmenyezett, handleKedvezmenyezett }) {
	if (csaladi) {
		return (
			<>
				<button type="button" id="-" onClick={e => handleEltartott(e.target.id)}>
					-
				</button>
				<span>{eltartott}</span>
				<button type="button" id="+" onClick={e => handleEltartott(e.target.id)}>
					+
				</button>
				<span>Eltartott, ebből kedvezményezett:</span>
				<button type="button" id="-" onClick={e => handleKedvezmenyezett(e.target.id)}>
					-
				</button>
				<span>{kedvezmenyezett}</span>
				<button type="button" id="+" onClick={e => handleKedvezmenyezett(e.target.id)}>
					+
				</button>
			</>
		);
	} else {
		return null;
	}
}

InputBeneficiary.propTypes = {
	csaladi: PropTypes.bool,
	eltartott: PropTypes.number,
	handleEltartott: PropTypes.func,
	kedvezmenyezett: PropTypes.number,
	handleKedvezmenyezett: PropTypes.func,
};
