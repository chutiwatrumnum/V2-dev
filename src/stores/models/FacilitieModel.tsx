import { createModel } from "@rematch/core";
import {
  facilitieType,
  ReserveSlotTimeType,
  ReserveFacilityType,
} from "../interface/Facilities";
import { RootModel } from "./index";
import axios from "axios";

import { message } from "antd";

export const facilities = createModel<RootModel>()({
  state: {
    paramsAPI: {
      perPage: 10,
      curPage: 1,
      facilitiesId: 1,
    },
    reserveSlotTime: {},
    peopleCountingData: undefined,
  } as facilitieType,
  reducers: {
    updateloadingParamsState: (state, payload) => ({
      ...state,
      paramsAPI: payload,
    }),
    updateReserveSlotTimeState: (state, payload) => ({
      ...state,
      reserveSlotTime: payload,
    }),
    updatePeopleCountingDataState: (state, payload) => ({
      ...state,
      peopleCountingData: payload,
    }),
  },
  effects: (dispatch) => ({
    async getTimeSlot(payload: ReserveSlotTimeType) {
      try {
        const result = await axios.get(
          `/facilities/slot-time?facilityId=${payload.id}&date=${payload.date}&groupSession=true`
        );
        if (result.data.statusCode >= 400) {
          // console.log(result.data);
          console.error(result.data.message);
          return false;
        }
        console.log(result.data);

        dispatch.facilities.updateReserveSlotTimeState(result.data.result);
        return true;
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async reserveFacility(payload: ReserveFacilityType) {
      try {
        // console.log(payload);
        const result = await axios.post(
          `/facilities/dashboard/booking`,
          payload
        );
        if (result.data.statusCode >= 400) {
          console.error(result.data.message);
          message.error(result.data.message);
          return;
        }
        dispatch.common.updateSuccessModalState({
          open: true,
          text: "Successfully reserved",
        });
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async getPeopleCountingData() {
      try {
        const result = await axios.get(`/people-counting?roomId=1`);
        if (result.data.statusCode >= 400) {
          console.error(result.data.message);
        }
        dispatch.facilities.updatePeopleCountingDataState(result.data.result);
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async editPeopleCountingData(payload) {
      try {
        const result = await axios.put(`/people-counting`, payload);
        if (result.data.statusCode >= 400) {
          console.error(result.data.message);
        }
        console.log("Success");
      } catch (error) {
        console.error("ERROR", error);
      }
    },
  }),
});
