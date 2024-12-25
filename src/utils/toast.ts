import { Toast } from "toastify-react-native";
import { ToastManagerState } from "toastify-react-native/utils/interfaces";

export const TOP_LEFT = "top-left";
export const TOP_RIGHT = "top-right";
export const TOP_CENTER = "top-center";
export const BOTTOM_LEFT = "bottom-left";
export const BOTTOM_RIGHT = "bottom-right";
export const BOTTOM_CENTER = "bottom-center";

const TOAST_DEFAULT_OPTIONS = {
  position: TOP_RIGHT,
  autoClose: 3000,
  pauseOnHover: true,
  closeOnClick: true,
  hideProgressBar: false,
};

const TOAST_SUCCESS = "TOAST_SUCCESS";
const TOAST_ERROR = "TOAST_ERROR";
const TOAST_WARN = "TOAST_WARN";
const TOAST_INFO = "TOAST_INFO";
const TOAST_DEFAULT = "TOAST_DEFAULT";

export const getToastFunction: any =
  (type: string, options?: ToastManagerState) => (message: string) => {
    const optsMerge = Object.assign({}, TOAST_DEFAULT_OPTIONS, options);
    let doToast: any = null;
    switch (type) {
      case TOAST_SUCCESS:
        doToast = Toast.success;
        break;
      case TOAST_ERROR:
        doToast = Toast.error;
        break;
      case TOAST_WARN:
        doToast = Toast.warn;
        break;
      case TOAST_INFO:
        doToast = Toast.info;
        break;
      case TOAST_DEFAULT:
        doToast = Toast;
        break;
      default:
        return doToast;
    }
    return doToast(message, optsMerge);
  };

export const toastSuccess: any = (
  message = "Success",
  options?: ToastManagerState
) => {
  getToastFunction(TOAST_SUCCESS, options)(message);
};

export const toastError: any = (
  message = "Error",
  options?: ToastManagerState
) => {
  getToastFunction(TOAST_ERROR, options)(message);
};

export const toastWarn: any = (
  message = "Warning",
  options?: ToastManagerState
) => {
  getToastFunction(TOAST_WARN, options)(message);
};

export const toastInfo: any = (
  message = "Info",
  options?: ToastManagerState
) => {
  getToastFunction(TOAST_INFO, options)(message);
};

export const toastDefault: any = (
  message = "Default",
  options?: ToastManagerState
) => {
  getToastFunction(TOAST_DEFAULT, options)(message);
};
