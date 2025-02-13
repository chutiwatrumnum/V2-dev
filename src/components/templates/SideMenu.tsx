import { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";
import { APP_VERSION } from "../../configs/configs";
import { whiteLabel } from "../../configs/theme";
import ConfirmModal from "../../components/common/ConfirmModal";
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
import MENU_LOGO from "../../assets/images/logo.svg";

import "../styles/sideMenu.css";
import { socket } from "../../configs/socket";

//antd constraints components
const { SubMenu } = Menu;
const main_link = "/dashboard";
// const path = window.location.pathname.split("/");

const SideMenu = () => {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [keyPath, setKeyPath] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
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
    <>
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
              openKeys={openKeys}
            >
              <Menu.Item
                key={`${main_link}/profile`}
                icon={
                  <ProfileIcon
                    color={iconMenuColorSelector(`profile`)}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/profile`}>Profile</Link>
              </Menu.Item>

              <Menu.Item
                key={`${main_link}/managementMain`}
                icon={
                  <ManagementIcon
                    color={iconMenuColorSelector("managementMain")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/managementMain`}>Management Team</Link>
              </Menu.Item>

              {/* User management */}

              <SubMenu
                key="userManagement"
                icon={
                  <UserManagementIcon
                    color={iconMenuColorSelector("userManagement")}
                    className="sideMenuIcon"
                  />
                }
                title="User management"
              >
                <Menu.Item
                  key={`${main_link}/residentInformation`}
                  icon={
                    <ResidentManagementIcon
                      color={iconSubMenuColorSelector("residentInformation")}
                      className="sideMenuIcon"
                    />
                  }
                >
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
                  }
                >
                  <Link to={`${main_link}/residentSignUp`}>
                    Resident’s Sign up
                  </Link>
                </Menu.Item>
              </SubMenu>

              {/* Facility Center */}

              <SubMenu
                key="facilities"
                icon={
                  <FacilityBookingIcon
                    color={iconMenuColorSelector("facilities")}
                    className="sideMenuIcon"
                  />
                }
                title="Reservation Lists"
              >
                <Menu.Item
                  key={`${main_link}/reservationDashboard`}
                  icon={
                    <ReservationDashboardIcon
                      color={iconSubMenuColorSelector("reservationDashboard")}
                      className="sideMenuIcon"
                    />
                  }
                >
                  <Link to={`${main_link}/reservedFacilities`}>Facilities</Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/reservationList`}
                  icon={
                    <ReservationListIcon
                      color={iconSubMenuColorSelector("reservationList")}
                      className="sideMenuIcon"
                    />
                  }
                >
                  <Link to={`${main_link}/reservationList`}>
                    Reservation Lists
                  </Link>
                </Menu.Item>
              </SubMenu>

              <Menu.Item
                key={`${main_link}/announcement`}
                icon={
                  <AnnouncementIcon
                    color={iconMenuColorSelector("announcement")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/announcement`}>Announcement</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}/emergencyCall`}
                icon={
                  <EmergencyIcon
                    color={iconMenuColorSelector("emergencyCall")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/emergencyCall`}>Emergency Call</Link>
              </Menu.Item>

              <Menu.Item
                key={`${main_link}/nearbyService`}
                icon={
                  <NearbyIcon
                    color={iconMenuColorSelector("nearbyService")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/nearbyService`}>Nearby Service</Link>
              </Menu.Item>

              {/* User management */}

              <Menu.Item
                key={`${main_link}/chatRoom`}
                icon={
                  <ChatIcon
                    color={iconMenuColorSelector("chatRoom")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link
                  to={`${main_link}/chatRoom`}
                  onClick={() => {
                    socket.connect();
                  }}
                >
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
                title="Service Center"
              >
                <Menu.Item
                  key={`${main_link}/serviceDashboard`}
                  icon={
                    <ServiceCenterDashboardIcon
                      color={iconSubMenuColorSelector("serviceDashboard")}
                      className="sideMenuIcon"
                    />
                  }
                >
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
                  }
                >
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
                  }
                >
                  <Link to={`${main_link}/ServiceChat`}>Messages</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
          <div>
            <Menu
              style={{ marginBottom: "auto" }}
              mode="inline"
              selectable={false}
            >
              <Menu.Item
                key="auth"
                icon={
                  <LogOutIcon
                    color={whiteLabel.dangerColor}
                    className="sideMenuIcon"
                  />
                }
                onClick={logoutHandler}
                style={{ alignSelf: "end", bottom: 0 }}
              >
                <span style={{ color: whiteLabel.dangerColor }}>Log Out</span>
              </Menu.Item>
              <div className="textVersion">version {APP_VERSION}</div>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
