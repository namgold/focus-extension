import React from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { DEFAULT } from '../../utils/const';
import './popup.css';

const Popup = props => {

    const [pausedTimestamp, setPausedTimestamp, isPersistentpausedTimestamp, error] = useChromeStorageLocal('pausedTimestamp', DEFAULT.pausedTimestamp);
    const [pauseAmount, setPauseAmount, isPersistentpauseAmount, errorpauseAmount] = useChromeStorageLocal('pauseAmount', DEFAULT.pauseAmount);
    const [resetAmount, setResetAmount, isPersistentresetAmount, errorresetAmount] = useChromeStorageLocal('resetAmount', DEFAULT.resetAmount);
    const timeleft = (pausedTimestamp + pauseAmount * 60000 - Date.now()) / 1000;

    const onPause = () => {
        setPausedTimestamp(new Date().getTime());
    }

    // const onCancel = () => {
    //     chrome.storage.sync.set({ pause: false });
    //     setPause(false);
    // }

    return (
        <div className="popup">
            <div className='row'>
                <h1>FOCUS</h1>
            </div>
            <div className='row mt-3'>
                <div className='col'>
                    <button class='btn btn-success' onClick={onPause} disabled={!(Date.now() - pausedTimestamp > resetAmount * 60000 || Date.now() - pausedTimestamp < pauseAmount * 60000)}>Pause for {pauseAmount} minutes</button>
                </div>
            </div>
            <div className='row'>
                <div className='col justify-content-center'>
                    Timeleft: {timeleft > 0 ? timeleft : 'Time Up'} second(s)
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
