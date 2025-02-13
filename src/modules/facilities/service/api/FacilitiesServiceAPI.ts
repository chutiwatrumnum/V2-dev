import axios from "axios";
import {
  DataType,
  Ibooking,
  conditionPage,
  dataItem,
} from "../../../../stores/interface/Facilities";
import { paramsdata } from "./paramsAPI";
import { encryptStorage } from "../../../../utils/encryptStorage";
import { statusSuccess } from "../../../../constant/status_code";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const getdataFacilitieslist = async (params: conditionPage) => {
  let url: string = `facilities/booking-log?`;
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
        const AllDataFacilies = result.data.result.bookingLog.rows;
        // console.log(AllDataFacilies);
        let data: DataType[] = [];
        await AllDataFacilies.map((e: any, i: number) => {
          let userdata: DataType = {
            key: e.id,
            refBooking: e.refBooking,
            purpose: e.purpose,
            joiningDate: e.joinAt ? dayjs(e.joinAt).format("DD/MM/YYYY") : "-",
            unitNo: e.unit.unitNo,
            status: e.status,
            createdAt: dayjs(e.createdAt).format("DD/MM/YYYY"),
            startEndTime: `${e.startTime}-${e.endTime}`,
            bookedBy: e.bookingUser,
            approve: e.approve,
            reject: e.reject,
            juristicConfirm: e.juristicConfirm,
          };
          data.push(userdata);
          // console.log(data);
        });

        return {
          total: result.data.result.bookingLog.total,
          status: true,
          dataValue: data,
        };
      } else {
        console.error("status code:", result.status);
        console.error("data error:", result.data);
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

const dowloadFacilities = async (id: number | null) => {
  console.log("====================================");
  console.log("id faci:", id);
  console.log("====================================");
  var now = dayjs();
  axios({
    url: `facilities/download?id=${id}`, //your url
    method: "GET",
    responseType: "blob", // important
  }).then((response) => {
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);
    console.log("response.data======", response.data);
    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", dayjs(now).format("DD-MM-YYYY")); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    // document.body.removeChild(link);
    // URL.revokeObjectURL(href);
  });
};

const deleteFacilitieId = async (id: number) => {
  try {
    const resultDelete = await axios.put(`facilities/booking-log/cancel/${id}`);
    console.log(resultDelete);

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

const ApprovedId = async (data: any) => {
  try {
    const resultPending = await axios.put(`facilities/booking-log`, data);
    if (resultPending.status === statusSuccess) {
      return {
        status: true,
      };
    } else {
      console.warn("approve", resultPending);

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

const getFacilitiesList = async () => {
  try {
    const facilitie = await axios.get("facilities/list");
    // console.log(facilitie);

    if (facilitie.status === statusSuccess) {
      let arrData: dataItem[] = [];
      facilitie.data.result.map((e: any) => {
        let data: dataItem = {
          value: e.id,
          label: e.name,
          imageId: e.imageUrl,
          validDateNumber: e.maxDayCanBook,
        };
        arrData.push(data);
      });
      return {
        status: true,
        data: arrData,
        firstId: arrData[0].value,
      };
    } else {
      return {
        status: false,
        data: null,
        firstId: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      data: null,
      firstId: null,
    };
  }
};

const getFacilitiesBymonth = async (param: any) => {
  try {
    const facilitie = await axios.get(
      `/facilities/by-month?facilitiesId=${param?.facilitiesId}&sortBy=${param?.sortBy}`
    );
    // console.log("getFacilitiesBymonth => ", facilitie.data.result);

    if (facilitie.status >= 400) {
      console.error(facilitie);
      return false;
    }
    return facilitie.data.result;
  } catch (err) {
    console.error("CATCH => ", err);
  }
};
export {
  getdataFacilitieslist,
  deleteFacilitieId,
  ApprovedId,
  getFacilitiesList,
  getFacilitiesBymonth,
  dowloadFacilities,
};
