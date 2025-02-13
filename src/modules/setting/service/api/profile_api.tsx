import axios, { AxiosError } from "axios";
import { message } from "antd";
import { ProfileDetail, editProfileDetail } from "../../../../stores/interfaces/Profile";
const getDataProfile = async () => {
  let url: string = `/mcst/profile`;
    try {
      const result = await axios.get(url);
      if (result.status === 200) {
        const profile = result.data.result;
       const profileDetail:ProfileDetail={
         id: profile.id,
         lastName: profile.lastName,
         firstName: profile.firstName,
         middleName: profile.middleName,
         nickName: profile.nickName,
         email: profile.email,
         active: profile.active,
         verifyByJuristic: profile.verifyByJuristic,
         channel: profile.channel,
         imageProfile: profile.imageProfile,
         contact: profile.contact,
         createdAt: profile.createdAt,
         role: profile.role.name,
       }
        return {
          total: result.data.result.total,
          status: true,
          data: profileDetail,
        };
      } else {
        console.warn("status code:", result.status);
        console.warn("data error:", result.data);
      }
    } catch (err:AxiosError | any) {
      console.log("err:", err);
      return {
        status: false,
        data: err.response?.data?.message? err.response?.data?.message:err.response.statusText,
      };
    }
};

 const EditDataProfile = async ( data: editProfileDetail) => {
  try {
    const result = await axios.put(`/mcst/profile`, data);
    if (result.status === 200) {
      console.log("eidt data success:",result.data);
      
      return true;
    } else {
      message.error(result.data.message)
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
export { getDataProfile,EditDataProfile };
