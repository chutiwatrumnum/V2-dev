import { useEffect, useState } from "react";
import { Row, Col, Typography, message, Space, Badge, Calendar } from "antd";
import { ExportOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import FilterByCalendarType from "../components/FilterByCalendarType";
import InfoModal from "../../monitoring/components/InfoModal";
import { DetailType } from "../../../stores/interfaces/BuildingCalendar";
import "../styles/buildingCalendar.css";
import "../../monitoring/styles/eventView.css";

import type { Dayjs } from "dayjs";

const { Text, Title } = Typography;

const MonthlyView = () => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const { buildingCalendarEventData, monthSelected } = useSelector(
    (state: RootState) => state.buildingCalendar
  );

  const [infoData, setInfoData] = useState<DetailType[]>([]);
  const [infoModal, setInfoModal] = useState(false);
  const [dateInfo, setDateInfo] = useState("");

  // functions

  const prevMonthHandler = () => {
    dispatch.buildingCalendar.updateMonthSelectedState(
      monthSelected.subtract(1, "M")
    );
  };
  const nextMonthHandler = () => {
    dispatch.buildingCalendar.updateMonthSelectedState(
      monthSelected.add(1, "M")
    );
  };

  const getListData = (value: Dayjs) => {
    let listData: DetailType[];
    let tempList = buildingCalendarEventData.filter(
      (item) => item.date === value.format("YYYY-MM-DD")
    );
    listData = tempList[0]?.detail ?? null;
    return listData || [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="listDateCellContainer">
        {listData.map((item) => (
          <li key={item.title}>
            <Badge color={item.colorCode} text={item.title} />
          </li>
        ))}
      </ul>
    );
  };

  const onDateSelect = (date: Dayjs) => {
    const listData = getListData(date);
    const dateDetail = date.format("YYYY-MM-DD");
    setInfoData(listData);
    setDateInfo(dateDetail);
    setInfoModal(true);
  };

  // actions
  useEffect(() => {}, []);

  return (
    <>
      <Col>
        <Col className="titleSelectContainer">
          <Text>Building calendar (Managing agent view)</Text>
        </Col>
        <FilterByCalendarType />
        <Col span={24}>
          <Row className="titleContainer">
            <Space direction="horizontal" size={60}>
              <LeftOutlined
                size={20}
                className="arrowIcon"
                onClick={prevMonthHandler}
              />
              <Title className="monthTitle" level={3}>
                {monthSelected.format("MMMM YYYY")}
              </Title>
              <RightOutlined className="arrowIcon" onClick={nextMonthHandler} />
            </Space>
          </Row>
          <Calendar
            value={monthSelected}
            headerRender={() => {
              return null;
            }}
            dateCellRender={dateCellRender}
            onSelect={onDateSelect}
          />
        </Col>
      </Col>
      <InfoModal
        data={infoData}
        visible={infoModal}
        date={dateInfo}
        onCancel={() => {
          setInfoModal(false);
        }}
      />
    </>
  );
};

export default MonthlyView;
