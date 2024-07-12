/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./state/authSlice";
import { useState } from "react";
import { useRegisterMutation, useLoginMutation, useAddExperienceMutation } from "./state/jobhunterApiSlice";

export function Register() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [data, setData] = useState({
		email: "",
		password: "",
		fullname: "",
		role: false,
		experience: "",
	});
	const [authLogin] = useLoginMutation();
	const [authRegister] = useRegisterMutation();
	const [addExperience] = useAddExperienceMutation();
	const [errors, setErrors] = useState([]);

	async function handleRegistration(e) {
		e.preventDefault();
		const { email, password, fullname, role } = data;
		const newErrors = [];

		if (email === "") {
			newErrors.push("Email megadása kötelező!");
		}

		if (password === "") {
			newErrors.push("Jelsző megadása kötelező!");
		}
		if (fullname === "") {
			newErrors.push("Teljes név megadása kötelező!");
		}

		setErrors(newErrors);

		if (Object.values(newErrors).length > 0) {
			return;
		}
		var roleString = "";
		if (role) {
			roleString = "company";
		} else {
			roleString = "jobseeker";
		}
		try {
			const result = await authRegister({
				email: email,
				password: password,
				fullname: fullname,
				role: roleString,
			}).unwrap();
			const loginResult = await authLogin({
				strategy: "local",
				email: email,
				password,
			}).unwrap();
			dispatch(login({ user: loginResult.user, token: loginResult.accessToken }));
			if (!data.role) {
				const expArray = data.experience.split("\n");
				if (expArray[0].split(";").length > 2) {
					for (let index = 0; index < expArray.length; index++) {
						const element = expArray[index].split(";");
						const expResult = await addExperience({
							company: element[0],
							title: element[1],
							interval: element[2],
						}).unwrap();
					}
				}
			}

			navigate("/", { replace: true });
		} catch (error) {
			setErrors(["Regisztráció sikertelen!"]);
		}
	}
	const handleChange = e => {
		if (e.target.name != "role") {
			setData({
				...data,
				[e.target.name]: e.target.value,
			});
		} else {
			setData({
				...data,
				[e.target.name]: e.target.checked,
			});
		}
	};
	return (
		<>
			<h1 className="text-4xl border-neutral-300 border-y-2 p-4 text-slate-900 font-sans font-semibold">Regisztráció</h1>
			<div className="mx-auto mt-8 w-5/12 flex justify-center	">
				<form onSubmit={handleRegistration}>
					<label className="w-96 font-semibold font-sans text-lg pr-20 mb-2 mr-1" htmlFor="email">
						Email
					</label>
					<input className="h-7 border-neutral-200 border-2 rounded mb-2 ml-6 pr-2" type="text" name="email" id="email" value={data.email} onChange={handleChange}></input>
					<br></br>
					<label className="w-96 font-semibold font-sans text-lg pr-20 mb-2" htmlFor="password">
						Jelszó
					</label>
					<input className="h-7 border-neutral-200 border-2 rounded mb-2 ml-6 pr-2" type="text" name="password" id="password" value={data.password} onChange={handleChange}></input>
					<br></br>
					<label className="w-96 font-semibold font-sans text-lg pr-16 mb-2" htmlFor="fullname">
						Teljes név
					</label>
					<input className="h-7 border-neutral-200 border-2 rounded mb-2 ml-2 pr-2" type="text" name="fullname" id="fullname" value={data.fullname} onChange={handleChange}></input>
					<br></br>
					{!data.role ? (
						<>
							<label className="w-96 font-semibold font-sans text-lg pr-10 mb-2" htmlFor="fullname">
								Tapasztalatok
							</label>
							<textarea className="h-7 border-neutral-200 border-2 rounded mb-2" name="experience" id="experience" value={data.experience} onChange={handleChange}></textarea>
							<br></br>
						</>
					) : (
						<div></div>
					)}
					<label className="w-96 font-semibold font-sans text-lg pr-5 mb-2" htmlFor="role">
						Cégként akar-e regisztrálni?
					</label>
					<input type="checkbox" name="role" id="role" checked={data.role} onChange={handleChange}></input>
					<br></br>
					<button className="h-10 w-40 border-zinc-500 border-4 rounded mb-2 bg-zinc-500 text-gray-50 font-semibold font-sans text-lg" type="submit">
						Regisztráció
					</button>
				</form>
				<br></br>
			</div>
			<div className="mx-auto w-5/12 flex justify-center	">
				<ul>
					{errors.map(error => (
						<li className="font-semibold font-sans text-lg text-red-600" key={error}>
							{error}
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
