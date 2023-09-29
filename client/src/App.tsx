import { Provider } from "react-redux";
import { store } from "./app/store";
import "./App.css";
import Main from "app/pages/Main";
import SocketProvider from "./app/providers/socket";
import MultiversXProvider from "app/providers/MultiversXProvider";
import Modals from "./app/modals";
import { ToastProvider } from "app/Toast";

const App = () => {
  return (
    <MultiversXProvider>
      {/* <React.StrictMode> */}
      <Provider store={store}>
        <SocketProvider />
        <ToastProvider>
          <Main />
          <Modals></Modals>
        </ToastProvider>
      </Provider>
      {/* </React.StrictMode> */}
    </MultiversXProvider>
  );
};

export default App;
