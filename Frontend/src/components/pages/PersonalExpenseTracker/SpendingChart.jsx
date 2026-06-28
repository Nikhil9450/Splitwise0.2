import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";

export default function SpendingChart({data}) {
  const modified_array = data?.map((item)=>{
    const date = item.date.split("T")[0];
    return {
      date,
      amount :item.amount,
    }
  })
  const reducing_amount_by_date = modified_array.reduce((acc,item)=>{
    if(acc[item.date]){
      acc[item.date] = acc[item.date]+item.amount
    }else{
      acc[item.date] = item.amount
    }
    return acc;
  },{})

  console.log("reducing_amount_by_date",reducing_amount_by_date);
  const xdata = Object.keys(reducing_amount_by_date).map((item)=>item.split("-")[2]);
  const ydata = Object.values(reducing_amount_by_date)
  console.log("xdata--------->",xdata);
  console.log("ydata------------>",ydata);

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
      width: 1,
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
      categories: xdata,
      labels: {
        rotate: -45,
      },
    },

    yaxis: {
      labels: {
        formatter: (value) => `₹${value}`,
      },
      show :false
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
      data: ydata,
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "2rem",
        p: 2,
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        border: "2px solid #313131",
      }}
    >
      <Typography
        fontWeight={500}
        mb={1}
        sx={{fontFamily: "Montserrat, sans-serif", marginBottom:"0px",fontSize:".8rem"}}
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
        <Box sx={{ minWidth: 300 ,width:xdata.length * 30}}>
          <Chart
            options={options}
            series={series}
            type="area"
            height={150}
          />
        </Box>
      </Box>
    </Box>
  );
}