import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Navbar from './Navbar/Navbar'
import Parameter_unit from './Parameter_unit.json' 
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux';
import { webSocketUrl } from './Utility/localstorage'


const socket = io('http://localhost:9000'); // Replace with your server URL


function Home() {
  

  const [Data, setData] = useState([]);
  const dateValue = useSelector(state => state.dateManager.value);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    // Fetch initial data
    axios.get('/api/getdata?date='+dateValue)
      .then((res) => {
        setData(res.data);
      })
      .catch(err => console.log(err));

        // Establish a WebSocket connection
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

    // Save the WebSocket instance to state
    


    // Socket event listener for real-time updates
    // socket.on('dataUpdate', (updatedData) => {
    //   setData(updatedData);
    // });

    // // Clean up the socket connection on component unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, [dateValue]); // Empty dependency array means this effect runs once on mount

  return (
    <div className='backend'>
      <Navbar />
      <div className='center2'>
        <div className='col-15 color ' alignment="center"></div>
        <div class="tbl col-15 " alignment="center">
          <table alignment="center">
            <tr class='header'>
              <th ALIGN='CENTER'>Machine PID</th>
              <th align='right'>Parameter Name</th>
              <th>Parameter Value</th>
              <th>Unit</th>
            </tr>
            <tbody>
              {Data.map((innerdata, index) => (
                <tr key={innerdata.PID}>
                  <td align='center'>{innerdata.PID}</td>
                  <td>{innerdata.ParameterName}</td>
                  <td align='right'>{innerdata.ParameterValue}</td>
                  <td key={innerdata.PID}>{Parameter_unit[innerdata.ParameterName]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='col-3 color '></div>
      </div>
      <div class="card bg-warning-subtle">
        <div class="card-body">
          <i className='timt'>copyright &#169; Protovec Technology Pvt Ltd.All right reserved 2023</i>
        </div>
      </div>
    </div>
  )
}

export default Home

