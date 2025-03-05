// Redux initial State

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
// async function fetchAddress() {
//   // 1 We get the user's geolocation
//   const positionObj = await getPosition();
//   const position = {
//     latitude: positionObj.coords.latitude,
//     longitude: positionObj.coords.longitude,
//   };
//   // 2 Then we use a reverse geocoding API to get descriptions
//   const addressObj = await getAddress(position);
//   const address = `${addressObj?.location} ${addressObj?.city} ${addressObj?.postcode} ${addressObj?.countryName}`;
//   //  3 Then we return an Object with the data
//   return { position, address };
// }

export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    // 1 We get the user's geolocation
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };
    // 2 Then we use a reverse geocoding API to get descriptions
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;
    //  3 Then we return an Object with the data
    return { position, address };
  },
);

const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};
// createSlice Global ui state Toolkit
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.status = "error";
        // state.error = action.error.message;
        state.error =
          "There was a problem getting your address. Make sure to fill this field";
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
