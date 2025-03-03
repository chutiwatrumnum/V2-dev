import { Button, Col, DatePicker, DatePickerProps, Row, Table } from "antd";
import Header from "../../../components/common/Header";
import { useBillPaymentChartListQuery, useBillPaymentDashboardListQuery } from "../hooks";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { ColumnsType } from "antd/es/table";
import { billPaymentDashboardDataType } from "../../../stores/interfaces/Payment";
import { PaymentColumnChart, PaymentPieChart } from "../components/paymentchart";
const scroll: { x?: number | string } = {
    x: "100vw",
};
const colorPieChartStatusMonth: string[] = ["#c50001", "#feb009", "#00a526"];
const dateFormat = "MMMM,YYYY";
const customFormat: DatePickerProps["format"] = (value) => `Month : ${value.format(dateFormat)}`;
const paymentChart: React.FC = () => {
    const { accessibility } = useSelector((state: RootState) => state.common);
    const [CurrentPage, setCurrentPage] = useState<number>(1);
    const [startMonth, setstartMonth] = useState<string | null>(null);
    const [endMonth, setendMonth] = useState<string | null>(null);
    const { data } = useBillPaymentChartListQuery();
    const { data: billPaymentDashboard, isLoading, refetch } = useBillPaymentDashboardListQuery({ startMonth: startMonth, endMonth: endMonth });
    const handleMonth = async (e: any) => {
        setstartMonth(e ? dayjs(e[0]).startOf("month").format("YYYY-MM") : null);
        setendMonth(e ? dayjs(e[1]).endOf("month").format("YYYY-MM") : null);
    };
    const pageSizeOptions = [10, 20, 60, 100];
    const PaginationConfig = {
        defaultPageSize: pageSizeOptions[0],
        pageSizeOptions: pageSizeOptions,
        current: CurrentPage,
        showSizeChanger: false,
        total: 10,
    };
    const columns: ColumnsType<billPaymentDashboardDataType> = [
        {
            title: "Date",
            dataIndex: "date",
            align: "center",
        },
        {
            title: "Total Invoice Bill",
            dataIndex: "totalBill",
            align: "right",
        },

        {
            title: "Total Amount Water",
            dataIndex: "waterBillAmount",
            align: "right",
        },
        {
            title: "Total Amount Electricity",
            dataIndex: "electricityBillAmount",
            align: "right",
        },
        {
            title: "Total Amount Maintenance Fee",
            dataIndex: "maintenanceFeeAmount",
            align: "right",
        },
        {
            title: "Received Amount",
            dataIndex: "receivedAmount",
            align: "right",
        },
    ];

    useEffect(() => {
        (async function () {
            await refetch();
        })();
    }, [startMonth, endMonth]);

    return (
        <>
            <Header title="Payment Summary Dashboard" />
            <Row>
                <Col span={12}>
                    <PaymentPieChart data={data?.billGroupByYearly} color={colorPieChartStatusMonth} />
                </Col>
                <Col span={12}>
                    <PaymentColumnChart data={data?.billGroupByYearly} color={colorPieChartStatusMonth} />
                </Col>
            </Row>
            <div className="paymentTopActionGroup"></div>
            <div className="paymentTopActionLeftGroup" style={{ marginTop: 15, marginBottom: 15 }}>
                <Col span={6}>
                    <DatePicker.RangePicker onChange={handleMonth} style={{ width: "95%" }} picker="month" format={customFormat} />
                </Col>

                <Col span={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        shape="round"
                        type="primary"
                        // onClick={async () => {
                        //     await setIsModalCreate(true);
                        // }}
                        disabled={!accessibility?.menu_resident_information.allowEdit}
                    >
                        export
                    </Button>
                </Col>
            </div>
            <Row>
                <Col span={24}>
                    <Table
                        columns={columns}
                        pagination={PaginationConfig}
                        dataSource={billPaymentDashboard?.dataBillPaymentDashboardList}
                        loading={isLoading}
                        // onChange={onChangeTable}
                        scroll={scroll}
                    />
                </Col>
            </Row>
        </>
    );
};
export default paymentChart;
