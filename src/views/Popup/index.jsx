import React, { useState } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { DEFAULT } from '../../utils/const';
import { T } from '../../utils/utils';
import useInterval from '../hooks/useInterval';
import './popup.css';

const Popup = props => {
    const [pausedActivated, setPausedActivated] = useChromeStorageLocal('pausedActivated', DEFAULT.pausedActivated);
    const [pauseAmount,] = useChromeStorageLocal('pauseAmount', DEFAULT.pauseAmount);
    const [resetAmount,] = useChromeStorageLocal('resetAmount', DEFAULT.resetAmount);
    const [,forceUpdate] = useState(0);
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
            <div className='row'>
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
