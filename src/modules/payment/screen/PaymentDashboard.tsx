import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Select, Table, Tabs, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { deleteResidentId } from "../service/api/PaymentServiceAPI";
import { Row, Col, DatePicker, Input, Button, Modal } from "antd";
import type { DatePickerProps, TabsProps } from "antd";
import dayjs from "dayjs";
import { DataType, conditionPage, selectListType } from "../../../stores/interfaces/Payment";

import CreatePaymentModal from "../components/CreatePaymentModal";
import EditPaymentDashboard from "../components/EditPaymentDashboard";
import InfoResidentInformation from "../components/InfoResidentInformation";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { useBillPaymentListQuery, useBillPaymentMasterDataListQuery } from "../hooks";
import "../styles/payment.css";
const { confirm } = Modal;
const tagColorSelector = (status: string) => {
    switch (status) {
        case "Pending":
            return "orange";
        case "Repairing":
            return "yellow";
        case "Success":
            return "green";
        case "Water Bill":
            return "blue";
        case "Electricity Bill":
            return "warning";
        case "Maintenance Fee":
            return "default";
        default:
            return "red";
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
    const { accessibility } = useSelector((state: RootState) => state.common);
    const pageSizeOptions = [10, 20, 60, 100];
    const [BillPaymentStatusLists, setBillPaymentStatusLists] = useState<TabsProps["items"]>([
        {
            label: "All",
            key: "",
        },
    ]);
    const [BillTypeSelectLists, setBillTypeSelectLists] = useState<selectListType[]>([
        {
            label: "All",
            value: "",
        },
    ]);
    const { data: BillPaymentMasterDataList, isSuccess } = useBillPaymentMasterDataListQuery();
    const [CurrentPage, setCurrentPage] = useState<number>(1);
    const [SearchData, setSearchData] = useState<string | undefined>(undefined);
    const [PerPage, setPerPage] = useState<number>(pageSizeOptions[0]);
    const [StartBillMonthly, setStartBillMonthly] = useState<string | undefined>(undefined);
    const [EndBillMonthly, setEndBillMonthly] = useState<string | undefined>(undefined);
    const [ByBillStatusId, setByBillStatusId] = useState<string | undefined>(undefined);
    const [ByBillTypeId, setByBillTypeId] = useState<string | undefined>(undefined);
    const [ByOutDate, setByOutDate] = useState<boolean | undefined>(undefined);
    // setting pagination Option
    const params: conditionPage = {
        perPage: PerPage,
        curPage: CurrentPage,
        search: SearchData,
        startBillMonthly: StartBillMonthly,
        endBillMonthly: EndBillMonthly,
        byBillStatusId: ByBillStatusId,
        byBillTypeId: ByBillTypeId,
        byOutDate: ByOutDate,
    };
    const { data, isLoading, refetch } = useBillPaymentListQuery(params);
    const PaginationConfig = {
        defaultPageSize: pageSizeOptions[0],
        pageSizeOptions: pageSizeOptions,
        current: CurrentPage,
        showSizeChanger: false,
        total: data?.total,
    };

    const [rerender, setRerender] = useState<boolean>(true);
    const [dataEdit, setDataEdit] = useState<DataType | null>(null);
    const [dataInfo, setDataInfo] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
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
            if (BillPaymentMasterDataList?.dataBillTypeSelectLists) {
                console.log(BillPaymentMasterDataList?.dataBillTypeSelectLists);

                setBillTypeSelectLists([
                    {
                        label: "All",
                        value: "",
                    },

                    ...BillPaymentMasterDataList.dataBillTypeSelectLists,
                ]);
            }
            if (BillPaymentMasterDataList?.dataBillPaymentStatusLists) {
                console.log(BillPaymentMasterDataList?.dataBillPaymentStatusLists);

                setBillPaymentStatusLists([
                    {
                        label: "All",
                        key: "",
                    },

                    ...BillPaymentMasterDataList?.dataBillPaymentStatusLists,
                ]);
            }
            await refetch();
        })();
    }, [rerender, CurrentPage, SearchData, ByOutDate, ByBillTypeId, isSuccess, StartBillMonthly, ByBillStatusId]);

    const onChangeTable: TableProps<DataType>["onChange"] = async (pagination: any, filters, sorter: any, extra) => {
        params.sort = sorter?.order;
        params.sortBy = sorter?.field;
        params.curPage = pagination?.current ? pagination?.current : PaginationConfig.current;
        params.perPage = pagination?.pageSize ? pagination?.pageSize : PaginationConfig.defaultPageSize;
        setCurrentPage(params.curPage);
        setPerPage(params.perPage);
    };

    const onSearch = async (value: string) => {
        console.log("onSearch:", value);
        setSearchData(value);
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
        title: "Unit no",
        dataIndex: "unitNo",
        align: "center",
      },
      {
        title: "Bill type",
        dataIndex: "billType",
        align: "center",
        render: (_, { billType }) => (
          <>
            <Tag>{billType}</Tag>
          </>
        ),
      },
      {
        title: "Bill status",
        dataIndex: "billStatus",
        align: "center",
        render: (_, { billStatus }) => (
          <>
            <Tag color={tagColorSelector(billStatus)}>{billStatus}</Tag>
          </>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        align: "center",
      },
      {
        title: "Start monthly",
        dataIndex: "startMonthly",
        align: "center",
      },
      {
        title: "End monthly",
        dataIndex: "endMonthly",
        align: "center",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        align: "center",
      },
      {
        title: "Created by",
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

    const handleMonth = async (e: any) => {
        if (e) {
            params.startBillMonthly = dayjs(e[0]).startOf("month").format("YYYY-MM");
            params.endBillMonthly = dayjs(e[1]).endOf("month").format("YYYY-MM");
        } else {
            params.startBillMonthly = undefined;
            params.endBillMonthly = undefined;
        }
        setStartBillMonthly(params.startBillMonthly);
        setEndBillMonthly(params.endBillMonthly);
    };

    return (
      <>
        <Header title="Payment Dashboard" />
        <div className="paymentTopActionGroup"></div>
        <div
          className="paymentTopActionLeftGroup"
          style={{ marginTop: 15, marginBottom: 15 }}>
          <Col span={6}>
            <RangePicker
              onChange={handleMonth}
              style={{ width: "95%" }}
              picker="month"
              format={customFormat}
            />
          </Col>
          {/* <Col span={6}>
                    <RangePicker onChange={handleDate} style={{ width: "95%" }} format={customFormat} />
                </Col> */}
          <Col span={4}>
            <Select
              defaultValue="All"
              style={{ width: "100%" }}
              onChange={(value: string) => {
                setByBillTypeId(value);
              }}
              options={BillTypeSelectLists}
            />
          </Col>
          {/* <Col span={4}>
                    <Select
                        defaultValue={OutDateList[0].label}
                        onChange={(value: string) => {
                            switch (value) {
                                case "OutDate":
                                    setByOutDate(true);
                                    break;
                                case "Current":
                                    setByOutDate(false);
                                    break;

                                default:
                                    setByOutDate(undefined);
                                    break;
                            }
                        }}
                        style={{ width: "100%" }}
                        options={OutDateList}
                    />
                </Col> */}
          <Col
            span={6}
            style={{ display: "flex", justifyContent: "flex-start" }}>
            <Search
              placeholder="Search by Unit"
              allowClear
              onSearch={onSearch}
              className="searchBox"
              style={{ width: 300 }}
            />
          </Col>
          <Col span={2} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              shape="round"
              type="primary"
              onClick={async () => {
                await setIsModalCreate(true);
              }}
              disabled={!accessibility?.menu_resident_information.allowEdit}>
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
        </div>
        {BillPaymentMasterDataList?.dataBillPaymentStatusLists ? (
          <Tabs
            defaultActiveKey=""
            items={BillPaymentStatusLists}
            onChange={async (key: string) => {
              setByBillStatusId(key);
            }}
          />
        ) : null}
        <Row>
          <Col span={24}>
            <Table
              columns={columns}
              pagination={PaginationConfig}
              dataSource={data?.dataBillPaymentList}
              loading={isLoading}
              onChange={onChangeTable}
              scroll={scroll}
            />
          </Col>
        </Row>
        <InfoResidentInformation
          callBack={async (isOpen: boolean) => await setIsModalOpenInfo(isOpen)}
          isOpen={isModalOpenInfo}
          resident={dataInfo}
        />
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
