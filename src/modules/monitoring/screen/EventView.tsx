import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Row, Col, Typography, Space, Badge } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { ConvertDate } from "../../../utils/helper";
import EventViewModal from "../components/EventViewModal";
import "../styles/eventView.css";

import { DetailType } from "../../../stores/interfaces/Summary";

const { Text, Title } = Typography;

const EventView = () => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const { eventViewData } = useSelector((state: RootState) => state.summary);
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [infoData, setInfoData] = useState<DetailType[]>([]);
  const [infoModal, setInfoModal] = useState(false);
  const [dateInfo, setDateInfo] = useState("");

  //functions
  const prevMonthHandler = () => {
    setMonth((prevState) => prevState.subtract(1, "M"));
  };
  const nextMonthHandler = () => {
    setMonth((prevState) => prevState.add(1, "M"));
  };

  const handleInfoClick = (item: DetailType, date: any) => {
    let dateDetail = ConvertDate(date).date;
    setInfoData([item]);
    setDateInfo(dateDetail);
    setInfoModal(true);
  };

  const tagEventColorHandler = (type: string) => {
    let color = "black";
    if (type === "building_calendar") {
      color = "#D2522D";
    } else if (type === "event") {
      color = "#AB3BCE";
    } else {
      color = "#25B3AE";
    }
    return color;
  };

  const fetchData = async () => {
    await dispatch.summary.getBuildingCalendarEventData(
      month.format("YYYY-MM")
    );
  };

  useEffect(() => {
    fetchData();
    // console.log(eventViewData);
  }, [month]);

  return (
    <>
      <Header title="Event view" />
      <Col span={24}>
        <Row className="titleContainer">
          <Space direction="horizontal" size={60}>
            <LeftOutlined className="arrowIcon" onClick={prevMonthHandler} />
            <Title className="monthTitle" level={3}>
              {month.format("MMMM YYYY")}
            </Title>
            <RightOutlined className="arrowIcon" onClick={nextMonthHandler} />
          </Space>
        </Row>
        <Col className="contentEventViewContainer">
          {eventViewData.map((item, index) => {
            return (
              <Col>
                <Title level={5}>
                  {ConvertDate(item.dateGroup ?? "2023-01-01").date}
                </Title>
                {item.data.map((detailItem, index) => {
                  return (
                    <Badge.Ribbon
                      color={tagEventColorHandler(detailItem?.type ?? "")}
                      text={detailItem.tag}>
                      <Row className="eventCard">
                        <Col span={24} className="eventCardInner">
                          <Row
                            style={{ height: "100%" }}
                            justify="space-between">
                            <Space direction="vertical" size={10}>
                              <Text strong>
                                {detailItem.title ?? detailItem.purpose ?? "-"}
                              </Text>
                              <Text>{detailItem.location ?? "-"}</Text>
                              <Text>{`${detailItem.startTime ?? "-"} - ${
                                detailItem.endTime ?? "-"
                              }`}</Text>
                            </Space>
                            <InfoCircleOutlined
                              onClick={() =>
                                handleInfoClick(detailItem, item.dateGroup)
                              }
                              style={{ fontSize: 16 }}
                            />
                          </Row>
                        </Col>
                      </Row>
                    </Badge.Ribbon>
                  );
                })}
              </Col>
            );
          })}
        </Col>
      </Col>
      <EventViewModal
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

export default EventView;
