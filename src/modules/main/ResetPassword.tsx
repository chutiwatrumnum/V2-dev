import { useRef } from "react";
import { Col, Space, Button, Typography, Form, Input, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../stores";
import { useParams, useNavigate } from "react-router-dom";

import { ResetPasswordPayloadType } from "../../stores/interfaces/User";
import type { FormInstance } from "antd/es/form";

import LOGO from "../../assets/images/logo.svg";

import "./styles/forgotPassword.css";

const { Text, Title } = Typography;

const resetPasswordRule = [
  { required: true, message: "Please re-enter the new password" },
  {
    pattern: new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-])[a-zA-Z0-9@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]{8,}$"
    ),
    message: (
      <span>
        Password must contain at least 8 characters, one lowercase letter,
        <br />
        uppercase letter, number, and special character
      </span>
    ),
  },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const test = useParams();
  const formRef = useRef<FormInstance>(null);
  const confirmModal = useSelector(
    (state: RootState) => state.common.confirmModal
  );

  const onFinish = async (values: ResetPasswordPayloadType) => {
    dispatch.common.updateConfirmModalState({
      ...confirmModal,
      open: true,
      title: "Are you sure?",
      cancelText: "Cancel",
      confirmText: "Yes",
      description:
        "Are you sure you want to require a password reset on next login for this user? This will prompt the user to create and confirm a new password the next time they attempt to login.",
      onConfirm: onConfirm,
      onConfirmParams: values,
    });
  };

  const onConfirm = async (values: ResetPasswordPayloadType) => {
    let payload: ResetPasswordPayloadType = { ...test, ...values };
    let resetStatus = await dispatch.userAuth.resetPassword(payload);
    if (resetStatus && resetStatus >= 400) {
      dispatch.common.updateConfirmModalState({
        ...confirmModal,
        loading: false,
      });
      return;
    }
    dispatch.common.updateConfirmModalState({
      ...confirmModal,
      loading: false,
    });
    navigate("/landing-screen");
    message.success("Reset password successfully");
    dispatch.common.updateSuccessModalState({
      open: true,
      text: "Successfully saved",
    });
  };

  const onFinishFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Col>
      <div className="logoContainer">
        <img src={LOGO} alt="logo" className="logo" />
      </div>
      <Col className="column forgotPasswordTitle">
        <Title level={3}>
          <span className="textColor">Forgot your password?</span>
        </Title>
        <Text className="textColor">
          Enter a new password below to change your password
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
        autoComplete="off">
        <Form.Item
          label={<Text className="textColor bold">New password</Text>}
          name="password"
          rules={resetPasswordRule}>
          <Input.Password placeholder="Input new password" size="large" />
        </Form.Item>

        <Form.Item
          label={<Text className="textColor bold">Re-enter new password</Text>}
          name="confirmPassword"
          rules={[
            ...resetPasswordRule,
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "The passwords you entered do not match. Please ensure both passwords are identical."
                  )
                );
              },
            }),
          ]}>
          <Input.Password placeholder="Input new password" size="large" />
        </Form.Item>

        <Form.Item className="txtCenter">
          <Button
            shape="round"
            className="resetPasswordBtn"
            type="primary"
            htmlType="submit"
            size="large">
            <span className="bold"> Reset password</span>
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
};

export default ResetPassword;
