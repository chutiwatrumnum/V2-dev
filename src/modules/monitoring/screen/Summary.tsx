import { useLayoutEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Row, Col, Typography, Space, Button, Empty } from "antd";
import { Column, Pie } from "@ant-design/plots";
import {
  LeftOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "../../../stores";
import "../styles/summary.css";

import dayjs, { Dayjs } from "dayjs";

const { Text, Title } = Typography;

const Summary = () => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const { monitorData } = useSelector((state: RootState) => state.common);

  const registeredResident = {
    data: monitorData?.totalUserRegistered ?? [],
    xField: "month",
    yField: "total",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      month: {
        alias: "month",
      },
      total: {
        alias: "total",
      },
    },
  };

  const totalNoOfBookingConfig = {
    appendPadding: 10,
    data: monitorData?.totalFacilitiesBooking ?? [],
    angleField: "total",
    colorField: "roomName",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    color: ["#E7BF4D", "#83CA86", "#4FA7DE", "#F482B2", "#9D6BCF", "#6275B9"],
  };

  const totalEventConfig = {
    data: monitorData?.totalEventBooking ?? [],
    xField: "month",
    yField: "total",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      month: {
        alias: "month",
      },
      total: {
        alias: "total",
      },
    },
  };

  const [year, setYear] = useState<Dayjs>(dayjs());

  // function
  const prevYearHandler = () => {
    setYear((prevState) => prevState.subtract(1, "year"));
  };
  const nextYearHandler = () => {
    setYear((prevState) => prevState.add(1, "year"));
  };

  //actions

  useLayoutEffect(() => {
    dispatch.common.getMonitorData(year.format("YYYY"));
    // console.log(monitorData);
  }, [year]);

  return (
    <>
      <Header title="Monitoring summary" />
      <Col span={24}>
        <Row className="titleContainer">
          <Space direction="horizontal" size={60}>
            <Button
              type="text"
              className="arrowBtn"
              icon={<LeftOutlined />}
              onClick={prevYearHandler}
              disabled={year.isSame(dayjs().subtract(1, "year"), "year")}
            />

            <Title className="monthTitle" level={3}>
              {year.format("YYYY")}
            </Title>
            <Button
              type="text"
              className="arrowBtn"
              icon={<RightOutlined />}
              onClick={nextYearHandler}
              disabled={year.isSame(dayjs(), "year")}
            />
          </Space>
        </Row>
        <Row className="rowSummaryContainer">
          <Col className="summaryCardContainer" style={{ width: "60%" }}>
            <Col className="summaryCardHeader">
              <Text>Registered residents</Text>
            </Col>
            <Col className="summaryCardContent">
              <div className="yearTxt">
                <Text type="secondary">Year: {year.format("YYYY")}</Text>
              </div>
              <Column
                columnStyle={{ fill: "#E7BF4D" }}
                style={{ maxHeight: 350 }}
                {...registeredResident}
              />
            </Col>
          </Col>
          <Col className="summaryCardContainer" style={{ width: "37%" }}>
            <Col className="summaryCardHeader" span={24}>
              <Text>Total no. of booking</Text>
            </Col>
            <Col className="summaryCardContent">
              {monitorData?.totalFacilitiesBooking?.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 370,
                  }}
                >
                  <Empty description="No data available" />
                </div>
              ) : (
                <Pie
                  style={{ maxWidth: "100%", maxHeight: 350 }}
                  {...totalNoOfBookingConfig}
                />
              )}
            </Col>
          </Col>
        </Row>
        <Row className="rowSummaryContainer">
          <Col className="summaryCardContainer" span={24}>
            <Col className="summaryCardHeader">
              <Text>Total no. of event</Text>
            </Col>
            <Col className="summaryCardContent">
              <div className="yearTxt">
                <Text type="secondary">Year: {year.format("YYYY")}</Text>
              </div>
              <Column
                columnStyle={{ fill: "#6275B9" }}
                style={{ maxHeight: 350 }}
                {...totalEventConfig}
              />
            </Col>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Summary;
