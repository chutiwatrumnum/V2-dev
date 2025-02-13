import { useState, useEffect, useRef } from "react";
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
  TimePicker,
  Tag,
  theme,
} from "antd";
import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RangePickerProps } from "antd/es/date-picker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { emailGroupSelect } from "../../../stores/interface/Buliding";
import {
  addBuildingActivity,
  addMaintenanceFacilities,
  getdataEmailGrouplist,
} from "../../building_activities/service/api/buildingActivitesAPI";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";
import { CreateMaintenanceFacilities } from "../../../stores/interface/Facilities";
dayjs.extend(customParseFormat);
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf("day");
};
interface ComponentCreateProps {
  id: number | null;
  name: string | null;
  isOpen: boolean;
  callBack: (isOpen: boolean, saved: boolean) => void;
}
let emailGroup: any[] = [];
const { confirm } = Modal;

const CreateMaintenance = (props: ComponentCreateProps) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [defaultEmailGroup, setDefaultEmailGroup] = useState<string[]>([]);
  const [emailGroupDataList, setEmailGroupDataList] = useState<
    emailGroupSelect[]
  >([]);
  const [reminderNotificationSelect, setReminderNotificationSelect] =
    useState<any>();
  const [disableDatePicker, setdisableDatePicker] = useState<boolean>(true);
  const inputRef = useRef<InputRef>(null);
  const dispatch = useDispatch<Dispatch>();

  const handleCancel = async () => {
    await props.callBack(!props?.isOpen, false);
    await resetValue();
  };

  //from
  const [form] = Form.useForm();

  const resetValue = async () => {
    await setDefaultEmailGroup([]);
    await form.resetFields();
    await setTags([]);
  };
  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      icon: null,
      content: "Are you sure you want to create maintenance?",
      okText: "Yes",
      className: "confirmStyle",
      bodyStyle: {
        textAlign: "center",
      },
      okType: "primary",
      cancelText: "Cancel",
      centered: true,

      async onOk() {
        const request: CreateMaintenanceFacilities = {
          facilitiesId: props?.id,
          title: values?.title,
          date: dayjs(values.date).format("YYYY-MM-DD"),
          startTime: dayjs(values.startTime).format("HH:mm A"),
          endTime: dayjs(values.endTime).format("HH:mm A"),
        };
        if (values.sendGroup > -1) {
          request.sendMailGroupId = values.sendGroup;
          request.sendMailGroup = [...defaultEmailGroup, ...tags];
        } else if (values.emailGroup) {
          request.sendMailGroup = tags;
        }
        if (values.note) {
          request.note = values.note;
        }
        if (values.reminderNotification) {
          if (values.reminderNotification === "0 Day") {
            request.remindNotiDays = 0;
          } else {
            request.remindNotiDays = values.reminderNotification;
          }
        } else if (values.reminderNotification === 0) {
          request.remindNotiDays = values.reminderNotification;
        }
        console.log("====================================");
        console.log("request:", request);
        console.log("====================================");
        const reultCreated = await addMaintenanceFacilities(request);
        if (reultCreated) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully created",
          });
          await resetValue();
          await props.callBack(!props?.isOpen, true);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed created",
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
        const result: any = await getdataEmailGrouplist();
        if (result?.status) {
          await setEmailGroupDataList(result?.datavalue);
          emailGroup = result?.emailGroup;
        }
        console.log("====================================");
        console.log("props:", props);
        console.log("====================================");
        await form.setFieldsValue({ facilitiesId: props?.name });
      })();
    }
  }, [props?.isOpen]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const reminderNotification: any = [
    {
      label: "1 Day",
      value: 1,
    },
    {
      label: "2 Day",
      value: 2,
    },
    {
      label: "3 Day",
      value: 3,
    },
    {
      label: "4 Day",
      value: 4,
    },
  ];

  //Tag
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = async (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    if (newTags.length < 1) {
      await form.setFieldsValue({
        emailGroup: null,
      });
    }
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      await setTags([...tags, inputValue]);
      await form.setFieldsValue({
        emailGroup: inputValue,
      });
    }
    await setInputVisible(false);
    await setInputValue("");
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);

  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };
  //Tag
  const handleChangeEmailGroupList = async (e: any) => {
    if (e > -1) {
      await setDefaultEmailGroup(emailGroup[e]);
      await form.setFieldsValue({ emailGroup: [emailGroup[e]] });
    } else {
      await setDefaultEmailGroup(emailGroup[e]);
    }
  };
  const handlerDefaultEmailGroupClose = async (removedEmailGroup: string) => {
    const newEmailGroup = defaultEmailGroup.filter(
      (emailGroup) => emailGroup !== removedEmailGroup
    );
    await setDefaultEmailGroup(newEmailGroup);
  };
  return (
    <>
      <Modal
        title="Create maintenance"
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
            onClick={form.submit}
          >
            Create
          </Button>,
        ]}
      >
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
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: "Please fill in required field" },
                  {
                    max: 99,
                    message: "Value should be less than 99 character",
                  },
                ]}
              >
                <Input placeholder="Input title" maxLength={100} />
              </Form.Item>
              <Form.Item
                name="facilitiesId"
                label="Facility"
                // rules={[
                //   { required: true, message: "Please fill in required field" },
                // ]}
              >
                <Input
                  value={props?.name ? props?.name : ""}
                  disabled={true}
                  placeholder="Select facility"
                />
              </Form.Item>

              <Form.Item
                name="date"
                label="Date"
                rules={[
                  { required: true, message: "Please fill in required field" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                  onChange={async (val) => {
                    if (val) {
                      const date1 = dayjs(dayjs(val).format("YYYY-MM-DD"));
                      const date2 = dayjs(dayjs().format("YYYY-MM-DD"));
                      const diffRsult = date1.diff(date2, "day");
                      if (diffRsult > 0) {
                        if (diffRsult > 0 && diffRsult <= 4) {
                          const reminderNotificationResult =
                            reminderNotification.slice(0, diffRsult);
                          await setReminderNotificationSelect(
                            reminderNotificationResult
                          );
                          await form.setFieldsValue({
                            reminderNotification: null,
                          });
                        } else if (diffRsult > 4) {
                          await setReminderNotificationSelect(
                            reminderNotification
                          );
                          await form.setFieldsValue({
                            reminderNotification: null,
                          });
                        }
                        await setdisableDatePicker(false);
                      } else if (diffRsult === 0) {
                        await setReminderNotificationSelect([
                          {
                            label: "0 Day",
                            value: 0,
                          },
                        ]);
                        await setdisableDatePicker(false);
                      } else {
                        await setdisableDatePicker(true);
                      }
                    } else {
                      await setdisableDatePicker(true);
                    }
                  }}
                />
              </Form.Item>

              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Start time"
                    name="startTime"
                    rules={[
                      {
                        required: true,
                        message: "This field is required !",
                      },
                    ]}
                  >
                    <TimePicker className="fullWidth" format="hh:mm a" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="End time"
                    name="endTime"
                    rules={[
                      {
                        required: true,
                        message: "This field is required !",
                      },
                    ]}
                  >
                    <TimePicker className="fullWidth" format="hh:mm a" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="reminderNotification"
                label="Notification setting"
              >
                <Select
                  allowClear
                  disabled={disableDatePicker}
                  options={reminderNotificationSelect}
                  placeholder="Select day"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="sendGroup" label="Send group">
                <Select
                  options={emailGroupDataList}
                  allowClear
                  onChange={handleChangeEmailGroupList}
                  placeholder="Select group"
                />
              </Form.Item>

              <Form.Item label="Additional email" name="emailGroup">
                {defaultEmailGroup?.length > 0
                  ? defaultEmailGroup.map((element: any) => {
                      return (
                        <Tag
                          closable
                          onClose={async (e) => {
                            await e.preventDefault();
                            await handlerDefaultEmailGroupClose(element);
                          }}
                        >
                          {element}
                        </Tag>
                      );
                    })
                  : null}
                {tagChild}
                {inputVisible ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                ) : (
                  <Tag onClick={showInput} style={tagPlusStyle}>
                    <PlusOutlined /> New email
                  </Tag>
                )}
              </Form.Item>

              <Form.Item label="Note" name="note">
                <Input.TextArea
                  showCount
                  style={{ height: 250, resize: "none" }}
                  rows={4}
                  maxLength={200}
                  placeholder="Input note"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateMaintenance;
