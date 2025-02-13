import { useState, useEffect } from "react";
import { Button, Row, Pagination, Select } from "antd";
import Header from "../../../components/templates/Header";
import SearchBox from "../../../components/common/SearchBox";
import MediumActionButton from "../../../components/common/MediumActionButton";
import NearByTable from "../components/NearByTable";
import NearbyCreateModal from "../components/NearbyCreateModal";
import AnnouncementEditModal from "../components/NearByEditModal";
import { EditIcon, TrashIcon } from "../../../assets/icons/Icons";

import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  deleteNearbyTypeServiceQuery,
  useNearbyServiceListQuery,
  useNearbyTypeQuery,
} from "../hooks";
import type { ColumnsType } from "antd/es/table";
import type { PaginationProps } from "antd";

import "../styles/announcement.css";
import {
  DataNearByCreateByType,
  DataNearByTableDataType,
  NearByPayloadType,
  NearBySelectListType,
} from "../../../stores/interfaces/NearBy";

const NearbyService = () => {
  // variables
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<DataNearByCreateByType | null>(null);
  const [search, setSearch] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [SelectNearType, setSelectNearType] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [listNearTypeSelect, setlistNearTypeSelect] = useState<
    NearBySelectListType[]
  >([
    {
      label: "All",
      value: null,
    },
  ]);
  const payload: NearByPayloadType = {
    search: search,
    curPage: curPage,
    perPage: perPage,
    filterByTypeId: SelectNearType,
  };
  const {
    data: nearBy,
    isError,
    error,
    isLoading,
    refetch,
  } = useNearbyServiceListQuery(payload);
  const mutationDeleteNearbyTypeService = deleteNearbyTypeServiceQuery();

  const { data: selectList, isLoading: isSelectListLoading } =
    useNearbyTypeQuery();
  // functions
  const onSearch = (value: string) => {
    // console.log(value);
    setSearch(value);
    setCurPage(1);
    setPerPage(5);
  };

  const onPageChange = (page: number) => {
    setCurPage(page);
  };

  const onCreate = () => {
    setIsCreateModalOpen(true);
  };

  const onCreateOk = () => {
    setIsCreateModalOpen(false);
  };

  const onCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  const onEdit = (record: DataNearByTableDataType) => {
    const editData: DataNearByCreateByType = {
      ...record,
    };
    editData.typeId = record.typeId.toString();
    if (record.address) {
      editData.address = record.address;
    }
    if (record.description) {
      editData.description = record.description;
    }
    if (record.note) {
      editData.note = record.note;
    }
    if (record.image) {
      editData.image = record.image;
    }
    if (record.lat) {
      editData.lat = record.lat.toString();
    }
    if (record.long) {
      editData.long = record.long.toString();
    }
    setEditData(editData);
    setIsEditModalOpen(true);
  };

  const onEditOk = () => {
    setIsEditModalOpen(false);
  };

  const onEditCancel = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };
  //   const fetchData: VoidFunction = async () => {
  //     if (selectList && !isSelectListLoading) {
  //       setlistNearTypeSelect([...listNearTypeSelect, ...selectList]);
  //     }
  //   };
  const onRefresh: VoidFunction = () => {
    setRefresh(!refresh);
  };

  const showDeleteConfirm = (value: DataNearByTableDataType) => {
    ConfirmModal({
      title: "Are you sure you want to delete this?",
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: async () => {
        await mutationDeleteNearbyTypeService.mutateAsync(value.id);
      },
      onCancel: () => console.log("Cancel"),
    });
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    // console.log(current, pageSize);
    setCurPage(current);
    setPerPage(pageSize);
  };

  const columns: ColumnsType<DataNearByTableDataType> = [
    {
      title: "Delete",
      key: "delete",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <Button
              onClick={() => showDeleteConfirm(record)}
              type="text"
              icon={<TrashIcon />}
            />
          </>
        );
      },
    },
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Image",
      key: "image",
      align: "center",
      render: ({ image }) => <img src={image} height={100} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Tel",
      dataIndex: "tel",
      key: "tel",
      align: "center",
    },
    {
      title: "Edit",
      key: "edit",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <Button
              type="text"
              icon={<EditIcon />}
              onClick={() => onEdit(record)}
            />
          </>
        );
      },
    },
  ];

  // Actions
  //   useEffect(() => {
  //     fetchData();
  //   }, [SelectNearType, search, curPage, refresh, perPage]);
  return (
    <>
      <Header title="Nearby Service" />
      <div className="announceTopActionGroup">
        <div className="announceTopActionLeftGroup">
          <Select
            defaultValue={
              listNearTypeSelect.length > 0 ? listNearTypeSelect[0].label : null
            }
            style={{ width: "48%", height: "100%" }}
            onChange={(value: string) => {
              setSelectNearType(value);
            }}
            options={
              isSelectListLoading ? [] : [...listNearTypeSelect, ...selectList]
            }
          />
          <SearchBox
            className="announceSearchBox"
            onSearch={onSearch}
            placeholderText="Search by title"
          />
        </div>
        <MediumActionButton
          message="Add new service"
          onClick={onCreate}
          className="createAnnouncementBtn"
        />
      </div>
      <NearByTable columns={columns} data={nearBy?.rows} />
      <Row
        className="announceBottomActionContainer"
        justify="end"
        align="middle"
      >
        <Pagination
          defaultCurrent={1}
          pageSize={perPage}
          onChange={onPageChange}
          total={nearBy?.total}
          pageSizeOptions={[10, 20, 40, 80, 100]}
          showSizeChanger={true}
          onShowSizeChange={onShowSizeChange}
        />
      </Row>

      <NearbyCreateModal
        selectList={selectList ? selectList : []}
        isCreateModalOpen={isCreateModalOpen}
        onOk={onCreateOk}
        onCancel={onCreateCancel}
        onRefresh={onRefresh}
      />
      <AnnouncementEditModal
        selectList={selectList ? selectList : []}
        isEditModalOpen={isEditModalOpen}
        onOk={onEditOk}
        onCancel={onEditCancel}
        data={editData}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default NearbyService;
