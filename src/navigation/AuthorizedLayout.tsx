import { useEffect, useLayoutEffect } from "react";
import { useOutlet, useNavigate, Navigate } from "react-router-dom";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../stores";
import SideMenu from "../components/templates/SideMenu";

import "./styles/authorizedLayout.css";
import { setupAxiosInterceptors } from "../configs/axios";

const { Sider, Content } = Layout;

function AuthorizedLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const outlet = useOutlet();
  useLayoutEffect(() => {
    // console.log("AxiosConfig running.....");
    // เรียกใช้ function setupAxiosInterceptors เมื่อ component โหลด
    try {
      setupAxiosInterceptors(navigate, dispatch);
    } catch (error) {
      console.log("setupAxiosInterceptors error :: ", error);
    }
  }, [navigate]);

  return (
    <Layout>
      <Sider width={320} className="sideContainer">
        <SideMenu />
      </Sider>
      <div className="authorizeBG" />
      <Layout style={{ marginLeft: 320 }}>
        <Content className="authorizeContentContainer">
          <div>{outlet}</div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AuthorizedLayout;
