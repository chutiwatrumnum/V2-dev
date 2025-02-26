import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Button, Modal, Form, Input, Row, Col, DatePicker, Select, notification, Divider, Typography } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { addPayment, blockDetail, unitDetail, roleDetail } from "../../../stores/interfaces/Payment";
import { getdatablock, getdatarole } from "../service/api/PaymentServiceAPI";
import { useDispatch } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { addBillPaymentQuery, useBillPaymentMasterDataListQuery } from "../hooks";
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

const createPaymentModal = (props: ComponentCreateProps) => {
    const { data } = useBillPaymentMasterDataListQuery();
    const mutationAddBillPayment = addBillPaymentQuery();
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
            content: "Are you sure you create bill payment?",
            icon: null,
            okText: "Yes",
            okType: "danger",
            cancelText: "Cancel",
            centered: true,
            async onOk() {
                const request: addPayment = {
                    unitId: Number(values.unitId),
                    startMonthly: dayjs(values.monthly[0]).format("YYYY-MM"),
                    endMonthly: dayjs(values.monthly[1]).format("YYYY-MM"),
                    billTypeId: Number(values.billTypeId),
                    amount: Number(values.amount),
                };
                if (values.dueDate) {
                    request.startDue = dayjs(values.dueDate[0]).format("YYYY-MM-DD");
                    request.endDue = dayjs(values.dueDate[1]).format("YYYY-MM-DD");
                }
                try {
                    await mutationAddBillPayment.mutateAsync(request);
                    dispatch.common.updateSuccessModalState({
                        open: true,
                        text: "Successfully bill payment",
                    });
                    props.callBack(!props?.isOpen, true);
                } catch (error: any) {
                    dispatch.common.updateSuccessModalState({
                        open: true,
                        status: "error",
                        text: error.response.data.message[0],
                    });
                    console.log("mutationAddBillPayment:", error);
                }
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    useEffect(() => {
        if (props?.isOpen) {
            (async function () {})();
        }
    }, [props?.isOpen]);

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            <Modal
                title="Create Bill Payment"
                width={1200}
                centered
                open={props?.isOpen}
                onCancel={handleCancel}
                footer={[
                    <Button shape="round" key="submit" type="primary" style={{ paddingLeft: 30, paddingRight: 30 }} onClick={form.submit}>
                        Add
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" name="basic" labelCol={{ span: 22 }} wrapperCol={{ span: 22 }} style={{ width: "100%", paddingTop: 10 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                    <Row>
                        <Col span={8}>
                            <Form.Item name="unitId" label="Address" rules={[{ required: true, message: "Address" }]}>
                                <Select options={data?.dataUnitSelectLists} placeholder="Please select address." />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item rules={[{ required: true, message: "Monthly" }]} name="monthly" label="Monthly">
                                <DatePicker.RangePicker picker="month" style={{ width: "92%" }} disabledDate={disabledDate} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="dueDate" label="Due date">
                                <DatePicker.RangePicker style={{ width: "92%" }} disabledDate={disabledDate} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider style={{ borderColor: "#7cb305" }}></Divider>
                    <Row>
                        <Col span={24}>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Payment Amount
                            </Typography.Title>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="billTypeId" label="Type" rules={[{ required: true, message: "Type" }]}>
                                        <Select options={data?.dataBillTypeSelectLists} placeholder="Please select type" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Amount"
                                        name="amount"
                                        rules={[
                                            { required: true, message: "amount" },
                                            {
                                                pattern: new RegExp(/^\d+(\.\d{1,2})?$/),
                                                message: "float 2 position only",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Please input amount" suffix="Bath" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default createPaymentModal;
