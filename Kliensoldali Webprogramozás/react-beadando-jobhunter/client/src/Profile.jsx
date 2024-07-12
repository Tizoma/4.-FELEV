/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { useGetExperiencesQuery } from "./state/jobhunterApiSlice";
import { getLoggedInUser } from "./state/authSlice";
import { useEffect } from "react";

export function Profile() {
	const loggedInUser = useSelector(getLoggedInUser);
	const { data, error, isLoading } = useGetExperiencesQuery();
	if (loggedInUser.role === "jobseeker") {
		return (
			<>
				<h1 className="text-4xl border-neutral-300 border-y-2 p-4 text-slate-900 font-sans font-semibold">Profilom</h1>
				<div className="mx-auto my-8 w-5/12">
					<h2 className="w-96 font-semibold font-sans text-3xl">Személyes adatok</h2>
					<div className="w-80 text-neutral-400 font-sans">Adataid és tapasztalataid egy helyen</div>
					<div className="flex justify-stretch mt-4 py-2 border-b-2 border-neutral-100">
						<div className="w-80 text-neutral-600 font-sans">Név</div>
						<div className="w-80 font-semibold font-sans">{loggedInUser.fullname}</div>
					</div>
					<div className="flex justify-stretch py-2 border-b-2 border-neutral-100">
						<div className="w-80 text-neutral-600 font-sans">Email</div>
						<div className="w-80 font-semibold font-sans">{loggedInUser.email}</div>
					</div>
					<div className="flex justify-stretch py-2 border-b-2 border-neutral-100">
						<div className="w-80 text-neutral-600 font-sans">Státusz</div>
						<div className="w-80 font-semibold font-sans">Munkakereső</div>
					</div>
					<h3 className="w-96 font-semibold font-sans text-2xl my-4">Korábbi tapasztalatok</h3>
					{!isLoading ? (
						data.data.map(experience =>
							experience.userId === loggedInUser.id ? (
								<>
									<div key={experience.id} className="flex justify-stretch py-2 border-b-2 border-neutral-100">
										<div className="w-80 text-neutral-600 font-sans">{experience.company}</div>
										<div className="w-80 font-semibold font-sans">
											{experience.interval} {experience.title}
										</div>
									</div>
								</>
							) : (
								<div key={experience.id}></div>
							)
						)
					) : (
						<div></div>
					)}
				</div>
			</>
		);
	} else {
		return (
			<>
				<h1 className="text-4xl border-neutral-300 border-y-2 p-4 text-slate-900 font-sans font-semibold">Profilom</h1>
			</>
		);
	}
}
