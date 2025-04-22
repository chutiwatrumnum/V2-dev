import { Badge, Menu, Modal, Col, Row, ConfigProvider, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidermenu.css";
import { encryptStorage } from "../../utils/encryptStorage";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";

import { whiteLabel } from "../../configs/theme";
import ConfirmModal from "../../components/common/ConfirmModalMenu";

import {
  FacilityBookingIcon,
  ReservationDashboardIcon,
  ReservationListIcon,
  LogOutIcon,
  AnnouncementIcon,
  EventIcon,
  EventJoinLogIcon,
  EventLogIcon,
  DocumentFromsIcon,
  PersonalFolderIcon,
  PublicFolderIcon,
  VisitorManagementLogIcon,
  ResidentsInformationIcon,
  ResidentsSignupIcon,
  PaymentIcon,
  ParcelIcon,
  SummaryIcon,
  PeopleCountingIcon,
} from "../../assets/icons/Icons";

//icon svg
import MENU_LOGO from "../../assets/images/logo.svg";
import USER_ICON from "../../assets/icons/user.svg";
import MONITORING_ICON from "../../assets/icons/Monitoring_icon.svg";
import SUMARY_ICON from "../../assets/icons/Summary.svg";

import { APP_VERSION } from "../../configs/configs";

//antd constraints components
const { SubMenu } = Menu;
const main_link = "/dashboard";
// let path = window.location.pathname.split("/");

const NewSideMenu = () => {
  const { accessibility } = useSelector((state: RootState) => state.common);
  const { refresh } = useSelector((state: RootState) => state.document);
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const userData = encryptStorage.getItem("userData");
  const [keyPath, setKeyPath] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [activeKeys, setActiveKeys] = useState(window.location.pathname);

  // const rootSubmenuKeys = ["facilities"];

  const onOpenChange = (keys: any) => {
    const latestOpenKey = keys.find((key: any) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const logoutHandler = () => {
    ConfirmModal({
      title: "Do you want to log out?",
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: onLogoutOk,
      onCancel: onLogoutCancel,
    });
  };

  const onLogoutOk = async () => {
    await dispatch.userAuth.onLogout();
    dispatch.userAuth.updateAuthState(false);
    navigate("/auth", { replace: true });
  };

  const onLogoutCancel = async () => {
    console.log("Cancel");
  };

  const iconMenuColorSelector = (key: string) => {
    // console.log(keyPath);
    // console.log(key);
    // console.log(keyPath.includes(key));

    if (keyPath.includes(key)) return whiteLabel.primaryColor;
    return whiteLabel.whiteColor;
  };

  const iconSubMenuColorSelector = (key: string) => {
    if (keyPath.includes(key)) return whiteLabel.primaryColor;
    return whiteLabel.whiteColor;
  };

  return (
    <React.Fragment>
      <div className="sideMenuContainer">
        <div className="sideMenuLogo">
          <img style={{ width: "60%" }} src={MENU_LOGO} alt="menuLogo" />
        </div>
        <div className="menuContainer">
          <div>
            <Menu
              defaultSelectedKeys={[window.location.pathname]}
              mode="inline"
              onSelect={({ keyPath }) => {
                setKeyPath(keyPath.toString());
              }}
              onOpenChange={(keys) => {
                const latestOpenKey = keys.find(
                  (key) => openKeys.indexOf(key) === -1
                );
                setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
              }}
              openKeys={openKeys}>
              <Menu.Item
                key="management"
                style={{ paddingTop: 30, paddingBottom: 30 }}
                disabled={!accessibility?.menu_mcst.allowView}>
                <Link
                  style={
                    !accessibility?.menu_mcst.allowView
                      ? { cursor: "not-allowed", pointerEvents: "none" }
                      : {}
                  }
                  to={
                    accessibility?.menu_mcst.allowView
                      ? `${main_link}/management`
                      : "/dashboard"
                  }>
                  <Row>
                    <Col
                      span={5}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}>
                      <img
                        src={
                          userData?.imageProfile
                            ? userData.imageProfile
                            : USER_ICON
                        }
                        alt="menu-logo"
                        width={50}
                        height={50}
                        style={{ borderRadius: 25 }}
                      />
                    </Col>

                    <Col
                      span={16}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}>
                      <div className={"group-name-top"}>
                        {userData?.firstName
                          ? `${userData?.firstName} ${
                              userData?.middleName ? userData?.middleName : ""
                            } ${userData?.lastName}`
                          : "Admin Management"}
                      </div>
                    </Col>
                  </Row>
                </Link>
              </Menu.Item>
              {/* <SubMenu
                key="Monitoring"
                icon={
                  <SummaryIcon
                    color={iconMenuColorSelector("Monitoring")}
                    className="sideMenuIcon"
                  />
                }
                title="Monitoring (Summary)"
                // disabled={true}
                // style={{ display: "none" }}
              > */}
              <Menu.Item
                key={`${main_link}/summary`}
                icon={
                  <SummaryIcon
                    color={iconMenuColorSelector("summary")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/summary`}>Summary</Link>
              </Menu.Item>
              {/* <Menu.Item
                  key={`${main_link}/event-view`}
                  // icon={<img src={EVENT_VIEW_ICON} alt="Event view" />}
                >
                  <Link to={`${main_link}/event-view`}>Event view</Link>
                </Menu.Item> */}
              {/* </SubMenu> */}
              <div className={"group-name"}>Facilities management</div>
              <SubMenu
                key="facilities"
                icon={
                  <FacilityBookingIcon
                    color={iconMenuColorSelector("facilities")}
                    className="sideMenuIcon"
                  />
                }
                title="Facilities">
                <Menu.Item
                  key={`${main_link}/reservationDashboard`}
                  icon={
                    <ReservationDashboardIcon
                      color={iconSubMenuColorSelector("reservationDashboard")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/reservedFacilities`}>
                    Our facilities
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/reservationList`}
                  icon={
                    <ReservationListIcon
                      color={iconSubMenuColorSelector("reservationList")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/reservationList`}>
                    Reservation Lists
                  </Link>
                </Menu.Item>
              </SubMenu>
              <div className={"group-name"}>Notice</div>
              <Menu.Item
                onClick={() => setOpenKeys([])}
                key={`${main_link}/announcement`}
                icon={
                  <AnnouncementIcon
                    color={iconMenuColorSelector("announcement")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/announcement`}>Announcement</Link>
              </Menu.Item>
              <SubMenu
                key="event"
                icon={
                  <EventIcon
                    color={iconMenuColorSelector("event")}
                    className="sideMenuIcon"
                  />
                }
                title="Event">
                <Menu.Item
                  key={`${main_link}event-logs`}
                  icon={
                    <EventLogIcon
                      color={iconMenuColorSelector("event-logs")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/event-logs`}>Event logs</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}event-joining-logs`}
                  icon={
                    <EventJoinLogIcon
                      color={iconMenuColorSelector("event-joining-logs")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/event-joining-logs`}>
                    Event joining logs
                  </Link>
                </Menu.Item>
              </SubMenu>
              <div className={"group-name"}>Document</div>
              <SubMenu
                key="document-forms"
                icon={
                  <DocumentFromsIcon
                    color={iconMenuColorSelector("document-forms")}
                    className="sideMenuIcon"
                  />
                }
                title="Document / forms">
                <Menu.Item
                  key={`${main_link}public-folder`}
                  icon={
                    <PublicFolderIcon
                      color={iconMenuColorSelector("public-folder")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/public-folder`}>Public folder</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}personal-folder`}
                  icon={
                    <PersonalFolderIcon
                      color={iconMenuColorSelector("personal-folder")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/personal-folder`}>
                    Personal folder
                  </Link>
                </Menu.Item>
              </SubMenu>
              <div className={"group-name"}>Visitor management</div>
              <Menu.Item
                key={`${main_link}visitor-management-log`}
                icon={
                  <VisitorManagementLogIcon
                    color={iconMenuColorSelector("visitor-management-log")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/visitor-management-log`}>
                  Visitor management log
                </Link>
              </Menu.Item>
              <div className={"group-name"}>User management</div>
              <Menu.Item
                key={`${main_link}resident-information`}
                icon={
                  <ResidentsInformationIcon
                    color={iconMenuColorSelector("resident-information")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/resident-information`}>
                  Resident’s information
                </Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}resident-sign-up`}
                icon={
                  <ResidentsSignupIcon
                    color={iconMenuColorSelector("resident-sign-up")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/resident-sign-up`}>
                  Resident’s sign up
                </Link>
              </Menu.Item>
              <Menu.Item
                icon={
                  <ParcelIcon
                    color={iconMenuColorSelector("payment-dashboard")}
                    className="sideMenuIcon"
                  />
                }
                key={`${main_link}payment-dashboard`}
                // icon={<img src={DELIVERY_LOGS_ICON} alt="Delivery logs" />}
              >
                <Link to={`${main_link}/payment-dashboard`}>Payment</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}/people-counting`}
                icon={
                  <PeopleCountingIcon
                    color={iconMenuColorSelector("peopleCounting")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/people-counting`}>People counting</Link>
              </Menu.Item>
              {/* <Menu.Item
                icon={
                  <ParcelIcon
                    color={iconMenuColorSelector("payment-dashboard")}
                    className="sideMenuIcon"
                  />
                }
                key={`${main_link}payment-chart`}
              >
                <Link to={`${main_link}/payment-chart`}>PaymentSummaryDashboard</Link>
              </Menu.Item> */}
              <Menu.Item
                key={`${main_link}16`}
                // icon={<img src={DELIVERY_LOGS_ICON} alt="Delivery logs" />}
                disabled={true}
                style={{ display: "none" }}>
                <Link to={`${main_link}/delivery-logs`}>Delivery logs</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div>
            <Menu
              style={{ marginBottom: "auto" }}
              mode="inline"
              selectable={false}>
              <Menu.Item
                key="auth"
                icon={
                  <LogOutIcon
                    color={whiteLabel.whiteColor}
                    className="sideMenuIcon"
                  />
                }
                onClick={logoutHandler}
                style={{ alignSelf: "end", bottom: 0 }}>
                <span style={{ color: whiteLabel.whiteColor }}>Log Out</span>
              </Menu.Item>
              <div className="textVersion">version {APP_VERSION}</div>
            </Menu>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewSideMenu;
