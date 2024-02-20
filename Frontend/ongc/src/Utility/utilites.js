
// const socket = require('socket.io-client')('http://localhost:9000'); // Replace with your Socket.IO server URL


// function generateTimestamps(startTime, endTime, interval = 1) {
//   const timestamps = [];
//   let currentTimestamp = startTime;

//   while (currentTimestamp <= endTime) {
//     timestamps.push(currentTimestamp);
//     currentTimestamp += interval * 60 * 60 * 1000; // Convert hours to milliseconds
//   }

//   return timestamps;
// }


function getDataset(filter_Data, rawData, label_value, chartType = 'bar', colors) {
  const filteredData = rawData.filter((data) => filter_Data.includes(data.ParameterName.trim()));
  // const startTime = new Date('2024-01-19T00:00:00'); // Assuming YYYY-MM-DDTHH:mm:ss format
  // const endTime = new Date('2024-01-19T23:59:59');
  // const timestamps = generateTimestamps(startTime.getTime(), endTime.getTime(), 1);
 


  if (chartType === 'bar') {
    return {
      labels: filteredData.map(data => data.ParameterName),
      datasets: [
        {
          type: chartType,
          label: label_value,
          data: filteredData.map(data => parseFloat(data.ParameterValue)),
          backgroundColor: colors || [
            "rgba(43, 63, 229, 0.8)",
            "rgba(250, 192, 19, 0.8)",
            "rgba(253, 135, 135, 0.8)",
          ],
          hoverOffset: 3,
          borderRadius: 5,
          maxBarThickness: 80

        },
      ],
    };
  } else if (chartType === 'pie') {
    return {
      labels:filteredData.map(data => data.ParameterName),
      datasets: [
        {
          label: label_value,
          data:filteredData.map(data => parseFloat(data.ParameterValue)),
          backgroundColor:  [
            "rgba(43, 63, 229, 0.8)",
            "rgba(250, 192, 19, 0.8)",
            "rgba(253, 135, 135, 0.8)",

          ],
          hoverOffset: 5,
          borderWidth: 10,
          padding:2
        },
      ],
    };
  } else if (chartType === 'line') {
    return {
      labels: filteredData.map(data => data.ParameterName),
          // labels:timestamps,
          // labels: timestamps.map(timestamp => new Date(timestamp).toLocaleString()), // Format timestamp to a human-readable date
      datasets: [
        {
          type: 'line',
          label: label_value,
          data: filteredData.map(data => parseFloat(data.ParameterValue)),
          borderColor: colors || "rgba(43, 63, 229, 1)",
          backgroundColor: "rgba(43, 63, 229, 0.2)", // Optional: background color for the line
          borderWidth: 2,
          pointRadius: 4, // Optional: adjust the size of data points
          hoverOffset: 3,
        },
      ],
    };
  }else if (chartType === 'doughnut') {
    return {
      labels: filteredData.map(data => data.ParameterName),
      datasets: [
        {
          data: filteredData.map(data => parseFloat(data.ParameterValue)),
          backgroundColor: colors || ["rgba(43, 63, 229, 1)", "rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
          hoverOffset: 10,
          // circumference: 180,// Optional: increase space when hovering over a segment
        },
      ],
    };
  } else if (chartType === 'gauge') {
    return {
      labels: ['Value'],
      datasets: [
        {
          type: 'doughnut',
          label: label_value,
          data: filteredData.map(data => parseFloat(data.ParameterValue)),// Assuming gauge data is single-valued
          backgroundColor: colors || ["rgba(43, 63, 229, 1)"],
          hoverOffset: 10,
          circumference: 180,
        },
      ],
    };
  }
}
  



function getOptionsets(graph_title, max_range, index_Axis = 'x') {
  let scale_value = {
    x: { max: max_range },
    y: { max: max_range } // Include both x and y scales
  };

  return {
    plugins: {
      title: {
        text: graph_title,
      },
    },
    indexAxis: index_Axis,
    scales: scale_value
  };
}


module.exports = { getDataset, getOptionsets };

