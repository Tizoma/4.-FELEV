import { useEffect, useState } from "react";
import { InputField } from "./components/InputField";
import { NewlyWeds } from "./components/NewlyWeds";
import { Entitled } from "./components/Entitled";
import { InputBeneficiary } from "./components/InputBeneficiary";

export default function SalaryCalculator() {
	const [name, setName] = useState("Családtag 1");
	const [brutto, setBrutto] = useState("");
	const [netto, setNetto] = useState(0);
	const [szja, setSzja] = useState(false);
	const [szemelyi, setSzemelyi] = useState(false);
	const [csaladi, setCsaladi] = useState(false);
	const [hazas, setHazas] = useState(false);
	const [datum, setDatum] = useState();
	const [eltartott, setEltartott] = useState(0);
	const [kedvezmenyezett, setKedvezmenyezett] = useState(0);

	useEffect(() => {
		if (brutto != null) {
			let levonas = 0;
			levonas += brutto * 0.185;
			//Szja mentesség
			if (szja && brutto > 499952) {
				levonas += (brutto - 499952) * 0.15;
			} else if (!szja) {
				levonas += brutto * 0.15;
			}
			//Személyi
			if (szemelyi) {
				if (levonas >= 77300) {
					levonas -= 77300;
				}
			}
			//Házas
			if (datum > new Date().setFullYear(new Date().getFullYear() - 2)) {
				levonas -= 5000;
			}
			//Családi
			if (kedvezmenyezett == 1) {
				levonas -= eltartott * 10000;
			} else if (kedvezmenyezett == 2) {
				levonas -= eltartott * 20000;
			} else if (kedvezmenyezett == 3) {
				levonas -= eltartott * 33000;
			}
			if (levonas > 0) {
				setNetto(brutto - levonas);
			} else {
				setNetto(brutto);
			}
		}
	}, [szja, brutto, szemelyi, datum, eltartott, kedvezmenyezett]);
	function handleSzja(c) {
		setSzja(c);
	}
	function handleSzemelyi(c) {
		setSzemelyi(c);
	}
	function handleCsaladi(c) {
		setCsaladi(c);
	}
	function handleHazas(c) {
		setHazas(c, 1);
	}

	function handleDatum(d) {
		setDatum(new Date(d));
	}

	function handleEltartott(e) {
		if (e == "-" && eltartott != 0) {
			setEltartott(eltartott - 1);
		}
		if (e == "+") {
			setEltartott(eltartott + 1);
		}
	}

	function handleKedvezmenyezett(k) {
		if (k == "-" && kedvezmenyezett != 0) {
			setKedvezmenyezett(kedvezmenyezett - 1);
		}
		if (k == "+" && kedvezmenyezett < eltartott && kedvezmenyezett < 3) {
			setKedvezmenyezett(kedvezmenyezett + 1);
		}
	}

	function handleNumeric(e) {
		const re = /^[0-9\b]+$/;
		if (e === "" || re.test(e)) {
			setBrutto(e);
		} else {
			setBrutto("");
		}
	}

	return (
		<>
			<div className="ui left aligned container">
				<h2 className="ui header">{name} bérének kiszámítása</h2>
				<form>
					<div className="ui hidden divider"></div>
					<InputField header="Családtag neve" type="text" name="name" placeHolder="Név" label="Add meg a családtag nevét" value={name} setter={setName} />
					<div className="ui hidden divider"></div>
					<InputField header="Bruttó bér" type="text" name="salary" placeHolder="Bruttó bér" label="Add meg a bruttó béredet!" value={brutto} setter={handleNumeric} />
					<div className="ui hidden divider"></div>
					<div className="ui toggle checkbox">
						<input type="checkbox" name="szja" checked={szja} onChange={e => handleSzja(e.target.checked)}></input>
						<label>25 év alattiak SZJA mentessége</label>
					</div>
					<div className="ui hidden divider"></div>
					<div className="ui toggle checkbox">
						<input type="checkbox" name="szja" checked={hazas} onChange={e => handleHazas(e.target.checked)}></input>
						<label>Friss házasok kedvezménye </label>
					</div>
					<NewlyWeds hazas={hazas} handler={handleDatum} />
					<Entitled hazas={hazas} jogosult={datum > new Date().setFullYear(new Date().getFullYear() - 2)} />
					<div className="ui hidden divider"></div>
					<div className="ui toggle checkbox">
						<input type="checkbox" name="szja" checked={szemelyi} onChange={e => handleSzemelyi(e.target.checked)}></input>
						<label>Személyi adókedvezmény</label>
					</div>
					<div className="ui hidden divider"></div>
					<div className="ui toggle checkbox">
						<input type="checkbox" name="csaladi" checked={csaladi} onChange={e => handleCsaladi(e.target.checked)}></input>
						<label>Családi kedvezmény</label>
					</div>
					<div className="ui hidden divider"></div>
					<InputBeneficiary csaladi={csaladi} eltartott={eltartott} handleEltartott={handleEltartott} kedvezmenyezett={kedvezmenyezett} handleKedvezmenyezett={handleKedvezmenyezett} />
				</form>
				<h3 className="ui header">Számított nettó bér</h3>
				<h3 className="ui header">{netto} Ft</h3>
			</div>
		</>
	);
}
