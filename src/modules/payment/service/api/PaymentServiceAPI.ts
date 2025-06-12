import axios from "axios";
import {
  DataType,
  ResidentAddNew,
  conditionPage,
  blockDetail,
  hobbyDetail,
  roleDetail,
  rejectRequest,
} from "../../../../stores/interfaces/Resident";
import { paramsdata } from "./paramsAPI";
import { encryptStorage } from "../../../../utils/encryptStorage";
import { statusSuccess, statusCreated } from "../../../../constant/status_code";
import { message } from "antd";
const getdataresidentlist = async (params: conditionPage) => {
  let url: string = `/users/list?`;
  const resultparams = await paramsdata(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    //  console.log("url:",url);
  }
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const result = await axios.get(url);
      if (result.status === statusSuccess) {
        const AllDataResident = result.data.result.userList.rows;
        let data: DataType[] = [];
        AllDataResident.map((e: any, i: number) => {
          let userdata: DataType = {
            key: e.id,
            firstName: e.firstName,
            lastName: e.lastName,
            middleName: e.middleName,
            blockNo: e?.unit[0]?.block[0]?.blockNo
              ? e.unit[0].block[0].blockNo
              : "-",
            unitNo: e?.unit[0]?.unitNo ? e?.unit[0].unitNo : "-",
            email: e.email,
            hobby: e.hobby ? e?.hobby : "-",
            role: e?.role[0]?.roleCode ? e?.role[0].roleCode : "-",
            moveInDate: e?.moveInDate ? e?.moveInDate : "-",
            birthDate: e?.birthDate ? e?.birthDate : null,
            contact: e.contact,
            iuNumber: e?.iuNumber ? e?.iuNumber : null,
            moveOutDate: e?.moveOutDate ? e?.moveOutDate : "-",
            nickName: e?.nickName ? e?.nickName : null,
            createdAt: e.createdAt,
            rejectAt: e.rejectAt ? e.rejectAt : "",
            rejectReason: e.rejectReason ? e.rejectReason : "",
            rejectUser: e.rejectUser ? e.rejectUser : "",
          };
          data.push(userdata);
        });

        return {
          total: result.data.result.userList.total,
          status: true,
          datavlaue: data,
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

const deleteResidentId = async (id: string) => {
  try {
    const resultDelete = await axios.delete(`/users/delete`, {
      data: {
        userId: id,
      },
    });
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

const ApprovedId = async (id: string) => {
  try {
    const resultApproved = await axios.post(`/users/approve`, {
      userId: id,
    });
    if (resultApproved.status === statusCreated) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
    };
  }
};

const getdatablock = async () => {
  try {
    const data = await axios.get("/unit/block-unit-list");
    if (data.status === 200) {
      const blocklst = data.data.result.blockList;

      let arrayBlock: blockDetail[] = [];
      blocklst.map((e: any) => {
        if (e?.active) {
          const block: blockDetail = {
            label: e.blockNo,
            value: e.id,
          };
          arrayBlock.push(block);
        }
      });
      if (arrayBlock.length > 0) {
        return {
          status: true,
          dataselectblock: arrayBlock,
          datablock: blocklst,
        };
      } else {
        return {
          status: false,
          datablock: null,
        };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      status: false,
      datablock: null,
    };
  }
};
const getdatarole = async () => {
  try {
    const data = await axios.get("/role/list");

    if (data.status === 200) {
      const rolelist = data.data.result.roleList;

      let arrayrole: roleDetail[] = [];
      rolelist.map((e: any) => {
        const role: roleDetail = {
          label: e.roleCode,
          value: e.id,
        };
        arrayrole.push(role);
      });

      if (arrayrole.length > 0) {
        return {
          status: true,
          datarole: arrayrole,
        };
      } else {
        return {
          status: false,
          datarole: null,
        };
      }
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      datarole: null,
    };
  }
};
const getdatahobby = async () => {
  try {
    const data = await axios.get("/hobby");

    if (data.status === 200) {
      const hobbylist = data.data.result.hobby;
      let arrayhobby: hobbyDetail[] = [];
      hobbylist.map((e: any) => {
        if (e.active) {
          const hobby: hobbyDetail = {
            label: e.nameEn,
            value: e.id,
          };
          arrayhobby.push(hobby);
        }
      });

      if (arrayhobby.length > 0) {
        return {
          status: true,
          datahobby: arrayhobby,
        };
      } else {
        return {
          status: false,
          datahobby: null,
        };
      }
    }
  } catch (error) {
    console.error(error);

    return {
      status: false,
      datahobby: null,
    };
  }
};
const editdataresident = async (id: string | any, data: ResidentAddNew) => {
  try {
    const result = await axios.put(`/users?userId=${id}`, data);
    if (result.status < 400) {
      return true;
    } else {
      message.error(result.data.message);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
const addResident = async (req: ResidentAddNew) => {
  try {
    const result = await axios.post("/users/sign-up-by-juristic", req);
    // console.log(result.data);
    if (result.status === statusCreated) {
      return true;
    } else {
      return result.data.message;
    }
  } catch (error) { }
};

const RejectById = async (data: rejectRequest) => {
  try {
    const resultReject = await axios.post(`/users/reject`, data);
    if (resultReject.status === statusCreated) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
    };
  }
};
export {
  getdataresidentlist,
  deleteResidentId,
  editdataresident,
  ApprovedId,
  RejectById,
  getdatahobby,
  getdatarole,
  getdatablock,
  addResident,
};
