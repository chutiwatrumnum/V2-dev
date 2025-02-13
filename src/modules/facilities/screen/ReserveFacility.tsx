import { useState, useEffect } from "react";
import { Row, Calendar, Select, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";
import Header from "../../../components/common/Header";
import "../styles/ReserveFacility.css";
import dayjs from "dayjs";
import { getFacilitiesList } from "../service/api/FacilitiesServiceAPI";

import { RoomType } from "../interface/Reserve";
import type { Dayjs } from "dayjs";
dayjs.locale("TH-gb");

// components
import ReserveSlotModal from "../components/ReserveSlotModal";

const ReserveFacility = () => {
  const dispatch = useDispatch<Dispatch>();
  const [dateSelected, setDateSelected] = useState(() => dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectRoom, setSelectRoom] = useState<RoomType>();
  const [itemList, setItemList] = useState<any>([]);

  const onSelect = async (date: Dayjs) => {
    if (date.isSame(dateSelected, "month")) {
      // console.log("ON SELECT DOING");
      setIsLoading(true);
      setDateSelected(date);
      let data = {
        id: selectRoom?.value ? selectRoom.value : 0,
        date: date.format("YYYY-MM-DD"),
      };
      setIsModalOpen(true);
      const timeSlot = await dispatch.facilities.getTimeSlot(data);
      if (!timeSlot) message.error("Something went wrong!");
      if (timeSlot) setIsLoading(false);
    }
  };

  const onPanelChange = (newValue: Dayjs) => {
    // console.log("onPanelChange WORK");
    setDateSelected(newValue);
  };

  const onCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: RoomType, option: any) => {
    console.log(option);
    setSelectRoom(option);
  };

  const fetchRoom = async () => {
    const dataRoomList = await getFacilitiesList();
    // console.log("data => ", dataRoomList);

    if (dataRoomList.status && dataRoomList.data !== null) {
      setItemList(dataRoomList.data);
      setSelectRoom(dataRoomList.data[0]);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  return (
    <>
      <Header title="Reserve facility" />
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Select
          value={selectRoom}
          style={{ width: 200 }}
          onChange={handleChange}
          options={itemList}
        />
      </Row>
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Calendar
          validRange={[
            dayjs().subtract(1, "day"),
            dayjs().add(selectRoom?.validDateNumber ?? 0, "day"),
          ]}
          value={dateSelected}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
          headerRender={({ value, onChange }) => {
            const start = dayjs().get("month");
            const end =
              dayjs().get("month") +
              Math.floor((selectRoom?.validDateNumber ?? 30) / 30) +
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
      <ReserveSlotModal
        roomSelected={
          selectRoom ? selectRoom : { label: "Something went wrong", value: 0 }
        }
        dateSelected={dateSelected.format("DD MMM YY")}
        onCancel={onCancelModal}
        isLoading={isLoading}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default ReserveFacility;
