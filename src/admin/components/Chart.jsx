import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip
);

function Chart() {
  const options = {};
  const data = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Sataurday",
    ],
    datasets: [
      {
        label: "Sales Graph",
        data: [100, 300, 100, 400, 700, 900, 4000],
        borderColor: "blue",
        backgroundColor:'blue'
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default Chart;
