export interface CommonType {
  successModal: { open: boolean; text: string };
  confirmModal: ConfirmModalType;
  unitOptions: { label: string; value: number }[];
  accessibility?: AccessibilityType;
  unitFilter?: number;
  masterData?: MasterDataType;
  monitorData?: {
    totalUserRegistered: RegisteredVisitorType[];
    totalFacilitiesBooking: TotalNoOfBookingType[];
    totalEventBooking: TotalEventType[];
  };
  loading: boolean;
}

export interface AccessibilityType {
  menu_monitoring_summary: MenuItemAccessibilityType;
  menu_monitoring_event: MenuItemAccessibilityType;
  menu_building_calendar: MenuItemAccessibilityType;
  menu_building_activities: MenuItemAccessibilityType;
  menu_our_facility: MenuItemAccessibilityType;
  menu_facility_log: MenuItemAccessibilityType;
  menu_reserve_facility: MenuItemAccessibilityType;
  menu_people_counting: MenuItemAccessibilityType;
  menu_event_log: MenuItemAccessibilityType;
  menu_event_joining: MenuItemAccessibilityType;
  menu_document_form_management: MenuItemAccessibilityType;
  menu_vms_facility: MenuItemAccessibilityType;
  menu_vms_event: MenuItemAccessibilityType;
  menu_resident_information: MenuItemAccessibilityType;
  menu_resident_sign_up: MenuItemAccessibilityType;
  menu_delivery_management: MenuItemAccessibilityType;
  menu_mcst: MenuItemAccessibilityType;
  menu_announcement_management: MenuItemAccessibilityType;
  team_user_profile: MenuItemAccessibilityType;
  team_user_management: MenuItemAccessibilityType;
  team_facility_management: MenuItemAccessibilityType;
  team_announcement: MenuItemAccessibilityType;
  team_team_management: MenuItemAccessibilityType;
}
export interface MenuItemAccessibilityType {
  permissionCode: string;
  permissionName: string;
  allowAdd:       boolean;
  allowView:      boolean;
  allowDelete:    boolean;
  allowEdit:      boolean;
}
export interface ConfirmModalType {
  open: boolean;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  loading: boolean;
  onConfirm: Function;
  onConfirmParams?: any | null | undefined;
}

export interface MasterDataType {
  roles: RoleType[];
  roleSize: number;
  blocks: BlockType[];
  blocksSize: number;
  hobbyList: HobbyListType[];
  calendarType: CalendarType[];
  calendarTypeSize: number;
}

export interface RoleType {
  id: number;
  name: string;
  roleCode: string;
}

export interface BlockType {
  id: number;
  active: boolean;
  blockNo: string;
  unit: UnitType[];
}

export interface UnitType {
  id: number;
  active: boolean;
  unitNo: string;
  blockId: number;
  totalSizePrivateDoc: string;
}

export interface HobbyListType {
  id: number;
  nameTh: string;
  nameEn: string;
  description: string;
  active: boolean;
}

export interface CalendarType {
  id: number;
  name: string;
  active: boolean;
  colorCode: string;
  priority: number;
}

export interface TotalNoOfBookingType {
  roomName: string;
  total: number;
}

export interface RegisteredVisitorType {
  month: string;
  total: number;
}

export interface TotalEventType {
  month: string;
  total: number;
}
