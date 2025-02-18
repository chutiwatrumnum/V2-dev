import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Table, message } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { deleteMCSTId } from "../service/api/MCSTServiceAPI";
import { Row, Col, Input, Button, Modal, Image, Avatar } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DataType, conditionPage } from "../../../stores/interfaces/Management";

import CreateAddNew from "../components/CreateAddNew";
import EditMSCTtInformation from "../components/EditMSCTtInformation";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;
const ManagementMain = () => {
  const navigate = useNavigate();
  const { loading, tableData, total } = useSelector(
    (state: RootState) => state.MCST
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
  };
  const [rerender, setRerender] = useState<boolean>(true);
  const [dataEdit, setDataEdit] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [paramsData, setParamsData] = useState<conditionPage>(params);
  const dispatch = useDispatch<Dispatch>();
  const { Search } = Input;

  useEffect(() => {
    (async function () {
      await setParamsData(params);
      await dispatch.MCST.getTableData(paramsData);
    })();
    if (!accessibility?.menu_mcst.available) {
      navigate("/dashboard");
      message.info("Apologies, unable to access function.");
    }
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
    await dispatch.MCST.getTableData(paramsData);
  };
  const onSearch = async (value: string) => {
    params = paramsData;
    params.search = value;
    await setParamsData(params);
    await dispatch.MCST.getTableData(paramsData);
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
            onClick={showDeleteConfirm}></Button>
        </>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      align: "center",
      width: "auto",
      render: (_, record) => (
        <>
          {record.image ? (
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              src={<Image src={record.image} width={"100%"} height={"100%"} />}
            />
          ) : (
            "No Image"
          )}
        </>
      ),
    },
    {
      title: "First name",
      dataIndex: "firstName",
      align: "center",
      width: "auto",
      sorter: {
        compare: (a, b) => a.firstName.localeCompare(b.firstName),
      },
    },
    {
      title: "Middle name",
      dataIndex: "middleName",
      align: "center",
      width: "auto",
      // sorter: {
      //   compare: (a, b) => a.middleName.localeCompare(b.middleName),
      // },
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      align: "center",
      width: "auto",
      sorter: {
        compare: (a, b) => a.lastName.localeCompare(b.lastName),
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      width: "auto",
      sorter: {
        compare: (a, b) => a.role.localeCompare(b.role),
      },
    },
    {
      title: "Contact",
      dataIndex: "contact",
      align: "center",
      width: "auto",
    },
    {
      title: "email",
      dataIndex: "email",
      align: "center",
      width: "auto",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },

    {
      title: "Edit",
      dataIndex: "edit",
      align: "center",
      key: "edit",
      width: "auto",
      render: (_, record) => (
        <>
          <Button
            shape="round"
            value={record.key}
            onClick={async () => {
              await editButton(record);
            }}
            type="text"
            icon={<EditOutlined />}
          />
        </>
      ),
    },
  ];

  const editButton = async (data: DataType) => {
    if (data.image === "No Image") {
      data.image = undefined;
    }
    await setDataEdit(data);
    await setIsModalOpen(true);
  };

  const showDeleteConfirm = ({ currentTarget }: any) => {
    confirm({
      title: "Confirm action",
      content: "Are you sure you want to remove this admin user?",
      icon: null,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        const statusDeleted = await deleteMCSTId(currentTarget.value);
        if (statusDeleted) {
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully removed",
          });
        } else {
          dispatch.common.updateSuccessModalState({
            open: true,
            status: "error",
            text: "Failed removed",
          });
        }
        setRerender(!rerender);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <Header title="Verticus Management" />
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Col
          span={20}
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
            }}>
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
          />
        </Col>
      </Row>
      <EditMSCTtInformation
        callBack={async (isOpen: boolean, saved: boolean) => {
          await setIsModalOpen(isOpen);
          if (saved) {
            await setRerender(!rerender);
          }
        }}
        isOpen={isModalOpen}
        MCST={dataEdit}
      />
    </>
  );
};

export default ManagementMain;
