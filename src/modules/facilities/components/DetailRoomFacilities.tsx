import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Col,
  Row,
  Card,
  Empty,
  Button,
  theme,
  Calendar,
  Select,
  Space,
} from "antd";
import { Dayjs } from "dayjs";
import { LeftOutlined } from "@ant-design/icons";
import { getFacilitiesBymonth } from "../service/api/FacilitiesServiceAPI";
import { Ibooking } from "../../../stores/interface/Facilities";

import CreateMaintenance from "./CreateMaintenance";
import "../styles/OurFacilities.css";
dayjs.locale("TH-gb");

interface DetailRoomFacilitiesProps {
  id: number | null;
  name: string | null;
  isOpen: boolean;
  imageId: string;
  callBack: (isOpen: boolean) => void;
  validDateNumber?: number;
}
const DetailRoomFacilities = (props: DetailRoomFacilitiesProps) => {
  const div1Ref = useRef<any>(null);
  const div2Ref = useRef<any>(null);
  const [booking, setBooking] = useState<Ibooking[] | null>(null);
  const [selectDate, setselectDate] = useState<string>("");
  const [isModalCreateBuildingActivities, setIsModalCreateBuildingActivities] =
    useState(false);
  const [div2MaxHeightState, setDiv2MaxHeightState] = useState(0);

  const setDiv2MaxHeight = () => {
    if (div1Ref.current && div2Ref.current) {
      div2Ref.current.style.height = `${div1Ref.current.clientHeight}px`;
      setDiv2MaxHeightState(div1Ref.current.clientHeight);
    }
  };

  const initCalendar = async () => {
    let params = {
      facilitiesId: props?.id,
      sortBy: dayjs().format("YYYY-MM-DD"),
    };
    const data = await getFacilitiesBymonth(params);
    // console.log(data);
    setBooking(data);
    setselectDate(dayjs().format("D MMMM YYYY"));
  };

  const onPanelChange = async (value: Dayjs) => {
    let params = {
      facilitiesId: props?.id,
      sortBy: value.format("YYYY-MM-DD"),
    };
    await getFacilitiesBymonth(params);
    const data = await getFacilitiesBymonth(params);
    // console.log(data);
    setBooking(data);
    setselectDate(value.format("D MMMM YYYY"));
  };

  const backNav = async () => {
    await props?.callBack(false);
  };

  useEffect(() => {
    if (props?.isOpen) {
      (async function () {
        await initCalendar();
      })();
    }
  }, [props?.isOpen]);

  useEffect(() => {
    // Set the initial max-height
    setDiv2MaxHeight();

    // Update the max-height on window resize
    window.addEventListener("resize", setDiv2MaxHeight);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", setDiv2MaxHeight);
    };
  }, [div1Ref.current]);

  return (
    <>
      <Row
        style={{
          display: "flex",
          fontSize: 20,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Col span={18}>
          <Button
            shape="default"
            onClick={backNav}
            type="default"
            icon={<LeftOutlined />}
          />
          <span
            style={{ fontSize: "20px", fontWeight: "bold", marginLeft: 10 }}
          >
            {props?.name}
          </span>
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          <Button
            shape="round"
            type="primary"
            onClick={() => {
              setIsModalCreateBuildingActivities(true);
            }}
          >
            Create maintenance
          </Button>
        </Col>
      </Row>
      <Row
        justify="space-between"
        style={{ height: "100%", paddingBottom: "5vh" }}
      >
        <Col span={12} className="bodyContainer-fcl" ref={div1Ref}>
          <Row>
            <img width={"100%"} height={"45%"} src={props?.imageId}></img>
            <Calendar
              className="Calendar-detail"
              // value={dayjs().subtract(30, "day")}
              validRange={[
                dayjs().subtract(30, "day"),
                dayjs().add(props.validDateNumber ?? 10, "day"),
              ]}
              // validRange={[dayjs(), dayjs().add(30, "day")]}
              // value={dateSelected}
              onSelect={onPanelChange}
              onPanelChange={onPanelChange}
              headerRender={({ value, onChange }) => {
                const start = dayjs().get("month") - 1;
                const end =
                  dayjs().get("month") +
                  Math.floor((props?.validDateNumber ?? 30) / 30) +
                  1;
                const monthOptions = [];

                let current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current = current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let i = start; i < end; i++) {
                  monthOptions.push(
                    <Select.Option key={i} value={i} className="month-item">
                      {months[i]}
                    </Select.Option>
                  );
                }
                const month = value.month();

                return (
                  <div className="calendarHeader">
                    <Row gutter={8}>
                      <Col>
                        <Select
                          size="middle"
                          className="calendarMonthSelect"
                          dropdownMatchSelectWidth={false}
                          value={month}
                          onChange={(newMonth) => {
                            const now = value.clone().month(newMonth);
                            onChange(now);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                );
              }}
            />
          </Row>
        </Col>
        <Col className="bodyContainer-fcl" span={11}>
          <Card
            ref={div2Ref}
            className="fullWidth rightCardControl-fcl"
            title={selectDate}
            headStyle={{ backgroundColor: "#D3D3D3", display: "flex" }}
            bodyStyle={{
              maxHeight: div2MaxHeightState - 56,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              {booking?.map((item) => {
                return (
                  <Row style={{ display: "flex" }}>
                    <Col span={4} className="timeShowControl-fcl">
                      <span>{`${item.startTime}`}</span>
                      <span>{`${item.endTime}`}</span>
                    </Col>
                    <Col span={20}>
                      {item.referralBooking !== null ? (
                        <div className="timeSlotDetailCard-fcl">
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ display: "flex" }}
                          >
                            <span>
                              <b>Booked by : </b>{" "}
                              {item.referralBooking.bookingBy}
                            </span>
                            <span>
                              <b>Unit No. : </b> {item.referralBooking.unit}
                            </span>
                            <span>
                              <b>Contact : </b> {item.referralBooking.contactNo}
                            </span>
                          </Space>
                        </div>
                      ) : (
                        <div className="timeSlotNoDetailCard-fcl">
                          <Empty />
                        </div>
                      )}
                    </Col>
                  </Row>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>
      <CreateMaintenance
        callBack={async (isOpen: boolean, created: boolean) => {
          await setIsModalCreateBuildingActivities(isOpen);
          if (created) {
            // await dispatch.building.getTableData(paramsData);
          }
        }}
        id={props?.id}
        name={props.name}
        isOpen={isModalCreateBuildingActivities}
      />
    </>
  );
};

export default DetailRoomFacilities;
