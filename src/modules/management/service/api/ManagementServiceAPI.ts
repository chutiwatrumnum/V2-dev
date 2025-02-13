import axios from "axios";
import {
  ManagementDataType,
  conditionPage,
  roleDetail,
  ManagementAddDataType,
} from "../../../../stores/interfaces/Management";
import { paramsData } from "./paramsAPI";
import { message } from "antd";
const getDataManagement = async (params: conditionPage) => {
  let url: string = `/mcst/list?`;
  const resultparams = await paramsData(params);
  if (resultparams.status) {
    url = url + resultparams.paramsstr;
    console.log("url:", url);
  }
    try {
      const result = await axios.get(url);
      if (result.status === 200) {
        console.log(result.data.result.userList);
        const dataManagement = result.data.result.userList.rows;
        const arrayDataManagement: ManagementDataType[] = [];
        dataManagement.map((e: any) => {
          const dataMSCT: ManagementDataType = {
            key: e.id,
            image: e.imageProfile ? e.imageProfile : null,
            firstName: e.firstName,
            middleName: e.middleName ? e.middleName : "-",
            lastName: e.lastName,
            email: e.email,
            role: e.role.name,
            contact: e.contact,
            activate: e.verifyByUser,
            updatedAt: e.updatedAt,
            updatedByUser: e.updatedByUser,
          };
          arrayDataManagement.push(dataMSCT);
        });
        return {
          total: result.data.result.userList.total,
          status: true,
          data: arrayDataManagement,
        };
      } else {
        console.warn("status code:", result.status);
        console.warn("data error:", result.data);
      }
    } catch (err) {
      console.error("err:", err);
    }

};
const getdataRole = async () => {
  try {
    const data = await axios.get("/mcst/add-juristic/master-data");
    if (data.status === 200) {
      const roleList = data.data.result.role;
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
};
const deleteManagementId = async (id: string) => {
  try {
    const resultDelete = await axios.delete(`/mcst/delete/${id}`);

    if (resultDelete.status === 200) {
      return {
        status: true,
      };
    } else {
      message.error(resultDelete.data.message);
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
const addDataTeamManagement = async (req: ManagementAddDataType) => {
  try {
    const result = await axios.post("/mcst/add-juristic", req);
    if (result.status === 200) {
      return true;
    } else {
      message.error(result.data.message);
      return false;
    }
  } catch (err) {
    console.log(err);
    // message.error(err)
    return false;
  }
};
const EditDataTeamManagement = async (
  id: string | any,
  data: ManagementAddDataType
) => {
  try {
    const result = await axios.put(`/mcst/update/${id}`, data);
    console.log("result", result);

    if (result.status === 200) {
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
export {
  getdataRole,
  getDataManagement,
  deleteManagementId,
  addDataTeamManagement,
  EditDataTeamManagement,
};
