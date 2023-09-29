import { useContext, useState } from "react";
import Modal from "react-modal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile, setWalletConnect } from "app/store/modal.slice";
import { useGetAccountInfo, useGetIsLoggedIn } from "app/hooks/sdkDappHooks";
import Iconify from "app/components/Iconify";
import { logout } from "app/hooks/sdkDappHooks";
import { initAvatar } from "app/config/const";
import { ToastrContext } from "app/providers/ToastrProvider";
import axios from "app/components/axios";
import { getNfts, setAuth } from "app/store/auth.slice";
import { getmybet } from "app/store/crash.slice";
import { AppDispatch, RootState } from "app/store";

Modal.setAppElement("body");

const ModalProfile = () => {
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(initAvatar);
  const notify = useContext(ToastrContext);
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.profile);
  const account = useGetAccountInfo();
  const auth = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(auth.user.name);
      setAvatar(auth.user.avatar);
      dispatch(getNfts(auth.user.address));
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (name && error === "name") setError("");
    return () => {};
  }, [name]);

  const handleSave = async () => {
    if (!name) {
      setError("name");
      return notify.error("Username required!");
    }
    if (!avatar) return notify.error("Please select your Avatar!");
    try {
      const result = await axios.post(
        "https://billing.ddog.club/auth/profile",
        {
          address: account.address,
          name,
          avatar,
        }
      );
      if (result && result.status === 200) {
        dispatch(setAuth({ ...result.data, token: "", nfts: [] }));
        notify.success("Successfully Changed!");
        dispatch(setProfile(false));
      }
    } catch (errors: any) {
      console.log(errors);
      if (errors.response.status === 400)
        notify.error(errors.response.data.errors[0].msg);
      else notify.error("Server Error!");
    }
  };
  return (
    <Modal
      id="modalAuth"
      isOpen={isOpen}
      onRequestClose={() => dispatch(setProfile(false))}
      className="modal-fade modal-content text-sm md:text-base"
      overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      contentLabel="Sign Up"
    >
      <div className="flex justify-between items-start">
        <h1 className="text-xl md:text-4xl text-white mt-3 font-semibold">
          My Profile
        </h1>
      </div>
      <div>
        <input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
          className={`mt-5 p-2.5 md:p-3 rounded-md bg-transparent outline-none text-bright border-border border w-full placeholder:text-secondary focus:border-indigo anim ${
            error === "name" && "border-tomato"
          }`}
          placeholder="Username"
        />
        <div className="mt-5 flex items-center justify-center">
          <img
            alt="avatar"
            src={avatar}
            className="w-24 h-24 md:w-32 md:h-32 mx-auto  border border-border rounded-full block"
          />
        </div>
        <div className="w-full py-3 flex overflow-auto">
          <img
            src={initAvatar}
            className="w-full border rounded-full cursor-pointer min-w-[80px] w-20 mx-2"
            onClick={() => setAvatar(initAvatar)}
          />
          {auth.nfts.map((item: any) => {
            return (
              <img
                src={item.url}
                key={item.url}
                className="w-full border rounded-full cursor-pointer min-w-[80px] w-20 mx-2"
                onClick={() => setAvatar(item.url)}
              />
            );
          })}
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-5 bg-gradient-to-r from-[#5E5BF8] via-[#9750F3] to-[#57A9F4] py-2.5 md:py-3 rounded-md text-white hover:shadow-[0_0_12px_0px_#818cf850] anim"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default ModalProfile;
