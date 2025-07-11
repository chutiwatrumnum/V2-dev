import { Models } from "@rematch/core";
import { userAuth } from "./UserAuthModel";
import { announcement } from "./AnnouncementModel";
import { resident } from "./residentModel";
import { common } from "./CommonModel";
import { visitor } from "./visitorModel";
import { facilities } from "./FacilitieModel";
import { MCST } from "./MCSTModel";
import { document } from "./DocumentFormsModel";
import { eventLog } from "./eventLogs";
import { deliveryLogs } from "./DeliveryLogsModel";
import { summary } from "./SummaryModel";
import { peopleCounting } from "./PeopleCounting";
import { serviceCenter } from "./ServiceCenterModel";
import { chat } from "./ChatModel";
export interface RootModel extends Models<RootModel> {
  userAuth: typeof userAuth;
  announcement: typeof announcement;
  resident: typeof resident;
  common: typeof common;
  facilities: typeof facilities;
  MCST: typeof MCST;
  visitor: typeof visitor;
  document: typeof document;
  eventLog: typeof eventLog;
  deliveryLogs: typeof deliveryLogs;
  summary: typeof summary;
  peopleCounting: typeof peopleCounting;
  serviceCenter: typeof serviceCenter;
  chat: typeof chat;
}
export const models: RootModel = {
  userAuth,
  announcement,
  resident,
  common,
  facilities,
  MCST,
  visitor,
  document,
  eventLog,
  deliveryLogs,
  summary,
  peopleCounting,
  serviceCenter,
  chat,
};