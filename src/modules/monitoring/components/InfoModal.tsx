import { useEffect } from "react";
import { Modal, Row, Col, Space, Typography } from "antd";
import "../styles/infoModal.css";

import { DetailType } from "../../../stores/interfaces/BuildingCalendar";

const { Text } = Typography;
interface FormPropsType {
  data: DetailType[];
  date: any;
  visible: boolean;
  onCancel: VoidFunction;
}

const FormTemplate = ({
  data = [],
  date = null,
  visible = false,
  onCancel,
}: FormPropsType) => {
  const clear = () => {
    onCancel();
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

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
          return (
            <Col className="infoModalContentContainer" span={24}>
              <Space style={{ width: "100%" }} direction="vertical" size={15}>
                <Row>
                  <Text>Event :</Text>
                  <Text strong className="rightTxtInfoModal">
                    {item.event ?? "Event name"}
                  </Text>
                </Row>
                <Row>
                  <Text>Title :</Text>
                  <Text className="rightTxtInfoModal">
                    {item.title ?? "Title"}
                  </Text>
                </Row>
                <Row>
                  <Text>Location :</Text>
                  <Text className="rightTxtInfoModal">
                    {item.location ?? "Location"}
                  </Text>
                </Row>
                <Row>
                  <Text>Date :</Text>
                  <Text className="rightTxtInfoModal">{date ?? "date"}</Text>
                </Row>
                <Row justify="space-between" className="timeInfoModalContainer">
                  <Row>
                    <Text>Start time :</Text>
                    <Text className="rightTxtInfoModal">
                      {item.startTime ?? "00:00 AM"}
                    </Text>
                  </Row>
                  <Row>
                    <Text>End time :</Text>
                    <Text className="rightTxtInfoModal">
                      {item.endTime ?? "00:00 AM"}
                    </Text>
                  </Row>
                </Row>
                <Row className="noteInfoModalContainer">
                  <Text>Note :</Text>
                  <Col offset={1} span={20}>
                    <Text>
                      {item.note ??
                        "Please bring the repair reports from the past quarter for analysis and discussion of the maintenance plan for the residents."}
                    </Text>
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

export default FormTemplate;
