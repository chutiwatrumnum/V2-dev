import { Modal } from "antd";
import React from "react";

// SVG Icon Components (คัดลอกมาจาก SuccessModal2.tsx)
const SuccessIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="50"
    height="50"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="#63A164"
    />
  </svg>
);

const FailedIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="50"
    height="50"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
      fill="#AD1B1B"
    />
  </svg>
);

/**
 * แสดง Success Modal แบบ auto-close (ใช้ UI จาก SuccessModal2.tsx)
 * @param message - ข้อความที่ต้องการแสดง
 */
export const showSuccessModal = (message: string) => {
  const instance = Modal.success({
    icon: null,
    title: null,
    footer: null,
    closable: false,
    maskClosable: false,
    content: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 0",
        }}>
        <SuccessIcon className="successIcon" />
        <p
          style={{
            fontSize: 16,
            fontWeight: 500,
            margin: 0,
            marginBottom: 16,
            color: "#63A164",
            textAlign: "center",
          }}>
          {message}
        </p>
      </div>
    ),
    centered: true,
    className: "statusModalController",
    width: 400,
  });

  // Auto close หลัง 3 วินาที
  setTimeout(() => {
    instance.destroy();
  }, 3000);

  return instance;
};

/**
 * แสดง Error Modal แบบ auto-close (ใช้ UI จาก FailedModal.tsx)
 * @param message - ข้อความที่ต้องการแสดง
 */
export const showErrorModal = (message: string) => {
  const instance = Modal.error({
    icon: null,
    title: null,
    footer: null,
    closable: false,
    maskClosable: false,
    content: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 0",
        }}>
        <FailedIcon className="successIcon" />
        <p
          style={{
            fontSize: 16,
            fontWeight: 500,
            margin: 0,
            marginBottom: 16,
            color: "#AD1B1B",
            textAlign: "center",
          }}>
          {message}
        </p>
      </div>
    ),
    centered: true,
    className: "statusModalController",
    width: 400,
  });

  // Auto close หลัง 3 วินาที
  setTimeout(() => {
    instance.destroy();
  }, 3000);

  return instance;
};
