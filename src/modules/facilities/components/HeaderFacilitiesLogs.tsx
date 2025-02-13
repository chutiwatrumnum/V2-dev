import React from "react";
import { useState, useEffect } from "react";
import { getFacilitiesList } from "../service/api/FacilitiesServiceAPI";
import FacilitiesLogs from "../screen/FacilitiesLogs";
import Header from "../../../components/common/Header";
import { Row, Select } from "antd";

const HeaderFacilitiesLogs = () => {
  const [selectRoomType, setselectRoomType] = useState<number | null>(null);
  const [itemList, setitemList] = useState<any>([]);
  useEffect(() => {
    (async function () {
      const dataRoomList = await getFacilitiesList();
      if (dataRoomList.status) {
        setitemList(dataRoomList.data);
        setselectRoomType(dataRoomList.firstId);
      }
    })();
  }, []);

  const handleChange = async (value: number) => {
    await setselectRoomType(value);
  };
  return (
    <>
      <Header title="Facilities booking logs" />
      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Select
          value={selectRoomType}
          style={{ width: 200 }}
          onChange={handleChange}
          options={itemList}
        />
      </Row>
      <FacilitiesLogs room={selectRoomType} />
    </>
  );
};
export default HeaderFacilitiesLogs;
