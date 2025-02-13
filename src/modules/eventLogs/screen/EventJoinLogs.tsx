import React, { useEffect, useState } from "react";
import Header from "../../../components/templates/Header";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  deleteEventJoinById,
  getDataJoinLogByid,
  downloadEventJoinLogs,
} from "../service/api/EventLogsServiceAPI";
import { Row, Col, Input, Button, Modal } from "antd";
import type { DatePickerProps } from "antd";
import { InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  dataEventJoinLogsType,
  conditionPage,
} from "../../../stores/interfaces/EventLog";
import InfoEventJoinLogs from "../components/InfoEventJoinLogs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
const { confirm } = Modal;
import SuccessModal from "../../../components/common/SuccessModal";
import FailedModal from "../../../components/common/FailedModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import MediumActionButton from "../../../components/common/MediumActionButton";
import SearchBox from "../../../components/common/SearchBox";
import DatePicker from "../../../components/common/DatePicker";

const EventJoinLogs = () => {
  const { loading, tableData, total } = useSelector(
    (state: RootState) => state.eventLog
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  // setting pagination Option
  const pageSizeOptions = [15, 30, 60, 100];
  const PaginationConfig = {
    defaultPageSize: pageSizeOptions[0],
    pageSizeOptions: pageSizeOptions,
    current: currentPage,
    showSizeChanger: false,
    total: total,
  };
  let params: conditionPage = {
    perPage: pageSizeOptions[0],
    curPage: currentPage,
  };
  const [rerender, setRerender] = useState<boolean>(true);
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
  const [paramsData, setParamsData] = useState<conditionPage>(params);
  const dispatch = useDispatch<Dispatch>();
  const customFormat: DatePickerProps["format"] = (value) =>
    `Month : ${value.format(dateFormat)}`;
  const dateFormat = "MMMM,YYYY";

  const { Search } = Input;
  const scroll: { x?: number | string } = {
    x: "100vw",
  };
  useEffect(() => {
    (async function () {
      await setParamsData(params);
      await dispatch.eventLog.getTableData(paramsData);
    })();
  }, [rerender]);

  const onChangeTable: TableProps<dataEventJoinLogsType>["onChange"] = async (
    pagination: any,
    filters,
    sorter: any,
    extra
  ) => {
    params = paramsData;
    params.sort = sorter?.order;
    params.sortBy = sorter?.field;
    params.curPage = pagination?.current
      ? pagination?.current
      : PaginationConfig.current;
    params.perPage = pagination?.pageSize
      ? pagination?.pageSize
      : PaginationConfig.defaultPageSize;
    await setParamsData(params);
    await setCurrentPage(params.curPage);
    await dispatch.eventLog.getTableData(paramsData);
  };
  const onSearch = async (value: string) => {
    params = paramsData;
    params.search = value;
    await setParamsData(params);
    await dispatch.eventLog.getTableData(paramsData);
  };
  const columns: ColumnsType<dataEventJoinLogsType> = [
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      width: "5%",
      render: (_, record) => (
        <>
          <Button
            value={record.key}
            type="text"
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}></Button>
        </>
      ),
    },
    {
      title: "Event name",
      dataIndex: "eventName",
      align: "center",
      width: "6%",
      sorter: {
        compare: (a, b) => a.eventName.localeCompare(b.eventName),
      },
    },
    {
      title: "Joining date",
      dataIndex: "joiningDate",
      align: "center",
      width: "6%",
      sorter: {
        compare: (a, b) => a.joiningDate.localeCompare(b.joiningDate),
      },
    },
    {
      title: "Unit no.",
      dataIndex: "unitNo",
      align: "center",
      width: "6%",
      sorter: {
        compare: (a, b) => a.unitNo.localeCompare(b.unitNo),
      },
    },
    {
      title: "Participant",
      dataIndex: "participant",
      align: "center",
      key: "participant",
      width: "5%",
      sorter: {
        compare: (a, b) => a.participant - b.participant,
      },
    },
    {
      title: "Booked by",
      dataIndex: "bookingBy",
      align: "center",
      key: "bookingBy",
      width: "5%",
    },
    {
      title: "Detail",
      dataIndex: "detail",
      align: "center",
      key: "detail",
      width: "5%",
      render: (_, record) => (
        <>
          <Row>
            <Col span={24}>
              <Button
                value={record.key}
                type="text"
                icon={<InfoCircleOutlined />}
                onClick={async () => {
                  const dataInfo = await getDataJoinLogByid(record.key);
                  if (dataInfo?.status) {
                    await setDataInfo(dataInfo.data);
                    await setIsModalOpenInfo(true);
                  }
                }}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const showDeleteConfirm = ({ currentTarget }: any) => {
    ConfirmModal({
      title: "Are you sure you want to delete this?",
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: async () => {
        const statusDeleted = await deleteEventJoinById(currentTarget.value);
        if (statusDeleted) {
          SuccessModal("Successfully Deleted");
        } else {
          FailedModal("Something went wrong");
        }
        setRerender(!rerender);
      },
      onCancel: () => console.log("Cancel"),
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
    await dispatch.eventLog.getTableData(paramsData);
  };

  const exportEventJoinLogs = () => {
    ConfirmModal({
      title: "Are you sure you want to export this file?",
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: async () => {
        const statusSuccess = await downloadEventJoinLogs();
        //  if (stastatusSuccesstusDeleted) {
        //    SuccessModal("Successfully Deleted");
        //  } else {
        //    FailedModal("Something went wrong");
        //  }
        //  setRerender(!rerender);
      },
      onCancel: () => console.log("Cancel"),
    });
  };

  return (
    <>
      <Header title="Event joining logs" />
      <div className="eventTopActionGroup">
        <div className="eventTopActionLeftGroup">
          <DatePicker
            className="eventDatePicker"
            onChange={handleDate}
            picker="month"
          />
          <SearchBox
            className="eventSearchBox"
            onSearch={onSearch}
            placeholderText="Search by event name"
          />
        </div>
        <MediumActionButton
          message="Export"
          onClick={exportEventJoinLogs}
          className="createEventBtn"
        />
      </div>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            pagination={PaginationConfig}
            dataSource={tableData}
            loading={loading}
            onChange={onChangeTable}
            scroll={scroll}
          />
        </Col>
      </Row>
      <InfoEventJoinLogs
        callBack={async (isOpen: boolean) => setIsModalOpenInfo(isOpen)}
        isOpen={isModalOpenInfo}
        eventjoinLog={dataInfo}
      />
    </>
  );
};

export default EventJoinLogs;
