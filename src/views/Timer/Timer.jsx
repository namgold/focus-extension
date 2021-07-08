import React, { useState } from 'react';
import { useChromeStorageSync } from 'use-chrome-storage';
import useInterval from '../../hooks/useInterval';
import { DEFAULT } from '../../utils/const';
import { T } from '../../utils/utils';

const Timer = () => {
    const [pausedActivated] = useChromeStorageSync('pausedActivated', DEFAULT.pausedActivated);
    const { timestamp, pauseAmount } = pausedActivated;
    const [,forceUpdate] = useState(0);
    useInterval(() => requestAnimationFrame(forceUpdate), 1000)
    const timeleft = (timestamp + pauseAmount * 60000 - Date.now()) / 1000;
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '15px',
                left: '15px',
                textShadow: 'rgba(150, 150, 150, 0.9) 2px 2px 8px',
                color: timeleft < 10 ? 'rgb(255, 78, 78)' : 'rgb(0, 255, 78)',
                padding: '5px 8px',
                backgroundColor: 'rgb(0, 0, 0)',
                borderRadius: '10px',
                opacity: '0.7',
                fontSize: '18px',
            }}
        >
            <span>{timeleft < 1 ? 'Bye!' : T.secondToMinutes(timeleft)}</span>
        </div>
    )
}

export default Timer;