import FamilyMemberTabs from "./FamilyMemberTabs/FamilyMemberTabs";
import HouseholdSummary from "./HouseholdSummary/HouseholdSummary";
import SalaryCalculator from "./SalaryCalculator/SalaryCalculator";

export default function HouseholdSalaryCalculator() {
	return (
		<>
			<header>
				<FamilyMemberTabs />
			</header>
			<main>
				<SalaryCalculator />
				<HouseholdSummary />
			</main>
		</>
	);
}
