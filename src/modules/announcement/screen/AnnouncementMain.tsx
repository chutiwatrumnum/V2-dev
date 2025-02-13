import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import type { ColumnsType } from "antd/es/table";
import {
  Row,
  Col,
  DatePicker,
  Input,
  Button,
  Image,
  Typography,
  Pagination,
  Modal,
  Table,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import {
  DataAnnouncementType,
  AnnouncePayloadType,
} from "../../../stores/interface/Announce";
import FormTemplate from "../components/FormTemplate";
import InformationTemplate from "../components/InformationTemplate";
import { ConvertDate } from "../../../utils/helper";

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const Announcement = () => {
  const columns: ColumnsType<DataAnnouncementType> = [
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      align: "center",
      render: (_: any, record: DataAnnouncementType) => (
        <Button
          shape="round"
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record)}
        />
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      width: 200,
      render: (imageUrl) => (
        <Image
          // width={220}
          height={140}
          src={imageUrl}
          fallback="data:image/png;base64,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"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      ellipsis: true,
      width: 300,
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
        multiple: 3,
      },
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_: any, record: DataAnnouncementType) => {
        let status = "Unpublished";
        let now = dayjs();

        if (now >= dayjs(record.startDate) && now <= dayjs(record.endDate)) {
          status = "Published";
        }
        return (
          <>
            <Text>{status}</Text>
          </>
        );
      },
    },
    {
      title: "Created date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt: string) => {
        let date = dayjs(createdAt).format("DD/MM/YYYY").toString();
        return (
          <>
            <Text>{date}</Text>
          </>
        );
      },
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (startDate: string) => {
        let date = dayjs(startDate).format("DD/MM/YYYY").toString();
        return (
          <>
            <Text>{date}</Text>
          </>
        );
      },
    },
    {
      title: "Start time",
      dataIndex: "startDate",
      key: "startTime",
      align: "center",
      render: (startDate: string) => {
        const time = ConvertDate(startDate); // add new
        return (
          <>
            <Text>{time.time}</Text>
          </>
        );
      },
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: (endDate: string) => {
        let date = dayjs(endDate).format("DD/MM/YYYY").toString();
        return (
          <>
            <Text>{date}</Text>
          </>
        );
      },
    },
    {
      title: "End time",
      dataIndex: "endDate",
      key: "endTime",
      align: "center",
      render: (endDate: string) => {
        let time = dayjs(endDate).format("hh:mm A").toString();
        return (
          <>
            <Text>{time}</Text>
          </>
        );
      },
    },
    {
      title: "Created by",
      key: "createBy",
      align: "center",
      render: (_: any, record: DataAnnouncementType) => {
        return (
          <>
            {record?.users ? (
              <Text>
                {record?.users?.firstName}
                {/* {record?.users?.middleName}
                {record?.users?.lastName} */}
              </Text>
            ) : (
              <Text>Juristic</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Edit",
      key: "edit",
      align: "center",
      render: (_: any, record: DataAnnouncementType) => (
        <>
          <Row>
            <Col span={12}>
              <Button
                shape="round"
                type="text"
                icon={<InfoCircleOutlined />}
                onClick={() => {
                  setInfoModalVisible(true);
                  setInfoData(record);
                }}
              />
            </Col>
            <Col span={12}>
              <Button
                shape="round"
                type="text"
                icon={<EditOutlined />}
                onClick={async () => {
                  setmodalVisible(true);
                  setEditData(record);
                }}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const dispatch = useDispatch<Dispatch>();
  const customFormat: DatePickerProps["format"] = (value) =>
    `${value.format(dateFormat)}`;
  const dateFormat = "MMMM,YYYY";
  const scroll: { x?: number | string } = {
    x: "100vw",
  };

  // variables
  const data = useSelector((state: RootState) => state.announcement.tableData);
  const announcementMaxLength = useSelector(
    (state: RootState) => state.announcement.announcementMaxLength
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [refresh, setRefresh] = useState(true);
  const [modalVisible, setmodalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [infoData, setInfoData] = useState<any>(null);

  // functions
  const fetchData: VoidFunction = async () => {
    let payload: AnnouncePayloadType = {
      search: search,
      curPage: curPage,
      perPage: perPage,
      startDate: startDate,
      endDate: endDate,
    };
    await dispatch.announcement.getTableData(payload);
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onDateSelect = (values: RangePickerProps["value"]) => {
    let start: any, end: any;
    values?.forEach((value, index) => {
      if (index === 0) {
        start = value?.locale("zh-cn");
      } else {
        end = value?.locale("zh-cn");
      }
    });
    setStartDate(start);
    setEndDate(end);
  };

  const onPageChange = (page: number) => {
    setCurPage(page);
  };

  const showDeleteConfirm = (value: DataAnnouncementType) => {
    confirm({
      title: "Confirm action ",
      content: "Are you sure you want to delete?",
      icon: null,
      okText: "Yes",
      okType: "primary",
      cancelText: "Cancel",
      centered: true,

      async onOk() {
        await dispatch.announcement.deleteTableData(value.id);
        onRefresh();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const addNewHandler = () => {
    setmodalVisible(true);
  };

  const onModalCancel: VoidFunction = () => {
    setmodalVisible(false);
    setEditData(null);
  };

  const onRefresh: VoidFunction = () => {
    setRefresh(!refresh);
  };

  // actions
  useEffect(() => {
    fetchData();
  }, [startDate, endDate, search, curPage, refresh]);

  return (
    <>
      <Header title="Announcement" />
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Col span={10}>
          <RangePicker
            style={{ width: "95%" }}
            picker="month"
            format={customFormat}
            onChange={onDateSelect}
          />
        </Col>
        <Col
          span={10}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Search
            placeholder="Search by title "
            onSearch={onSearch}
            className="searchBox"
            style={{ width: 300 }}
            allowClear
          />
        </Col>
        <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button shape="round" type="primary" onClick={addNewHandler}>
            Add new
          </Button>
          <FormTemplate
            onCancel={onModalCancel}
            onRefresh={onRefresh}
            data={editData}
            visible={modalVisible}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            scroll={scroll}
            pagination={false}
          />
          <Row justify={"end"}>
            <Pagination
              className="pagination"
              defaultCurrent={1}
              pageSize={perPage}
              onChange={onPageChange}
              total={announcementMaxLength}
            />
          </Row>
        </Col>
      </Row>
      <InformationTemplate
        visible={infoModalVisible}
        data={infoData}
        onCancel={() => setInfoModalVisible(false)}
      />
    </>
  );
};

export default Announcement;
