import { useCallback } from "react";
import toast, { ToastOptions } from "react-hot-toast";

type Theme = "light" | "dark";

export function useNotify(theme: Theme = "light") {
  // กำหนด style ของ toast ตาม theme
  const baseStyle: ToastOptions = {
    style: {
      background: theme === "dark" ? "#333" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      border: theme === "dark" ? "1px solid #444" : "1px solid #ddd",
    },
  };

  const success = useCallback(
    (msg: string) => toast.success(msg, baseStyle),
    [theme]
  );

  const error = useCallback(
    (msg: string) => toast.error(msg, baseStyle),
    [theme]
  );

  const info = useCallback(
    (msg: string) => toast(msg, baseStyle),
    [theme]
  );

  const promise = useCallback(
    <T,>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) =>
      toast.promise(promise, msgs, baseStyle),
    [theme]
  );

  return { success, error, info, promise };
}