import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { socketEvents } from "../providers/socket";
import axios from "axios";

const { ApiNetworkProvider } = require("@multiversx/sdk-network-providers");
const apiNetworkProvider = new ApiNetworkProvider(
  "https://devnet-api.multiversx.com"
);

interface IState {
  token: string;
  user: {
    address: string;
    name: string;
    avatar: string;
    balance: Record<TCoin, number>;
    wallet: any;
  };
  nfts: any[];
}

const initialState: IState = {
  token: "",
  user: {
    address: "",
    name: "",
    avatar: "",
    balance: {
      btc: 0,
      eth: 0,
      ltc: 0,
      egld: 0,
      kas: 0,
      erg: 0,
      xrp: 0,
      bnb: 0,
      usdc: 0,
      usdt: 0,
      matic: 0,
      ada: 0,
      sol: 0,
      ebone: 0,
      betabone: 0,
    },
    wallet: null,
  },
  nfts: [],
};

export const getNfts = createAsyncThunk("getNfts", async (address: string) => {
  const data = await apiNetworkProvider.doGetGeneric(
    `accounts/${address}/nfts`
  );
  return data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogout: (state) => {
      state.token = initialState.token;
      state.user = initialState.user;
    },
    setAuth: (state, action: PayloadAction<IState>) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        axios.defaults.headers.common["x-auth-token"] = action.payload.token;
        socketEvents.emitAuth({ auth: state });
      }
    },
    setBalance: (state, action: PayloadAction<any>) => {
      let chain: TCoin = action.payload.chain;
      state.user.balance[chain] += action.payload.amount;
      state.user.balance[chain] = Number(state.user.balance[chain].toFixed(8));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNfts.pending, (state, action) => {});
    builder.addCase(getNfts.fulfilled, (state, action: any) => {
      state.nfts = action.payload.map((item: any) => {
        return { name: item.identifier, url: item.url };
      });
    });
    builder.addCase(getNfts.rejected, (state, action) => {});
  },
});

export const { setAuth, setLogout, setBalance } = authSlice.actions;

export default authSlice.reducer;
