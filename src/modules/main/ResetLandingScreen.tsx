import { Col, Space, Button, Typography, Form, Input } from "antd";
import { Link } from "react-router-dom";

import LOGO from "../../assets/images/logo.svg";
import LOGIN_EMAIL_ICON from "../../assets/icons/Login_email.svg";
import LOGIN_PASSWORD_ICON from "../../assets/icons/Login_password.svg";

import "./styles/signIn.css";

const { Text, Title } = Typography;

const ResetLandingScreen = () => {
  return (
    <Col className="containerSignIn">
      <Space direction="vertical" size={0} style={{ alignItems: "center" }}>
        <img src={LOGO} alt="logo" className="logo" />
      </Space>
      <Col style={{ justifyContent: "center", marginTop: 30 }}>
        <Title level={3}>
          <span style={{ color: "#fff" }}>Password changed!</span>
        </Title>
        <Text className="textColor">
          Your password has been changed successfully.
        </Text>
      </Col>
    </Col>
  );
};

export default ResetLandingScreen;
