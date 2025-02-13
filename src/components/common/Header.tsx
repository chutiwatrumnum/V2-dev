import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb } from "antd";
import "../style/header.css";
import BELL_ICON from "../../assets/icons/bell.png";
let width = window.innerWidth;
type Prop = {
  title: string;
  BreadcrumbData?: {
    status: boolean;
    data: any[];
  } | null;
};
function Header({ title, BreadcrumbData }: Prop) {
  return (
    <Row className="heading">
      <Col
        span={22}
        className="title"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {BreadcrumbData ? <Breadcrumb items={BreadcrumbData?.data} /> : title}
      </Col>
    </Row>
  );
}
const styles = {
  container: {
    maxheight: 500,
    overflow: "auto",
  },
} as const;

export default Header;
