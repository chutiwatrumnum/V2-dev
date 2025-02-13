export interface ServiceCenterSelectListType {
  label: string;
  key: string | null;
}
export interface ServiceCenterPayloadType {
  search: string | null;
  curPage: number;
  perPage: number;
  status: string | null;
}
export interface ServiceCenterDataType {
  id: number;
  description: string;
  fullname: string;
  serviceTypeName: string;
  statusName: string;
  roomAddress: string;
  actionDate: null;
  completedDate: null;
  acknowledgeDate: null;
  cause: null;
  solution: null;
  tel: string;
  createdAt: Date;
  status: ServiceType;
  createdBy: CreatedBy;
  unit: Unit;
  serviceType: ServiceType;
  imageItems: ImageItem[];
}

export interface CreatedBy {
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface ImageItem {
  imageUrl: string;
  imageStatus: ServiceType;
}

export interface ServiceType {
  nameCode: string;
  nameEn: string;
}

export interface Unit {
  unitNo: string;
  roomAddress: string;
  floor: number;
}