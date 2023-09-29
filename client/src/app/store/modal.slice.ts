import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  profile: boolean;
  walletConnect: boolean;
  selchain: boolean;
  setting: boolean;
  menu: boolean;
  chain: TCoin;
  chat: boolean;
  screenshot: boolean;
  deposit: boolean;
  withdraw: boolean;
  swap: boolean;
}

const initialState: ModalState = {
  profile: false,
  walletConnect: false,
  selchain: false,
  setting: false,
  menu: false,
  chain: "ebone",
  chat: false,
  screenshot: false,
  deposit: false,
  withdraw: false,
  swap: false,
};

export const slice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setWalletConnect: (state, action) => {
      state.walletConnect = action.payload;
    },
    setSelChain: (state, action) => {
      state.selchain = action.payload;
    },
    setSetting: (state, action) => {
      state.setting = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setChain: (state, action) => {
      state.chain = action.payload;
    },
    setScreenshot: (state, action) => {
      state.screenshot = action.payload;
    },
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setDeposit: (state, action) => {
      state.deposit = action.payload;
    },
    setWithdraw: (state, action) => {
      state.withdraw = action.payload;
    },
    setSwap: (state, action) => {
      state.swap = action.payload;
    },
  },
});

export const {
  setProfile,
  setWalletConnect,
  setMenu,
  setSelChain,
  setSetting,
  // setLogin,
  setChain,
  setScreenshot,
  setChat,
  setDeposit,
  setWithdraw,
  setSwap,
} = slice.actions;

export default slice.reducer;
