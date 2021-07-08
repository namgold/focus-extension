import React, { useState } from 'react';
import { useChromeStorageSync } from 'use-chrome-storage';
import { DEFAULT } from '../../utils/const';
import { T } from '../../utils/utils';
import useInterval from '../../hooks/useInterval';
import './popup.css';

const Popup = props => {
    const [pausedActivated, setPausedActivated] = useChromeStorageSync('pausedActivated', DEFAULT.pausedActivated);
    const [pauseAmount,] = useChromeStorageSync('pauseAmount', DEFAULT.pauseAmount);
    const [resetAmount,] = useChromeStorageSync('resetAmount', DEFAULT.resetAmount);
    const [,forceUpdate] = useState();
    const pauseLeft = (pausedActivated.timestamp + pausedActivated.pauseAmount * 60000 - Date.now()) / 1000;
    const unlockIn = (pausedActivated.timestamp + pausedActivated.resetAmount * 60000 - Date.now()) / 1000;

    const onPause = () => setPausedActivated({
        timestamp: new Date().getTime(),
        pauseAmount: pauseAmount,
        resetAmount: resetAmount,
    });

    useInterval(() => requestAnimationFrame(forceUpdate), 1000)

    return (
        <div className="popup">
            <div className='row' style={{ justifyContent: 'center' }}>
                <h1>FOCUS</h1>
            </div>
            <div className='row mt-3'>
                <div className='col'>
                    <button class='btn btn-success' onClick={onPause} disabled={unlockIn > 0}>
                        {pauseLeft > 0
                            ? <>Pause time left: <span className='text-monospace'>{T.secondToMinutes(pauseLeft)}</span></>
                            : unlockIn > 0
                                ? <>Unlock in: <span className='text-monospace'>{T.secondToMinutes(unlockIn)}</span></>
                                : <>Pause for {pauseAmount} minutes</>
                        }
                    </button>
                </div>
            </div>
            {/* <div className='row'>
                <div className='col'>
                    <button class='btn btn-success' onClick={onCancel}>Cancel</button>
                </div>
            </div> */}
        </div>
    );
}

export default Popup;