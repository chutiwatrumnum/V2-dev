import { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  deleteBuildActivityByID,
  deleteParticipantGroupByID,
} from "../service/api/buildingActivitesAPI";
import { Row, Col, Input, Button, Modal, Tabs, Form } from "antd";
import type { DatePickerProps, TabsProps } from "antd";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DataType,
  columnTable,
  conditionPage,
} from "../../../stores/interfaces/Buliding";
import CreateBuildingActivities from "../components/CreateBuildingActivities";
import EditBuildingActivitiesModal from "../components/EditBuildingActivities";
import EditMaintenanceFacilityModal from "../components/EditMaintenanceFacility";
import CreateParticipantGroup from "../components/CreateParticipantGroup";
import EditParticipantGroupModal from "../components/EditParticipantGroup";
import InfoParticipantGroup from "../components/InfoParticipantGroup";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
const { confirm } = Modal;
const BuildingActivities = () => {
  const { loading, tableData, total } = useSelector(
    (state: RootState) => state.building
  );
  const { accessibility } = useSelector((state: RootState) => state.common);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataEdit, setDataEdit] = useState<DataType | null>(null);
  const [dataEditBuildActivity, setDataEditBuildActivity] =
    useState<DataType | null>(null);
  const [dataEditMaintenanceFacility, setDataEditMaintenanceFacility] =
    useState<DataType | null>(null);
  const [isModalCreateBuildingActivities, setIsModalCreateBuildingActivities] =
    useState(false);
  const [isModalCreateParticipantGroup, setIsModalCreateParticipantGroup] =
    useState(false);
  const [isModalEditParticipantGroup, setIsModalEditParticipantGroup] =
    useState(false);
  const [isModalEditBuildActivity, setIsModalEditBuildActivity] =
    useState(false);
  const [isModalEditMaintenanceFacility, setIsModalEditMaintenanceFacility] =
    useState(false);
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
  };

  const columnTables: columnTable = {
    buildingActivityTable: [
      {
        title: "Delete",
        dataIndex: "action",
        align: "center",
        width: "4%",
        render: (_, record) => (
          <>
            <Button
              shape="round"
              value={record.key}
              type="text"
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}></Button>
          </>
        ),
      },
      {
        title: "No",
        dataIndex: "no",
        align: "center",
        width: "3%",
      },
      {
        title: "Event",
        dataIndex: "calendarTypeName",
        align: "center",
        width: "7%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) =>
                  a.calendarTypeName.localeCompare(b.calendarTypeName),
              }
            : false,
      },
      {
        title: "Title",
        dataIndex: "title",
        align: "center",
        ellipsis: true,
        width: "7%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.title.localeCompare(b.title),
              }
            : false,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        align: "center",
        width: "5%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.date.localeCompare(b.date),
              }
            : false,
        render: (date: string) => {
          let Created = dayjs(date).format("DD/MM/YYYY").toString();
          return (
            <>
              <div>{Created}</div>
            </>
          );
        },
      },
      {
        title: "Time",
        dataIndex: "time",
        align: "center",
        width: "5%",

        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.time.localeCompare(b.time),
              }
            : false,
      },
      {
        title: "Created by",
        dataIndex: "createdBy",
        align: "center",
        width: "5%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.createdBy.localeCompare(b.createdBy),
              }
            : false,
      },
      {
        title: "Note",
        dataIndex: "note",
        ellipsis: true,
        align: "center",
        width: "5%",

        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.note.localeCompare(b.note),
              }
            : false,
      },
      {
        title: "Edit",
        dataIndex: "edit",
        align: "center",
        key: "edit",
        width: "5%",
        render: (_, record) => (
          <>
            <Row>
              <Col span={24}>
                <Button
                  shape="round"
                  value={record.key}
                  onClick={async () => {
                    await EditBuildingActivities(record);
                  }}
                  type="text"
                  icon={<EditOutlined />}
                />
              </Col>
            </Row>
          </>
        ),
      },
    ],
    allTabsColumn: [
      {
        title: "Delete",
        dataIndex: "action",
        align: "center",
        width: "3%",
        render: (_, record) => (
          <>
            <Button
              shape="round"
              value={record.key}
              type="text"
              icon={<DeleteOutlined />}
              onClick={showDeleteParticipantGroupConfirm}
              disabled={
                !accessibility?.menu_resident_sign_up.allowDelete
              }></Button>
          </>
        ),
      },
      {
        title: "No",
        dataIndex: "no",
        align: "center",
        width: "3%",
      },
      {
        title: "Group",
        dataIndex: "groupname",
        align: "center",
        width: "7%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a?.groupname.localeCompare(b?.groupname),
              }
            : false,
      },
      {
        title: "Updated Date",
        dataIndex: "date",
        key: "date",
        align: "center",
        width: "5%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.date.localeCompare(b.date),
              }
            : false,
        render: (date: string) => {
          let Created = dayjs(date).format("DD/MM/YYYY").toString();
          return (
            <>
              <div>{Created}</div>
            </>
          );
        },
      },
      {
        title: "Updated Time",
        dataIndex: "time",
        key: "time",
        align: "center",
        width: "5%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.time.localeCompare(b.time),
              }
            : false,
        render: (time: string) => {
          let date = dayjs(time).format("HH:mm").toString();
          return (
            <>
              <div>{date}</div>
            </>
          );
        },
      },
      {
        title: "Created by",
        dataIndex: "createdBy",
        align: "center",
        width: "5%",
        sorter:
          tableData.length > 0
            ? {
                compare: (a, b) => a.createdBy.localeCompare(b.createdBy),
              }
            : false,
      },
      {
        title: "Info",
        dataIndex: "action",
        align: "center",
        width: "5%",
        render: (_, record) => (
          <>
            <Row>
              <Col span={24}>
                <Button
                  shape="round"
                  value={record.key}
                  onClick={async () => {
                    await infoData(record);
                  }}
                  type="text"
                  icon={<InfoCircleOutlined />}
                />
              </Col>
            </Row>
          </>
        ),
      },
      {
        title: "Edit",
        dataIndex: "action",
        align: "center",
        width: "5%",
        render: (_, record) => (
          <>
            <Row>
              <Col span={24}>
                <Button
                  shape="round"
                  value={record.key}
                  onClick={async () => {
                    await editParticipantGroup(record);
                  }}
                  type="text"
                  icon={<EditOutlined />}
                />
              </Col>
            </Row>
          </>
        ),
      },
    ],
  };
  const [rerender, setRerender] = useState<boolean>(true);
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
  const dispatch = useDispatch<Dispatch>();
  const [paramsData, setParamsData] = useState<conditionPage>(params);
  const [columnsTable, setColumnsTable] = useState<ColumnsType<DataType>>(
    columnTables.buildingActivityTable
  );
  const [tabsSelected, setTabsSelected] = useState<string>("1");
  const customFormat: DatePickerProps["format"] = (value) =>
    `Month : ${value.format(dateFormat)}`;
  const dateFormat = "MMMM,YYYY";

  const { Search } = Input;
  const onSearch = async (value: string) => {
    params = paramsData;
    params.search = value;
    await setParamsData(params);
    if (tabsSelected === "2") {
      await dispatch.building.getTableDataGroup(paramsData);
    } else {
      await dispatch.building.getTableData(paramsData);
    }
  };

  const [form] = Form.useForm();
  useEffect(() => {
    (async function () {
      const columns = columnTables.buildingActivityTable;
      await setColumnsTable(columns);
      await setParamsData(params);
      await dispatch.building.getTableData(paramsData);
    })();
  }, [rerender]);

  const editParticipantGroup = async (data: any) => {
    await setDataEdit(data);
    await setIsModalEditParticipantGroup(true);
  };

  const EditBuildingActivities = async (data: any) => {
    if (data.facilitiesId > 0) {
      await setDataEditMaintenanceFacility(data);
      await setIsModalEditMaintenanceFacility(true);
    } else {
      await setDataEditBuildActivity(data);
      await setIsModalEditBuildActivity(true);
    }
  };
  const infoData = async (data: any) => {
    await setDataInfo(data);
    await setIsModalOpenInfo(true);
  };
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
    if (tabsSelected === "2") {
      await dispatch.building.getTableDataGroup(paramsData);
    } else {
      await dispatch.building.getTableData(paramsData);
    }
  };

  const showDeleteConfirm = ({ currentTarget }: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to delete?",
      icon: null,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusDeleted = await deleteBuildActivityByID(
          currentTarget.value
        );
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
        await dispatch.building.getTableData(paramsData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showDeleteParticipantGroupConfirm = ({ currentTarget }: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to delete participant group?",
      icon: null,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusDeleted = await deleteParticipantGroupByID(
          currentTarget.value
        );
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
        await dispatch.building.getTableDataGroup(paramsData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onChangeTab = async (key: string) => {
    if (key === "2") {
      await setTabsSelected(key);
      const columns = columnTables.allTabsColumn;
      await setColumnsTable(columns);
      params.curPage = 1;
      await setParamsData(params);
      await setCurrentPage(params.curPage);
      await dispatch.building.getTableDataGroup(params);
    } else {
      await setTabsSelected(key);
      params.curPage = 1;
      const columns = columnTables.buildingActivityTable;
      await setColumnsTable(columns);
      await setParamsData(params);
      await setCurrentPage(params.curPage);
      await dispatch.building.getTableData(params);
    }
  };

  const itemsTabs: TabsProps["items"] = [
    {
      key: "1",
      label: `Building activities`,
    },
    {
      key: "2",
      label: `Participant group`,
    },
  ];

  return (
    <>
      <Header title="Building activities" />
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey="1" items={itemsTabs} onChange={onChangeTab} />
        </Col>
        <Col></Col>
      </Row>
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Col
          span={10}
          style={{ display: "flex", justifyContent: "flex-start" }}>
          <Search
            placeholder={
              tabsSelected == "1" ? "Search by title" : "Search by group"
            }
            allowClear
            onSearch={onSearch}
            className="searchBox"
            style={{ width: 300 }}
          />
        </Col>
        <Col
          span={10}
          style={{ display: "flex", justifyContent: "flex-end" }}></Col>
        <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
          {tabsSelected === "1" ? (
            <Button
              shape="round"
              type="primary"
              onClick={async () => {
                await setIsModalCreateBuildingActivities(true);
              }}
              disabled={!accessibility?.menu_resident_information.allowEdit}>
              Create building activities
            </Button>
          ) : (
            <Button
              shape="round"
              type="primary"
              onClick={async () => {
                await setIsModalCreateParticipantGroup(true);
              }}
              disabled={!accessibility?.menu_resident_information.allowEdit}>
              Create participant group
            </Button>
          )}

          <CreateParticipantGroup
            callBack={async (isOpen: boolean, created: boolean) => {
              await setIsModalCreateParticipantGroup(isOpen);
              if (created) {
                await dispatch.building.getTableDataGroup(paramsData);
              }
            }}
            isOpen={isModalCreateParticipantGroup}
          />
        </Col>

        <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
          <CreateBuildingActivities
            callBack={async (isOpen: boolean, created: boolean) => {
              await setIsModalCreateBuildingActivities(isOpen);
              if (created) {
                await dispatch.building.getTableData(paramsData);
              }
            }}
            isOpen={isModalCreateBuildingActivities}
          />
        </Col>
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
          />
        </Col>
      </Row>
      <InfoParticipantGroup
        callBack={async (isOpen: boolean) => await setIsModalOpenInfo(isOpen)}
        isOpen={isModalOpenInfo}
        ParticipantGroup={dataInfo}
      />
      <EditParticipantGroupModal
        callBack={async (isOpen: boolean, saved: boolean) => {
          await setIsModalEditParticipantGroup(isOpen);
          if (saved) {
            await dispatch.building.getTableDataGroup(paramsData);
          }
        }}
        isOpen={isModalEditParticipantGroup}
        prarticipantGroup={dataEdit}
      />
      <EditBuildingActivitiesModal
        callBack={async (isOpen: boolean, saved: boolean) => {
          await setIsModalEditBuildActivity(isOpen);
          if (saved) {
            await dispatch.building.getTableData(paramsData);
          }
        }}
        isOpen={isModalEditBuildActivity}
        BuildingActivities={dataEditBuildActivity}
      />

      <EditMaintenanceFacilityModal
        callBack={async (isOpen: boolean, saved: boolean) => {
          await setIsModalEditMaintenanceFacility(isOpen);
          if (saved) {
            await dispatch.building.getTableData(paramsData);
          }
        }}
        isOpen={isModalEditMaintenanceFacility}
        MaintenanceFacility={dataEditMaintenanceFacility}
      />
    </>
  );
};

export default BuildingActivities;
