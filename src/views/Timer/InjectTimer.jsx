import React from 'react'
import ReactDOM from 'react-dom'
import Timer from './Timer'

const TIMER_ROOT_ID = 'timer-root';

const InjectTimer = () => {
    if (!document.getElementById(TIMER_ROOT_ID)) {
        const timerRoot = document.createElement('div');
        timerRoot.setAttribute("id", TIMER_ROOT_ID);
        document.body.appendChild(timerRoot);
        ReactDOM.render(
            <React.StrictMode>
                <Timer />
            </React.StrictMode>,
            timerRoot
        );
    }
}

export default InjectTimer;