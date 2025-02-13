import axios from "axios";
import {
  DataType,
  BuildingActivitiesNew,
  conditionPage,
  ParticipantGroup,
  edidtDataParticipantGroup,
  emailGroupSelect,
  eventMasterGroupList,
  BuildingActivitiesEdit,
  MaintenanceFacilityEdit,
} from "../../../../stores/interface/Buliding";
import { paramsdata } from "./paramsAPI";
import { encryptStorage } from "../../../../utils/encryptStorage";
import { statusSuccess, statusCreated } from "../../../../constant/status_code";
import { CreateMaintenanceFacilities } from "../../../../stores/interface/Facilities";

const getdataBuildinglist = async (params: conditionPage) => {
  let url: string = `/building-calendar/activities-list?`;
  const resultparams = await paramsdata(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    console.log("url:", url);
  }
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const result = await axios.get(url);
      if (result.status < 400) {
        console.log("====================================");
        console.log("build acti:", result.data);
        console.log("====================================");
        const AllDataBuildingActivityList = result.data.result.list;
        console.log(AllDataBuildingActivityList);

        let data: DataType[] = [];
        AllDataBuildingActivityList.map((e: any, i: number) => {
          let userdata: DataType = {
            no: e?.no,
            key: e?.id,
            calendarTypeName: e?.calendarTypeName,
            title: e?.title,
            date: e?.date,
            time: `${e?.startTime}-${e.endTime}`,
            createdBy: e?.createdBy,
            note: e?.note ? e?.note : "-",
            groupname: "",
            email: [],
            sendMailGroupId: e.sendMailGroupId,
            sendMailGroup: e?.sendMailGroup ? e?.sendMailGroup : null,
            remindNotiDays: e.remindNotiDays != null ? e.remindNotiDays : null,
            startTime: e?.startTime,
            endTime: e?.endTime,
            location: e?.location ? e?.location : null,
            facilitiesId: e?.facilitiesId,
          };
          data.push(userdata);
        });

        return {
          total: result.data.result.listMax,
          status: true,
          datavalue: data,
        };
      } else {
        console.warn("status code:", result.status);
        console.warn("data error:", result.data);
      }
    } catch (err) {
      console.error("err:", err);
    }
  } else {
    console.log("====================================");
    console.log("token undefilend.....");
    console.log("====================================");
  }
};

const getdataEmailGrouplist = async () => {
  let url: string = `/building-calendar/activities/group`;
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const result = await axios.get(url);
      if (result.status === statusSuccess) {
        const AllDataEmailGroup = result.data.result.list;
        let data: emailGroupSelect[] = [];
        let emailGroup: any[] = [];
        AllDataEmailGroup.map((e: any, i: number) => {
          let email_group_list: emailGroupSelect = {
            label: e?.groupName,
            value: i,
          };
          emailGroup.push(e?.email);
          data.push(email_group_list);
        });

        return {
          emailGroup: emailGroup,
          status: true,
          datavalue: data,
        };
      } else {
        console.warn("status code:", result.status);
        console.warn("data error:", result.data);
      }
    } catch (err) {
      console.error("err:", err);
    }
  } else {
    console.log("====================================");
    console.log("token undefilend.....");
    console.log("====================================");
  }
};

const getdataEventMasterlist = async () => {
  let url: string = `/master`;
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const result = await axios.get(url);
      if (result.status === statusSuccess) {
        const AllDataEmailGroup = result.data.result.calendarType;
        let data: eventMasterGroupList[] = [];
        AllDataEmailGroup.map((e: any, i: number) => {
          let email_group_list: eventMasterGroupList = {
            label: e?.name,
            value: e?.id,
          };
          data.push(email_group_list);
        });

        return {
          status: true,
          datavalue: data,
        };
      } else {
        console.warn("status code:", result.status);
        console.warn("data error:", result.data);
      }
    } catch (err) {
      console.error("err:", err);
    }
  } else {
    console.log("====================================");
    console.log("token undefilend.....");
    console.log("====================================");
  }
};

const getdataGrouplist = async (params: conditionPage) => {
  let url: string = `/building-calendar/activities/group?`;
  const resultparams = await paramsdata(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    // console.log("url:", url);
  }
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const result = await axios.get(url);
      if (result.status < 400) {
        const AllDataResident = result.data.result.list;
        // console.log(AllDataResident);
        let data: DataType[] = [];
        AllDataResident.map((e: any, i: number) => {
          let userdata: DataType = {
            no: e?.no,
            key: e?.id,
            title: e?.title,
            date: e?.createdAt,
            time: e?.updatedAt,
            createdBy: e?.createdBy,
            note: e?.note ? e?.note : "-",
            calendarTypeName: "",
            groupname: e.groupName,
            email: e?.email,
            sendMailGroupId: "",
            sendMailGroup: null,
            remindNotiDays: null,
            startTime: "",
            endTime: "",
            location: null,
            facilitiesId: 0,
          };
          data.push(userdata);
        });

        return {
          total: result.data.result.listMax,
          status: true,
          datavalue: data,
        };
      } else {
        console.warn("status code:", result.status);
        console.warn("data error:", result.data);
      }
    } catch (err) {
      console.error("err:", err);
    }
  } else {
    console.log("====================================");
    console.log("token undefilend.....");
    console.log("====================================");
  }
};

const addParticipantGroup = async (req: ParticipantGroup) => {
  try {
    const result = await axios.post("/building-calendar/activities/group", req);
    if (result.status === statusCreated) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const editDataParticipantGroup = async (data: edidtDataParticipantGroup) => {
  try {
    const result = await axios.put(`/building-calendar/activities/group`, data);
    if (result.status === statusSuccess) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const editDataBuildActivity = async (data: BuildingActivitiesEdit) => {
  try {
    const result = await axios.put(`/building-calendar/activities`, data);
    if (result.status === statusSuccess) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
const editDataMaintenanceFacility = async (data: MaintenanceFacilityEdit) => {
  try {
    const result = await axios.put(
      `/building-calendar/activities/facilities`,
      data
    );
    if (result.status === statusSuccess) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
const deleteBuildActivityByID = async (id: string) => {
  try {
    const resultDelete = await axios.delete(
      `/building-calendar/activities/${id}`,
      {
        data: {
          userId: id,
        },
      }
    );
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
const deleteParticipantGroupByID = async (id: string) => {
  try {
    const resultDelete = await axios.delete(
      `/building-calendar/activities/group/${id}`
    );
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

const addBuildingActivity = async (req: BuildingActivitiesNew) => {
  try {
    const result = await axios.post(
      "/building-calendar/activities-create",
      req
    );
    if (result.status === statusCreated) {
      return true;
    } else {
      return false;
    }
  } catch (error) {}
};
const addMaintenanceFacilities = async (req: CreateMaintenanceFacilities) => {
  try {
    const result = await axios.post(
      "/building-calendar/activities/facilities",
      req
    );
    if (result.status === statusCreated) {
      return true;
    } else {
      return false;
    }
  } catch (error) {}
};

export {
  getdataBuildinglist,
  getdataGrouplist,
  deleteParticipantGroupByID,
  deleteBuildActivityByID,
  addParticipantGroup,
  addBuildingActivity,
  editDataParticipantGroup,
  getdataEmailGrouplist,
  getdataEventMasterlist,
  editDataBuildActivity,
  addMaintenanceFacilities,
  editDataMaintenanceFacility,
};
