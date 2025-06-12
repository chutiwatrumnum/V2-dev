import { io } from "socket.io-client";
import { encryptStorage } from "../utils/encryptStorage";

const URL = "https://v2-backend-service-gtbie.ondigitalocean.app/chat";
const accessToken = encryptStorage.getItem("accessToken");

export const socket = io(URL, {
  reconnection: true,
  reconnectionAttempts: 2,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 2000,
  timeout: 5000,
  extraHeaders: {
    authorization: `bearer ${accessToken}`,
  },
});
