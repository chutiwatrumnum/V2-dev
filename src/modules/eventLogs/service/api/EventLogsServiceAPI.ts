import axios from "axios";
import { paramsdata } from "./paramsAPI";
import { encryptStorage } from "../../../../utils/encryptStorage";
import { statusSuccess, statusCreated } from "../../../../constant/status_code";
import {
  AddNewEventLogsType,
  dataEventJoinLogsType,
  conditionPage,
  dataEventJoinLogsByIDType,
  dataEventLogsType,
  EditEventLogsType,
  IChangeLockedById,
} from "../../../../stores/interfaces/EventLog";
import dayjs from "dayjs";

/**
 * Get list of event join logs
 * @param params Filter and pagination parameters
 * @returns Processed event join logs data with status
 */
const getDataEventJoinLogList = async (params: conditionPage) => {
  let url: string = `events/referral/list?`;
  const resultparams = await paramsdata(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    console.log("url:", url);
  }
  const token = await encryptStorage.getItem("accessToken");
  try {
    const result = await axios.get(url);
    if (result.status === statusSuccess) {
      const AllDataEventLogs = result.data.result.rows;
      let data: dataEventJoinLogsType[] = [];

      // Using map with direct push for better readability while maintaining original logic
      AllDataEventLogs.forEach((e: any) => {
        let dataEventLogs: dataEventJoinLogsType = {
          key: e?.id,
          eventName: e?.eventName,
          joiningDate: e?.joiningDate,
          blockNo: e?.blockNo,
          unitNo: e?.unitNo,
          participant: e?.participant,
          bookingBy: e?.bookingBy,
        };
        data.push(dataEventLogs);
      });

      return {
        total: result.data.result.total,
        status: true,
        datavalue: data,
      };
    } else {
      console.warn("status code:", result.status);
      console.warn("data error:", result.data);
      return {
        total: 0,
        status: false,
        datavalue: [],
      };
    }
  } catch (err) {
    console.error("err:", err);
    return {
      total: 0,
      status: false,
      datavalue: [],
    };
  }
};

/**
 * Get list of event logs
 * @param params Filter and pagination parameters
 * @returns Processed event logs data with status
 */
const getDataEventLogList = async (params: conditionPage) => {
  let url: string = `events/list?`;
  const resultparams = await paramsdata(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    console.log("url:", url);
  }
  const token = await encryptStorage.getItem("accessToken");
  try {
    const result = await axios.get(url);
    console.log("getdataEventLoglist:", result);

    if (result.status === statusSuccess) {
      const AllDataEventLogs = result.data.result.rows;
      let data: dataEventLogsType[] = [];

      // Using forEach for better readability
      AllDataEventLogs.forEach((e: any) => {
        // Helper function to format name
        const formatName = (user: any) => {
          if (!user) return "";
          return `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`.trim();
        };

        let dataEventLogs: dataEventLogsType = {
          key: e?.id,
          title: e?.title,
          description: e?.description,
          status:
            dayjs(e?.date, "YYYY-MM-DD").diff(dayjs().format("YYYY-MM-DD")) > -1
              ? "Published"
              : "Unpublished",
          limitPeople: e?.limitPeople,
          createDate: e?.createdAt,
          startDate: e?.date,
          startTime: e?.startTime,
          endTime: e?.endTime,
          visitorRegister: e?.isAllowVisitor,
          createBy: formatName(e?.createdBy),
          unitAll: e?.unitAll,
          unitList: e?.unitList,
          imageUrl: e?.imageUrl,
          isPayable: e?.isPayable,
          fee: e?.fee,
          locked: e?.locked,
          currentBookingPeople: e?.currentBookingPeople,
          isMaxBookingPerUnit: e?.isMaxBookingPerUnit,
          maxBookingPerUnit: e?.maxBookingPerUnit,
        };
        data.push(dataEventLogs);
      });

      return {
        total: result.data.result.total,
        status: true,
        datavalue: data,
      };
    } else {
      console.warn("status code:", result.status);
      console.warn("data error:", result.data);
      return {
        total: 0,
        status: false,
        datavalue: [],
      };
    }
  } catch (err) {
    console.error("err:", err);
    return {
      total: 0,
      status: false,
      datavalue: [],
    };
  }
};

/**
 * Delete event log by ID
 * @param id Event log ID
 * @returns Operation success status
 */
const deleteEventLogsById = async (id: string) => {
  try {
    const resultDelete = await axios.delete(`/events/${id}`);
    if (resultDelete.status === statusSuccess) {
      return true;
    } else {
      console.warn("delete", resultDelete);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * Delete event join by ID
 * @param id Event join ID
 * @returns Operation success status
 */
const deleteEventJoinById = async (id: string) => {
  try {
    const resultDelete = await axios.delete(`/events/referral/${id}`);
    if (resultDelete.status === statusSuccess) {
      return {
        status: true,
      };
    } else {
      console.warn("delete", resultDelete);
      return {
        status: false,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
    };
  }
};

/**
 * Edit event log
 * @param req Edit event request data
 * @returns Operation success status
 */
const editEventLogs = async (req: EditEventLogsType) => {
  try {
    const result = await axios.put("/events/update", req);
    if (result.status === statusSuccess) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
};

/**
 * Add new event log
 * @param req New event data
 * @returns Operation success status
 */
const addEventLogs = async (req: AddNewEventLogsType) => {
  try {
    const result = await axios.post("/events/create", req);
    if (result.status === statusCreated) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return false;
  }
};

/**
 * Get event join log details by ID
 * @param id Event join log ID
 * @returns Event join log details with status
 */
const getDataJoinLogByid = async (id: number) => {
  try {
    const resultDatajoinLogId = await axios.get(
      `events/referral/info?referralId=${id}`
    );
    if (resultDatajoinLogId.status === statusSuccess) {
      const { participant, roomType } = resultDatajoinLogId.data.result;
      let dataJoinLogId: dataEventJoinLogsByIDType = {
        typeEventJoinLog: roomType,
        participant: participant,
      };
      return {
        status: true,
        data: dataJoinLogId,
      };
    } else {
      return {
        status: false,
        data: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      data: null,
    };
  }
};

/**
 * Change event locked status by ID
 * @param req Lock status change request
 * @returns Operation success status
 */
const changeLockedById = async (req: IChangeLockedById) => {
  try {
    const result = await axios.put("/events/locked", req);
    if (result.status === statusSuccess) {
      return true;
    } else {
      console.warn("Failed to change lock status:", result.status);
      return false;
    }
  } catch (error) {
    console.error("Error changing lock status:", error);
    return false;
  }
};

/**
 * Download event logs report
 */
const downloadEventLogs = async () => {
  try {
    const now = dayjs();
    const fileName = dayjs(now).format("DD-MM-YYYY");

    axios({
      url: `events/events-log/download`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      // Create file link in browser's memory
      const href = URL.createObjectURL(response.data);
      console.log("response.data======", response.data);

      // Create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Optional cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }, 100);
    });
  } catch (error) {
    console.error("Error downloading event logs:", error);
  }
};

/**
 * Download event join logs report
 */
const downloadEventJoinLogs = async () => {
  try {
    const now = dayjs();
    const fileName = dayjs(now).format("DD-MM-YYYY");

    axios({
      url: `events/events-joining/download`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      // Create file link in browser's memory
      const href = URL.createObjectURL(response.data);
      console.log("response.data======", response.data);

      // Create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Optional cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }, 100);
    });
  } catch (error) {
    console.error("Error downloading event join logs:", error);
  }
};

export {
  getDataEventJoinLogList,
  getDataEventLogList,
  getDataJoinLogByid,
  deleteEventJoinById,
  editEventLogs,
  addEventLogs,
  deleteEventLogsById,
  changeLockedById,
  downloadEventJoinLogs,
  downloadEventLogs,
};