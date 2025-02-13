import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Badge, Menu, Modal, Col, Row, ConfigProvider, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/sidermenu.css";
import { encryptStorage } from "../../utils/encryptStorage";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";

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
import { APP_VERSION } from "../../configuration/configs";

//antd constraints components
const { SubMenu } = Menu;
const { confirm } = Modal;
const { Text } = Typography;
const main_link = "/dashboard";
let path = window.location.pathname.split("/");

const NewSideMenu = () => {
  const { accessibility } = useSelector((state: RootState) => state.common);
  const { refresh } = useSelector((state: RootState) => state.document);
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const userData = encryptStorage.getItem("userData");
  const [openKeys, setOpenKeys] = useState([path[2]]);
  const [activeKeys, setActiveKeys] = useState(window.location.pathname);

  const rootSubmenuKeys = ["facilities"];

  const onOpenChange = (keys: any) => {
    const latestOpenKey = keys.find((key: any) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const logoutHandler = () => {
    confirm({
      title: "Confirm action",
      icon: null,
      content: "Are you sure you want to log out?",
      okText: "Yes",
      className: "confirmStyle",
      bodyStyle: {
        textAlign: "center",
      },
      okType: "primary",
      cancelText: "Cancel",
      centered: true,

      async onOk() {
        await dispatch.userAuth.onLogout();
        navigate("/auth", { replace: true });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <React.Fragment>
      <div className="side-menu">
        <div className="menu-logo">
          <img className="menu-logo-image" src={MENU_LOGO} alt="menu-logo" />
          <p className="powerBy">Powered By Artani</p>
        </div>
        <div className="menu-group">
          <Menu
            defaultSelectedKeys={[window.location.pathname]}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            onClick={(k) => {
              setActiveKeys(k.key);
            }}
            mode="inline"
            style={{ background: "none" }}
          >
            <Menu.Item
              key="management"
              style={{ paddingTop: 30, paddingBottom: 30 }}
              disabled={!accessibility?.menu_mcst.available}
            >
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
                }
              >
                <Row>
                  <Col
                    span={5}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
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
                    }}
                  >
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
              icon={<img src={MONITORING_ICON} alt="Monitoring" />}
              title="Monitoring (Summary)"
              // disabled={true}
              // style={{ display: "none" }}
            >
              <Menu.Item
                key={`${main_link}/summary`}
                icon={<img src={SUMARY_ICON} alt="Summary" />}
              >
                <Link to={`${main_link}/summary`}>Summary</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}/event-view`}
                icon={<img src={EVENT_VIEW_ICON} alt="Event view" />}
              >
                <Link to={`${main_link}/event-view`}>Event view</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="Building calendar"
              icon={<img src={CALENDAR_ICON} alt="Building calendar" />}
              title="Building calendar"
              // disabled={true}
              // style={{ display: "none" }}
            >
              <Menu.Item
                key={`${main_link}3`}
                icon={<img src={EVENT_VIEW_ICON} alt="Calendar" />}
              >
                <Link to={`${main_link}/building-calendar`}>Calendar</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}`}
                icon={<img src={BUILDING_ICON} alt="Building activities" />}
              >
                <Link to={`${main_link}/building-activities`}>
                  Building activities
                </Link>
              </Menu.Item>
            </SubMenu>
            <div className={"group-name"}>Facilities management</div>
            <SubMenu
              key="facilities"
              icon={<img src={FACILITIES_ICON} alt="facilities" />}
              title="Facilities"
            >
              <Menu.Item
                key={`${main_link}5`}
                icon={<img src={OUR_FACILITY_ICON} alt="ourFacility" />}
              >
                <Link to={`${main_link}/our-facilities`}>Our facilities</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}6`}
                icon={<img src={FACILITY_LOG_ICON} alt="facilityLog" />}
              >
                <Link to={`${main_link}/facilities-booking-logs`}>
                  Facilities booking logs
                </Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}7`}
                icon={<img src={RESERVE_FACILITY_ICON} alt="reserveFacility" />}
              >
                <Link to={`${main_link}/reserve-facility`}>
                  Reserve facility
                </Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}8`}
                icon={<img src={PEOPLE_COUNTING_ICON} alt="peopleCounting" />}
                style={{ display: "none" }}
              >
                <Link to={`${main_link}/people-counting`}>People counting</Link>
              </Menu.Item>
            </SubMenu>
            <div className={"group-name"}>Notice</div>
            <Menu.Item
              onClick={() => setOpenKeys([])}
              key={`${main_link}/announcement`}
              icon={<img src={ANNOUNCEMENT_ICON} alt="announcement" />}
            >
              <Link to={`${main_link}/announcement`}>Announcement</Link>
            </Menu.Item>
            <SubMenu
              key="event"
              icon={<img src={EVENT_ICON} alt="event" />}
              title="Event"
            >
              <Menu.Item
                key={`${main_link}9`}
                icon={<img src={EVENT_LOGS_ICON} alt="Event logs" />}
              >
                <Link to={`${main_link}/event-logs`}>Event logs</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}10`}
                icon={
                  <img src={EVENT_JOIN_LOGS_ICON} alt="Event joining logs" />
                }
              >
                <Link to={`${main_link}/event-joining-logs`}>
                  Event joining logs
                </Link>
              </Menu.Item>
            </SubMenu>
            <div className={"group-name"}>Document</div>
            <SubMenu
              key="Document / forms"
              icon={<img src={DOCUMENT_FORMS_ICON} alt="Document / forms" />}
              title="Document / forms"
            >
              <Menu.Item
                key={`${main_link}11`}
                icon={<img src={PUBLIC_FOLDER_ICON} alt="Public folder" />}
              >
                <Link to={`${main_link}/public-folder`}>Public folder</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}12`}
                icon={<img src={PERSONAL_FOLDER_ICON} alt="Personal folder" />}
              >
                <Link to={`${main_link}/personal-folder`}>Personal folder</Link>
              </Menu.Item>
            </SubMenu>
            <div className={"group-name"}>Visitor management</div>
            <Menu.Item
              key={`${main_link}13`}
              icon={
                <img
                  src={VISITOR_MANAGEMENT_LOGS_ICON}
                  alt="Visitor management logs"
                />
              }
            >
              <Link to={`${main_link}/visitor-management-log`}>
                Visitor management log
              </Link>
            </Menu.Item>
            <div className={"group-name"}>User management</div>
            <Menu.Item
              key={`${main_link}14`}
              icon={
                <img
                  src={RESERVE_INFORMATION_ICON}
                  alt="Resident’s information"
                />
              }
            >
              <Link to={`${main_link}/resident-information`}>
                Resident’s information
              </Link>
            </Menu.Item>
            <Menu.Item
              key={`${main_link}15`}
              icon={<img src={RESERVE_SINGUP_ICON} alt="Resident’s sign up" />}
            >
              <Link to={`${main_link}/resident-sign-up`}>
                Resident’s sign up
              </Link>
            </Menu.Item>
            <Menu.Item
              key={`${main_link}16`}
              icon={<img src={DELIVERY_LOGS_ICON} alt="Delivery logs" />}
              disabled={true}
              style={{ display: "none" }}
            >
              <Link to={`${main_link}/delivery-logs`}>Delivery logs</Link>
            </Menu.Item>
            <div className={"group-name"}>Setting</div>
            <Menu.Item
              key="auth"
              icon={<img src={LOG_OUT_ICON} alt="Log out" />}
              onClick={logoutHandler}
            >
              <Text className="logout">Log out</Text>
            </Menu.Item>
            <div className="text-version">version {APP_VERSION}</div>
          </Menu>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewSideMenu;
