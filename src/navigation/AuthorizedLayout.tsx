import { useEffect, useLayoutEffect } from "react";
import { useOutlet, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../stores";
import { useDispatch } from "react-redux";
import { Dispatch } from "../stores";
import { encryptStorage } from "../utils/encryptStorage";

import SideMenu from "../components/templates/SideMenu";

import "./styles/AuthorizedLayout.css";

const { Sider, Content } = Layout;

function AuthorizedLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const userAuth = useSelector((state: RootState) => state.userAuth);
  const outlet = useOutlet();

  const refreshTokenHandle = async () => {
    let token = { token: await encryptStorage.getItem("refreshToken") };
    // let token = { token: "123" };
    if (token) await dispatch.userAuth.refreshToken(token);
  };

  useLayoutEffect(() => {
    (() => {
      if (!userAuth.isAuth) {
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 500);
        return;
      }
    })();
  }, []);
  return (
    <Layout>
      <Sider
        width={320}
        style={{
          background:
            "linear-gradient(177.2deg, #2D4B40 4.02%, #284138 32.87%, #223830 64.52%, #1D2F28 97.16%)",
          height: "100vh",
          position: "fixed",
          left: 0,
          overflow: "auto",
          top: 0,
          bottom: 0,
        }}
      >
        <SideMenu />
      </Sider>
      <Layout className="authContentContainer">
        <Content className="authContent">
          <div>{outlet}</div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AuthorizedLayout;
