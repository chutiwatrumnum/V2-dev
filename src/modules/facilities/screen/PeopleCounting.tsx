import { useState, useEffect } from "react";
import "dayjs/locale/en-gb";
import { Row, Button, Col, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import Header from "../../../components/common/Header";
import PeopleCountingModal from "../components/PeopleCountingModal";
import { PeopleCountingDataType } from "../../../stores/interface/Facilities";

import PEOPLE_COUNTING_ICON from "../../../assets/icons/People_counting_icon_white.svg";
import EDIT_ICON from "../../../assets/icons/Edit.svg";
import "../styles/ReserveFacility.css";

const { Text, Title } = Typography;

const PeopleCounting = () => {
  // variables
  const dispatch = useDispatch<Dispatch>();
  const { peopleCountingData } = useSelector(
    (state: RootState) => state.facilities
  );
  const { accessibility } = useSelector((state: RootState) => state.common);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<PeopleCountingDataType>();
  const [onRefresh, setOnRefresh] = useState<boolean>(false);

  // functions
  const editHandler = () => {
    setIsModalOpen(true);
    setModalData(peopleCountingData);
  };

  // actions
  useEffect(() => {
    dispatch.facilities.getPeopleCountingData();
  }, [onRefresh]);

  return (
    <>
      <Header title={"People counting"} />
      <Row className="peopleCountingContainer">
        <Col
          style={{ backgroundImage: `url(${peopleCountingData?.roomImgs})` }}
          className="peopleCountingCardContainer"
        >
          <Col className="peopleCountingGradients">
            <Row style={{ alignItems: "center" }} justify="space-between">
              <Col>
                <Title style={{ color: "#fff", marginBottom: 5 }} level={4}>
                  {peopleCountingData?.roomName}
                </Title>
                <Row style={{ alignItems: "center" }}>
                  <img
                    height={15}
                    src={PEOPLE_COUNTING_ICON}
                    alt="peopleCounting"
                  />
                  <Text style={{ color: "#fff", marginLeft: 8 }}>
                    {peopleCountingData?.totalPeople} People
                  </Text>
                </Row>
              </Col>
              <Button
                shape="round"
                type="text"
                onClick={editHandler}
                icon={
                  <img height={24} src={EDIT_ICON} alt="editPeopleCounting" />
                }
              />
            </Row>
          </Col>
        </Col>
      </Row>
      <PeopleCountingModal
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setModalData(undefined);
        }}
        onRefresh={() => {
          setOnRefresh(!onRefresh);
        }}
        data={modalData}
        editAllow={accessibility?.menu_people_counting.allowEdit ?? false}
      />
    </>
  );
};

export default PeopleCounting;
