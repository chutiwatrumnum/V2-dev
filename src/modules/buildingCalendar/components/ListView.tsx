import { useEffect, useState } from "react";
import { Row, Col, Typography, Space } from "antd";
import {
  InfoCircleOutlined,
  ExportOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { ConvertDate } from "../../../utils/helper";
import InfoModal from "../../monitoring/components/InfoModal";
import FilterByCalendarType from "../components/FilterByCalendarType";
import "../styles/buildingCalendar.css";
import "../../monitoring/styles/eventView.css";

import { DetailType } from "../../../stores/interfaces/BuildingCalendar";

const { Text, Title } = Typography;

const ListView = () => {
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

  const handleInfoClick = (item: DetailType, date: any) => {
    let dateDetail = ConvertDate(date).date;
    setInfoData([item]);
    setDateInfo(dateDetail);
    setInfoModal(true);
  };

  // actions
  useEffect(() => {}, []);

  // components

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
          <Col className="contentEventViewContainer">
            {buildingCalendarEventData.map((item, index) => {
              return (
                <Col>
                  <Title level={5}>{ConvertDate(item.date).date}</Title>
                  {item.detail.map((detailItem, index) => {
                    return (
                      <Row
                        style={{ backgroundColor: detailItem.colorCode }}
                        className="eventCard">
                        <Col span={24} className="eventCardInner">
                          <Row
                            style={{ height: "100%" }}
                            justify="space-between">
                            <Space direction="vertical" size={10}>
                              <Text strong>
                                {detailItem.title ?? "Title name"}
                              </Text>
                              <Text>{detailItem.location ?? "Location"}</Text>
                              <Text>{`${detailItem.startTime ?? "00:00"} - ${
                                detailItem.endTime ?? "00:00"
                              }`}</Text>
                            </Space>
                            <InfoCircleOutlined
                              onClick={() =>
                                handleInfoClick(detailItem, item.date)
                              }
                              style={{ fontSize: 16 }}
                            />
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                </Col>
              );
            })}
          </Col>
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

export default ListView;
