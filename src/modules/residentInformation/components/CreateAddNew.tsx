import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  notification,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  ResidentAddNew,
  blockDetail,
  unitDetail,
  roleDetail,
} from "../../../stores/interfaces/Resident";
import {
  addResident,
  getdatablock,
  getdatarole,
} from "../service/api/ResidentServiceAPI";
import { useDispatch } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
dayjs.extend(customParseFormat);
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf("day");
};
const disabledDateBirth: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf("day");
};
interface ComponentCreateProps {
  isOpen: boolean;
  callBack: (isOpen: boolean, saved: boolean) => void;
}
let blocklst: any[] = [];
const { confirm } = Modal;

const CreateAddNew = (props: ComponentCreateProps) => {
  const [selectedblock, setselectedblock] = useState(true);
  const [block, setblock] = useState<blockDetail[] | any>([]);
  const [unit, setunitDetail] = useState<unitDetail[]>([]);
  const [role, setrole] = useState<roleDetail[]>([]);
  // const [hobby, sethobbyDetail] = useState<hobbyDetail[]>([]);
  const dispatch = useDispatch<Dispatch>();

  const handleCancel = async () => {
    await form.resetFields();
    await props.callBack(!props?.isOpen, false);
  };

  //from
  const [form] = Form.useForm();
  const { Option } = Select;

  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to register?",
      icon: null,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        values.moveInDate = values.moveInDate
          ? dayjs(values.moveInDate).format("YYYY-MM-DD")
          : null;
        values.moveOutDate = values.moveOutDate
          ? dayjs(values.moveOutDate).format("YYYY-MM-DD")
          : null;
        values.birthDate = values.birthDate
          ? dayjs(values.birthDate).format("YYYY-MM-DD")
          : null;
        values.channel = "web";
        const request: ResidentAddNew = {
          firstName: values.firstName,
          lastName: values.lastName,
          nickName: values.nickName ? values.nickName : null,
          email: values.email,
          roleId: values.roleId,
          hobby: values.hobby,
          unitId: values.unitId,
          iuNumber: values.iuNumber ? values.iuNumber : null,
          contact: values.contact,
          middleName: values.middleName,
          imageProfile: values.imageProfile,
          birthDate:
            values.birthDate !== "Invalid Date" ? values.birthDate : null,
          channel: values.channel,
          moveInDate:
            values.moveInDate !== "Invalid Date" ? values.moveInDate : null,
          moveOutDate:
            values.moveOutDate !== "Invalid Date" ? values.moveOutDate : null,
        };

        const resultCreated = await addResident(request);
        if (resultCreated == true) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully register",
          });
          await props.callBack(!props?.isOpen, true);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: resultCreated,
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
        await initDattaCreate();
      })();
    }
  }, [props?.isOpen]);

  const initDattaCreate = async () => {
    // const dataehobby: any = await getdatahobby();
    const dataerole: any = await getdatarole();
    const dataeblock = await getdatablock();
    blocklst = dataeblock?.datablock;
    // await sethobbyDetail(dataehobby?.datahobby);
    await setrole(dataerole?.datarole);
    await setblock(dataeblock?.dataselectblock);
    await handleChangeBlock(1);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChangeBlock = async (e: any) => {
    await form.setFieldsValue({
      unitId: null,
    });
    if (e) {
      await setselectedblock(false);
      const unitdata = blocklst[e - 1].unit;
      const arrayUnit: unitDetail[] = [];
      unitdata.map((e: any) => {
        if (e?.active) {
          const unitdata: unitDetail = {
            label: e.unitNo,
            value: e.id,
          };
          arrayUnit.push(unitdata);
        }
      });
      if (arrayUnit.length > 0) {
        await setunitDetail(arrayUnit);
      }
    }
  };
  return (
    <>
      <Modal
        title="Add new resident"
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
            <Col span={8}>
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
                <Input placeholder="Input email" />
              </Form.Item>
              {/* <Form.Item
                name="blockNo"
                label="Block no."
                rules={[{ required: true, message: "Block" }]}
              >
                <Select
                  options={block}
                  onChange={handleChangeBlock}
                  placeholder="Input block no."
                />
              </Form.Item> */}
              <Form.Item
                name="unitId"
                label="Unit no."
                rules={[{ required: true, message: "Unit" }]}>
                <Select
                  disabled={selectedblock}
                  options={unit}
                  placeholder="Select unit no."
                />
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
                  { max: 10, message: "max 10 number" },
                  { pattern: new RegExp(/^[0-9]*$/), message: "digit only" },
                ]}>
                <Input placeholder="Input IU number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Please select role" }]}>
                <Select options={role} placeholder="Select role" />
              </Form.Item>
              <Form.Item name="birthDate" label="Birthday">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select birthday"
                  disabledDate={disabledDateBirth}
                />
              </Form.Item>
              <Form.Item
                label="Contact No."
                name="contact"
                rules={[
                  { max: 10, message: "max 10 number" },
                  { pattern: new RegExp(/^[0-9]*$/), message: "digit only" },
                  { required: true, message: "Please fill in required field" },
                ]}>
                <Input placeholder="Input contact no." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateAddNew;
