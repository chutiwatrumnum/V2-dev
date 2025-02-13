import { createModel } from "@rematch/core";
import { HistoryVisitorType, conditionPage, HistoryVisitorDataType } from "../interfaces/historyVisitor";
import { RootModel } from "./index";
import { getDataManagement } from "../../modules/management/service/api/ManagementServiceAPI";
import dayjs from "dayjs";
export const historyVisitor = createModel<RootModel>()({
    state: {
        tableData: [],
        loading: false,
        total: 0,
        residentMaxLength: 0,
    } as HistoryVisitorType,
    reducers: {
        updateloadingDataState: (state, payload) => ({
            ...state,
            loading: payload,
        }),
        updatetotalgDataState: (state, payload) => ({
            ...state,
            total: payload,
        }),
        updateTableDataState: (state, payload) => ({
            ...state,
            tableData: payload,
        }),
        updateAnnouncementMaxLengthState: (state, payload) => ({
            ...state,
            residentMaxLength: payload,
        }),
    },
    effects: (dispatch) => ({
        async getTableData(payload: conditionPage) {
            dispatch.historyVisitor.updateloadingDataState(true);
            dispatch.historyVisitor.updateTableDataState(mockData);
            dispatch.historyVisitor.updatetotalgDataState(mockData.length);
            dispatch.historyVisitor.updateloadingDataState(false);
            return;
            const data: any = await getDataManagement(payload);
            if (data?.status) {
                dispatch.historyVisitor.updateTableDataState(data.data);
                dispatch.historyVisitor.updatetotalgDataState(data.total);
                dispatch.historyVisitor.updateloadingDataState(false);
            } else {
                dispatch.historyVisitor.updateloadingDataState(false);
            }
        },
    }),
});

const mockData: HistoryVisitorDataType[] = [
    {
      key: "1",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: "-",
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: true,
      checkInType: "รอดําเนินการ",
      checkInIsActiveButton: true,
      checkOutIsActiveButton: false,
      inverterType: "Whitelist",
      appointmentDay: "-"
    },
    {
      key: "2",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: "-",
      status: "แสตมป์แล้ว",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "รอดําเนินการ",
      checkInIsActiveButton: true,
      checkOutIsActiveButton: false,
      inverterType: "Blacklist",
      appointmentDay: "-"
    },
    {
      key: "3",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ออกจากโครงการแล้ว",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "4",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "5",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "6",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "7",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "8",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "9",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
    {
      key: "10",
      idCard: "123456789012345678",
      licensePlate: "123456",
      homeAddress: "123",
      checkIn: dayjs().format("DD/MM/YYYY HH:mm"),
      checkOut: dayjs().add(1, "hour").format("DD/MM/YYYY HH:mm"),
      status: "ยังไม่ได้รับการแสตมป์",
      fullName: "เทส เทส",
      IsActiveButton: false,
      checkInType: "อยู่ในโครงการ",
      checkInIsActiveButton: false,
      checkOutIsActiveButton: false,
      inverterType: "Visitor",
      appointmentDay: "-"
    },
];
