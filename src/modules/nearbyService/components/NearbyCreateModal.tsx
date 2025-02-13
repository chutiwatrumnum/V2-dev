import { useState, useEffect } from "react";
import { Form, Input, Row, TimePicker, Select } from "antd";
import { emailRuleNotRequired, latitudeRule, longitudeRule, noSpacialInputRule, requiredRule, telRule } from "../../../configs/inputRule";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";

import UploadImageGroup from "../../../components/group/UploadImageGroup";
import FormModal from "../../../components/common/FormModal";
import SmallButton from "../../../components/common/SmallButton";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {addNearbyTypeServiceQuery} from '../hooks'
import { DataNearByCreateByType, NearBySelectListType } from "../../../stores/interfaces/NearBy";
import dayjs from "dayjs";
import FailedModal from "../../../components/common/FailedModal";
import SuccessModal from "../../../components/common/SuccessModal";
type NearByCreateModalType = {
    isCreateModalOpen: boolean;
    onOk: () => void;
    onCancel: () => void;
    onRefresh: () => void;
    selectList: NearBySelectListType[];
};

const NearByCreateModal = ({ isCreateModalOpen, selectList, onOk, onCancel, onRefresh }: NearByCreateModalType) => {
    const dispatch = useDispatch<Dispatch>();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const mutationAddNearbyTypeService= addNearbyTypeServiceQuery()
    const onModalClose = () => {
        form.resetFields();
        setPreviewImage("");
        onCancel();
    };

    useEffect(() => {
        setOpen(isCreateModalOpen);
    }, [isCreateModalOpen]);

    const ModalContent = () => {
        return (
          <Form
            form={form}
            name="NearByCreateModal"
            // style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            onFinish={async (value) => {
              ConfirmModal({
                title: "You confirm the information?",
                okMessage: "Yes",
                cancelMessage: "Cancel",
                onOk: async () => {
                  const payload: DataNearByCreateByType = {
                    ...value,
                  };
                  payload.typeId = Number(payload.typeId);
                  payload.open = dayjs(value.open).format("HH:mm");
                  payload.close = dayjs(value.close).format("HH:mm");
                  payload.lat = Number(payload.lat);
                  payload.long = Number(payload.long);
                  // console.log(payload);
                  // return
                  await mutationAddNearbyTypeService.mutateAsync(payload);
                  form.resetFields();
                  setPreviewImage("");
                  onOk();
                  onRefresh();
                  mutationAddNearbyTypeService.reset();
                },
              });
            }}
            onFinishFailed={() => {
              console.log("FINISHED FAILED");
            }}>
            <div className="announceModalColumn">
              <div className="announceModalContainer">
                <div className="announceModalColumn">
                  <Form.Item<DataNearByCreateByType>
                    label="Image"
                    name="image"
                    rules={requiredRule}>
                    <UploadImageGroup
                      onChange={(url) => {
                        setPreviewImage(url);
                      }}
                      image={previewImage}
                      ratio="1920x1080 px"
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Type"
                    name="typeId"
                    rules={requiredRule}>
                    <Select
                      size="large"
                      placeholder="Please select service type"
                      options={selectList?.length > 0 ? selectList : undefined}
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Name"
                    name="name"
                    rules={noSpacialInputRule}>
                    <Input
                      size="large"
                      placeholder="Please input name"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Tel."
                    name="tel"
                    rules={telRule}>
                    <Input
                      size="large"
                      placeholder="Please input tel"
                      maxLength={10}
                      showCount
                    />
                  </Form.Item>
                </div>
                <div className="announceModalColumn">
                  <Form.Item<DataNearByCreateByType>
                    label="Lat"
                    name="lat"
                    rules={latitudeRule}>
                    <Input
                      size="large"
                      placeholder="Please input lat"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Long"
                    name="long"
                    rules={longitudeRule}>
                    <Input
                      size="large"
                      placeholder="Please input long"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Address"
                    name="address"
                    // rules={requiredRule}
                  >
                    <Input.TextArea
                      rows={5}
                      placeholder="Please input address"
                      maxLength={1200}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Description"
                    name="description"
                    // rules={requiredRule}
                  >
                    <Input.TextArea
                      rows={5}
                      placeholder="Please input description"
                      maxLength={1200}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Note"
                    name="note"
                    // rules={requiredRule}
                  >
                    <Input.TextArea
                      rows={5}
                      placeholder="Please input note"
                      maxLength={1200}
                      showCount
                    />
                  </Form.Item>
                </div>
                <div className="announceModalColumn">
                  {/* Start date/time */}
                  <h4 style={{ fontWeight: 800 }}>Opening hours</h4>
                  <Row justify="space-between">
                    <Form.Item<DataNearByCreateByType>
                      label="Open"
                      name="open"
                      rules={requiredRule}
                      style={{ width: "48%" }}>
                      <TimePicker
                        format="HH:mm"
                        placeholder="Open time"
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item<DataNearByCreateByType>
                      label="Close"
                      name="close"
                      rules={requiredRule}
                      style={{ width: "48%" }}>
                      <TimePicker
                        format="HH:mm"
                        placeholder="Close time"
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>
                  </Row>
                  <h4 style={{ fontWeight: 800 }}>Social platform</h4>
                  <Form.Item<DataNearByCreateByType>
                    label="Facebook Page id"
                    name="facebookPageId">
                    <Input
                      size="large"
                      placeholder="https://www.facebook.com/ServiceID"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Email"
                    name="email"
                    rules={emailRuleNotRequired}>
                    <Input
                      size="large"
                      placeholder="example@email.com"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Instagram"
                    name="instagram">
                    <Input
                      size="large"
                      placeholder="https://www.instagram.com/ServiceID"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType> label="Line" name="line">
                    <Input
                      size="large"
                      placeholder="https://line.me/R/ti/p/ServiceID"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item<DataNearByCreateByType>
                    label="Website"
                    name="website">
                    <Input
                      size="large"
                      placeholder="https://example.com"
                      maxLength={120}
                      showCount
                    />
                  </Form.Item>
                </div>
              </div>
              <SmallButton className="saveButton" message="Save" form={form} />
            </div>
          </Form>
        );
    };

    return (
        <>
            <FormModal isOpen={open} title="Add new service" content={<ModalContent />} onOk={onOk} onCancel={onModalClose} className="announceFormModal" />
        </>
    );
};

export default NearByCreateModal;
