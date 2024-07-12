import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3030";

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

export const jobhunterApiSlice = createApi({
	reducerPath: "jobhunterApi",
	baseQuery,
	endpoints: builder => ({
		getJobs: builder.query({
			query: () => ({
				url: "jobs",
			}),
		}),
		register: builder.mutation({
			query: body => ({
				url: "users",
				method: "POST",
				body,
			}),
		}),
		login: builder.mutation({
			query: body => ({
				url: "authentication",
				method: "POST",
				body,
			}),
		}),
		getExperiences: builder.query({
			query: () => ({
				url: "experiences",
				method: "GET",
			}),
		}),
		addExperience: builder.mutation({
			query: body => ({
				url: "experiences",
				method: "POST",
				body,
			}),
		}),
	}),
});

//Reducer
export const jobhunterApiReducer = jobhunterApiSlice.reducer;

//Hooks
export const { useGetJobsQuery, useLoginMutation, useGetExperiencesQuery, useRegisterMutation, useAddExperienceMutation } = jobhunterApiSlice;
