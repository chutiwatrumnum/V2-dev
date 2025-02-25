import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import dayjs from "dayjs";
import { Button, Modal, Form, Input, Row, Col, DatePicker, Select } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DataType,
  roleDetail,
  ResidentAddNew,
  unitDetail,
} from "../../../stores/interfaces/Payment";
import axios from "axios";
import {
  editdataresident,
  getdatarole,
} from "../service/api/PaymentServiceAPI";

dayjs.extend(customParseFormat);

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf("day");
};
const disabledDateBirth: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf("day");
};

const { confirm } = Modal;
interface MyComponentProps {
  resident: DataType | null;
  isOpen: boolean;

  callBack: (isOpen: boolean, saved: boolean) => void;
}
const EditResidentInformation = (props: MyComponentProps) => {
  const unitOptions = useSelector(
    (state: RootState) => state.common.unitOptions
  );
  // const [unit, setunitDetail] = useState<unitDetail[] | any>([]);
  const [role, setrole] = useState<roleDetail[] | any>([]);
  // const [hobby, sethobbyDetail] = useState<hobbyDetail[]|any>([]);
  const [ismodal, setismodal] = useState<boolean>(false);
  const [initloading, setinitloading] = useState<boolean>(false);
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
    const editdata: any = props?.resident;
    const dataerole: any = await getdatarole();

    const currentUnit = unitOptions.find(
      (item) => item.label === editdata.unitNo
    );

    if (dataerole?.datarole) {
      dataerole?.datarole.map((e: any) => {
        if (e?.label === props?.resident?.role) {
          editdata.roleId = e?.value;
        }
      });
    }

    setrole(dataerole?.datarole);

    editdata.birthDate =
      dayjs(props?.resident?.birthDate).format("DD/MM/YYYY") !== "Invalid Date"
        ? dayjs(props?.resident?.birthDate)
        : null;

    editdata.moveInDate =
      dayjs(props?.resident?.moveInDate).format("DD/MM/YYYY") !== "Invalid Date"
        ? dayjs(props?.resident?.moveInDate)
        : null;

    editdata.moveOutDate =
      dayjs(props?.resident?.moveOutDate).format("DD/MM/YYYY") !==
      "Invalid Date"
        ? dayjs(props?.resident?.moveOutDate)
        : null;

    editdata.unitId = currentUnit?.value;

    form.setFieldsValue({
      ...editdata,
    });

    await setismodal(true);
  };
  const handleCancel = async () => {
    await form.resetFields();
    await setismodal(false);
    await props.callBack(!props?.isOpen, false);
  };

  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to edit resident’s information?",
      icon: null,
      // content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        values.moveInDate = dayjs(values.moveInDate).format("YYYY-MM-DD");
        values.moveOutDate = dayjs(values.moveOutDate).format("YYYY-MM-DD");
        values.birthDate = dayjs(values.birthDate).format("YYYY-MM-DD");
        values.channel = "web";
        values.imageProfile = "base64";
        const request: ResidentAddNew = {
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName,
          nickName: values.nickName ? values.nickName : null,
          email: values.email,
          roleId: values.roleId,
          hobby: values.hobby,
          unitId: values.unitId,
          iuNumber: values.iuNumber ? values.iuNumber : null,
          contact: values.contact,
          imageProfile: values.imageProfile,
          birthDate:
            values.birthDate !== "Invalid Date" ? values.birthDate : null,
          channel: values.channel,
          moveInDate:
            values.moveInDate !== "Invalid Date" ? values.moveInDate : null,
          moveOutDate:
            values.moveOutDate !== "Invalid Date" ? values.moveOutDate : null,
        };

        const resultedit = await editdataresident(
          props?.resident?.key,
          request
        );
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

  return (
    <>
      <Modal
        title="Edit resident’s information"
        width={1200}
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
          labelCol={{ span: 20 }}
          wrapperCol={{ span: 22 }}
          style={{ width: "100%", paddingTop: 10 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Row>
            <Col span={8}>
              <Form.Item
                label="First name"
                name="firstName"
                rules={[
                  { max: 25, message: "max 25 charecter" },
                  {
                    pattern: new RegExp(/^[a-zA-Z]*$/),
                    message: "character only",
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
              <Form.Item label="Nickname" name="nickName">
                <Input placeholder="Input nickname" />
              </Form.Item>
            </Col>

            <Col span={8}>
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
                <Input disabled placeholder="Input email" />
              </Form.Item>
              <Form.Item
                name="unitId"
                label="Unit no."
                rules={[{ required: true, message: "Unit" }]}>
                <Select options={unitOptions} placeholder="Select unit no." />
              </Form.Item>

              <Row>
                <Col span={12}>
                  <Form.Item name="moveInDate" label="Move-in date">
                    <DatePicker
                      style={{ width: "92%" }}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="moveOutDate" label="Move-out date">
                    <DatePicker
                      style={{ width: "92%" }}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="IU number"
                name="iuNumber"
                rules={[
                  { max: 10, message: "max 10 charecter" },
                  { pattern: new RegExp(/^[0-9]*$/), message: "digit only" },
                ]}>
                <Input placeholder="Input iu number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Role" }]}>
                <Select options={role} placeholder="Select role." />
              </Form.Item>
              <Form.Item name="birthDate" label="Birthday (Op)">
                <DatePicker
                  placeholder="Select birthday"
                  style={{ width: "100%" }}
                  disabledDate={disabledDateBirth}
                />
              </Form.Item>
              <Form.Item
                label="Contact No."
                name="contact"
                rules={[
                  { max: 10, message: "max 10 charecter" },
                  { pattern: new RegExp(/^[0-9]*$/), message: "digit only" },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input phone no." />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item wrapperCol={{ offset: 21, span: 16 }}>
            <Button shape="round" shape="round"
              style={{ paddingLeft: 30, paddingRight: 30 }}
              type="primary"
              htmlType="submit">
              Save
            </Button>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default EditResidentInformation;
