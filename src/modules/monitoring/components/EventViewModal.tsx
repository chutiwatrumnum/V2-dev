import { useEffect } from "react";
import { Modal, Row, Col, Space, Typography } from "antd";
import "../styles/infoModal.css";

import { DetailType } from "../../../stores/interfaces/Summary";

const { Text } = Typography;
interface FormPropsType {
  data: DetailType[];
  date: any;
  visible: boolean;
  onCancel: VoidFunction;
}

const EventViewModal = ({
  data = [],
  date = null,
  visible = false,
  onCancel,
}: FormPropsType) => {
  const clear = () => {
    onCancel();
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal
        title="Event detail"
        width={600}
        centered
        open={visible}
        onCancel={clear}
        footer={false}
        bodyStyle={{
          paddingTop: 20,
          overflowY: "scroll",
          maxHeight: "calc(80vh)",
        }}>
        {data.map((item: DetailType) => {
          if (item.type === "building_calendar" || item.type === "event")
            return (
              <Col className="infoModalContentContainer" span={24}>
                <Space style={{ width: "100%" }} direction="vertical" size={15}>
                  {item.type === "building_calendar" ? (
                    <Row>
                      <Text>Event :</Text>
                      <Text strong className="rightTxtInfoModal">
                        {item.event ?? "-"}
                      </Text>
                    </Row>
                  ) : null}
                  <Row>
                    <Text>Title :</Text>
                    <Text strong className="rightTxtInfoModal">
                      {item.title ?? "-"}
                    </Text>
                  </Row>
                  <Row>
                    <Text>Location :</Text>
                    <Text className="rightTxtInfoModal">
                      {item.location ?? "-"}
                    </Text>
                  </Row>
                  <Row>
                    <Text>Date :</Text>
                    <Text className="rightTxtInfoModal">{date ?? "-"}</Text>
                  </Row>
                  <Row
                    justify="space-between"
                    className="timeInfoModalContainer">
                    <Row>
                      <Text>Start time :</Text>
                      <Text className="rightTxtInfoModal">
                        {item.startTime ?? "-"}
                      </Text>
                    </Row>
                    <Row>
                      <Text>End time :</Text>
                      <Text className="rightTxtInfoModal">
                        {item.endTime ?? "-"}
                      </Text>
                    </Row>
                  </Row>
                  <Row justify="start" className="noteInfoModalContainer">
                    <Text strong>Note :</Text>
                    <Col offset={1} span={20}>
                      <Text>{item.note ?? "-"}</Text>
                    </Col>
                  </Row>
                </Space>
              </Col>
            );
          else
            return (
              <Col className="infoModalContentContainer" span={24}>
                <Space style={{ width: "100%" }} direction="vertical" size={15}>
                  <Row>
                    <Text>Purpose :</Text>
                    <Text strong className="rightTxtInfoModal">
                      {item.purpose ?? "-"}
                    </Text>
                  </Row>
                  <Row>
                    <Text>Booked by :</Text>
                    <Text strong className="rightTxtInfoModal">
                      {item.bookedBy ?? "-"}
                    </Text>
                  </Row>
                  <Row>
                    <Text>Contact no :</Text>
                    <Text strong className="rightTxtInfoModal">
                      {item.contactNo ?? "-"}
                    </Text>
                  </Row>
                  <Row>
                    <Text>Location :</Text>
                    <Text className="rightTxtInfoModal">
                      {item.location ?? "-"}
                    </Text>
                  </Row>
                  <Row justify="start">
                    <Text>Date :</Text>
                    <Text className="rightTxtInfoModal">{date ?? "-"}</Text>
                  </Row>
                  <Row
                    justify="space-between"
                    className="timeInfoModalContainer">
                    <Row>
                      <Text>Start time :</Text>
                      <Text className="rightTxtInfoModal">
                        {item.startTime ?? "-"}
                      </Text>
                    </Row>
                    <Row>
                      <Text>End time :</Text>
                      <Text className="rightTxtInfoModal">
                        {item.endTime ?? "-"}
                      </Text>
                    </Row>
                  </Row>
                  <Row justify="start" className="noteInfoModalContainer">
                    <Text strong>Note :</Text>
                    <Col offset={1} span={20}>
                      <Text>{item.note ?? "-"}</Text>
                    </Col>
                  </Row>
                </Space>
              </Col>
            );
        })}
      </Modal>
    </>
  );
};

export default EventViewModal;
