import { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Input, Row, Col, Tag, theme } from "antd";
import {
  ParticipantGroup,
  edidtDataParticipantGroup,
} from "../../../stores/interface/Buliding";
import {
  addParticipantGroup,
  editDataParticipantGroup,
} from "../service/api/buildingActivitesAPI";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";
interface EditPrarticipantGroupProps {
  prarticipantGroup: any;
  isOpen: boolean;
  callBack: (isOpen: boolean, saved: boolean) => void;
}

const { confirm } = Modal;

const EditParticipantGroup = (props: EditPrarticipantGroupProps) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const dispatch = useDispatch<Dispatch>();

  const handleCancel = async () => {
    await resset();
    await props.callBack(!props?.isOpen, false);
  };
  const resset = async () => {
    await form.resetFields();
    await setTags([]);
  };
  //from
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      icon: null,
      content: "Are you sure you want to edit participant group?",
      okText: "Yes",
      okType: "primary",
      cancelText: "Cancel",
      centered: true,

      async onOk() {
        const request: edidtDataParticipantGroup = {
          id: props?.prarticipantGroup.key,
          groupName: values.groupName,
          email: tags,
        };
        const reultCreated = await editDataParticipantGroup(request);
        if (reultCreated) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully edited",
          });
          await resset();
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

  useEffect(() => {
    if (props?.isOpen) {
      (async function () {
        await initedit();
      })();
    }
  }, [props?.isOpen]);
  const initedit = async () => {
    const editdata: any = props?.prarticipantGroup;

    await form.setFieldsValue({
      groupName: editdata?.groupname,
      emailGroup: editdata?.email,
    });
    await setTags(editdata?.email);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  //Tag
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = async (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
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

  return (
    <>
      <Modal
        title="Edit participant group"
        width={400}
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
            Save
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
            <Col span={24}>
              <Form.Item
                label="Group name"
                name="groupName"
                rules={[
                  { required: true, message: "Please fill in required field" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Additional email"
                name="emailGroup"
                rules={[
                  { required: true, message: "Please fill in required field" },
                ]}
              >
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EditParticipantGroup;
