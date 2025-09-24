import { useCallback } from 'react';
import toast, { ToastOptions } from 'react-hot-toast';

type Theme = 'light' | 'dark';

export function useNotify(theme?: Theme) {
  // กำหนด style ของ toast ตาม theme
  const themeClass = theme || document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    //getComputedStyle(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  const baseStyle: ToastOptions = {
    style: {
      background: themeClass === 'dark' ? '#333' : '#fff',
      color: themeClass === 'dark' ? '#fff' : '#000',
      border: themeClass === 'dark' ? '1px solid #444' : '1px solid #ddd',
    },
  };

  const success = useCallback(
    (msg: string) => toast.success(msg, baseStyle),
    [themeClass],
  );

  const error = useCallback(
    (msg: string) => toast.error(msg, baseStyle),
    [themeClass],
  );

  const info = useCallback((msg: string) => toast(msg, baseStyle), [themeClass]);

  const promise = useCallback(
    <T,>(
      promise: Promise<T>,
      msgs: { loading: string; success: string; error: string },
    ) => toast.promise(promise, msgs, baseStyle),
    [themeClass],
  );

  return { success, error, info, promise };
}
