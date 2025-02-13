import dayjs from "dayjs";
import { Modal, Row, Col } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DataType } from "../../../stores/interface/Resident";
const rowStyle: object = {
  paddingTop: 2,
  paddingBottom: 2,
};
dayjs.extend(customParseFormat);
interface InfoResidentInformationProps {
  resident: DataType;
  isOpen: boolean;
  callBack: (isOpen: boolean) => void;
}
const InfoResidentInformation = (props: InfoResidentInformationProps) => {
  const handleCancel = async () => {
    await props.callBack(!props?.isOpen);
  };
  return (
    <>
      <Modal
        title="Info"
        width={450}
        centered
        open={props?.isOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Row style={{ paddingTop: 10, paddingBottom: 2 }}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"First name "}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"Move-in date"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}> {props?.resident?.firstName}</Col>
          {/* <Col span={14}> {props?.resident?.middleName}</Col> */}
          <Col span={10}>
            {dayjs(props?.resident?.moveInDate).format("DD/MM/YYYY") !==
            "Invalid Date"
              ? dayjs(props?.resident?.moveInDate).format("DD-MM-YYYY")
              : "-"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"Middle name"}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"Move-out date"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}>{props?.resident?.middleName ?? "-"}</Col>
          <Col span={10}>
            {dayjs(props?.resident?.moveOutDate).format("DD/MM/YYYY") !==
            "Invalid Date"
              ? dayjs(props?.resident?.moveOutDate).format("DD-MM-YYYY")
              : "-"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"Last name "}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"IU number"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}> {props?.resident?.lastName}</Col>
          <Col span={10}>
            {props?.resident?.iuNumber ? props?.resident?.iuNumber : "-"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"email "}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"Registration channel"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}> {props?.resident?.email}</Col>
          <Col span={10}>( Admin register )</Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"Contact"}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"Birthday (Op) "}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}> {props?.resident?.contact}</Col>
          <Col span={10}>
            {dayjs(props?.resident?.birthDate).format("DD/MM/YYYY") !==
            "Invalid Date"
              ? dayjs(props?.resident?.birthDate).format("DD-MM-YYYY")
              : "-"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"Unit no."}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"Create "}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}> {props?.resident?.unitNo}</Col>
          <Col span={10}>
            {props?.resident?.createdAt
              ? dayjs(props?.resident?.createdAt).format("DD-MM-YYYY")
              : "-"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14} style={{ fontWeight: 700 }}>
            {"Nickname"}
          </Col>
          <Col span={10} style={{ fontWeight: 700 }}>
            {"Role"}
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={14}>
            {props?.resident?.nickName ? props?.resident?.nickName : "-"}
          </Col>
          <Col span={10}> {props?.resident?.role}</Col>
        </Row>
      </Modal>
    </>
  );
};

export default InfoResidentInformation;
