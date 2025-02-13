import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import dayjs from "dayjs";
import axios from "axios";
import "../styles/ReserveFacility.css";

//components
import {
  Modal,
  Button,
  Radio,
  Space,
  Input,
  Col,
  Row,
  Form,
  Select,
  message,
  Spin,
} from "antd";
import CALENDAR_ICON from "../../../assets/icons/Calendar.svg";

//interface
import type { RadioChangeEvent } from "antd";
import {
  DataType,
  ReserveSlotModalPropsType,
  SlotSelectedType,
  UnitRoomType,
  UserDataType,
} from "../interface/Reserve";
import { ReserveFacilityType } from "../../../stores/interface/Facilities";
import {
  noTextInputRule,
  normalInputRule,
  requiredMailRule,
  requiredRule,
} from "../../../utils/formRule";

const { TextArea } = Input;
const { confirm } = Modal;

const ReserveSlotModal = ({
  roomSelected,
  dateSelected,
  onCancel,
  isLoading = true,
  isOpen = false,
}: ReserveSlotModalPropsType) => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const [reserveForm] = Form.useForm();
  const reserveSlotTime = useSelector(
    (state: RootState) => state.facilities.reserveSlotTime
  );
  const unitOptions = useSelector(
    (state: RootState) => state.common.unitOptions
  );
  const [slotSelected, setSlotSelected] = useState<SlotSelectedType>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [userNameList, setUserNameList] = useState<UserDataType[]>();
  const [sessionSelected, setSessionSelected] = useState(0);

  //functions
  const onChange = (e: RadioChangeEvent) => {
    // console.log("radio checked", e.target.value);
    setSlotSelected(e.target.value);
  };

  const onFinish = async (values: any) => {
    // console.log(values);
    let payload: ReserveFacilityType = {
      purpose: values.purpose,
      joinAt: dayjs(dateSelected).format("YYYY-MM-DD"),
      facilityId: roomSelected.value,
      userId: values.userId,
      note: values?.note,
      slotTimeId: slotSelected?.id ?? -1,
      contactNo: values.contactNo,
      email: values.email,
    };
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to reserve?",
      icon: null,
      okText: "Yes",
      okType: "primary",
      cancelText: "Cancel",
      centered: true,

      async onOk() {
        if (payload.slotTimeId === -1) {
          message.error("Something went wrong. Please try again");
          return;
        }
        await dispatch.facilities.reserveFacility(payload);
        clear();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const clear = () => {
    reserveForm.resetFields();
    setSessionSelected(0);
    setSlotSelected(undefined);
    setIsBookingOpen(false);
    setUserNameList(undefined);
    onCancel();
  };

  const setDefaultValue = () => {
    reserveForm.setFieldsValue({
      date: dayjs(dateSelected).format("DD-MM-YYYY"),
      time: `${slotSelected?.startTime} - ${slotSelected?.endTime}`,
      location: roomSelected.label,
    });
  };

  const onUnitSelected = async (value: number) => {
    reserveForm.setFieldsValue({
      contactNo: null,
      email: null,
      userId: null,
    });
    setUserNameList([]);
    const unitResult = await axios.get(`/users?active=true&unitId=${value}`);
    if (unitResult.status >= 400) {
      console.error(unitResult.data.message);
      return;
    }
    if (unitResult.data.result.dataListLength === 0) {
      message.info("No user data in this unit");
      return;
    }
    setUserNameList(unitResult.data.result.dataList);
  };

  const onUserSelected = async (value: string, option: any) => {
    reserveForm.setFieldsValue({
      contactNo: option.contact,
      email: option.email,
    });
  };

  const onSessionSelected = (e: RadioChangeEvent) => {
    setSessionSelected(e.target.value);
  };

  // useEffect(() => {
  //   console.log(reserveSlotTime);
  // }, []);

  return (
    <>
      <Modal
        title="Available session"
        open={isOpen}
        footer={
          reserveSlotTime?.slotTime
            ? [
                <Button
                  shape="round"
                  style={{ width: 120 }}
                  key="submit"
                  type="primary"
                  onClick={() => {
                    setDefaultValue();
                    onCancel();
                    setIsBookingOpen(true);
                  }}
                  disabled={
                    slotSelected && dayjs(dateSelected + " 23:00") >= dayjs()
                      ? false
                      : true
                  }
                >
                  Next
                </Button>,
              ]
            : null
        }
        onCancel={clear}
      >
        {isLoading ? (
          <div className="loadingContainer">
            <Spin />
            <p>Loading...</p>
          </div>
        ) : reserveSlotTime?.slotTime ? (
          <>
            <Row>
              <span style={{ margin: "10px 0" }}>
                {`Date : `} <b>{dayjs(dateSelected).format("DD-MM-YYYY")}</b>
              </span>
            </Row>
            {reserveSlotTime.sessionGroupByTab ? (
              <>
                <Col
                  style={{
                    width: "60%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 30,
                  }}
                >
                  {reserveSlotTime.slotTime.map((slotTime, index) => {
                    return (
                      <Radio.Group
                        onChange={onSessionSelected}
                        value={sessionSelected}
                      >
                        <Radio.Button value={index}>
                          {slotTime.sessionGroup} session
                        </Radio.Button>
                      </Radio.Group>
                    );
                  })}
                </Col>
                <Radio.Group onChange={onChange} value={slotSelected}>
                  <Row>
                    {reserveSlotTime.slotTime[sessionSelected].data.map(
                      (item) => {
                        return (
                          <Col span={12} style={{ marginBottom: 10 }}>
                            <Radio
                              value={item}
                            >{`${item.startTime} - ${item.endTime}`}</Radio>
                          </Col>
                        );
                      }
                    )}
                  </Row>
                </Radio.Group>
              </>
            ) : (
              <>
                <Radio.Group
                  onChange={onChange}
                  value={slotSelected}
                  style={{ width: "100%" }}
                >
                  <Row>
                    {reserveSlotTime.slotTime.map((slotTime) => {
                      return (
                        <>
                          {slotTime.data.map((item) => {
                            return (
                              <Col span={12} style={{ marginBottom: 10 }}>
                                <Radio
                                  value={item}
                                >{`${item.startTime} - ${item.endTime}`}</Radio>
                              </Col>
                            );
                          })}
                        </>
                      );
                    })}
                  </Row>
                </Radio.Group>
              </>
            )}
          </>
        ) : (
          <Col className="noSlot">
            <img src={CALENDAR_ICON} alt="Calendar" />
            <p style={{ marginTop: 20 }}>
              There were no empty slots for today.
            </p>
          </Col>
        )}
      </Modal>
      <Modal
        title="Create booking"
        width={1000}
        open={isBookingOpen}
        footer={null}
        onCancel={clear}
      >
        <Form
          form={reserveForm}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row justify="space-between">
            <Col span={11} className="formBlockReserveSlot">
              <Form.Item label="Purpose" name="purpose" rules={normalInputRule}>
                <Input width="100%" placeholder="Input purpose" />
              </Form.Item>
              <Row>
                <Col span={12} className="formBlockReserveSlot">
                  <Form.Item label="Date" name="date">
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Time" name="time">
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Location" name="location">
                <Input disabled={true} />
              </Form.Item>
              <Form.Item label="Unit no" name="unitNo" rules={requiredRule}>
                <Select
                  showSearch
                  fieldNames={{ label: "unitNo", value: "id" }}
                  placeholder="Select unit no."
                  optionFilterProp="children"
                  onChange={onUnitSelected}
                  filterOption={(input, option) =>
                    (option?.unitNo ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={unitOptions}
                />
              </Form.Item>
              <Form.Item label="Name" name="userId" rules={requiredRule}>
                <Select
                  showSearch
                  fieldNames={{ label: "fullName", value: "id" }}
                  placeholder="Select name"
                  optionFilterProp="children"
                  onChange={onUserSelected}
                  filterOption={(input, option) =>
                    (option?.firstName ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={userNameList}
                />
              </Form.Item>
            </Col>
            <Col span={11} className="formBlockReserveSlot">
              <Form.Item
                label="Contact no."
                name="contactNo"
                rules={noTextInputRule}
              >
                <Input width="100%" placeholder="Input contact no." />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={requiredMailRule}>
                <Input width="100%" placeholder="Input email" />
              </Form.Item>
              <Form.Item label="Note" name="note">
                <TextArea
                  placeholder="Input note"
                  showCount
                  maxLength={200}
                  rows={8}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="noMargin" wrapperCol={{ offset: 21, span: 3 }}>
            <Button
              shape="round"
              style={{ width: 120 }}
              key="submit"
              type="primary"
              htmlType="submit"
            >
              Reserve
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReserveSlotModal;
