import { useLayoutEffect } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { encryptStorage } from "./utils/encryptStorage";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "./stores";

import "antd/dist/reset.css";
import "./App.css";

// layouts
import UnauthorizedLayout from "./navigation/UnauthorizedLayout";
import AuthorizedLayout from "./navigation/AuthorizedLayout";

// authorize routes
import SummaryDashboard from "./modules/summary/screens/Summary";
import Announcement from "./modules/announcement/screens/Announcement";
import Emergency from "./modules/emergency/screens/Emergency";
import NearbyService from "./modules/nearbyService/screens/NearbyService";
import ServiceDashboard from "./modules/serviceCenter/screens/ServiceDashboard";
import ServiceCenterLists from "./modules/serviceCenter/screens/ServiceCenterLists";
import ServiceChat from "./modules/serviceCenter/screens/ServiceChat";

import PeopleCountingMain from "./modules/peopleCounting/screens/PeopleCountingMain";
import ManagementMain from "./modules/management/screens/ManagementMain";
import ResidentInformationMain from "./modules/userManagement/screens/ResidentInformationMain";
import ResidentSignUp from "./modules/userManagement/screens/ResidentSignUp";

import ReservedFacilities from "./modules/facilities/screen/ReservedFacilities";
import ReservationList from "./modules/facilities/screen/ReservationList";

import EventLogs from "./modules/eventLogs/screen/EventLogs";
import EventJoinLogs from "./modules/eventLogs/screen/EventJoinLogs";

import ChangePassword from "./modules/setting/screens/ChangePassword";
import Profile from "./modules/setting/screens/Profile";
import AdminManagement from "./modules/setting/screens/AdminManagement";

import AreaControl from "./modules/powerManagement/screens/AreaControl";
import DeviceControl from "./modules/powerManagement/screens/DeviceControl";

import ChatRoomScreen from "./modules/chat/screens/ChatRoomScreen";

// unauthorize routes
import SignInScreen from "./modules/main/SignInScreen";
import RecoveryScreen from "./modules/main/RecoveryScreen";
import ResetPassword from "./modules/main/ResetPassword";
import SuccessResetScreen from "./modules/main/SuccessResetScreen";
import HistoryVisitor from "./modules/HistoryVisitor/screens/historyVisitor";
import CheckInVisitor from "./modules/HistoryVisitor/screens/checkInVisitor";
import CheckOutVisitor from "./modules/HistoryVisitor/screens/checkOutVisitor";
// components

function App() {
  const dispatch = useDispatch<Dispatch>();
  const { isAuth } = useSelector((state: RootState) => state.userAuth);

  useLayoutEffect(() => {
    (async () => {
      try {
        // Check Access token
        const accessToken = await encryptStorage.getItem("accessToken");
        if (
          accessToken === null ||
          accessToken === undefined ||
          accessToken === ""
        )
          throw "accessToken not found";
        // Check Refresh token
        const resReToken = await dispatch.userAuth.refreshTokenNew();
        if (!resReToken) throw "accessToken expired";
        await dispatch.common.getRoleAccessToken();
        await dispatch.common.getUnitOptions();
        dispatch.userAuth.updateAuthState(true);
        return true;
      } catch (e) {
        dispatch.userAuth.updateAuthState(false);
        return false;
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* unauthorized_route */}
        <Route element={<UnauthorizedLayout />}>
          <Route index path="/auth" element={<SignInScreen />} />
          <Route path="/recovery" element={<RecoveryScreen />} />
          <Route path="/forgot-password/:token" element={<ResetPassword />} />
          <Route path="/success-reset" element={<SuccessResetScreen />} />
        </Route>
        {/* authorized_route */}
        <Route path="dashboard" element={<AuthorizedLayout />}>
          <Route index path="summary" element={<SummaryDashboard />} />
          {/* Facility */}
          <Route path="reservedFacilities" element={<ReservedFacilities />} />
          <Route path="reservationList" element={<ReservationList />} />
          <Route path="peopleCounting" element={<PeopleCountingMain />} />
          {/* Fixing report */}
          <Route path="serviceCenterMessages" element={<SummaryDashboard />} />
          <Route path="emergencyContact" element={<SummaryDashboard />} />
          {/* Building progress */}
          <Route
            path="buildingProgressDashboard"
            element={<SummaryDashboard />}
          />
          <Route path="checkInVisitor" element={<CheckInVisitor />} />
          <Route path="checkOutVisitor" element={<CheckOutVisitor />} />
          <Route path="historyVisitor" element={<HistoryVisitor />} />
          <Route path="managementMain" element={<ManagementMain />} />
          <Route
            path="residentInformation"
            element={<ResidentInformationMain />}
          />
          <Route path="residentSignUp" element={<ResidentSignUp />} />
          <Route path="parcelAlert" element={<SummaryDashboard />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="emergencyCall" element={<Emergency />} />
          <Route path="serviceDashboard" element={<ServiceDashboard />} />
          <Route path="serviceCenterLists" element={<ServiceCenterLists />} />
          <Route path="serviceChat" element={<ServiceChat />} />
          <Route path="nearbyService" element={<NearbyService />} />
          <Route path="payment" element={<SummaryDashboard />} />
          <Route path="chatRoom" element={<ChatRoomScreen />} />
          <Route path="smartMailbox" element={<SummaryDashboard />} />
          <Route path="securityCenter" element={<SummaryDashboard />} />
          {/* User management */}
          <Route path="residentManagement" element={<SummaryDashboard />} />
          <Route path="registration" element={<SummaryDashboard />} />
          <Route path="roomManagement" element={<SummaryDashboard />} />
          {/* Setting */}
          <Route path="profile" element={<Profile />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="adminManagement" element={<AdminManagement />} />
          {/* Device control */}
          <Route path="areaControl" element={<AreaControl />} />
          <Route path="deviceControl" element={<DeviceControl />} />
          {/* Event-logs */}
          <Route path="event-logs" element={<EventLogs />} />
          <Route path="event-joining-logs" element={<EventJoinLogs />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
