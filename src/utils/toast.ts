import Toast, { ToastShowParams } from "react-native-toast-message";

export const TOP = "top";
export const BOTTOM = "bottom";

const TOAST_DEFAULT_OPTIONS: ToastShowParams = {
  position: TOP,
};

const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  DEFAULT: "default",
};

const showToast = (
  type: string,
  message: string,
  options?: ToastShowParams
) => {
  const optsMerge = { ...TOAST_DEFAULT_OPTIONS, ...options };
  Toast.show({
    type,
    text1: message,
    ...optsMerge,
  });
};

export const toastSuccess = (
  message = "Success",
  options?: ToastShowParams
) => {
  showToast(TOAST_TYPES.SUCCESS, message, options);
};

export const toastError = (message = "Error", options?: ToastShowParams) => {
  showToast(TOAST_TYPES.ERROR, message, options);
};

export const toastInfo = (message = "Info", options?: ToastShowParams) => {
  showToast(TOAST_TYPES.INFO, message, options);
};

export const toastDefault = (
  message = "Default",
  options?: ToastShowParams
) => {
  showToast(TOAST_TYPES.DEFAULT, message, options);
};
