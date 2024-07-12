import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./state/authSlice";
import { useState } from "react";
import { useLoginMutation } from "./state/jobhunterApiSlice";

// eslint-disable-next-line react/prop-types
export function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [data, setData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState([]);
	const [authLogin] = useLoginMutation();

	const handleChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	async function handleLogin(e) {
		e.preventDefault();
		const { email, password } = data;
		const newErrors = [];

		if (email === "") {
			newErrors.push("Email megadása kötelező!");
		}

		if (password === "") {
			newErrors.push("Jelsző megadása kötelező!");
		}

		setErrors(newErrors);

		if (Object.values(newErrors).length > 0) {
			return;
		}

		try {
			const result = await authLogin({
				strategy: "local",
				email: email,
				password,
			}).unwrap();
			dispatch(login({ user: result.user, token: result.accessToken }));
			navigate("/", { replace: true });
		} catch (error) {
			setErrors(["Email cím / jelsző rossz!"]);
		}
	}
	return (
		<>
			<h1 className="text-4xl border-neutral-300 border-y-2 p-4 text-slate-900 font-sans font-semibold">Bejelentkezés</h1>
			<div className="mx-auto mt-8 w-5/12 flex justify-center	">
				<form onSubmit={handleLogin}>
					<label className="w-96 font-semibold font-sans text-lg pr-5 mb-2" htmlFor="email">
						Email
					</label>
					<input className="h-7 border-neutral-200 border-2 rounded mb-2" type="text" name="email" id="email" value={data.email} onChange={handleChange}></input>
					<br></br>
					<label className="w-96 font-semibold font-sans text-lg pr-4 mb-2" htmlFor="password">
						Jelszó
					</label>
					<input className="h-7 border-neutral-200 border-2 rounded mb-2" type="text" name="password" id="password" value={data.password} onChange={handleChange}></input>
					<br></br>
					<button className="h-10 w-40 border-zinc-500 border-4 rounded mb-2 bg-zinc-500 text-gray-50 font-semibold font-sans text-lg" type="submit">
						Bejelentkezés
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
