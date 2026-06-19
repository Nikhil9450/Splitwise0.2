import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";

export default function SpendingChart() {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#3b3b3b"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
      },
    },

    markers: {
      size: 5,
      hover: {
        size: 8,
      },
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 5,
    },

    xaxis: {
      categories: Array.from(
        { length: 30 },
        (_, i) => i
      ),
      labels: {
        rotate: -45,
      },
    },

    yaxis: {
      labels: {
        formatter: (value) => `₹${value}`,
      },
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `₹${value}`,
      },
    },
  };

  const series = [
    {
      name: "Expense",
      data: [
        500, 1200, 800, 1500, 900,
        2000, 700, 1100, 1400, 600,
        1800, 900, 1300, 2200, 1000,
        700, 1500, 1200, 900, 1700,
        800, 1400, 1900, 1000, 600,
        1600, 1200, 1800, 900, 2100,
      ],
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "2rem",
        p: 3,
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        border: "2px solid #313131",
      }}
    >
      <Typography
        variant="h7"
        fontWeight={600}
        mb={3}
        sx={{fontFamily: "Montserrat, sans-serif",}}
      >
        Daily Spending 
      </Typography>

      <Box
        sx={{
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#d1d5db",
            borderRadius: 999,
          },
        }}
      >
        <Box sx={{ minWidth: 1000 }}>
          <Chart
            options={options}
            series={series}
            type="area"
            height={200}
          />
        </Box>
      </Box>
    </Box>
  );
}