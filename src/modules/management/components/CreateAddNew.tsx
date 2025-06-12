import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import UploadImageGroup from "../../../components/groups/UploadImageGroup";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  notification,
} from "antd";
import { MSCTAddNew, roleDetail } from "../../../stores/interfaces/Management";
import { getdataRole, addMSCT } from "../service/api/MCSTServiceAPI";
import { Dispatch, RootState } from "../../../stores";
interface ComponentCreateProps {
  isOpen: boolean;
  callBack: (isOpen: boolean, saved: boolean) => void;
}

const { confirm } = Modal;

const CreateAddNew = (props: ComponentCreateProps) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [role, setrole] = useState<roleDetail[]>([]);
  const dispatch = useDispatch<Dispatch>();
  const handleCancel = async () => {
    await form.resetFields();
    await props.callBack(!props?.isOpen, false);
  };

  //from
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      icon: null,
      content: "Do you want to proceed with adding a new admin?",
      okText: "Yes",
      className: "confirmStyle",
      bodyStyle: {
        textAlign: "center",
      },
      okType: "primary",
      cancelText: "Cancel",
      centered: true,

      async onOk() {
        const request: MSCTAddNew = {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          email: values.email,
          roleId: values.roleId,
          contact: values.contact,
          channel: "web",
          imageProfile: values.imageUrl ? values.imageUrl : null,
        };
        const reultCreated = await addMSCT(request);
        if (reultCreated) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully added",
          });
          await form.resetFields();
          await props.callBack(!props?.isOpen, true);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "failed added",
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    if (props?.isOpen) {
      (async function () {
        await initDataCreate();
      })();
    }
  }, [props?.isOpen]);

  const initDataCreate = async () => {
    const dataerole: any = await getdataRole();

    await setrole(dataerole?.data);
  };
  const handleImageChange = (url: string) => {
    setImageUrl(url);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Add admin management"
        width={800}
        centered
        open={props?.isOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            shape="round"
            key="submit"
            type="primary"
            style={{ paddingLeft: 30, paddingRight: 30 }}
            onClick={form.submit}>
            Register
          </Button>,
        ]}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 22 }}
          wrapperCol={{ span: 22 }}
          style={{ width: "100%", paddingTop: 10 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Row>
            <Col span={12}>
              <Form.Item
                label="First name"
                name="firstName"
                rules={[
                  { max: 25, message: "max 25 charecter" },
                  {
                    pattern: new RegExp(/^[a-zA-Z]*$/),
                    message: "charecter only",
                  },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input first name" />
              </Form.Item>
              <Form.Item
                label="Middle name"
                name="middleName"
                rules={[{ max: 25, message: "max 25 charecter" }]}>
                <Input placeholder="Input middle name" />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="lastName"
                rules={[
                  { max: 25, message: "max 25 charecter" },
                  {
                    pattern: new RegExp(/^[a-zA-Z]*$/),
                    message: "charecter only",
                  },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input last name" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    pattern: new RegExp(
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ),
                    message: "invalid email",
                  },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input email" />
              </Form.Item>
              <Form.Item
                label="Contact no."
                name="contact"
                rules={[
                  { max: 15, message: "max 15 character" },
                  { pattern: new RegExp(/^[0-9]*$/), message: "digit only" },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input contact no." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Image" name="imageUrl">
                <UploadImageGroup onChange={handleImageChange} image={""} />
              </Form.Item>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Role" }]}>
                <Select options={role} placeholder="Select role" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateAddNew;
