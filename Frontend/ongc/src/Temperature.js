import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { webSocketUrl } from './Utility/localstorage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Temperature() {
    const [chartData, setChartData] = useState([]);
    const [socket, setSocket] = useState(null);
    const [timeGranularity, setTimeGranularity] = useState('hour'); // 'hour' or 'minute'

    useEffect(() => {
        const getValueData = async () => {
            const reqData = await fetch('/api/fetchData');
            const resData = await reqData.json();
            console.log('Fetched data:', resData);
            setChartData(resData);
        }
        getValueData();

        const ws = new WebSocket(webSocketUrl);

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

        return () => {
            ws.close();
        };

    }, []);

    const generateDatasets = () => {
        if (!chartData || chartData.length === 0) {
            return [];
        }

        const datasets = [];

        for (let i = 1; i <= 7; i++) {
            const label = `TT${i}`;
            const data = chartData.map(entry => entry[label]);
            const color = getRandomColor();

            datasets.push({
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: color,
                hoverOffset: 3,
            });
        }

        return datasets;
    };

    const generateTimeLabels = () => {
        if (!chartData || chartData.length === 0) {
            return [];
        }

        const timeLabels = chartData.map(entry => {
            const date = new Date(entry.DateTime);
            return timeGranularity === 'hour' ? `${date.getHours()}:00` : `${date.getHours()}:${date.getMinutes()}`;
        });

        return Array.from(new Set(timeLabels)); // Remove duplicates
    };

    const getRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const handleToggleGranularity = () => {
        setTimeGranularity(prevGranularity => (prevGranularity === 'hour' ? 'minute' : 'hour'));
    };

    return (
        <React.Fragment>
            <div className="container-fluid">
                <div>
                    <div className="col-md-10 mb-4 mt-4 ml-4 Tempp">
                        <Line
                            data={{
                                labels: generateTimeLabels(),
                                datasets: generateDatasets(),
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {},
                                    title: {
                                        display: true,
                                        text: `TT1 TO TT7 Parameters - ${timeGranularity.toUpperCase()} wise`,
                                        font: { size: 25, color: 'rgba(0, 0, 0, 1)' },
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: true,
                                        },
                                        title: {
                                            display: true,
                                            text: "Data According to Time",
                                            font: { size: 20, color: 'rgba(0, 0, 0, 1)' },
                                        },
                                    },
                                    y: {
                                        grid: {
                                            display: true,
                                        },
                                        title: {
                                            display: true,
                                            text: "Data in Range",
                                            font: { size: 20, color: 'rgba(0, 0, 0, 1)' },
                                        },
                                    },
                                },
                            }}
                        />
                        <button onClick={handleToggleGranularity} className="buttonDecorative" >Minutes OR Hours</button>
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    );
}

export default Temperature;
