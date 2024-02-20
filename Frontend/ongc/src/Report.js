import Chart from './Charts/Chart';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
// import { getDataset, getOptionsets } from './Utility/utilites'
import Navbar from './Navbar/Navbar';
// import io from 'socket.io-client';
import { getDataset, getOptionsets } from './Utility/utilites';
import { useSelector } from 'react-redux';
import { webSocketUrl } from './Utility/localstorage';
import Temperature from './Temperature';







function Report() {
  const [socket, setSocket] = useState(null); // State to hold the socket connection
  const [Data, setData] = useState([])
  const dateValue = useSelector(state => state.dateManager.value);

  // useEffect(() => {
  //   // Initialize the socket connection when the component mounts
  //   const newSocket = io('http://localhost:9000');
  //   setSocket(newSocket);

  //   // Disconnect the socket when the component unmounts
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   // Listen for data updates from the Socket.IO server
  //   if (socket) {
  //     socket.on('data-update', (updatedData) => {
  //       setData(updatedData);
  //     });

  //     // Remove the event listener when the component unmounts
  //     return () => {
  //       socket.off('data-update');
  //     };
  //   }
  // }, [socket]);

  useEffect(() => {
    // Fetch initial data when the component mounts
    axios.get('/api/getdata?date=' + dateValue)
      .then(res => {
        setData(res.data);
        // Emit the updated data to the Socket.IO server
        // if (socket) {
        //   socket.emit('data-update', res.data);
        // }
      })
      .catch(err => console.log(err));

    const ws = new WebSocket(webSocketUrl); // Replace with your WebSocket server URL

    // Set up event listeners
    ws.addEventListener('open', () => {
      console.log('WebSocket connection opened');
    });

    ws.addEventListener('message', (event) => {
      console.log(`Received message: ${event.data}`);

    });

    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    setSocket(ws);
    // Clean up the WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [dateValue]);

  // useEffect(() => {
  //   axios.get('/api/getdata')
  //     .then(res => {
  //       setData(res.data)
  //     })
  //     .catch(err => console.log(err))
  // }, [])


  const customBarColors = ["rgba(255, 0, 0, 0.7)"];
  const customBarColorss = ["rgba(255,255,0,0.7)"];
  const customBarColorsss = ["rgba(255,0,255,0.7)"];
  const customBarColorssss = ["rgba(255,136,0)"];
  const customBarColorsssss = ["rgba(0,0,0,0.7)"];
  const customBarColorssssss = ["rgba(0,0,255)"];



  const getRunningHour = () => {
    let runninghour = Data.find((obj, i) => {
      return obj.ParameterName === "Running_Hour"
    })
    return runninghour.ParameterValue
    // let runningHourInSeconds = Data.find((obj) => obj.ParameterName === "Running_Hour")?.ParameterValue || 0;

    // // Convert seconds to hh:mm:ss format
    // const hours = Math.floor(runningHourInSeconds / 3600);
    // const minutes = Math.floor((runningHourInSeconds % 3600) / 60);
    // const seconds = runningHourInSeconds % 60;

    // // Format the result
    // const formattedRunningHour = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // return formattedRunningHour;
  }
  const getRunningTime = () => {
    let runningtime = Data.find((obj, i) => {
      return obj.ParameterName === "Running_Minute"
    })
    return runningtime.ParameterValue
  }


  return (
    <div className='Backenddd'>
      <Navbar />
      <div class="container">
        <div id="box1" class="box">
          <div class="roz">
            <Chart
              chartType="bar"
              data={getDataset(['PT5'], Data, "Kg/cm2", 'bar', customBarColorssss)}
              options={getOptionsets(" PARAMETERS OF PT5", 250, 'x')}
            />
          </div>
          <hr />
          <div class="roz">
            <Chart
              chartType="bar"
              data={getDataset(['SFM_2'], Data, "Kg/hr", 'bar', customBarColors)}
              options={getOptionsets('PARAMETERS OF SFM_2', 9999)}
            />
          </div>
          <hr />
          <div class="roz">
            <Chart
              chartType="bar"
              data={getDataset(['WFM'], Data, "Kg/hr", 'bar', customBarColorsssss)}
              options={getOptionsets(" PARAMETERS OF WFM ", 9999)}
            />
          </div>
          <hr />
          <div class="roz">
            <Chart
              chartType="bar"
              data={getDataset(['TT8'], Data, "Deg.C", 'bar', customBarColorsss)}
              options={getOptionsets(" PARAMETERS OF TT8 ", 500)}
            />
          </div>
          <hr />
          {/* <div class="roz">
            <Chart
              chartType="gauge"
              data={getDataset('TT8', Data, "Deg.C", 'gauge')}
              options={getOptionsets(" PARAMETERS OF TT8 ", 500, 'y')}
            />
          </div> */}
          <hr />

          {/* <!---------------------------------- verticle div end --> */}

        </div>
        <div id="box2" class="box">
          <div class="roz">

            <div class="and">
              <div class="roz">
                <Chart
                  chartType="pie"
                  data={getDataset(['Boiler_Steam_Quality_Dryness'], Data, "%", 'pie', customBarColorss)}
                  options={getOptionsets(" PARAMETERS OF Boiler Steam Quality Dryness ", 100)}
                />
              </div>
            </div>
            <hr />
            <div className='roz'>
              <Chart
                chartType="bar"
                data={getDataset(['Totalizer_SFM_2'], Data, "Ton", 'bar', customBarColorssssss)}
                options={getOptionsets(" PARAMETERS of Totalizer SFM_2 ", 99999999)}
              />
            </div>
          </div>
          <hr />
          {Data && Data.length > 0 && <div class="roz">
            {/* <div className='Runn'> */}
            <div className='Runn1'>
              <p><b> RunningHour </b> : <input
                type="text"
                value={getRunningHour()}
                readOnly
              /></p>
            </div>
            <br />
            <div className='Runn2'>
              <p><b>RunningTime</b>: <input
                type="text"
                value={getRunningTime()}
                readOnly
              /></p>
            </div>
            {/* </div> */}
          </div>}
          <hr />
          <div className='roz'>
            <Chart
              chartType="line"
              data={getDataset(['TT1', 'TT2', 'TT3', 'TT4', 'TT5', 'TT6', 'TT7'], Data, 'Deg.C', 'line', customBarColorss)}
              options={getOptionsets('PARAMETERS OF TT1 to TT7', 500)}
            />
          </div>
        </div>

        {/* <!---------------------------------- verticle div end --> */}


      </div>
      {/* Actually what happened is temperature chart component is having navbar too me reflected */}
      {/* <div className="col-md-8 mb-4 mt-4 bg-white"> */}
      <div className='container'>
       <Temperature/>
      </div>



    </div>
  )

}

export default Report
