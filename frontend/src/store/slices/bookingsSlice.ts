import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  id: number;
  date: string;
  startTime: string;
  participants: number;
  activityId: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface BookingsState {
  items: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  items: [],
  loading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings(state, action: PayloadAction<Booking[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBooking(state, action: PayloadAction<Booking>) {
      state.items.push(action.payload);
    },
    updateBooking(state, action: PayloadAction<Booking>) {
      const index = state.items.findIndex(
        (booking) => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeBooking(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (booking) => booking.id !== action.payload
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBookings,
  addBooking,
  updateBooking,
  removeBooking,
  setLoading,
  setError,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
