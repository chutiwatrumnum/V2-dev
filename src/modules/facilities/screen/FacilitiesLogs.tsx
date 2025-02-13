import React, { useEffect, useState } from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  deleteFacilitieId,
  getdataFacilitieslist,
  ApprovedId,
  dowloadFacilities,
} from "../service/api/FacilitiesServiceAPI";
import {
  Row,
  Col,
  DatePicker,
  Input,
  Button,
  Modal,
  Checkbox,
  Table,
  Badge,
} from "antd";
import type { SorterResult } from "antd/es/table/interface";
import type { DatePickerProps } from "antd";
import { DeleteOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DataType, conditionPage } from "../../../stores/interface/Facilities";
const { confirm } = Modal;
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
interface FacilitiesLogsProps {
  room: number | null;
}
const pageSizeOptions = [10, 20, 60, 100];
let paramsAPI: conditionPage = {
  perPage: pageSizeOptions[0],
  curPage: 1,
  facilitiesId: 0,
};
const scroll: { x?: number | string } = {
  x: "10vw",
};

const FacilitiesLogs = ({ room }: FacilitiesLogsProps) => {
  const params: conditionPage = {
    perPage: pageSizeOptions[0],
    curPage: 1,
    facilitiesId: 0,
  };
  const [rerender, setRerender] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setstartDate] = useState<any>(null);
  const [endtDate, setendtDate] = useState<any>(null);
  const [loadingTable, setloadingTable] = useState<boolean>(true);
  const [total, settotal] = useState<number>(0);
  const [dataTable, setdataTable] = useState<DataType[]>([]);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [valueSearch, setvalueSearch] = useState<string>("");
  const dispatch = useDispatch<Dispatch>();

  const { RangePicker } = DatePicker;
  const customFormat: DatePickerProps["format"] = (value) =>
    `Month : ${value.format(dateFormat)}`;
  const dateFormat = "MMMM,YYYY";

  const { Search } = Input;
  const onSearch = async (value: string) => {
    paramsAPI.search = value;
    await initdata(paramsAPI);
  };
  // setting pagination Option

  let PaginationConfig = {
    pageSizeOptions: pageSizeOptions,
    pageSize: pageSizeOptions[0],
    current: currentPage,
    // showSizeChanger: true,
    total: total,
  };
  const [Page, setPage] = useState(PaginationConfig);

  useEffect(() => {
    if (room) {
      (async function () {
        paramsAPI = params;
        paramsAPI.facilitiesId = room;
        await initdata(paramsAPI);
        await setstartDate(null);
        await setendtDate(null);
        await setvalueSearch("");
        await setSortedInfo({});
        await setPage(PaginationConfig);
      })();
    }
  }, [rerender, room]);

  const initdata = async (params: conditionPage) => {
    const data = await getdataFacilitieslist(params);
    // console.log("init data => ", data);

    if (data?.status) {
      await setdataTable(data?.dataValue);
      await settotal(data?.total);
      PaginationConfig.total = data?.total;
    }
    await setloadingTable(false);
  };
  const onChangeTable: TableProps<DataType>["onChange"] = async (
    pagination: any,
    filters,
    sorter: any,
    extra
  ) => {
    // console.log("params", pagination);
    if (paramsAPI) {
      paramsAPI.curPage = pagination?.current
        ? pagination?.current
        : PaginationConfig.current;
      paramsAPI.perPage = pagination?.pageSize
        ? pagination?.pageSize
        : PaginationConfig.pageSize;

      if (sorter?.order) {
        paramsAPI.sortBy = sorter?.field;
        paramsAPI.sort = sorter?.order;
      } else {
        paramsAPI.sortBy = undefined;
        paramsAPI.sort = undefined;
      }
      PaginationConfig = pagination;

      await setPage(PaginationConfig);
      await setSortedInfo(sorter as SorterResult<DataType>);
      await setCurrentPage(paramsAPI.curPage);
      await initdata(paramsAPI);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      width: "auto",
      render: (_, record) => (
        <>
          <Button
            shape="round"
            value={record.key}
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => {
              showDeleteConfirm(record);
            }}
          ></Button>
        </>
      ),
    },
    {
      title: "Booking ref",
      dataIndex: "refBooking",
      align: "center",
      width: "auto",
    },
    {
      title: "Title",
      dataIndex: "purpose",
      align: "center",
      width: "auto",
    },
    {
      title: "Joining date",
      dataIndex: "joiningDate",
      align: "center",
      width: "auto",
    },
    {
      title: "Unit no.",
      dataIndex: "unitNo",
      align: "center",
      key: "unitNo",
      width: "auto",
      sorter: {
        compare: (a, b) => a.unitNo.localeCompare(b.unitNo),
      },
      sortOrder: sortedInfo.columnKey === "unitNo" ? sortedInfo.order : null,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "auto",
      render: (_, record) => <div>{record.status}</div>,
      sorter: {
        compare: (a, b) => a?.status.localeCompare(b?.status),
      },
      sortOrder: sortedInfo.columnKey === "status" ? sortedInfo.order : null,
    },
    {
      title: "Created date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: "auto",
      sorter: (a, b) =>
        dayjs(a.createdAt, "DD/MM/YYYY").unix() -
        dayjs(b.createdAt, "DD/MM/YYYY").unix(),
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    },
    {
      title: "Start-End time",
      dataIndex: "startEndTime",
      align: "center",
      width: "auto",
    },
    {
      title: "Booked by",
      dataIndex: "bookedBy",
      align: "center",
      key: "bookedBy",
      width: "auto",
      sorter: {
        compare: (a, b) => a.bookedBy.localeCompare(b.bookedBy),
      },
      sortOrder: sortedInfo.columnKey === "bookedBy" ? sortedInfo.order : null,
    },

    {
      title: "Approved",
      align: "center",
      dataIndex: "approve",
      width: "auto",
      render: (_, record) => (
        <>
          <Row>
            <Col span={24}>
              <Checkbox
                disabled={record.juristicConfirm}
                checked={record.approve}
                value={record.key}
                onChange={showApproved}
              ></Checkbox>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Reject",
      dataIndex: "reject",
      align: "center",
      key: "edit",
      width: "auto",
      render: (_, record) => (
        <>
          <Row>
            <Col span={24}>
              <Checkbox
                disabled={record.juristicConfirm}
                checked={record.reject}
                value={record.key}
                onChange={reject}
              ></Checkbox>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const showDeleteConfirm = (params: DataType) => {
    let msgModal = "Are you sure you want to delete this?";
    if (params.juristicConfirm) {
      msgModal = "Are you sure you want to delete?";
    }
    confirm({
      title: "Confirm action",
      content: msgModal,
      icon: null,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusDeleted = await deleteFacilitieId(parseInt(params.key));
        if (statusDeleted) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully deleted",
          });
          await initdata(paramsAPI);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed deleted",
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const exportFacilites = ({ currentTarget }: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to export this file?",
      icon: null,
      okText: "Yes",
      okType: "primary",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusSuccess = await dowloadFacilities(room);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleDate = async (e: any) => {
    if (e) {
      paramsAPI.startDate = dayjs(e[0]).startOf("month").format("YYYY-MM");
      paramsAPI.endDate = dayjs(e[1]).endOf("month").format("YYYY-MM");
      await setstartDate(dayjs(e[0]).startOf("month"));
      await setendtDate(dayjs(e[1]).endOf("month"));
    } else {
      paramsAPI.startDate = undefined;
      paramsAPI.endDate = undefined;
      await setstartDate(null);
      await setendtDate(null);
    }
    await initdata(paramsAPI);
  };

  const showApproved = (e: CheckboxChangeEvent) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to approve this?",
      icon: null,
      okText: "Yes",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusApprovedId = await ApprovedId({
          id: e.target.value,
          approve: true,
        });

        if (statusApprovedId) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully approved",
          });
          await initdata(paramsAPI);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed approved",
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const reject = (e: CheckboxChangeEvent) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to reject this?",
      icon: null,
      okText: "Yes",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusApprovedId = await ApprovedId({
          id: e.target.value,
          reject: true,
        });
        if (statusApprovedId) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully rejected",
          });
          await initdata(paramsAPI);
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed rejected",
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Col span={10}>
          <RangePicker
            value={[startDate, endtDate]}
            onChange={handleDate}
            style={{ width: "95%" }}
            picker="month"
            format={customFormat}
          />
        </Col>
        <Col
          span={10}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Search
            value={valueSearch}
            placeholder="Search by booking reference"
            allowClear
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              await setvalueSearch(e.target.value);
            }}
            onSearch={onSearch}
            className="searchBox"
            style={{ width: 300 }}
          />
        </Col>
        <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button shape="round" type="primary" onClick={exportFacilites}>
            Export
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            pagination={Page}
            dataSource={dataTable}
            loading={loadingTable}
            onChange={onChangeTable}
            scroll={scroll}
          />
        </Col>
      </Row>
    </>
  );
};

export default FacilitiesLogs;
