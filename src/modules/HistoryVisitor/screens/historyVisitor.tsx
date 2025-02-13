import { useEffect, useState } from "react";
import { Row, Button, DatePicker, Col } from "antd";
import Header from "../../../components/templates/Header";
import SearchBox from "../../../components/common/SearchBox";
import MediumActionButton from "../../../components/common/MediumActionButton";
import HistoryVisitorTable from "../components/HistoryVisitorTable";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import type { ColumnsType, TableProps } from "antd/es/table";
import { HistoryVisitorDataType, conditionPage } from "../../../stores/interfaces/historyVisitor";
import "../styles/historyVisitor.css";
import ConfirmModal from "../../../components/common/ConfirmModal";
import SuccessModal from "../../../components/common/SuccessModal";
import FailedModal from "../../../components/common/FailedModal";
const HistoryVisitor = () => {
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
    const stamping = ({ currentTarget }: any) => {
        console.log(currentTarget.value);
        tableData.map((item) => {
            if (item.key === currentTarget.value) {
                item.status = "แสตมป์แล้ว";
                item.IsActiveButton=false
            }
        })
        ConfirmModal({
          title: "Are you sure you want to stamp this?",
          okMessage: "Yes",
          cancelMessage: "Cancel",
          async onOk() {
            const statusApproved = await dispatch.historyVisitor.updateTableDataState(tableData);
            if (statusApproved) {
              SuccessModal("Successfully stamp");
            } else {
              FailedModal("Failed stamp");
            }
            //setRerender(!rerender);
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      };
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
            title: "เวลาเข้า",
            dataIndex: "checkIn",
            key: "checkIn",
            align: "center",
            sorter: {
                compare: (a, b) => a.checkIn.localeCompare(b.checkIn),
            },
        },
        {
            title: "เวลาออก",
            dataIndex: "checkOut",
            key: "checkOut",
            align: "center",
            sorter: {
                compare: (a, b) => a.checkOut.localeCompare(b.checkOut),
            },
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            align: "center",
        },
        {
            title: "action",
            key: "action",
            align: "center",
            render: (_, record) => {
                return (
                    <>
                        <Row>
                            <Col span={24}>
                                <Button value={record.key} onClick={stamping} disabled={!record?.IsActiveButton}>
                                    แสตมป์
                                </Button>
                            </Col>
                        </Row>
                    </>
                );
            },
        },
    ];
    return (
        <>
            <Header title="History Visitor" />
            <div className="managementTopActionGroup">
                <div className="userManagementTopActionLeftGroup">
                    <DatePicker.RangePicker className="userManagementDatePicker" onChange={() => {}} />
                    <SearchBox placeholderText="Search by first name, mobile no. and Room address" className="userManagementSearchBox" onSearch={onSearch} />
                </div>
                <MediumActionButton disabled={accessibility?.team_team_management.allowAdd ? false : true} className="managementExportBtn" message="CheckStamp" onClick={() => {}} />
                <MediumActionButton disabled={accessibility?.team_team_management.allowAdd ? false : true} className="managementExportBtn" message="Print" onClick={() => {}} />
            </div>
            <HistoryVisitorTable columns={columns} data={tableData} PaginationConfig={PaginationConfig} loading={loading} onchangeTable={onChangeTable} />
            <Row className="managementBottomActionContainer" justify="end" align="middle"></Row>
        </>
    );
};

export default HistoryVisitor;
