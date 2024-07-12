/* eslint-disable no-unused-vars */
import { useGetJobsQuery } from "./state/jobhunterApiSlice";

export function Home() {
	const { data, error, isLoading } = useGetJobsQuery();
	function handleSearch(e) {
		e.preventDefault();
	}
	return (
		<>
			<h1 className="text-4xl border-neutral-300 border-y-2 p-4 text-slate-900 font-sans font-semibold">Főoldal</h1>
			<div className="mx-auto my-8 w-5/12">
				<h2 className="text-xl">Böngéssz az állások között</h2>
				<form onSubmit={e => handleSearch(e)}>
					<input className="w-96 h-10 border-neutral-200 border-2 rounded" type="text" id="search" name="search" label="search" />
					<button className="text-lg m-2" type="submit">
						Keresés
					</button>
				</form>
				<div className="text-neutral-400 mt-4 pb-4 border-b-2 border-neutral-200">Állás neve</div>
				{!isLoading ? (
					data.data.map(job => (
						<div key={job.id}>
							<div className="flex justify-between pt-2">
								<div className="w-96 font-semibold font-sans">{job.position}</div>
								<div className="w-52 font-semibold font-sans text-right">
									{job.salaryFrom} - {job.salaryTo} Ft
								</div>
							</div>
							<div className="flex justify-between  pb-4 border-b-2 border-neutral-200">
								<div className="w-52 text-neutral-400 font-sans">{job.city}</div>
								<div className="w-52 text-neutral-400 font-sans text-right">{job.type}</div>
							</div>
						</div>
					))
				) : (
					<div></div>
				)}
			</div>
		</>
	);
}
