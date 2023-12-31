import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Iconify from "./Iconify";
import { coinSVG, coins } from "app/config/const";
import { setChain, setSelChain } from "app/store/modal.slice";
import { RootState } from "app/store";

export default function Dropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const chain: TCoin = useSelector((state: RootState) => state.modal.chain);
  const MainCoin = coinSVG[chain];

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <div onClick={toggleDropdown}>
        <div className="flex justify-between items-center md:border border-border rounded-xl md:p-4 gap-2 text-base cursor-pointer">
          <div className="flex items-center gap-2">
            <MainCoin className="w-0 h-6 md:w-6"/>
            <div className="hidden md:flex gap-1">
              {auth.user.balance[chain].toFixed(3)}{" "}
              <div className="uppercase">{chain}</div>
            </div>
          </div>
          <Iconify
            icon={"material-symbols:keyboard-arrow-down-rounded"}
            className={"w-5 h-5 text-white hidden md:block"}
          />
        </div>
      </div>
      {isOpen && (
        <div
          className={`hidden absolute md:top-[110%] md:left-0 bg-border rounded-md z-30 py-2 shadow-md anim-dropdown gap-2 md:flex flex-col right-[-65px]`}
        >
          <div className="flex items-center gap-2 px-2 py-1">
            <img
              alt="avatar"
              src={auth.user.avatar}
              className="w-6 h-6 rounded-full border border-secondary"
            />
            <div className="text-indigo">{auth.user.name}</div>
          </div>
          <div className="border-t border-indigo/10 mx-2"></div>
          <div className="overflow-y-auto mx-2">
            {coins.map((currency: string) => {
              //h-[160px]
              const CoinIcon = coinSVG[currency];
              return currency === chain ? (
                <div key={currency}></div>
              ) : (
                <div
                  key={currency}
                  className="flex py-3 gap-2 text-xs items-center cursor-pointer hover:bg-indigo/5"
                  onClick={() => {
                    setIsOpen(false);
                    dispatch(setChain(currency));
                  }}
                >
                  <CoinIcon className="w-6 h-6"/>
                  <div>{auth.user.balance[currency as TCoin].toFixed(3)}</div>
                  <div className="uppercase">{currency}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-center items-center md:hidden border-border p-3 md:p-4 gap-2 text-base cursor-pointer">
        <MainCoin
          className="w-6 h-6 md:w-0"
          onClick={() => dispatch(setSelChain(true))}
        ></MainCoin>
      </div>
    </div>
  );
}
