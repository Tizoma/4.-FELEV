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
			//TB
			levonas += brutto * 0.185;
			//Szja mentesség
			if (szja && brutto > 499952) {
				levonas += (brutto - 499952) * 0.15;
			} else if (!szja) {
				levonas += brutto * 0.15;
			}
			//Személyi
			if (szemelyi) {
				levonas -= 77300;
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
			} else if (brutto == "" || brutto == 0) {
				setNetto(0);
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

	function handleGombok(g) {
		console.log(g);
		switch (g) {
			case "-5":
				setBrutto(brutto * 0.95);
				break;
			case "-1":
				setBrutto(brutto * 0.99);
				break;
			case "+1":
				setBrutto(brutto * 1.01);
				break;
			case "+5":
				setBrutto(brutto * 1.05);
				break;
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
			<div>
				<h2 className="uppercase font-black">{name} bérének kiszámítása</h2>
				<form>
					<InputField header="Családtag neve" type="text" name="name" placeHolder="Név" label="Add meg a családtag nevét" value={name} setter={setName} />
					<InputField header="Bruttó bér" type="text" name="salary" placeHolder="Bruttó bér" label="Add meg a bruttó béredet!" value={brutto} setter={handleNumeric} />
					<div className="my-4">
						<button type="button" className="bg-slate-600 mx-1 p-4 border-2 border-slate-600 rounded-2xl text-white font-semibold" id="-5" onClick={e => handleGombok(e.target.id)}>
							-5%
						</button>
						<button type="button" className="bg-slate-600 mx-1 p-4 border-2 border-slate-600 rounded-2xl text-white font-semibold" id="-1" onClick={e => handleGombok(e.target.id)}>
							-1%
						</button>
						<button type="button" className="bg-slate-600 mx-1 p-4 border-2 border-slate-600 rounded-2xl text-white font-semibold" id="+1" onClick={e => handleGombok(e.target.id)}>
							+1%
						</button>
						<button type="button" className="bg-slate-600 mx-1 p-4 border-2 border-slate-600 rounded-2xl text-white font-semibold" id="+5" onClick={e => handleGombok(e.target.id)}>
							+5%
						</button>
					</div>
					<div className="my-0.5">
						<div className="ui toggle checkbox">
							<input type="checkbox" name="szja" checked={szja} onChange={e => handleSzja(e.target.checked)}></input>
							<label>25 év alattiak SZJA mentessége</label>
						</div>
					</div>
					<br></br>
					<div className="my-0.5">
						<div className="ui toggle checkbox ">
							<input type="checkbox" name="szja" checked={hazas} onChange={e => handleHazas(e.target.checked)}></input>
							<label className="mr-2">Friss házasok kedvezménye </label>
						</div>

						<NewlyWeds hazas={hazas} handler={handleDatum} />
						<Entitled hazas={hazas} jogosult={datum > new Date().setFullYear(new Date().getFullYear() - 2)} />
					</div>
					<br></br>
					<div className="my-0.5">
						<div className="ui toggle checkbox ">
							<input type="checkbox" name="szja" checked={szemelyi} onChange={e => handleSzemelyi(e.target.checked)}></input>
							<label>Személyi adókedvezmény</label>
						</div>
					</div>
					<br></br>
					<div className="my-0.5">
						<div className="ui toggle checkbox">
							<input type="checkbox" name="csaladi" checked={csaladi} onChange={e => handleCsaladi(e.target.checked)}></input>
							<label>Családi kedvezmény</label>
						</div>
					</div>
					<br></br>
					<div className="my-0.5">
						<InputBeneficiary csaladi={csaladi} eltartott={eltartott} handleEltartott={handleEltartott} kedvezmenyezett={kedvezmenyezett} handleKedvezmenyezett={handleKedvezmenyezett} />
					</div>
				</form>
				<p className="font-bold text-xl md-4">Számított nettó bér:</p>
				<span className="bg-slate-600 mx-1 p-4 border-2 border-slate-600 rounded-2xl text-white font-semibold">{netto} Ft</span>
			</div>
		</>
	);
}
