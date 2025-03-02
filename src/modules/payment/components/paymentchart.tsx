import { Pie, PieConfig } from '@ant-design/plots';
import { paymentStatusMonthly } from '../../../stores/interfaces/Payment';

interface paymentPieChartProps {
data:paymentStatusMonthly[]
color:string[]
}
const PaymentPieChart= ({data,color}:paymentPieChartProps) => {
    const config:PieConfig = {
        data,
        angleField: 'total',
        colorField: 'month',
        innerRadius: 0.6,
        color: color,
        legend: {
          color: {
            title: false,
            position: 'right',
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
}
export  {PaymentPieChart}