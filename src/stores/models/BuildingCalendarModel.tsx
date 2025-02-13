import { createModel } from "@rematch/core";
import { BuildingCalendarDataType } from "../interface/BuildingCalendar";
import { RootModel } from "./index";
import axios from "axios";
import dayjs from "dayjs";

export const buildingCalendar = createModel<RootModel>()({
  state: {
    buildingCalendarEventData: [],
    selectedCalendarType: [],
    monthSelected: dayjs(),
    isLoading: true,
  } as BuildingCalendarDataType,
  reducers: {
    updateBuildingCalendarEventDataState: (state, payload) => ({
      ...state,
      buildingCalendarEventData: payload,
    }),
    updateSelectedCalendarTypeState: (state, payload) => ({
      ...state,
      selectedCalendarType: payload,
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
    async getBuildingCalendarEventData(payload: {
      date?: string;
      types: number[];
    }) {
      let typeId = "";
      payload.types.map((item, index) => {
        let text = `&typeId[${index}]=${item.toString()}`;
        typeId = typeId.concat(text);
      });
      let date = `date=${payload.date}` ?? "";
      // console.log(`/building-calendar/list-view?${date}${typeId}`);

      try {
        const result = await axios.get(
          `/building-calendar/list-view?${date}${typeId}`
        );
        if (result.status >= 400) {
          console.error("ERROR => ", result.data.message);
          return;
        }
        dispatch.buildingCalendar.updateBuildingCalendarEventDataState(
          result.data.result.list
        );
      } catch (error) {
        console.error("ERROR", error);
      }
    },
  }),
});
