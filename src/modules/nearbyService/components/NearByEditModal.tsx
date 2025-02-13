import { useState, useEffect } from "react";
import { Form, Input, Row, TimePicker, Select } from "antd";
import { emailRuleNotRequired, latitudeRule, longitudeRule, noSpacialInputRule, requiredRule, telRule } from "../../../configs/inputRule";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";

import UploadImageGroup from "../../../components/group/UploadImageGroup";
import FormModal from "../../../components/common/FormModal";
import SmallButton from "../../../components/common/SmallButton";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { DataNearByCreateByType, NearBySelectListType } from "../../../stores/interfaces/NearBy";
import { editNearbyTypeServiceQuery } from "../hooks";

type NearByEditModalType = {
    isEditModalOpen: boolean;
    onOk: () => void;
    onCancel: () => void;
    data: DataNearByCreateByType | null;
    onRefresh: () => void;
    selectList: NearBySelectListType[];
};

const AnnouncementEditModal = ({ isEditModalOpen, onOk, onCancel, data, onRefresh, selectList }: NearByEditModalType) => {
    const dispatch = useDispatch<Dispatch>();
    const id = data?.id;
    const [nearByForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const mutationEditNearbyTypeService= editNearbyTypeServiceQuery()
    const onClose = () => {
        nearByForm.resetFields();
        onCancel();
    };

    useEffect(() => {
        setOpen(isEditModalOpen);
    }, [isEditModalOpen]);

    useEffect(() => {
        if (data) {
            // console.log(data);
            setPreviewImage(data.image ?? "");
            nearByForm.setFieldsValue(data);
            nearByForm.setFieldValue("open", dayjs(data.open, "HH:mm"));
            nearByForm.setFieldValue("close", dayjs(data.close, "HH:mm"));
        }
    }, [data]);

    const ModalContent = () => {
        return (
            <Form
                form={nearByForm}
                name="nearByEditModal"
                // style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                onFinish={async (value) => {
                    ConfirmModal({
                        title: "Are you sure you want to edit this?",
                        okMessage: "Yes",
                        cancelMessage: "Cancel",
                        onOk: async () => {
                            const payload: DataNearByCreateByType = {
                                id: id,
                                typeId: Number(value.typeId),
                                name: value.name,
                                tel: value.tel,
                                open: dayjs(value.open).format("HH:mm"),
                                close: dayjs(value.close).format("HH:mm"),
                                address: data?.address,
                                description: data?.description,
                                note: data?.note,
                                image: null,
                                lat: isNaN(value.lat) ? undefined : data?.lat,
                                long: isNaN(value.long) ? undefined : data?.long,
                            };
                            if (value.lat) {
                                payload.lat = Number(value.lat);
                            }
                            if (value.long) {
                                payload.long = Number(value.long);
                            }
                            if (value.address !== data?.address) {
                                payload.address = value.address;
                            }
                            if (value.description !== data?.description) {
                                payload.description = value.description;
                            }
                            if (value.note !== data?.note) {
                                payload.note = value.note;
                            }
                            if (value.image !== data?.image) {
                                payload.image = value.image;
                            }
                            // console.log("value:", value);
                            // console.log("data:", data);
                            // console.log("payload:", payload);

                            // return
                            // const payload2:any={
                            //     ...payload
                            // }
                            // payload2.name=null
                      
                             await mutationEditNearbyTypeService.mutateAsync(payload);
                             nearByForm.resetFields();
                             onOk();
                             onRefresh();
                             mutationEditNearbyTypeService.reset();
                          
                        },
                        onCancel: () => console.log("Cancel"),
                    });
                }}
                onFinishFailed={() => {
                    console.log("FINISHED FAILED");
                }}
            >
                <div className="announceModalColumn">
                    <div className="announceModalContainer">
                        <div className="announceModalColumn">
                            <Form.Item<DataNearByCreateByType> label="Image" name="image" rules={requiredRule}>
                                <UploadImageGroup
                                    onChange={(url) => {
                                        setPreviewImage(url);
                                    }}
                                    image={previewImage}
                                    ratio="1920x1080 px"
                                />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Type" name="typeId" rules={requiredRule}>
                                <Select size="large" placeholder="Please select service type" options={selectList?.length > 0 ? selectList : undefined} />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Name" name="name" rules={noSpacialInputRule}>
                                <Input size="large" placeholder="Please input name" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Tel." name="tel" rules={telRule}>
                                <Input size="large" placeholder="Please input tel" maxLength={10} showCount />
                            </Form.Item>
                        </div>
                        <div className="announceModalColumn">
                            <Form.Item<DataNearByCreateByType> label="Lat" name="lat" rules={latitudeRule}>
                                <Input size="large" placeholder="Please input lat" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Long" name="long" rules={longitudeRule}>
                                <Input size="large" placeholder="Please input long" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType>
                                label="Address"
                                name="address"
                                // rules={requiredRule}
                            >
                                <Input.TextArea rows={7} placeholder="Please input address" maxLength={1200} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType>
                                label="Description"
                                name="description"
                                // rules={requiredRule}
                            >
                                <Input.TextArea rows={7} placeholder="Please input description" maxLength={1200} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType>
                                label="Note"
                                name="note"
                                // rules={requiredRule}
                            >
                                <Input.TextArea rows={7} placeholder="Please input note" maxLength={1200} showCount />
                            </Form.Item>
                        </div>
                        <div className="announceModalColumn">
                            {/* Start date/time */}

                            <Row justify="space-between">
                                <Form.Item<DataNearByCreateByType> label="Open" name="open" rules={requiredRule} style={{ width: "48%" }}>
                                    <TimePicker placeholder="Open time" style={{ width: "100%" }} size="large" />
                                </Form.Item>
                                <Form.Item<DataNearByCreateByType> label="Close" name="close" rules={requiredRule} style={{ width: "48%" }}>
                                    <TimePicker placeholder="Close time" style={{ width: "100%" }} size="large" />
                                </Form.Item>
                            </Row>
                            <Form.Item<DataNearByCreateByType> label="Facebook Page id" name="facebookPageId">
                                <Input size="large" placeholder="https://www.facebook.com/ServiceID" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Email" name="email" rules={emailRuleNotRequired}>
                                <Input size="large" placeholder="example@email.com" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Instagram" name="instagram">
                                <Input size="large" placeholder="https://www.instagram.com/ServiceID" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Line" name="line">
                                <Input size="large" placeholder="https://line.me/R/ti/p/ServiceID" maxLength={120} showCount />
                            </Form.Item>
                            <Form.Item<DataNearByCreateByType> label="Website" name="website">
                                <Input size="large" placeholder="https://example.com" maxLength={120} showCount />
                            </Form.Item>
                        </div>
                    </div>
                    <SmallButton className="saveButton" message="Save" form={nearByForm} />
                </div>
            </Form>
        );
    };

    return (
        <>
            <FormModal isOpen={open} title="Edit Nearby Service" content={<ModalContent />} onOk={onOk} onCancel={onClose} className="announceFormModal" />
        </>
    );
};

export default AnnouncementEditModal;
