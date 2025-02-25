import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
import UploadImageGroup from "../../../components/groups/UploadImageGroup";
import SendToGroup from "../../../components/groups/SendToGroup";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import dayjs from "dayjs";

import "../styles/announcement.css";

import {
  AddNewAnnouncementType,
  DataAnnouncementType,
} from "../../../stores/interfaces/Announce";
import { ConvertDate, ConvertDateToString } from "../../../utils/helper";

const { TextArea } = Input;
const { confirm } = Modal;

interface FormPropsType {
  data: DataAnnouncementType | null;
  visible: boolean;
  onCancel: VoidFunction;
  onRefresh: VoidFunction;
}

const normalInputRule = [
  {
    pattern: new RegExp(/^[a-zA-Z0-9 ]*$/),
    message: "Can't use special character",
  },
  { required: true, message: "Please fill in required field" },
  {
    max: 99,
    message: "Value should be less than 99 character",
  },
];
const requiredRule = [
  { required: true, message: "Please fill in required field" },
];

const FormTemplate = ({
  onCancel,
  onRefresh,
  data = null,
  visible = false,
}: FormPropsType) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [units, setUnits] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isSendToModalOpen, setIsSendToModalOpen] = useState(false);
  const dispatch = useDispatch<Dispatch>();
  const [form] = Form.useForm();
  const title = data !== null ? "Edit announcement" : "Add new announcement";

  const onFinish = async (values: any) => {
    // add new
    const startDates = ConvertDateToString(values.startDate, values.startTime);
    const endDates = ConvertDateToString(values.endDate, values.endTime);
    const start = ConvertDate(startDates);
    const end = ConvertDate(endDates);

    let newValues: AddNewAnnouncementType = {
      id: data?.id,
      title: values.title,
      description: values.description,
      url: values.url,
      startDate: start.dateTimeUTC, // add new  YYYY-MM-DD hh:mm A to UTC
      endDate: end.dateTimeUTC, // add new
      unitList: units,
      image64: imageUrl,
      imageUrl: values.imageUrl,
      all: isAllSelected,
    };

    // console.log(newValues);

    if (data) {
      confirm({
        title: "Confirm action",
        icon: null,
        content: "Are you sure you want to edit the announcement?",
        okText: "Yes",
        okType: "primary",
        cancelText: "Cancel",
        centered: true,

        async onOk() {
          await dispatch.announcement.editAnnounce(newValues);
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully created",
          });
          clear();
          onRefresh();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      confirm({
        title: "Confirm action",
        icon: null,
        content: "Are you sure you want to add new announcement?",
        okText: "Yes",
        okType: "primary",
        cancelText: "Cancel",
        centered: true,
        async onOk() {
          await dispatch.announcement.addNewAnnounce(newValues);
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully created",
          });
          clear();
          onRefresh();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const clear = () => {
    setImageUrl(undefined);
    setPreviewImage("");
    form.resetFields();
    onCancel();
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
  };

  const onSendToChange = (value: { value: string; label: React.ReactNode }) => {
    // console.log(value);
    if (value) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
      setIsSendToModalOpen(true);
    }
  };

  const onSelectedUnits = (data: number[]) => {
    setUnits(data);
  };

  const onCancelSendToModal = () => {
    setIsSendToModalOpen(false);
  };

  useEffect(() => {
    if (data) {
      setUnits(data.unitList);
      setPreviewImage(data.imageUrl);
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        url: data.url,
        startDate: dayjs(data.startDate),
        startTime: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
        endTime: dayjs(data.endDate),
        sendTo: data.all,
        imageUrl: data.imageUrl,
      });
    }
  }, [data]);

  return (
    <>
      <Modal
        title={title}
        width={1200}
        centered
        open={visible}
        onCancel={clear}
        footer={false}
        style={{
          borderBottom: 20,
          borderWidth: 200,
          borderBlock: 10,
        }}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 22 }}
          wrapperCol={{ span: 22 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Row>
            <Col span={8}>
              <Form.Item label="Title" name="title" rules={normalInputRule}>
                <Input placeholder="Input title" maxLength={100} />
              </Form.Item>
              <Form.Item
                label="Announcement body"
                name="description"
                rules={requiredRule}>
                <TextArea
                  placeholder="Input announcement body"
                  maxLength={2000}
                  rows={6}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Start date"
                    name="startDate"
                    rules={requiredRule}>
                    <DatePicker className="fullWidth" format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item
                    label="Start time"
                    name="startTime"
                    rules={requiredRule}>
                    <TimePicker className="fullWidth" format="hh:mm a" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="End date"
                    name="endDate"
                    rules={requiredRule}>
                    <DatePicker className="fullWidth" format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item
                    label="End time"
                    name="endTime"
                    rules={requiredRule}>
                    <TimePicker className="fullWidth" format="hh:mm a" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="URL" name="url">
                <Input placeholder="Input URL" />
              </Form.Item>
              <Form.Item label="Send to" name="sendTo" rules={requiredRule}>
                <Select
                  placeholder="Select receiver"
                  onSelect={onSendToChange}
                  options={[
                    {
                      value: true,
                      label: "Select all",
                    },
                    {
                      value: false,
                      label: "Select by unit",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Image"
                name="imageUrl"
                // rules={requiredRule}
              >
                <UploadImageGroup
                  image={previewImage}
                  onChange={handleImageChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="noMargin" wrapperCol={{ offset: 22, span: 2 }}>
            <Button shape="round" type="primary" htmlType="submit">
              {data !== null ? "Save" : "Add"}
            </Button>
          </Form.Item>
        </Form>
        <SendToGroup
          onChange={onSelectedUnits}
          isModalOpen={isSendToModalOpen}
          onClose={onCancelSendToModal}
          data={units}
        />
      </Modal>
    </>
  );
};

export default FormTemplate;
