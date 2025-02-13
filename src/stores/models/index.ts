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
import { buildingCalendar } from "./BuildingCalendarModel";
import { building } from "./buidingtModel";
import { summary } from "./SummaryModel";
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
  buildingCalendar: typeof buildingCalendar;
  building: typeof building;
  summary: typeof summary;
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
  buildingCalendar,
  building,
  summary,
};
