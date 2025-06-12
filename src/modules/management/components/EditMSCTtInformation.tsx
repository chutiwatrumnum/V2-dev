import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  notification,
  Form,
  Input,
  Row,
  Col,
  Select,
} from "antd";
import {
  MSCTAddNew,
  roleDetail,
  DataType,
} from "../../../stores/interfaces/Management";
import UploadImageGroup from "../../../components/groups/UploadImageGroup";
import { getdataRole, editdataMCST } from "../service/api/MCSTServiceAPI";
import { Dispatch, RootState } from "../../../stores";
interface EditMSCTComponentProps {
  MCST: DataType | null;
  isOpen: boolean;

  callBack: (isOpen: boolean, saved: boolean) => void;
}

const { confirm } = Modal;

const EditMSCTtInformation = (props: EditMSCTComponentProps) => {
  const [role, setrole] = useState<roleDetail[] | any>([]);
  const [ismodal, setismodal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const dispatch = useDispatch<Dispatch>();
  //from
  const [form] = Form.useForm();
  useEffect(() => {
    if (props?.isOpen) {
      (async function () {
        await initedit();
      })();
    }
  }, [props?.isOpen]);

  const initedit = async () => {
    const dataerole: any = await getdataRole();
    const dataEditinit: any = props?.MCST;
    dataEditinit.imageUrl = props?.MCST?.image;
    if (dataerole?.data) {
      dataerole?.data.map((e: any) => {
        if (e?.label === props?.MCST?.role) {
          dataEditinit.roleId = e?.value;
        }
      });
    }
    await setImageUrl(props?.MCST?.image);
    await form.setFieldsValue({ ...dataEditinit });
    await setrole(dataerole?.data);
  };
  const handleCancel = async () => {
    await form.resetFields();
    await setismodal(false);
    await props.callBack(!props?.isOpen, false);
  };
  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to edit this admin user?",
      icon: null,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        values.channel = "web";
        const request: any = {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          email: values.email,
          roleId: values.roleId,
          contact: values.contact,
          imageProfile:
            values.imageUrl !== props?.MCST?.image ? values.imageUrl : null,
          channel: values.channel,
        };
        const resultedit = await editdataMCST(props?.MCST?.key, request);
        if (resultedit) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully edited",
          });
          await props.callBack(!props?.isOpen, true);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed edited",
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
  };
  return (
    <>
      <Modal
        title="Edit admin management"
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
            save
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
                  { max: 15, message: "max 15 charecter" },
                  { pattern: new RegExp(/^[0-9]*$/), message: "digit only" },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input phone no." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Image" name="imageUrl">
                <UploadImageGroup
                  image={imageUrl ? imageUrl : ""}
                  onChange={handleImageChange}
                />
              </Form.Item>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Role" }]}>
                <Select options={role} placeholder="Input role." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EditMSCTtInformation;
