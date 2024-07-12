import PropTypes from "prop-types";

export function InputBeneficiary({ csaladi, eltartott, handleEltartott, kedvezmenyezett, handleKedvezmenyezett }) {
	if (csaladi) {
		return (
			<>
				<button className="bg-slate-50 mx-1 px-2 border-2 border-slate-500 rounded-full " type="button" id="-" onClick={e => handleEltartott(e.target.id)}>
					-
				</button>
				<span>{eltartott}</span>
				<button className="bg-slate-50 mx-1 px-2 border-2 border-slate-500 rounded-full " type="button" id="+" onClick={e => handleEltartott(e.target.id)}>
					+
				</button>
				<span className="mx-1">Eltartott, ebből kedvezményezett:</span>
				<button className="bg-slate-50 mx-1 px-2 border-2 border-slate-500 rounded-full " type="button" id="-" onClick={e => handleKedvezmenyezett(e.target.id)}>
					-
				</button>
				<span>{kedvezmenyezett}</span>
				<button className="bg-slate-50 mx-1 px-2 border-2 border-slate-500 rounded-full " type="button" id="+" onClick={e => handleKedvezmenyezett(e.target.id)}>
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
