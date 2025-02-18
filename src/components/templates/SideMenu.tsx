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
  UserManagementIcon,
  ResidentManagementIcon,
  RegistrationIcon,
  ProfileIcon,
  ManagementIcon,
  NearbyIcon,
  EmergencyIcon,
  ChatIcon,
  ServiceCenterIcon,
  ServiceCenterDashboardIcon,
  ServiceCenterListIcon,
} from "../../assets/icons/Icons";

//icon svg
import MENU_LOGO from "../../assets/images/mainLogo.svg";
import USER_ICON from "../../assets/icons/user.svg";
import MONITORING_ICON from "../../assets/icons/Monitoring_icon.svg";
import SUMARY_ICON from "../../assets/icons/Summary.svg";
import CALENDAR_ICON from "../../assets/icons/Building_calendar.svg";
import BUILDING_ICON from "../../assets/icons/Building_activities.svg";
import EVENT_VIEW_ICON from "../../assets/icons/Event_view.svg";
import FACILITIES_ICON from "../../assets/icons/facilities.svg";
import OUR_FACILITY_ICON from "../../assets/icons/Our_facilities.svg";
import FACILITY_LOG_ICON from "../../assets/icons/Facilities_booking_logs.svg";
import RESERVE_FACILITY_ICON from "../../assets/icons/Reserve_facility.svg";
import PEOPLE_COUNTING_ICON from "../../assets/icons/People_counting.svg";
import ANNOUNCEMENT_ICON from "../../assets/icons/Announcement.svg";
import EVENT_ICON from "../../assets/icons/Event.svg";
import EVENT_LOGS_ICON from "../../assets/icons/Event_logs.svg";
import EVENT_JOIN_LOGS_ICON from "../../assets/icons/Event_joining_logs.svg";
import DOCUMENT_FORMS_ICON from "../../assets/icons/Document_forms.svg";

import PUBLIC_FOLDER_ICON from "../../assets/icons/Public_folder.svg";
import PERSONAL_FOLDER_ICON from "../../assets/icons/Personal_folder.svg";
import VISITOR_MANAGEMENT_LOGS_ICON from "../../assets/icons/Visitor_management_log.svg";
import RESERVE_INFORMATION_ICON from "../../assets/icons/Reserve_facility.svg";

import RESERVE_SINGUP_ICON from "../../assets/icons/Residents_sign_up.svg";
import DELIVERY_LOGS_ICON from "../../assets/icons/Delivery_log.svg";
import LOG_OUT_ICON from "../../assets/icons/Log_out.svg";
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
          <img style={{ width: "40%" }} src={MENU_LOGO} alt="menuLogo" />
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
                disabled={!accessibility?.menu_mcst.available}>
                <Link
                  style={
                    !accessibility?.menu_mcst.available
                      ? { cursor: "not-allowed", pointerEvents: "none" }
                      : {}
                  }
                  to={
                    accessibility?.menu_mcst.available
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
                          : "Verticus Management"}
                      </div>
                    </Col>
                  </Row>
                </Link>
              </Menu.Item>
              <SubMenu
                key="Monitoring"
                // icon={<img src={MONITORING_ICON} alt="Monitoring" />}
                title="Monitoring (Summary)"
                // disabled={true}
                // style={{ display: "none" }}
              >
                <Menu.Item
                  key={`${main_link}/summary`}
                  // icon={<img src={SUMARY_ICON} alt="Summary" />}
                >
                  <Link to={`${main_link}/summary`}>Summary</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/event-view`}
                  // icon={<img src={EVENT_VIEW_ICON} alt="Event view" />}
                >
                  <Link to={`${main_link}/event-view`}>Event view</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="Building calendar"
                // icon={<img src={CALENDAR_ICON} alt="Building calendar" />}
                title="Building calendar"
                // disabled={true}
                // style={{ display: "none" }}
              >
                <Menu.Item
                  key={`${main_link}3`}
                  // icon={<img src={EVENT_VIEW_ICON} alt="Calendar" />}
                >
                  <Link to={`${main_link}/building-calendar`}>Calendar</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}`}
                  // icon={<img src={BUILDING_ICON} alt="Building activities" />}
                >
                  <Link to={`${main_link}/building-activities`}>
                    Building activities
                  </Link>
                </Menu.Item>
              </SubMenu>
              <div className={"group-name"}>Facilities management</div>
              <SubMenu
                key="facilities"
                icon={
                  <FacilityBookingIcon
                    color={iconMenuColorSelector("facilities")}
                    className="sideMenuIcon"
                  />
                }
                title="Reservation Lists">
                <Menu.Item
                  key={`${main_link}/reservationDashboard`}
                  icon={
                    <ReservationDashboardIcon
                      color={iconSubMenuColorSelector("reservationDashboard")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/reservedFacilities`}>Facilities</Link>
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
                // icon={<img src={ANNOUNCEMENT_ICON} alt="announcement" />}
              >
                <Link to={`${main_link}/announcement`}>Announcement</Link>
              </Menu.Item>
              <SubMenu
                key="event"
                // icon={<img src={EVENT_ICON} alt="event" />}
                title="Event">
                <Menu.Item
                  key={`${main_link}9`}
                  // icon={<img src={EVENT_LOGS_ICON} alt="Event logs" />}
                >
                  <Link to={`${main_link}/event-logs`}>Event logs</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}10`}
                  // icon={
                  //   <img src={EVENT_JOIN_LOGS_ICON} alt="Event joining logs" />
                  // }
                >
                  <Link to={`${main_link}/event-joining-logs`}>
                    Event joining logs
                  </Link>
                </Menu.Item>
              </SubMenu>
              <div className={"group-name"}>Document</div>
              <SubMenu
                key="Document / forms"
                // icon={<img src={DOCUMENT_FORMS_ICON} alt="Document / forms" />}
                title="Document / forms">
                <Menu.Item
                  key={`${main_link}11`}
                  // icon={<img src={PUBLIC_FOLDER_ICON} alt="Public folder" />}
                >
                  <Link to={`${main_link}/public-folder`}>Public folder</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}12`}
                  // icon={
                  //   <img src={PERSONAL_FOLDER_ICON} alt="Personal folder" />
                  // }
                >
                  <Link to={`${main_link}/personal-folder`}>
                    Personal folder
                  </Link>
                </Menu.Item>
              </SubMenu>
              <div className={"group-name"}>Visitor management</div>
              <Menu.Item
                key={`${main_link}13`}
                // icon={
                //   <img
                //     src={VISITOR_MANAGEMENT_LOGS_ICON}
                //     alt="Visitor management logs"
                //   />
                // }
              >
                <Link to={`${main_link}/visitor-management-log`}>
                  Visitor management log
                </Link>
              </Menu.Item>
              <div className={"group-name"}>User management</div>
              <Menu.Item
                key={`${main_link}14`}
                // icon={
                //   <img
                //     src={RESERVE_INFORMATION_ICON}
                //     alt="Resident’s information"
                //   />
                // }
              >
                <Link to={`${main_link}/resident-information`}>
                  Resident’s information
                </Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}15`}
                // icon={
                //   <img src={RESERVE_SINGUP_ICON} alt="Resident’s sign up" />
                // }
              >
                <Link to={`${main_link}/resident-sign-up`}>
                  Resident’s sign up
                </Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}16`}
                // icon={<img src={DELIVERY_LOGS_ICON} alt="Delivery logs" />}
                disabled={true}
                style={{ display: "none" }}>
                <Link to={`${main_link}/delivery-logs`}>Delivery logs</Link>
              </Menu.Item>

              {/* <Menu.Item
                key={`${main_link}/profile`}
                icon={
                  <ProfileIcon
                    color={iconMenuColorSelector(`profile`)}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/profile`}>Profile</Link>
              </Menu.Item> */}
              {/* <Menu.Item
                key={`${main_link}/managementMain`}
                icon={
                  <ManagementIcon
                    color={iconMenuColorSelector("managementMain")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/managementMain`}>Management Team</Link>
              </Menu.Item> */}
              {/* User management */}
              {/* <SubMenu
                key="userManagement"
                icon={
                  <UserManagementIcon
                    color={iconMenuColorSelector("userManagement")}
                    className="sideMenuIcon"
                  />
                }
                title="User management">
                <Menu.Item
                  key={`${main_link}/residentInformation`}
                  icon={
                    <ResidentManagementIcon
                      color={iconSubMenuColorSelector("residentInformation")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/residentInformation`}>
                    Resident’s Information
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/residentSignUp`}
                  icon={
                    <UserManagementIcon
                      color={iconSubMenuColorSelector("residentSignUp")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/residentSignUp`}>
                    Resident’s Sign up
                  </Link>
                </Menu.Item>
              </SubMenu> */}
              {/* Facility Center */}
              {/* <SubMenu
                key="facilities"
                icon={
                  <FacilityBookingIcon
                    color={iconMenuColorSelector("facilities")}
                    className="sideMenuIcon"
                  />
                }
                title="Reservation Lists">
                <Menu.Item
                  key={`${main_link}/reservationDashboard`}
                  icon={
                    <ReservationDashboardIcon
                      color={iconSubMenuColorSelector("reservationDashboard")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/reservedFacilities`}>Facilities</Link>
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
              </SubMenu> */}
              {/* <Menu.Item
                key={`${main_link}/announcement`}
                icon={
                  <AnnouncementIcon
                    color={iconMenuColorSelector("announcement")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/announcement`}>Announcement</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}/emergencyCall`}
                icon={
                  <EmergencyIcon
                    color={iconMenuColorSelector("emergencyCall")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/emergencyCall`}>Emergency Call</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}/nearbyService`}
                icon={
                  <NearbyIcon
                    color={iconMenuColorSelector("nearbyService")}
                    className="sideMenuIcon"
                  />
                }>
                <Link to={`${main_link}/nearbyService`}>Nearby Service</Link>
              </Menu.Item> */}
              {/* User management */}
              {/* <Menu.Item
                key={`${main_link}/chatRoom`}
                icon={
                  <ChatIcon
                    color={iconMenuColorSelector("chatRoom")}
                    className="sideMenuIcon"
                  />
                }>
                <Link
                  to={`${main_link}/chatRoom`}
                  onClick={() => {
                    socket.connect();
                  }}>
                  Chat Room
                </Link>
              </Menu.Item>
              <SubMenu
                key="seviceCenter"
                icon={
                  <ServiceCenterIcon
                    color={iconMenuColorSelector("serviceDashboard")}
                    className="sideMenuIcon"
                  />
                }
                title="Service Center">
                <Menu.Item
                  key={`${main_link}/serviceDashboard`}
                  icon={
                    <ServiceCenterDashboardIcon
                      color={iconSubMenuColorSelector("serviceDashboard")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/serviceDashboard`}>
                    Service Center Dashboard
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/ServiceCenterLists`}
                  icon={
                    <ServiceCenterListIcon
                      color={iconSubMenuColorSelector("ServiceCenterLists")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/serviceCenterLists`}>
                    Service Center Lists
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/ServiceChat`}
                  icon={
                    <ChatIcon
                      color={iconSubMenuColorSelector("ServiceChat")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/ServiceChat`}>Messages</Link>
                </Menu.Item>
              </SubMenu> */}
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
                    color={whiteLabel.dangerColor}
                    className="sideMenuIcon"
                  />
                }
                onClick={logoutHandler}
                style={{ alignSelf: "end", bottom: 0 }}>
                <span style={{ color: whiteLabel.dangerColor }}>Log Out</span>
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
