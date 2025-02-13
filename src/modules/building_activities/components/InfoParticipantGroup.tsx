import React, { useState } from "react";
import dayjs from "dayjs";
import { Modal, Row, Col, Tag } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface InfoParticipantGroup {
  ParticipantGroup: any;
  isOpen: boolean;
  callBack: (isOpen: boolean) => void;
}

const InfoParticipantGroup = (props: InfoParticipantGroup) => {
  const handleCancel = async () => {
    await props.callBack(!props?.isOpen);
  };

  return (
    <>
      <Modal
        title="Info"
        width={700}
        centered
        open={props?.isOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Row style={{ paddingTop: 10, paddingBottom: 2 }}>
          <Col span={12} style={{ fontWeight: 700 }}>
            {"Group name"}
          </Col>
          <Col span={12} style={{ fontWeight: 700 }}>
            {"Participants "}
          </Col>
        </Row>
        <Row style={{ paddingTop: 2, paddingBottom: 2 }}>
          <Col span={12}> {props?.ParticipantGroup?.groupname}</Col>
          <Col span={12} style={{ paddingRight: 30 }}>
            {props?.ParticipantGroup?.email.map((e: any) => {
              return <Tag>{e}</Tag>;
            })}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default InfoParticipantGroup;
