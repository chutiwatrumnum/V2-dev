export interface NearByTableDataType {
  tableData: DataNearByTableDataType[];
  NearByMaxLength: number;
  selectList: NearBySelectListType[];
}
export interface DataNearByTableDataType {
  id:          number;
  image:       string;
  typeId:      number;
  name:        string;
  tel:         string;
  address:     string;
  description: string;
  note:        string;
  open:        string;
  close:       string;
  lat:         number;
  long:        number;
}
export interface NearByPayloadType {
  search: string | null;
  curPage: number;
  perPage: number;
  filterByTypeId:string|null
}

export interface NearBySelectListType {
  label: string;
  value: string|null;
}

export interface DataNearByCreateByType {
  id?:          number;
  image?:       string|null;
  typeId:      number|string;
  name:        string;
  tel:         string;
  open:        string;
  close:       string;
  address?:     string;
  description?: string;
  note?:        string;
  lat?:         number|string;
  long?:        number|string;
  facebookPageId?: string;
  email?:          string;
  instagram?:      string;
  line?:           string;
  website?:        string;
}