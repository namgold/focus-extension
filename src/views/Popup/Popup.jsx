import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChromeStorageSync } from 'use-chrome-storage';
import { DEFAULT } from '../../utils/const';
import { T } from '../../utils/utils';
import { getActivatedTab, isBlockWebsite, findBlockWebsite, remove } from '../../utils/helper';
import useInterval from '../../hooks/useInterval';
import './popup.css';

const Popup = props => {
    let [blockWebsites, setBlockWebsites] = useChromeStorageSync('blockWebsites', DEFAULT.blockWebsites);
    const [pausedActivated, setPausedActivated] = useChromeStorageSync('pausedActivated', DEFAULT.pausedActivated);
    const [pauseAmount] = useChromeStorageSync('pauseAmount', DEFAULT.pauseAmount);
    const [resetAmount] = useChromeStorageSync('resetAmount', DEFAULT.resetAmount);
    const [, forceUpdate] = useState();
    const pauseLeft = (pausedActivated.timestamp + pausedActivated.pauseAmount * 60000 - Date.now()) / 1000;
    const unlockIn = (pausedActivated.timestamp + pausedActivated.resetAmount * 60000 - Date.now()) / 1000;
    const currentTab = useRef(null);
    const isBlocked = currentTab.current?.url && isBlockWebsite(currentTab.current?.url, { blockWebsites });
    useEffect(() => {
        getActivatedTab(tab => {
            currentTab.current = tab;
        });
    }, []);

    blockWebsites = blockWebsites || [];

    const onPause = () =>
        setPausedActivated({
            timestamp: new Date().getTime(),
            pauseAmount: pauseAmount,
            resetAmount: resetAmount,
        });

    const onBlockThisSite = useCallback(() => {
        if (!isBlockWebsite(currentTab.current.url, { blockWebsites })) {
            try {
                let blockWebsiteRecord = findBlockWebsite(currentTab.current.url, blockWebsites);
                if (blockWebsiteRecord) {
                    blockWebsiteRecord.active = true;
                } else {
                    blockWebsiteRecord = { url: new URL(currentTab.current.url).hostname, active: true };
                    T.addKeyBlockWebsites(blockWebsiteRecord);
                    blockWebsites.push(blockWebsiteRecord);
                }
                setBlockWebsites(blockWebsites);
                remove(currentTab.current);
            } catch (e) {}
        }
        T.notify('Website has been blocked', T.NOTIFY_TYPE.SUCCESS);
    }, [blockWebsites, setBlockWebsites]);

    useInterval(() => requestAnimationFrame(forceUpdate), 1000);

    return (
        <div className='popup'>
            <div className='row' style={{ justifyContent: 'center' }}>
                <h1>FOCUS</h1>
            </div>
            <div className='row mt-3'>
                <div className='col'>
                    <button class='btn btn-success' onClick={onPause} disabled={unlockIn > 0}>
                        {pauseLeft > 0 ? (
                            <>
                                Pause time left: <span className='text-monospace'>{T.secondToMinutes(pauseLeft)}</span>
                            </>
                        ) : unlockIn > 0 ? (
                            <>
                                Unlock in: <span className='text-monospace'>{T.secondToMinutes(unlockIn)}</span>
                            </>
                        ) : (
                            <>Pause for {pauseAmount} minutes</>
                        )}
                    </button>
                </div>
            </div>
            {currentTab.current?.url && /https?/.test(new URL(currentTab.current?.url).protocol) && (
                <div className='row mt-3'>
                    <div className='col'>
                        <button class='btn btn-danger' onClick={onBlockThisSite} disabled={isBlocked}>
                            {isBlocked ? 'This site has been blocked' : 'Block this site!'}
                        </button>
                    </div>
                </div>
            )}
            {/* <div className='row'>
                <div className='col'>
                    <button class='btn btn-success' onClick={onCancel}>Cancel</button>
                </div>
            </div> */}
        </div>
    );
};

export default Popup;
