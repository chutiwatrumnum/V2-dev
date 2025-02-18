import { useEffect, useState } from "react";
import { Typography, Modal, Col, Space } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "../../stores";
import "../styles/modal.css";

const { Text } = Typography;

const SuccessModal = (p0: string) => {
  const [iconSatus, seticonSatus] = useState<any>(
    <CheckCircleFilled
      style={{ color: "#65C466", fontSize: 50, lineHeight: 50 }}
    />
  );
  let icon = null;
  const dispatch = useDispatch<Dispatch>();
  const successModal = useSelector(
    (state: RootState) => state.common.successModal
  );
  const closeModal = () => {
    dispatch.common.updateSuccessModalState(false);
  };

  useEffect(() => {
    if (successModal) {
      (async function () {
        switch (successModal.status) {
          case "error":
            await seticonSatus(
              <CloseCircleFilled
                style={{ color: "red", fontSize: 50, lineHeight: 50 }}
              />
            );
            break;

          default:
            await seticonSatus(
              <CheckCircleFilled
                style={{ color: "#65C466", fontSize: 50, lineHeight: 50 }}
              />
            );
            break;
        }
      })();
      setTimeout(() => {
        closeModal();
      }, 3000);
    }
  }, [successModal]);

  return (
    <Modal
      open={successModal.open}
      footer={null}
      onCancel={closeModal}
      closable={false}
      className="successModalController"
      centered>
      <Col style={{ textAlign: "center", padding: "30px 0" }}>
        <Space direction="vertical" size={25}>
          {iconSatus}
          <Text>{successModal.text}</Text>
        </Space>
      </Col>
    </Modal>
  );
};

export default SuccessModal;
