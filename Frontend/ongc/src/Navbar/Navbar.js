import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { setDateValue } from '../Redux/dateManager';




function Navbar() {
    const dateValue = useSelector(state => state.dateManager.value);
    // console.log(dateValue)
    const dispatch = useDispatch();
    const [date, setDate] = useState(dateValue);
    const dateChange = (e) => {
        let date_one = e.target.value
        // console.log(date_one);
        dispatch(setDateValue(date_one));
        setDate(date_one);
    }
    
   

    



    return (
        <div>

            <nav>
                <div class="left-components">
                    <img class="imgs imgsL" src="./Images/ONGC_3.jpg" alt="ONGC Logo" />
                </div>
                <div class="left-components">

                    <div class="diveup">
                        <p><b>BOILER NO : SGMB/SB/8.5T/025</b></p>
                    </div>

                    <div class="divedown">
                        <p ><b>BOILER MODEL : SGMB/8500/175</b></p>
                    </div>


                </div>
                {/* -------------------------------------------------------------- */}

                {/* --------------------------------------------------------------------- */}
                <div class="right-components">

                    <img class="imgs" src="./Images/ONGC_1.png" alt="ONGC Logo" />
                </div>
                {/* ------------------------------------------------------------------- */}
                <div class="right-components ongcbtnmain">
                    <a href="/" class="text-sm text-blue-700 dark:text-blue-600  ">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="red">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10M12 12h.01M12 18v.01"></path>
                        </svg>
                    </a>

                </div>
            </nav>


            {/* ================================================================================ */}



            <nav class="RM2">
                <div class="max-w-screen-xl px-0 py-1 mx-auto flex">
                    <div class="flex1 items-Left">
                        <ul class="flex flex-row font-medium mt-3 space-x-8 rtl:space-x-reverse text-sm">
                            <li>
                                <a href="/Table" class="text-gray-900 dark:text-white hover:blink" aria-current="page">Report</a>
                            </li>
                            <li>
                                <a href="/Home2" class="text-gray-900 dark:text-white hover:blink">LIVE_REPORTS</a>
                            </li>
                            <li>
                                <a href="/Report" class="text-gray-900 dark:text-white hover:blink">7_REPORTS</a>
                            </li>
                            <li>
                                <a href="/Temperature" class="text-gray-900 dark:text-white hover:blink">Temperature</a>
                            </li>

                        </ul>
                    </div>
                    {/* <div class="max-w-screen-sm mx-auto flex flex1 items-Right ml-auto"> */}
                    <div class="nav2flex items-Right">
                        <div className="date-time-selector RD">
                            <input onChange={e => { dateChange(e) }} value={date} type="date" id="datetimeInput" name="datetimeInput" style={{ fontSize: '0.85rem', width: '150px' }} />
                        </div>
                    </div>
                </div>
            </nav>


        </div>
    )
}

export default Navbar
