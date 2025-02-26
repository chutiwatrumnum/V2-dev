import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Select, Table, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { deleteResidentId } from "../service/api/PaymentServiceAPI";
import { Row, Col, DatePicker, Input, Button, Modal } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import { DataType, conditionPage, selectListType } from "../../../stores/interfaces/Payment";

import CreatePaymentModal from "../components/CreatePaymentModal";
import EditPaymentDashboard from "../components/EditPaymentDashboard";
import InfoResidentInformation from "../components/InfoResidentInformation";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { useBillPaymentListQuery, useBillPaymentMasterDataListQuery } from "../hooks";
const { confirm } = Modal;
const tagColorSelector = (status: string) => {
    switch (status) {
        case "Pending":
            return "red";
        case "Repairing":
            return "orange";
        case "Success":
            return "green";
        case "Water Bill":
            return "blue";
        case "Electricity Bill":
            return "warning";
        case "Maintenance Fee":
            return "default";
        default:
            return "black";
    }
};
const OutDateList: Array<selectListType> = [
    {
        label: "All",
        value: "All",
    },
    {
        label: "OutDate",
        value: "OutDate",
    },
    {
        label: "Current",
        value: "Current",
    },
];
const PaymentDashboard = () => {
    const { data: BillPaymentMasterDataList } = useBillPaymentMasterDataListQuery();
    const { loading, tableData, total } = useSelector((state: RootState) => state.resident);
    const { accessibility } = useSelector((state: RootState) => state.common);
    const [currentPage, setCurrentPage] = useState<number>(1);
    // setting pagination Option
    const pageSizeOptions = [10, 20, 60, 100];
    let params: conditionPage = {
        perPage: pageSizeOptions[0],
        curPage: currentPage,
        verifyByJuristic: true,
        reject: false,
        isActive: true,
    };
    const { data, isLoading } = useBillPaymentListQuery(params);
    const PaginationConfig = {
        defaultPageSize: pageSizeOptions[0],
        pageSizeOptions: pageSizeOptions,
        current: currentPage,
        showSizeChanger: false,
        total: data?.total,
    };

    const [rerender, setRerender] = useState<boolean>(true);
    const [dataEdit, setDataEdit] = useState<DataType | null>(null);
    const [dataInfo, setDataInfo] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
    const [paramsData, setParamsData] = useState<conditionPage>(params);
    const dispatch = useDispatch<Dispatch>();
    const { RangePicker } = DatePicker;
    const customFormat: DatePickerProps["format"] = (value) => `Month : ${value.format(dateFormat)}`;
    const dateFormat = "MMMM,YYYY";

    const { Search } = Input;
    const scroll: { x?: number | string } = {
        x: "100vw",
    };
    useEffect(() => {
        (async function () {
            await setParamsData(params);
            await dispatch.resident.getTableData(paramsData);
        })();
    }, [rerender]);

    const onChangeTable: TableProps<DataType>["onChange"] = async (pagination: any, filters, sorter: any, extra) => {
        params = paramsData;
        params.sort = sorter?.order;
        params.sortBy = sorter?.field;
        params.curPage = pagination?.current ? pagination?.current : PaginationConfig.current;
        params.perPage = pagination?.pageSize ? pagination?.pageSize : PaginationConfig.defaultPageSize;
        await setParamsData(params);
        await setCurrentPage(params.curPage);
        await dispatch.resident.getTableData(paramsData);
    };

    const onSearch = async (value: string) => {
        params = paramsData;
        params.search = value;
        await setParamsData(params);
        await dispatch.resident.getTableData(paramsData);
    };

    const columns: ColumnsType<DataType> = [
        // {
        //   title: "Delete",
        //   dataIndex: "delete",
        //   align: "center",
        //   render: (_, record) => (
        //     <>
        //       <Button
        //         shape="round"
        //         value={record.key}
        //         type="text"
        //         icon={<DeleteOutlined />}
        //         onClick={showDeleteConfirm}
        //         disabled={
        //           !accessibility?.menu_resident_information.allowDelete
        //         }></Button>
        //     </>
        //   ),
        // },
        {
            title: "unitNo",
            dataIndex: "unitNo",
            align: "center",
            sorter: {
                compare: (a, b) => a.unitNo.localeCompare(b.unitNo),
            },
        },
        {
            title: "billType",
            dataIndex: "billType",
            align: "center",
            render: (_, { billType }) => (
                <>
                    <Tag color={tagColorSelector(billType)}>{billType}</Tag>
                </>
            ),
        },
        {
            title: "billStatus",
            dataIndex: "billStatus",
            align: "center",
            render: (_, { billStatus }) => (
                <>
                    <Tag color={tagColorSelector(billStatus)}>{billStatus}</Tag>
                </>
            ),
        },
        {
            title: "amount",
            dataIndex: "amount",
            align: "center",
        },
        {
            title: "startMonthly",
            dataIndex: "startMonthly",
            align: "center",
        },
        {
            title: "endMonthly",
            dataIndex: "endMonthly",
            align: "center",
        },
        {
            title: "createdAt",
            dataIndex: "createdAt",
            align: "center",
        },
        {
            title: "createdBy",
            dataIndex: "createdBy",
            align: "center",
        },
        // {
        //     title: "Edit",
        //     dataIndex: "edit",
        //     align: "center",
        //     key: "edit",
        //     width: "10%",
        //     render: (_, record) => (
        //         <>
        //             <Row>
        //                 <Col span={12}>
        //                     <Button
        //                         shape="round"
        //                         value={record.key}
        //                         type="text"
        //                         icon={<InfoCircleOutlined />}
        //                         onClick={async () => {
        //                             await setDataInfo(record);
        //                             await setIsModalOpenInfo(true);
        //                         }}
        //                     />
        //                 </Col>
        //                 <Col span={12}>
        //                     <Button
        //                         shape="round"
        //                         value={record.key}
        //                         onClick={async () => {
        //                             await editButton(record);
        //                         }}
        //                         type="text"
        //                         icon={<EditOutlined />}
        //                         disabled={!accessibility?.menu_resident_information.allowEdit}
        //                     />
        //                 </Col>
        //             </Row>
        //         </>
        //     ),
        // },
    ];

    const editButton = async (data: DataType) => {
        setDataEdit(data);
        setIsModalOpen(true);
    };

    const showDeleteConfirm = ({ currentTarget }: any) => {
        confirm({
            title: "Confirm action",
            content: "Are you sure you want to delete resident’s information?",
            icon: null,
            // content: "Some descriptions",
            okText: "Yes",
            okType: "danger",
            cancelText: "Cancel",
            centered: true,
            async onOk() {
                const statusDeleted = await deleteResidentId(currentTarget.value);
                if (statusDeleted) {
                    dispatch.common.updateSuccessModalState({
                        open: true,
                        text: "Successfully deleted",
                    });
                } else {
                    dispatch.common.updateSuccessModalState({
                        open: true,
                        status: "error",
                        text: "Failed deleted",
                    });
                }
                setRerender(!rerender);
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const handleDate = async (e: any) => {
        params = paramsData;
        if (e) {
            params.startDate = dayjs(e[0]).startOf("month").format("YYYY-MM");
            params.endDate = dayjs(e[1]).endOf("month").format("YYYY-MM");
        } else {
            params.startDate = undefined;
            params.endDate = undefined;
        }
        await setParamsData(params);
        await dispatch.resident.getTableData(paramsData);
    };

    return (
        <>
            <Header title="Payment Dashboard" />
            <Row style={{ marginTop: 15, marginBottom: 15 }}>
                <Col span={6}>
                    <RangePicker onChange={handleDate} style={{ width: "95%" }} picker="month" format={customFormat} />
                </Col>
                <Col span={6}>
                    <RangePicker onChange={handleDate} style={{ width: "95%" }} format={customFormat} />
                </Col>
                <Col span={4}>
                    <Select defaultValue="All" style={{ width: "100%" }} options={BillPaymentMasterDataList?.dataBillTypeSelectLists} />
                </Col>
                <Col span={4}>
                    <Select defaultValue={[OutDateList]} style={{ width: "100%" }} options={OutDateList} />
                </Col>
                <Col span={6} style={{ display: "flex", justifyContent: "flex-start" }}>
                    <Search placeholder="Search by first name" allowClear onSearch={onSearch} className="searchBox" style={{ width: 300 }} />
                </Col>
                <Col span={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        shape="round"
                        type="primary"
                        onClick={async () => {
                            await setIsModalCreate(true);
                        }}
                        disabled={!accessibility?.menu_resident_information.allowEdit}
                    >
                        Add new
                    </Button>
                    <CreatePaymentModal
                        callBack={async (isOpen: boolean, created: boolean) => {
                            await setIsModalCreate(isOpen);
                            if (created) {
                                await setRerender(!rerender);
                            }
                        }}
                        isOpen={isModalCreate}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table columns={columns} pagination={PaginationConfig} dataSource={data?.dataBillPaymentList} loading={isLoading} onChange={onChangeTable} scroll={scroll} />
                </Col>
            </Row>
            <InfoResidentInformation callBack={async (isOpen: boolean) => await setIsModalOpenInfo(isOpen)} isOpen={isModalOpenInfo} resident={dataInfo} />
            <EditPaymentDashboard
                callBack={async (isOpen: boolean, saved: boolean) => {
                    await setIsModalOpen(isOpen);
                    if (saved) {
                        await setRerender(!rerender);
                    }
                }}
                isOpen={isModalOpen}
                resident={dataEdit}
            />
        </>
    );
};

export default PaymentDashboard;
