import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setDeposit } from "app/store/modal.slice";
import { RootState } from "app/store";
import ChainList from "app/components/ChainList";
import NetworkList from "app/components/NetworkList";
import { ReactComponent as Copy } from "app/assets/svg/Copy.svg";
import { useState } from "react";
import { networks } from "app/config/const";
import { QRCodeSVG } from "qrcode.react";
import { shortenAddress } from "app/utils/util";
import Iconify from "app/components/Iconify";
import { useToast } from "app/Toast";

Modal.setAppElement("body");

const ModalDeposit = () => {
  const dispatch = useDispatch();
  const deposit = useSelector((state: RootState) => state.modal.deposit);
  const toast = useToast();
  const [chain, setChain] = useState("ebone");
  const [network, setNetwork] = useState("mvx");
  const { user } = useSelector((state: RootState) => state.auth);
  const copyStringToClipboard = async () => {
    await navigator.clipboard.writeText(user.wallet[network].address);
    toast.info("Copied!");
  };
  const onSetChain = (newchain: string) => {
    if (newchain != chain) {
      setNetwork(networks[newchain as TCoin][0]);
      setChain(newchain);
    }
  };

  return (
    <Modal
      id="Deposit"
      isOpen={deposit}
      onRequestClose={() => dispatch(setDeposit(false))}
      className="modal-fade modal-content text-sm md:text-base"
      overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      contentLabel="Deposit"
    >
      {user.wallet && (
        <>
          <div className="flex items-end justify-between mb-2">
            <p>Deposit Currency</p>
            <button
              onClick={() => {
                dispatch(setDeposit(false));
              }}
            >
              <Iconify
                icon="uiw:close"
                className={"w-6 h-6 cursor-pointer"}
              ></Iconify>
            </button>
          </div>
          <ChainList chain={chain} setChain={onSetChain} swap={false} />
          <p className="my-2">Choose Network</p>
          <NetworkList
            chain={chain}
            network={network}
            setNetwork={setNetwork}
          />
          <div className="border border-border text-center w-full my-2 rounded-xl">
            <p className="my-2">Deposit Address</p>
            <QRCodeSVG
              width={180}
              height={180}
              className="p-2 mx-auto bg-white"
              value={user.wallet[network].address}
            />
            <p className="truncate p-2">
              {shortenAddress(user.wallet[network].address)}
            </p>
            <button
              className="my-2 border border-[#3CE5B5] rounded-xl p-3 flex items-center mx-auto text-[#3CE5B5]"
              onClick={copyStringToClipboard}
            >
              Copy
              <Copy className="ml-1" />
            </button>
          </div>
          <p className="text-sm">
            <span className="text-white">Notice:</span> Send only{" "}
            {chain.toUpperCase()} to this deposit address. Coins will be
            deposited automatically after 6 network confirmations
          </p>
        </>
      )}
    </Modal>
  );
};

export default ModalDeposit;
