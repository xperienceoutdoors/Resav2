import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Activity {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

interface ActivitiesState {
  items: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  items: [],
  loading: false,
  error: null,
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setActivities(state, action: PayloadAction<Activity[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addActivity(state, action: PayloadAction<Activity>) {
      state.items.push(action.payload);
    },
    updateActivity(state, action: PayloadAction<Activity>) {
      const index = state.items.findIndex(
        (activity) => activity.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeActivity(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (activity) => activity.id !== action.payload
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
  setActivities,
  addActivity,
  updateActivity,
  removeActivity,
  setLoading,
  setError,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;
