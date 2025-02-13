import axios from "axios";
import {
  DataType,
  conditionPage,
  roleDetail,
  MSCTAddNew,
} from "../../../../stores/interface/Management";
import { paramsdata } from "./paramsAPI";
import { encryptStorage } from "../../../../utils/encryptStorage";
import { statusSuccess, statusCreated } from "../../../../constant/status_code";
const getdataManagement = async (params: conditionPage) => {
  let url: string = `/mcst/list?`;
  const resultparams = await paramsdata(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    // console.log("url:", url);
  }
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const result = await axios.get(url);
      if (result.status === statusSuccess) {
        const dataMSCTList = result.data.result.userList.rows;
        const arrayDataMSCTList: DataType[] = [];
        dataMSCTList.map((e: any) => {
          let dataMSCT: DataType = {
            key: e.id,
            image: e.imageProfile ? e.imageProfile : null,
            firstName: e.firstName,
            middleName: e.middleName, 
            lastName: e.lastName,
            email: e.email,
            role: e.role[0].name,
            contact: e.contact,
          };
          arrayDataMSCTList.push(dataMSCT);
        });
        return {
          total: result.data.result.userList.total,
          status: true,
          data: arrayDataMSCTList,
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
const getdataRole = async () => {
  const token = await encryptStorage.getItem("accessToken");
  if (token) {
    try {
      const data = await axios.get("/role/list-for-juristic");
      if (data.status === statusSuccess) {
        const roleList = data.data.result.roleList;
        let arrayRole: roleDetail[] = [];
        roleList.map((e: any) => {
          const role: roleDetail = {
            label: e.name,
            value: e.id,
          };
          arrayRole.push(role);
        });
        if (arrayRole.length > 0) {
          return {
            status: true,
            data: arrayRole,
          };
        } else {
          return {
            status: false,
            data: null,
          };
        }
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        data: null,
      };
    }
  } else {
    console.log("====================================");
    console.log("token undefilend.....");
    console.log("====================================");
  }
};
const deleteMCSTId = async (id: string) => {
  try {
    const resultDelete = await axios.delete(
      `/mcst/delete/${id}`
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
const addMSCT=async (req:MSCTAddNew) => { 
  try {
   const result= await axios.post("/mcst/add-juristic",req)
   console.log('====================================');
   console.log("add new msct data:",result);
   console.log('====================================');
   if (result.status===statusCreated) {
    return true;
  } else {
    return false;
  }
  } catch (err) {
    console.error(err);
    return false
    
  }
 }
 const editdataMCST = async (id: string|any, data: MSCTAddNew) => {
  try {
    const result = await axios.put(`/mcst/update/${id}`, data);
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
export { getdataRole, getdataManagement,deleteMCSTId,addMSCT,editdataMCST };
