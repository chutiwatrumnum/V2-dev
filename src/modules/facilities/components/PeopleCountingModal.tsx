import { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Row, Col, message } from "antd";
import UploadImageGroup from "../../../components/groups/UploadImageGroup";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { ConvertDate, ConvertDateToString } from "../../../utils/helper";
import { PeopleCountingDataType } from "../../../stores/interface/Facilities";

const { TextArea } = Input;

interface PeopleCountingModalPropType {
  data?: PeopleCountingDataType;
  visible: boolean;
  onCancel: VoidFunction;
  onRefresh: VoidFunction;
  editAllow: boolean;
}

const normalInputRule = [
  {
    pattern: new RegExp(/^[a-zA-Z0-9 ]*$/),
    message: "Can't use special character",
  },
  { required: true, message: "This field is required !" },
];
const requiredRule = [{ required: true, message: "This field is required !" }];

const PeopleCountingModal = ({
  onCancel,
  onRefresh,
  data,
  visible = false,
  editAllow,
}: PeopleCountingModalPropType) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [previewImage, setPreviewImage] = useState<string>("");
  const dispatch = useDispatch<Dispatch>();
  const [form] = Form.useForm();
  const title = "Edit room";

  const onFinish = async (values: any) => {
    // add new
    let newValues: any = {
      id: data?.id,
      roomName: values.roomName,
      description: values.description,
    };
    if (imageUrl) newValues.roomImgs = imageUrl;

    if (data) {
      await dispatch.facilities.editPeopleCountingData(newValues);
    } else {
      message.error("Something went wrong");
    }
    clear();
    onRefresh();
    dispatch.common.updateSuccessModalState({
      open: true,
      text: "Successfully upload",
    });
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

  useEffect(() => {
    if (data) {
      setPreviewImage(data.roomImgs);
      form.setFieldsValue({
        roomName: data.roomName,
        description: data.description,
        roomImgs: data.roomImgs,
      });
    }
    dispatch.common.getBlockOptions();
  }, [data]);

  return (
    <>
      <Modal
        title={title}
        width={500}
        centered
        open={visible}
        onCancel={clear}
        footer={false}
        style={{
          borderBottom: 20,
          borderWidth: 200,
          borderBlock: 10,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={24}>
              <Form.Item label="Room name" name="roomName" rules={requiredRule}>
                <Input placeholder="Input title" disabled={!editAllow} />
              </Form.Item>
              <Form.Item label="Detail" name="description" rules={requiredRule}>
                <TextArea
                  maxLength={200}
                  rows={6}
                  showCount
                  disabled={!editAllow}
                />
              </Form.Item>
              <Form.Item
                label="Image"
                name="roomImgs"
                // rules={requiredRule}
              >
                <UploadImageGroup
                  image={previewImage}
                  onChange={handleImageChange}
                  disabled={!editAllow}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            style={{
              textAlign: "end",
            }}
          >
            <Button
              shape="round"
              type="primary"
              htmlType="submit"
              disabled={!editAllow}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PeopleCountingModal;
