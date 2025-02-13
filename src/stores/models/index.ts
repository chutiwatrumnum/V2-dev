import { Models } from "@rematch/core";
import { userAuth } from "./UserAuthModel";
import { common } from "./CommonModel";
import { announcement } from "./Announcement";
import { facilities } from "./FacilitieModel";
import { MCST } from "./MCSTModel";
import { resident } from "./residentModel";
import { peopleCounting } from "./PeopleCounting";
import { powerManagement } from "./PowerManagement";
import { historyVisitor } from "./historyVisitorModel";
import { eventLog } from "./eventLogs";
import { chat } from "./ChatModel";
import { nearBy } from "./NearBy";
import { emergency } from "./EmergencyModel";
import { serviceCenter } from "./ServiceCenterModel";
export interface RootModel extends Models<RootModel> {
  userAuth: typeof userAuth;
  common: typeof common;
  announcement: typeof announcement;
  facilities: typeof facilities;
  MCST: typeof MCST;
  resident: typeof resident;
  peopleCounting: typeof peopleCounting;
  powerManagement: typeof powerManagement;
  historyVisitor: typeof historyVisitor;
  eventLog: typeof eventLog;
  chat: typeof chat;
  nearBy: typeof nearBy;
  emergency: typeof emergency;
  serviceCenter: typeof serviceCenter;
}
export const models: RootModel = {
  userAuth,
  common,
  announcement,
  facilities,
  MCST,
  resident,
  peopleCounting,
  powerManagement,
  historyVisitor,
  eventLog,
  chat,
  nearBy,
  emergency,
  serviceCenter,
};
