import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setSwap } from "app/store/modal.slice";
import { RootState } from "app/store";
import { useState, useEffect } from "react";
import ChainList from "app/components/ChainList";
import NumberInput from "app/components/NumberInput";
import axios from "axios";
import Iconify from "app/components/Iconify";
import { setBalance } from "app/store/auth.slice";
import { useToast } from "app/Toast";

let prices: any;
Modal.setAppElement("body");

const ModalSwap = () => {
  const dispatch = useDispatch();
  const swap = useSelector((state: RootState) => state.modal.swap);
  const toast = useToast();
  const [src, setSrc] = useState("egld");
  const [dest, setDest] = useState("ebone");
  const { user } = useSelector((state: RootState) => state.auth);
  const rate = (dest: any) => {
    return dest === "ebone" ? 1 : 0.99;
  };
  const convert = (src: any, dest: any) => {
    setTo(
      ((prices[src] * Number(from) * rate(dest)) / prices[dest]).toFixed(3)
    );
  };

  const [from, setfrom] = useState("1.000");
  const [to, setTo] = useState("1.000");

  useEffect(() => {
    axios.get("https://billing.ddog.club/prices").then((res) => {
      prices = res.data;
      convert(src, dest);
    });
    return () => {};
  }, []);

  const onSwap = async () => {
    if (Number(from) === 0) toast.warning("Input correct swap amount.");
    if (Number(from) > user.balance[src as TCoin])
      toast.warning("You have insufficient amount to swap.");
    if (Number(from) > 0 && user.balance[src as TCoin] >= Number(from)) {
      let { amount, result } = (
        await axios.post("https://billing.ddog.club/swap", {
          address: user.address,
          name: user.name,
          from: src,
          to: dest,
          amount: Number(from),
        })
      ).data;
      dispatch(setBalance({ chain: src, amount: -Number(from) }));
      dispatch(setBalance({ chain: dest, amount: amount }));
      console.log(amount, result);
    }
  };

  return (
    <Modal
      id="Swap"
      isOpen={swap}
      onRequestClose={() => {
        dispatch(setSwap(false));
      }}
      className="modal-fade modal-content text-sm md:text-base"
      overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      contentLabel="Deposit"
    >
      <p className="flex justify-between my-2">
        <p>Swap from</p>
        <p
          className="cursor-pointer hover:underline hover:text-[#0f0]"
          onClick={() => {
            setfrom(user.balance[src as TCoin].toFixed(3));
            setTo(
              (
                (prices[src] * user.balance[src as TCoin] * rate(dest)) /
                prices[dest]
              ).toFixed(3)
            );
          }}
        >{`Avaliable: ${user.balance[src as TCoin]}`}</p>
      </p>
      <div className="relative">
        <NumberInput
          onChange={(e: any) => setfrom(e)}
          onBlur={() => {
            setfrom(Number(from).toFixed(3));
            convert(src, dest);
          }}
          value={from}
          fixed={8}
          className="w-full h-full bg-back py-4 px-4 m-rounded text-[white] transition duration-300 outline-none"
        />
        <div className="absolute right-1 top-[5px]">
          <ChainList
            chain={src}
            setChain={(e: any) => {
              setSrc(e);
              convert(e, dest);
            }}
            swap={true}
            except={dest}
          />
        </div>
      </div>
      <div className="relative flex my-2 justify-center">
        <p className="absolute left-0 bottom-0">Swap to</p>
        <button
          className=""
          onClick={() => {
            convert(dest, src);
            setSrc(dest);
            setDest(src);
          }}
        >
          <Iconify icon={"ri:swap-line"} className="w-8 h-8" />
        </button>
      </div>
      <div className="relative">
        <NumberInput
          onChange={(e: any) => setTo(e)}
          onBlur={() => {
            setTo(Number(to).toFixed(3));
            setfrom(
              ((prices[dest] * Number(to)) / rate(dest) / prices[src]).toFixed(
                8
              )
            );
          }}
          value={to}
          fixed={8}
          className="w-full h-full bg-back py-4 px-4 m-rounded text-[white] transition duration-300 outline-none"
        />
        <div className="absolute right-1 top-[5px]">
          <ChainList
            chain={dest}
            setChain={(e: any) => {
              setDest(e);
              convert(src, e);
            }}
            swap={true}
            except={src}
          />
        </div>
      </div>
      {prices && (
        <p className="my-2 uppercase">{`1 ${src} = ${(
          prices[src] / prices[dest]
        ).toFixed(3)} ${dest}`}</p>
      )}
      <div className="flex justify-between my-2">
        <p>Swap fee:</p>
        <p className="uppercase">{`${(Number(from) * (1 - rate(dest))).toFixed(
          8
        )} ${src}`}</p>
      </div>
      <button
        className="my-2 border border-[#3CE5B5] rounded-xl p-3 flex items-center mx-auto text-[#3CE5B5]"
        onClick={onSwap}
      >
        Swap
      </button>
    </Modal>
  );
};

export default ModalSwap;
