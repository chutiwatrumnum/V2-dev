import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { Tabs, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import "../styles/buildingCalendar.css";

import { tabItems } from "../variable";

const PublicFolder = () => {
  const dispatch = useDispatch<Dispatch>();
  const { selectedCalendarType, monthSelected } = useSelector(
    (state: RootState) => state.buildingCalendar
  );

  // functions
  const onTabChange = (key: string) => {
    console.log(key);
  };

  // actions
  useEffect(() => {
    dispatch.buildingCalendar.getBuildingCalendarEventData({
      types: selectedCalendarType,
      date: monthSelected.format("YYYY-MM-DD"),
    });
  }, [selectedCalendarType, monthSelected]);

  return (
    <>
      <Header title="Building calendar" />
      <Tabs defaultActiveKey="1" items={tabItems} onChange={onTabChange} />
    </>
  );
};

export default PublicFolder;
