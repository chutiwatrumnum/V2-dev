import React, { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  deleteResidentId,
  ApprovedId,
  RejectById,
} from "../service/api/ResidentServiceAPI";
import {
  Row,
  Col,
  DatePicker,
  Input,
  Button,
  Modal,
  notification,
  Tabs,
  Form,
} from "antd";
import type { DatePickerProps, TabsProps } from "antd";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DataType,
  columnTable,
  conditionPage,
  rejectRequest,
} from "../../../stores/interfaces/Resident";
import ApprovedResidentSignUp from "../components/ApprovedResidentSignUp";
import InfoResidentSignUp from "../components/InfoResidentSignUp";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
const { confirm } = Modal;
const ResidentSignUp = () => {
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
    verifyByJuristic: false,
    reject: false,
    isActive: false,
  };

  const columnTables: columnTable = {
    defaultTable: [
      {
        title: "Delete",
        dataIndex: "action",
        align: "center",
        width: "2%",
        render: (_, record) => (
          <>
            <Button
              shape="round"
              value={record.key}
              type="text"
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}
              disabled={
                !accessibility?.menu_resident_sign_up.allowDelete
              }></Button>
          </>
        ),
      },
      {
        title: "First name",
        dataIndex: "firstName",
        align: "center",
        width: "7%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.firstName.localeCompare(b.firstName),
              }
            : false,
      },
      {
        title: "Middle name",
        dataIndex: "middleName",
        align: "center",
        width: "7%",
        //   sorter:
        //     tableData.length > 0
        //       ? {
        //           compare: (a, b) => a.unitNo.localeCompare(b.unitNo),
        //         }
        //       : false,
      },
      {
        title: "Last name",
        dataIndex: "lastName",
        align: "center",
        width: "7%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.lastName.localeCompare(b.lastName),
              }
            : false,
      },
      {
        title: "Unit no.",
        dataIndex: "unitNo",
        align: "center",
        width: "7%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.unitNo.localeCompare(b.unitNo),
              }
            : false,
      },
      {
        title: "email",
        dataIndex: "email",
        align: "center",
        width: "5%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.email.localeCompare(b.email),
              }
            : false,
      },
      {
        title: "Role",
        dataIndex: "role",
        align: "center",
        width: "10%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.role.localeCompare(b.role),
              }
            : false,
      },
    ],
    allTabsColumn: [
      {
        title: "Create",
        dataIndex: "createdAt",
        align: "center",
        width: "5%",
        // sorter:tableData.length>0? {
        //   compare: (a, b) => a.createdAt.localeCompare(b.createdAt),
        // },
        render: (record) => {
          return (
            <Row>
              <Col span={24}>{dayjs(record).format("DD/MM/YYYY")}</Col>
            </Row>
          );
        },
      },
      {
        align: "center",
        width: "2%",
        render: (record) => {
          return (
            <Row>
              <Col span={24}>
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
            </Row>
          );
        },
      },

      {
        title: "Approved",
        dataIndex: "approved",
        align: "center",
        key: "approved",
        width: "5%",
        render: (_, record) => (
          <>
            <Row>
              <Col span={24}>
                <Button
                  shape="round"
                  value={record.key}
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={showApproved}
                  disabled={
                    !accessibility?.menu_resident_sign_up.allowEdit
                  }></Button>
              </Col>
            </Row>
          </>
        ),
      },
      {
        title: "Reject",
        dataIndex: "Reject",
        align: "center",
        key: "Reject",
        width: "5%",
        render: (_, record) => (
          <>
            <Row>
              <Col span={24}>
                <Button
                  shape="round"
                  value={record.key}
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={showReject}
                  disabled={
                    !accessibility?.menu_resident_sign_up.allowEdit
                  }></Button>
              </Col>
            </Row>
          </>
        ),
      },
    ],
    rejectTabsColumn: [
      {
        title: "Reject date",
        dataIndex: "rejectAt",
        align: "center",
        width: "5%",
        render: (_, record) => {
          return (
            <div>
              {record.rejectAt !== "-"
                ? dayjs(record.rejectAt).format("DD/MM/YYYY")
                : "-"}
            </div>
          );
        },
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.rejectAt.localeCompare(b.rejectAt),
              }
            : false,
      },
      {
        title: "Reject by",
        dataIndex: "rejectUser",
        align: "center",
        width: "10%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.rejectUser.localeCompare(b.rejectUser),
              }
            : false,
      },
      {
        align: "center",
        width: "2%",
        render: (record) => {
          return (
            <Row>
              <Col span={24}>
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
            </Row>
          );
        },
      },
    ],
    waitActiveTabsColumn: [
      // {
      //   title: "Reject date",
      //   dataIndex: "rejectAt",
      //   align: "center",
      //   width: "5%",
      //   render: (_, record) => {
      //     return (
      //       <div>
      //         {record.rejectAt !== "-"
      //           ? dayjs(record.rejectAt).format("DD/MM/YYYY")
      //           : "-"}
      //       </div>
      //     );
      //   },
      //   sorter:
      //     tableData.length > 0
      //       ? {
      //           compare: (a, b) => a.rejectAt.localeCompare(b.rejectAt),
      //         }
      //       : false,
      // },
      // {
      //   title: "Reject by",
      //   dataIndex: "rejectUser",
      //   align: "center",
      //   width: "10%",
      //   sorter:
      //     tableData.length > 0
      //       ? {
      //           compare: (a, b) => a.rejectUser.localeCompare(b.rejectUser),
      //         }
      //       : false,
      // },
      {
        align: "center",
        width: "2%",
        render: (record) => {
          return (
            <Row>
              <Col span={24}>
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
            </Row>
          );
        },
      },
    ],
  };
  const [rerender, setRerender] = useState<boolean>(true);
  const [dataApproved, setDataApproved] = useState<any>(null);
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpenApproved] = useState(false);
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
  const dispatch = useDispatch<Dispatch>();
  const [paramsData, setParamsData] = useState<conditionPage>(params);
  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const [RejectId, setRejectId] = useState<string | null>(null);
  const [columnsTable, setColumnsTable] = useState<ColumnsType<DataType>>(
    columnTables.defaultTable
  );
  const [tabsSelected, setTabsSelected] = useState<string>("1");
  const { RangePicker } = DatePicker;
  const customFormat: DatePickerProps["format"] = (value) =>
    `Month : ${value.format(dateFormat)}`;
  const dateFormat = "MMMM,YYYY";

  const { Search } = Input;
  const onSearch = async (value: string) => {
    params = paramsData;
    params.search = value;
    await setParamsData(params);
    await dispatch.resident.getTableData(paramsData);
  };
  const [form] = Form.useForm();
  useEffect(() => {
    (async function () {
      const columns = columnTables.defaultTable.concat(
        columnTables.allTabsColumn
      );
      await setColumnsTable(columns);
      await setParamsData(params);
      await dispatch.resident.getTableData(paramsData);
    })();
  }, [rerender]);

  const scroll: { x?: number | string } = {
    x: "100vw",
  };
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

  const showDeleteConfirm = ({ currentTarget }: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to delete this?",
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
        await dispatch.resident.getTableData(paramsData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onChangeTab = async (key: string) => {
    if (key === "2") {
      const columns = columnTables.defaultTable.concat(
        columnTables.waitActiveTabsColumn
      );
      await setColumnsTable(columns);
      params = paramsData;
      params.reject = false;
      params.verifyByJuristic = true;
      params.isActive = false;
      params.curPage = 1;
      await setParamsData(params);
      await setCurrentPage(params.curPage);
      await dispatch.resident.getTableData(paramsData);
    } else if (key === "3") {
      const columns = columnTables.defaultTable.concat(
        columnTables.rejectTabsColumn
      );
      await setColumnsTable(columns);
      params = paramsData;
      params.reject = true;
      params.verifyByJuristic = true;
      params.curPage = 1;
      await setParamsData(params);
      await setCurrentPage(params.curPage);
      await dispatch.resident.getTableData(paramsData);
    } else {
      params = paramsData;
      params.reject = false;
      params.verifyByJuristic = false;
      params.curPage = 1;
      const columns = columnTables.defaultTable.concat(
        columnTables.allTabsColumn
      );
      await setColumnsTable(columns);
      await setParamsData(params);
      await setCurrentPage(params.curPage);
      await dispatch.resident.getTableData(paramsData);
    }
  };

  const itemsTabs: TabsProps["items"] = [
    {
      key: "1",
      label: `All`,
    },
    {
      key: "2",
      label: `Pending verification`,
    },
    {
      key: "3",
      label: `Reject`,
    },
  ];
  //approve
  const showApproved = ({ currentTarget }: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to approve this?",
      icon: null,
      okText: "Yes",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusCreated = await ApprovedId(currentTarget.value);
        if (statusCreated) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully approved",
          });
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed approved",
          });
        }
        console.log("statusCreated", statusCreated);
        setRerender(!rerender);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //reject
  const showReject = async ({ currentTarget }: any) => {
    setRejectId(currentTarget.value);
    setRejectModal(true);
  };

  const onFinish = async (values: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to reject this?",
      icon: null,
      okText: "Yes",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const requestReject: rejectRequest = {
          userId: `${RejectId}`,
          rejectReason: values.rejectReason,
        };
        const statusReject = await RejectById(requestReject);

        if (statusReject) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully rejected",
          });
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "failed rejected",
          });
        }
        await setRejectModal(false);
        await form.resetFields();
        await setRerender(!rerender);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };
  const handleCancel = async () => {
    await setRejectId(null);
    await form.resetFields();
    await setRejectModal(false);
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
      <Header title="Resident’s sign up" />
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey="1" items={itemsTabs} onChange={onChangeTab} />
        </Col>
      </Row>
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
        <Col
          span={4}
          style={{ display: "flex", justifyContent: "flex-end" }}></Col>
      </Row>

      <Row>
        <Col span={24}>
          <Table
            style={{ width: "100%" }}
            columns={columnsTable}
            pagination={PaginationConfig}
            dataSource={tableData}
            loading={loading}
            onChange={onChangeTable}
            scroll={scroll}
          />
        </Col>
      </Row>
      <InfoResidentSignUp
        callBack={async (isOpen: boolean) => await setIsModalOpenInfo(isOpen)}
        isOpen={isModalOpenInfo}
        resident={dataInfo}
      />
      <ApprovedResidentSignUp
        callBack={async (isOpen: boolean) =>
          await setIsModalOpenApproved(isOpen)
        }
        isOpen={isModalOpen}
        resident={dataApproved}
      />
      <Modal
        title="Please input note to reject this"
        open={rejectModal}
        onOk={form.submit}
        onCancel={handleCancel}
        //  okButtonProps={{ style: {marginRight:30 } }}
        cancelButtonProps={{ style: { display: "none" } }}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 20 }}
          wrapperCol={{ span: 22 }}
          style={{ width: "110%", paddingTop: 10 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item
            label="Note"
            name="rejectReason"
            // rules={[
            //   { max: 200, message: "max 200 charecter" },
            //   {
            //     // pattern: new RegExp(/^[a-zA-Z0-9]*$/),
            //     // message: "charecter and number only",
            //   },
            //   { required: true, message: "Please fill in required field" },
            // ]}
          >
            <Input.TextArea
              showCount
              style={{ height: 120, resize: "none" }}
              rows={4}
              maxLength={200}
              placeholder="Input note"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ResidentSignUp;
