import ModalProfile from "./ModalProfile";
import ModalWalletConnect from "./ModalWalletConnect";
import ModalScreenshot from "./ModalScreenshot";
import ModalSetting from "./ModalSetting";
import ModalSelChain from "./ModalSelChain";
import ModalWithdraw from "./ModalWithdraw";
import ModalDeposit from "./ModalDeposit";
import ModalSwap from "./ModalSwap";

const Modals = () => {
  return (
    <>
      <ModalSelChain />
      <ModalSetting />
      <ModalDeposit />
      <ModalWithdraw />
      <ModalSwap />
      <ModalProfile />
      <ModalWalletConnect />
      <ModalScreenshot />
    </>
  );
};

export default Modals;
