import { useLayoutEffect } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { encryptStorage } from "./utils/encryptStorage";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "./stores";
import { Spin } from "antd";

import "antd/dist/reset.css";
import "./App.css";

// layouts
import UnauthorizedLayout from "./navigation/UnauthorizedLayout";
import AuthorizedLayout from "./navigation/AuthorizedLayout";

// authorize routes
import AnnouncementMain from "./modules/announcement/screen/AnnouncementMain";

import ReservedFacilities from "./modules/facilities/screen/ReservedFacilities";
import ReservationList from "./modules/facilities/screen/ReservationList";

import ManagementMain from "./modules/management/screen/ManagementMain";

import VisitorManagementLog from "./modules/vistorManagement/screen/VisitorManagementLog";

import ResidentSignUp from "./modules/residentInformation/screen/ResidentSignUp";
import ResidentInformation from "./modules/residentInformation/screen/ResidentInformationMain";
import PaymentDashboard from "./modules/payment/screen/PaymentDashboard";

import PublicFolder from "./modules/documentForms/screen/PublicFolder";
import PersonalFolder from "./modules/documentForms/screen/PersonalFolder";

import EventLogs from "./modules/eventLogs/screen/EventLogs";
import EventJoinLogs from "./modules/eventLogs/screen/EventJoinLogs";

// import DeliveryLogs from "./modules/deliveryLogs/screen/deliveryLogs";
import EventView from "./modules/monitoring/screen/EventView";
import Summary from "./modules/monitoring/screen/Summary";

// import PeopleCounting from "./modules/facilities/screen/PeopleCounting";

// unauthorize routes
import SignInScreen from "./modules/main/SignInScreen";
import RecoveryScreen from "./modules/main/RecoveryScreen";
import ResetPassword from "./modules/main/ResetPassword";
import ResetLandingScreen from "./modules/main/ResetLandingScreen";

// tv slide show
// import TVSlideShow from "./modules/tv/screens/TVSlideShow";

// components
import SuccessModal from "./components/common/SuccessModal";
import ConfirmModal from "./components/common/ConfirmModal";

function App() {
    const dispatch = useDispatch<Dispatch>();
    const { isAuth } = useSelector((state: RootState) => state.userAuth);
    const { loading } = useSelector((state: RootState) => state.common);

    useLayoutEffect(() => {
        (async () => {
            try {
                // Check Access token
                dispatch.common.updateLoading(true);
                const accessToken = await encryptStorage.getItem("accessToken");
                if (accessToken === null || accessToken === undefined || accessToken === "") throw "accessToken not found";
                // Check Refresh token
                const resReToken = await dispatch.userAuth.refreshTokenNew();
                if (!resReToken) throw "accessToken expired";
                // Token pass
                await dispatch.common.getUnitOptions();
                await dispatch.common.getMasterData();
                await dispatch.userAuth.refreshUserDataEffects();
                await dispatch.common.getRoleAccessToken();
                dispatch.userAuth.updateAuthState(true);
                dispatch.common.updateLoading(false);
                return true;
            } catch (e) {
                dispatch.userAuth.updateAuthState(false);
                dispatch.common.updateLoading(false);
                return false;
            }
        })();
    }, [isAuth]);

    return (
        <BrowserRouter>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        height: "100vh",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Spin size="large" />
                    {/* <p style={{ marginTop: 10 }}>Loading...</p> */}
                </div>
            ) : (
                <Routes>
                    {/* unauthorized_route */}
                    <Route element={<UnauthorizedLayout />}>
                        <Route index path="/auth" element={<SignInScreen />} />
                        <Route index path="/recovery" element={<RecoveryScreen />} />
                        <Route index path="/forgot-password/:token" element={<ResetPassword />} />
                        <Route index path="/landing-screen" element={<ResetLandingScreen />} />
                    </Route>
                    {/* authorized_route */}
                    <Route path="dashboard" element={<AuthorizedLayout />}>
                        <Route index path="summary" element={<Summary />} />
                        <Route path="management" element={<ManagementMain />} />

                        {/* Facility */}
                        <Route path="reservedFacilities" element={<ReservedFacilities />} />
                        <Route path="reservationList" element={<ReservationList />} />
                        <Route path="visitor-management-log" element={<VisitorManagementLog />} />
                        <Route path="announcement" element={<AnnouncementMain />} />
                        <Route index path="resident-information" element={<ResidentInformation />} />
                        <Route index path="payment-dashboard" element={<PaymentDashboard />} />
                        <Route path="resident-sign-up" element={<ResidentSignUp />} />
                        <Route path="public-folder" element={<PublicFolder />} />
                        <Route path="personal-folder" element={<PersonalFolder />} />
                        <Route path="event-logs" element={<EventLogs />} />
                        <Route path="event-joining-logs" element={<EventJoinLogs />} />
                        <Route path="event-view" element={<EventView />} />
                        {/* <Route path="people-counting" element={<PeopleCounting />} /> */}
                    </Route>
                    <Route path="*" element={<Navigate to="/auth" />} />
                    {/* <Route path="tv-podcast" element={<TVSlideShow />} /> */}
                </Routes>
            )}
            <SuccessModal />
            <ConfirmModal />
        </BrowserRouter>
    );
}
export default App;
