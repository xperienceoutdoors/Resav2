import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Activity, TagTypes } from '../types/api';

export const activitiesApi = createApi({
  reducerPath: 'activitiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/activities`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Activity'] as const,
  endpoints: (builder) => ({
    getActivities: builder.query<Activity[], void>({
      query: () => '',
      providesTags: [{ type: 'Activity', id: 'LIST' }],
    }),
    getActivity: builder.query<Activity, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Activity' as const, id }],
    }),
    createActivity: builder.mutation<Activity, Partial<Activity>>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Activity', id: 'LIST' }],
    }),
    updateActivity: builder.mutation<Activity, { id: string; body: Partial<Activity> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Activity' as const, id }],
    }),
    deleteActivity: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Activity', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = activitiesApi;
