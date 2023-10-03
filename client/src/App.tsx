import { Provider } from "react-redux";
import { store } from "app/store";
import SocketProvider from "app/providers/socket";
import MultiversXProvider from "app/providers/MultiversXProvider";
import { ToastProvider } from "app/Toast";
import Main from "app/pages/Main";
import Modals from "app/modals";
import "App.css";

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
