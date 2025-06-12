import { createModel } from "@rematch/core";
import { ChatModelDataType, SendChatDataType } from "../interfaces/Chat";
import { RootModel } from "./index";
import axios from "axios";

export const chat = createModel<RootModel>()({
  state: {
    chatListSortBy: "time",
    curPageChatData: 2,
  } as ChatModelDataType,
  reducers: {
    updateSortByData: (state, payload) => ({
      ...state,
      chatListSortBy: payload,
    }),
    updateCurPageChatData: (state, payload) => ({
      ...state,
      curPageChatData: payload,
    }),
  },
});
