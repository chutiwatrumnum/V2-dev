import { Column, Pie, PieConfig } from "@ant-design/plots";
import { paymentStatusMonthly } from "../../../stores/interfaces/Payment";

interface paymentPieChartProps {
    data: paymentStatusMonthly[];
    color: string[];
}
interface paymentColumnChartProps {
    data: paymentStatusMonthly[];
    color: string[];
}
const PaymentPieChart = ({ data, color }: paymentPieChartProps) => {
    const config: PieConfig = {
        data,
        angleField: "total",
        colorField: "month",
        innerRadius: 0.6,
        color: color,
        legend: {
            color: {
                title: false,
                position: "right",
                rowPadding: 5,
            },
        },
        annotations: [
            //   {
            //     type: 'text',
            //     style: {
            //       text: 'AntV\nCharts',
            //       x: '50%',
            //       y: '50%',
            //       textAlign: 'center',
            //       fontSize: 40,
            //       fontStyle: 'bold',
            //     },
            //   },
        ],
    };
    return <Pie {...config} />;
};
const PaymentColumnChart = ({ data,color }: paymentColumnChartProps) => {
    const config = {
        data,
        xField: "month",
        yField: "total",
        colorField: "month",
        color: color,
        label: {
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            month: {
                alias: "month",
            },
            total: {
                alias: "total",
            },
        },
    };
    return <Column columnStyle={{ fill: "#E7BF4D" }} style={{ maxHeight: 350 }} {...config} />;
};
export { PaymentPieChart, PaymentColumnChart };
