import { useEffect, useState } from "react";
import { Row, Col, Button, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import "../styles/buildingCalendar.css";
import "../../monitoring/styles/eventView.css";

import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { CalendarType } from "../../../stores/interface/Common";

const FilterByCalendarType = () => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const { masterData } = useSelector((state: RootState) => state.common);
  const { selectedCalendarType } = useSelector(
    (state: RootState) => state.buildingCalendar
  );
  const calendarTypeData = masterData?.calendarType;

  // functions
  const onCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    dispatch.buildingCalendar.updateSelectedCalendarTypeState(checkedValues);
  };

  const selectedAllClick = () => {
    let selected: number[] = [];
    calendarTypeData?.map((item: CalendarType) => {
      selected.push(item.id);
    });
    dispatch.buildingCalendar.updateSelectedCalendarTypeState(selected);
  };

  const clearAllClick = () => {
    dispatch.buildingCalendar.updateSelectedCalendarTypeState([]);
  };

  // actions
  useEffect(() => {}, []);

  // components
  const CheckBoxComponent = ({ item }: { item: CalendarType }) => {
    return (
      <Col className="checkboxContainer">
        <Checkbox
          style={{ backgroundColor: item.colorCode }}
          value={item.id}
          className="checkbox"
        >
          {item.name}
        </Checkbox>
      </Col>
    );
  };

  return (
    <Col className="categorySelectorContainer">
      <Row>
        <Button onClick={selectedAllClick} type="link">
          Select all
        </Button>
        <Button onClick={clearAllClick} type="link">
          Clear all
        </Button>
      </Row>

      <Checkbox.Group
        style={{ width: "100%" }}
        onChange={onCheckboxChange}
        value={selectedCalendarType}
      >
        <Row>
          {calendarTypeData?.map((item) => {
            return <CheckBoxComponent item={item} />;
          })}
        </Row>
      </Checkbox.Group>
    </Col>
  );
};

export default FilterByCalendarType;
