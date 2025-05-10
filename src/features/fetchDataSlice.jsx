import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchApi = createAsyncThunk("weatherApi/fetchData", async ({ city, lang }) => {
  const API_Key = "72b809e0a5c9a17ce77e727b3951d8b2";
  const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric&lang=${lang}`);
  localStorage.setItem("City", JSON.stringify(city));
  localStorage.setItem("Language", JSON.stringify(lang));
  return await res.data;
});

const FetchDataSlice = createSlice({
  name: "weatherApi",
  initialState: {
    loading: false,
    data: [],
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApi.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchApi.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default FetchDataSlice.reducer;
