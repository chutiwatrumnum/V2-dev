import { Col, Space, Button, Typography, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";
import { LoginPayloadType } from "../../stores/interfaces/User";
import { Link } from "react-router-dom";

import LOGO from "../../assets/images/logo.svg";
import LOGIN_EMAIL_ICON from "../../assets/icons/Login_email.svg";
import LOGIN_PASSWORD_ICON from "../../assets/icons/Login_password.svg";

import "./styles/signIn.css";

const { Text } = Typography;

const SignInScreen = () => {
  const dispatch = useDispatch<Dispatch>();

  const onFinish = (values: LoginPayloadType) => {
    dispatch.userAuth.loginEffects(values);
  };

  const onFinishFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Col className="containerSignIn">
      <Space direction="vertical" size={0} style={{ alignItems: "center" }}>
        <img src={LOGO} alt="logo" className="logo" />
      </Space>
      <Form
        name="basic"
        className="formSignIn"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label={
            <Text style={{ color: "white" }} className="textColor">
              Email
            </Text>
          }
          name="username"
          required={true}>
          <Input placeholder="Input email address" size="large" />
        </Form.Item>

        <Form.Item
          label={
            <Text style={{ color: "white" }} className="textColor bold">
              Password
            </Text>
          }
          name="password"
          required={true}>
          <Input.Password placeholder="Input password" size="large" />
        </Form.Item>

        <Link to={"/recovery"} className="forgotPassword">
          <span>Forgot password?</span>
        </Link>

        <Form.Item className="txtCenter">
          <Button
            shape="round"
            className="loginBtn"
            type="primary"
            htmlType="submit"
            size="large">
            <span className="bold">Login</span>
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
};

export default SignInScreen;
