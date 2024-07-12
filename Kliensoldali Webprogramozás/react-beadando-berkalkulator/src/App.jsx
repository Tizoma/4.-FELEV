import HouseholdSalaryCalculator from "./components/HouseholdSalaryCalculator";

function App() {
	return (
		<div className="w-7/12 h-max m-auto bg-slate-200 p-6 border-8 rounded-lg border-slate-400 shadow-lg">
			<h1 className="font-black">Bérkalkulátor alkalmazás</h1>
			<HouseholdSalaryCalculator />
		</div>
	);
}

export default App;
