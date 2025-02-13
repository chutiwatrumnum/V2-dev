import { Typography, Modal, Col, Space, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "../../stores";

import "../style/modal.css";

const { Text, Title } = Typography;

const ConfirmModal = () => {
  const dispatch = useDispatch<Dispatch>();
  const confirmModal = useSelector(
    (state: RootState) => state.common.confirmModal
  );

  const closeModal = () => {
    dispatch.common.updateConfirmModalState({
      ...confirmModal,
      open: false,
    });
  };

  const handleOk = async () => {
    dispatch.common.updateConfirmModalState({
      ...confirmModal,
      loading: true,
    });
    await confirmModal.onConfirm(
      confirmModal.onConfirmParams ? confirmModal.onConfirmParams : null
    );
  };

  return (
    <Modal
      open={confirmModal.open}
      onCancel={closeModal}
      closable={false}
      centered
      className="confirmModal"
      footer={[
        <Button shape="round" key="back" onClick={closeModal}>
          {confirmModal.cancelText}
        </Button>,
        <Button
          shape="round"
          key="submit"
          type="primary"
          loading={confirmModal.loading}
          onClick={handleOk}
        >
          {confirmModal.confirmText}
        </Button>,
      ]}
    >
      <Col className="confirmModalContent">
        <Space direction="vertical" size={25}>
          <Title level={3} style={{ textAlign: "center" }}>
            {confirmModal.title}
          </Title>
          <Text>
            <span>{confirmModal.description}</span>
          </Text>
        </Space>
      </Col>
    </Modal>
  );
};

export default ConfirmModal;
