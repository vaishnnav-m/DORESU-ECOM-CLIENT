import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  Tooltip
);

function Chart({ labels, salesPerday, graphType }) {
  console.log(labels, salesPerday);
  const data = {
    labels,
    datasets: [
      {
        label: "Sales Graph",
        data: salesPerday,
        borderColor: "blue",
        backgroundColor: "blue",
        tension: graphType ==='Line' ? 0.4 : '',
      },
    ],
  };

  const options = {};

  if(graphType === 'Bar'){
    return <Bar options={options} data={data} />
  }else if(graphType === 'Line'){
    return <Line options={options} data={data} />;
  }
}

export default Chart;
