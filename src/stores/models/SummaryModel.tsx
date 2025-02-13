import { createModel } from "@rematch/core";
import { SummaryDataType } from "../interface/Summary";
import { RootModel } from "./index";
import axios from "axios";
import dayjs from "dayjs";

export const summary = createModel<RootModel>()({
  state: {
    eventViewData: [],
    monthSelected: dayjs(),
    isLoading: true,
  } as SummaryDataType,
  reducers: {
    updateEventViewDataState: (state, payload) => ({
      ...state,
      eventViewData: payload,
    }),
    updateMonthSelectedState: (state, payload) => ({
      ...state,
      monthSelected: payload,
    }),
    updateIsLoadingState: (state, payload: boolean) => ({
      ...state,
      isLoading: payload,
    }),
  },
  effects: (dispatch) => ({
    async getBuildingCalendarEventData(payload: string) {
      let date = `month=${payload}` ?? "";
      try {
        const result = await axios.get(
          `/monitoring-summary/event-view?${date}`
        );
        if (result.status >= 400) {
          console.error("ERROR => ", result.data.message);
          return;
        }
        dispatch.summary.updateEventViewDataState(result.data.result);
        // console.log(result.data.result);
      } catch (error) {
        console.error("ERROR", error);
      }
    },
  }),
});
