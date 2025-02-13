import { useEffect, useState } from "react";
import { Row, Button, Col } from "antd";
import Header from "../../../components/templates/Header";
import SearchBox from "../../../components/common/SearchBox";
import MediumActionButton from "../../../components/common/MediumActionButton";
import HistoryVisitorTable from "../components/HistoryVisitorTable";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import type { ColumnsType, TableProps } from "antd/es/table";
import { HistoryVisitorDataType, conditionPage } from "../../../stores/interfaces/historyVisitor";
import { QrcodeOutlined, PlusOutlined } from "@ant-design/icons"
import "../styles/historyVisitor.css";
const CheckInVisitor = () => {
    // variables
    const { loading, tableData, total } = useSelector((state: RootState) => state.historyVisitor);
    const { accessibility } = useSelector((state: RootState) => state.common);
    const [currentPage, setCurrentPage] = useState<number>(1);
    // setting pagination Option
    const pageSizeOptions = [10, 20, 40, 80, 100];
    const PaginationConfig = {
        defaultPageSize: pageSizeOptions[0],
        pageSizeOptions: pageSizeOptions,
        current: currentPage,
        showSizeChanger: true,
        total: total,
    };
    let params: conditionPage = {
        perPage: pageSizeOptions[0],
        curPage: currentPage,
        sort: "desc   ",
        sortBy: "updated",
    };
    const [rerender, setRerender] = useState<boolean>(true);
    const [paramsData, setParamsData] = useState<conditionPage>(params);
    const dispatch = useDispatch<Dispatch>();

    useEffect(() => {
        (async function () {
            await setParamsData(params);
            await dispatch.historyVisitor.getTableData(paramsData);
        })();
        if (accessibility?.team_team_management) {
        }
    }, [rerender]);

    const onChangeTable: TableProps<HistoryVisitorDataType>["onChange"] = async (pagination: any, sorter: any) => {
        params = paramsData;
        params.sort = sorter?.order;
        params.sortBy = sorter?.field;
        params.curPage = pagination?.current ? pagination?.current : PaginationConfig.current;
        params.perPage = pagination?.pageSize ? pagination?.pageSize : PaginationConfig.defaultPageSize;
        await setParamsData(params);
        await setCurrentPage(params.curPage);
        await dispatch.historyVisitor.getTableData(paramsData);
    };

    // functions

    const onSearch = async (value: string) => {
        params = paramsData;
        params.search = value;
        await setParamsData(params);
        await dispatch.historyVisitor.getTableData(paramsData);
    };

    const columns: ColumnsType<HistoryVisitorDataType> = [
        {
            title: "เลขบัตรประชาชน",
            dataIndex: "idCard",
            width: "auto",
            align: "center",
            sorter: {
                compare: (a, b) => a.idCard.localeCompare(b.idCard),
            },
        },
        {
            title: "ทะเบียนรถ",
            dataIndex: "licensePlate",
            key: "licensePlate",
            align: "center",
            sorter: {
                compare: (a, b) => a.licensePlate.localeCompare(b.licensePlate),
            },
        },
        {
            title: "ชื่อ - นามสกุล",
            dataIndex: "fullName",
            key: "fullName",
            align: "center",
            sorter: {
                compare: (a, b) => a.fullName.localeCompare(b.fullName),
            },
        },
        {
            title: "บ้านเลขที่",
            dataIndex: "homeAddress",
            key: "homeAddress",
            align: "center",
            sorter: {
                compare: (a, b) => a.homeAddress.localeCompare(b.homeAddress),
            },
        },
        {
            title: "รูปแบบการเชิญ",
            dataIndex: "inverterType",
            key: "inverterType",
            align: "center",
            sorter: {
                compare: (a, b) => a.inverterType.localeCompare(b.inverterType),
            },
        },
        {
            title: "วันที่นัดหมาย",
            dataIndex: "appointmentDay",
            key: "appointmentDay",
            align: "center",
            sorter: {
                compare: (a, b) => a.appointmentDay.localeCompare(b.appointmentDay),
            },
        },
        {
            title: "สถานะ",
            dataIndex: "checkInType",
            key: "checkInType",
            align: "center",
        },
        {
            title: "action",
            key: "action",
            align: "center",
            render: (_, record) => {
                return (
                    record?.checkInIsActiveButton?
                    <>
                        <Row>
                            <Col span={24}>
                                <Button value={record.key} onClick={() => {}}>
                                    เข้าโครงการ
                                </Button>
                            </Col>
                        </Row>
                    </>:null
                );
            },
        },
    ];
    return (
        <>
            <Header title="CheckIn Visitor" />
            <div className="managementTopActionGroup">
                <div className="userManagementTopActionLeftGroup">
                    <SearchBox placeholderText="Search by first name, mobile no. and Room address" className="userManagementSearchBox" onSearch={onSearch} />
                </div>
                <MediumActionButton icon={<PlusOutlined />} disabled={accessibility?.team_team_management.allowAdd ? false : true} className="managementExportBtn" message="Add New Visitor" onClick={() => {}} />
                <MediumActionButton icon={<QrcodeOutlined />} disabled={accessibility?.team_team_management.allowAdd ? false : true} className="managementExportBtn" message="Scan QR Code" onClick={() => {}} />
            </div>
            <HistoryVisitorTable columns={columns} data={tableData} PaginationConfig={PaginationConfig} loading={loading} onchangeTable={onChangeTable} />
            <Row className="managementBottomActionContainer" justify="end" align="middle"></Row>
        </>
    );
};

export default CheckInVisitor;
