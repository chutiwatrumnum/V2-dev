import dayjs from "dayjs";
import { Modal, Row, Col, Typography, Image } from "antd";
import { DataAnnouncementType } from "../../../stores/interface/Announce";

import "../styles/announcement.css";

const { Text, Title } = Typography;

interface FormPropsType {
  data: DataAnnouncementType | null;
  visible: boolean;
  onCancel: VoidFunction;
}

const InformationTemplate = ({
  onCancel,
  data = null,
  visible = false,
}: FormPropsType) => {
  const convertDate = (val: string | undefined) => {
    let date = dayjs(val).format("DD/MM/YYYY : hh:mm a").toString();
    return date;
  };
  const status = (
    startDate: string | undefined,
    endDate: string | undefined
  ) => {
    let status = "Unpublished";
    let now = dayjs();

    if (now >= dayjs(startDate) && now <= dayjs(endDate)) {
      status = "Published";
    }
    return status;
  };
  return (
    <>
      <Modal
        title="Details"
        width={800}
        centered
        open={visible}
        onCancel={onCancel}
        footer={false}
        style={{
          borderBottom: 20,
          borderWidth: 200,
          borderBlock: 10,
        }}
      >
        <Row>
          <Col span={12} style={{ padding: 10 }}>
            <Title level={5}>Image</Title>
            <Image
              width="100%"
              style={{ borderRadius: 10 }}
              src={data?.imageUrl}
            />
            <Row>
              <Col span={12}>
                <Title level={5}>Created date</Title>
                <Text>
                  {dayjs(data?.createdAt).format("DD/MM/YYYY").toString()}
                </Text>
                <Title level={5}>Start date/time</Title>
                <Text>{convertDate(data?.startDate)}</Text>
                <Title level={5}>Status</Title>
                <Text>{status(data?.startDate, data?.endDate)}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Created by</Title>
                <Text>
                  {data?.users?.firstName} {data?.users?.lastName}
                </Text>
                <Title level={5}>End date/time</Title>
                <Text>{convertDate(data?.endDate)}</Text>
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ padding: 10 }}>
            <Title level={5}>Title</Title>
            <Text>{data?.title}</Text>
            <Title level={5}>Announcement body</Title>
            <Text style={{ whiteSpace: "pre-line" }}>{data?.description}</Text>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default InformationTemplate;
