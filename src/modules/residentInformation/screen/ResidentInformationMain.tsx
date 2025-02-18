import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { deleteResidentId } from "../service/api/ResidentServiceAPI";
import { Row, Col, DatePicker, Input, Button, Modal, notification } from "antd";
import type { DatePickerProps } from "antd";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DataType, conditionPage } from "../../../stores/interfaces/Resident";

import CreateAddNew from "../components/CreateAddNew";
import EditResidentInformation from "../components/EditResidentInformation";
import InfoResidentInformation from "../components/InfoResidentInformation";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
const { confirm } = Modal;
const ResidentInformation = () => {
  const { loading, tableData, total } = useSelector(
    (state: RootState) => state.resident
  );
  const { accessibility } = useSelector((state: RootState) => state.common);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // setting pagination Option
  const pageSizeOptions = [10, 20, 60, 100];
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
    verifyByJuristic: true,
    reject: false,
    isActive: true,
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
      await dispatch.resident.getTableData(paramsData);
    })();
  }, [rerender]);

  const onChangeTable: TableProps<DataType>["onChange"] = async (
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
    await dispatch.resident.getTableData(paramsData);
  };

  const onSearch = async (value: string) => {
    params = paramsData;
    params.search = value;
    await setParamsData(params);
    await dispatch.resident.getTableData(paramsData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            shape="round"
            value={record.key}
            type="text"
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            disabled={
              !accessibility?.menu_resident_information.allowDelete
            }></Button>
        </>
      ),
    },
    {
      title: "First name",
      dataIndex: "firstName",
      align: "center",
      sorter: {
        compare: (a, b) => a.firstName.localeCompare(b.firstName),
      },
    },
    {
      title: "Middle name",
      dataIndex: "middleName",
      align: "center",
      // sorter: {
      //   compare: (a, b) => a.firstName.localeCompare(b.firstName),
      // },
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      align: "center",
      sorter: {
        compare: (a, b) => a.lastName.localeCompare(b.lastName),
      },
    },
    // {
    //   title: "Unit no.",
    //   dataIndex: "unitNo",
    //   align: "center",
    //   sorter: {
    //     compare: (a, b) => a.unitNo.localeCompare(b.unitNo),
    //   },
    // },
    {
      title: "email",
      dataIndex: "email",
      align: "center",
      width: "5%",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      sorter: {
        compare: (a, b) => a.role.localeCompare(b.role),
      },
    },
    // {
    //   title: "Hobby",
    //   dataIndex: "hobby",
    //   align: "center",
    //   sorter: {
    //     compare: (a, b) => a.hobby.localeCompare(b.hobby),
    //   },
    // },
    {
      title: "Move-in date",
      dataIndex: "moveInDate",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {dayjs(record.moveInDate).format("DD/MM/YYYY") != "Invalid Date"
              ? dayjs(record.moveInDate).format("DD/MM/YYYY")
              : "-"}
          </div>
        );
      },
      // sorter: {
      //   compare: (a, b) => a.moveInDate.localeCompare(b.moveInDate),
      // },
    },

    {
      title: "Edit",
      dataIndex: "edit",
      align: "center",
      key: "edit",
      width: "10%",
      render: (_, record) => (
        <>
          <Row>
            <Col span={12}>
              <Button
                shape="round"
                value={record.key}
                type="text"
                icon={<InfoCircleOutlined />}
                onClick={async () => {
                  await setDataInfo(record);
                  await setIsModalOpenInfo(true);
                }}
              />
            </Col>
            <Col span={12}>
              <Button
                shape="round"
                value={record.key}
                onClick={async () => {
                  await editButton(record);
                }}
                type="text"
                icon={<EditOutlined />}
                disabled={!accessibility?.menu_resident_information.allowEdit}
              />
            </Col>
          </Row>
        </>
      ),
    },
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
      <Header title="Resident’s information" />
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Col span={10}>
          <RangePicker
            onChange={handleDate}
            style={{ width: "95%" }}
            picker="month"
            format={customFormat}
          />
        </Col>
        <Col
          span={10}
          style={{ display: "flex", justifyContent: "flex-start" }}>
          <Search
            placeholder="Search by first name"
            allowClear
            onSearch={onSearch}
            className="searchBox"
            style={{ width: 300 }}
          />
        </Col>
        <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            shape="round"
            type="primary"
            onClick={async () => {
              await setIsModalCreate(true);
            }}
            disabled={!accessibility?.menu_resident_information.allowEdit}>
            Add new
          </Button>
          <CreateAddNew
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
      <InfoResidentInformation
        callBack={async (isOpen: boolean) => await setIsModalOpenInfo(isOpen)}
        isOpen={isModalOpenInfo}
        resident={dataInfo}
      />
      <EditResidentInformation
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

export default ResidentInformation;
