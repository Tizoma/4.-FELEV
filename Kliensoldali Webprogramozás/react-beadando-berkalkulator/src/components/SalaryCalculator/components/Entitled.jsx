import PropTypes from "prop-types";

export function Entitled({ hazas, jogosult }) {
	if (hazas) {
		if (jogosult) {
			return (
				<>
					<span className="bg-green-500 mx-1 px-2 py-1 border-2 border-slate-400 rounded-full text-white ">Jogosult</span>
				</>
			);
		} else {
			return (
				<>
					<span className="bg-red-500 mx-1 px-4 py-1 border-2 border-slate-400 rounded-full text-white ">Nem jogosult</span>
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
