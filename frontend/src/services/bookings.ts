import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Booking } from '../types/api';

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/bookings`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Booking'] as const,
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => '',
      providesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking' as const, id }],
    }),
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
    updateBooking: builder.mutation<Booking, { id: string; body: Partial<Booking> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Booking' as const, id }],
    }),
    cancelBooking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Booking' as const, id }],
    }),
    getBookingsByDate: builder.query<Booking[], string>({
      query: (date) => `/date/${date}`,
      providesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useGetBookingsByDateQuery,
} = bookingsApi;
