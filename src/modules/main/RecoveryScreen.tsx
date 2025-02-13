import { useRef } from "react";
import { Col, Space, Button, Typography, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";

import type { FormInstance } from "antd/es/form";

import LOGO from "../../assets/images/logo.svg";

import "./styles/forgotPassword.css";

const { Text, Title } = Typography;

const RecoveryScreen = () => {
  const dispatch = useDispatch<Dispatch>();
  const formRef = useRef<FormInstance>(null);

  const onFinish = async (values: { email: string }) => {
    await dispatch.userAuth.recoveryByEmail(values);
  };

  const onFinishFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };

  const onCancel = () => {
    formRef.current?.resetFields();
  };

  return (
    <Col>
      <Space direction="vertical" size={0} style={{ alignItems: "center" }}>
        <img src={LOGO} alt="logo" className="logo" />
      </Space>
      <Col className="column forgotPasswordTitle">
        <Title level={3}>
          <span className="bold">Forgot your password?</span>
        </Title>
        <Text className="textColor">
          Enter your email to receive further guidance
        </Text>
      </Col>
      <Form
        name="recovery"
        ref={formRef}
        className="formForgotPassword"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<Text className="textColor bold">Email</Text>}
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid email",
            },
            {
              required: true,
              message: "Please fill in required field",
            },
          ]}
        >
          <Input placeholder="Input email address" size="large" />
        </Form.Item>

        <Form.Item className="txtCenter">
          <Button
            shape="round"
            className="transBtn"
            htmlType="button"
            onClick={onCancel}
            href="/auth"
            size="large"
          >
            <span className="bold">Cancel</span>
          </Button>
          <Button
            shape="round"
            className="sendBtn"
            type="primary"
            htmlType="submit"
            size="large"
          >
            <span className="bold">Send</span>
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
};

export default RecoveryScreen;
