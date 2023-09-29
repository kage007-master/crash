import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";

import { ToastContext } from "./ToastContext";
import { Toast } from "./Toast";
import err from "../assets/images/error.png";
import suc from "../assets/images/success.png";
import war from "../assets/images/warning.png";

// Create a random ID
function generateUEID() {
  let first = (Math.random() * 46656) | 0;
  let second = (Math.random() * 46656) | 0;
  first = ("000" + first.toString(36)).slice(-3);
  second = ("000" + second.toString(36)).slice(-3);
  return first + second;
}

export const ToastProvider = (props) => {
  const [toasts, setToasts] = useState([]);
  const success = (content) =>
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: generateUEID(), content, title: "Success!", type: 0 },
    ]);
  const error = (content) =>
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: generateUEID(), content, title: "Error!", type: 1 },
    ]);
  const warning = (content) =>
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: generateUEID(), content, title: "Warning!", type: 1 },
    ]);
  const close = (id) =>
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  const contextValue = useMemo(() => ({ error, success, warning }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}

      {createPortal(
        <div className="toasts-wrapper z-50">
          {toasts.map((toast) => (
            <div
              className={`toast toast-${
                toast.type === 0
                  ? "success"
                  : toast.type === 1
                  ? "error"
                  : "warning"
              } justify-between py-4 px-4 w-full items-center`}
              key={toast.id}
            >
              <div className="flex items-center">
                <img
                  src={toast.type === 0 ? suc : toast.type === 1 ? err : war}
                />
                <div className="px-2">
                  <p className="text-lg font-[700]">{toast.title}</p>
                  <p className="text-white">{toast.content}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => close(toast.id)}
                  className="text-white text-3xl"
                >
                  x
                </button>
                <Toast close={() => close(toast.id)} />
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
