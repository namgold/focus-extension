import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { DEFAULT } from '../../utils/const';
import { T } from '../../utils/utils';
import './options.css';

const Favicon = props => {
    const { src } = props;
    const [icoStrategyIndex, setIcoStrategyIndex] = useState(0);
    const [aHref, setAHref] = useState(src);

    const icoStrategy = [
        url => (url.startsWith('https://') || url.startsWith('http://') ? url : 'https://' + url) + '/favicon.ico',
        url => 'https://favicon.yandex.net/favicon/' + url,
    ]

    useEffect(() => {
        setIcoStrategyIndex(0);
        setAHref(src.startsWith('https://') || src.startsWith('http://') ? src : 'https://' + src);
    }, [src]);

    const handleError = e => {
        console.log('HandleError', e);
        if (icoStrategyIndex < icoStrategy.length - 1)
            setIcoStrategyIndex(icoStrategyIndex + 1);
    }

    return (
        <a href={aHref} target="_blank" rel="noreferrer">
            {/* <div style={{ overflow: 'hidden', width: '32px', height: '32px' }}> */}
                <img src={icoStrategy[icoStrategyIndex](src)} width='32px' alt={src} onError={handleError} />
            {/* </div> */}
        </a>
    );
}

const MemoFavicon = React.memo(Favicon);

function Options() {
    const [blockWebsitesStorage, setBlockWebsitesStorage] = useChromeStorageLocal('blockWebsites', DEFAULT.blockWebsites);
    const [blockWebsitesState, setBlockWebsitesState] = useState(blockWebsitesStorage);
    const [pauseAmount, setPauseAmount] = useChromeStorageLocal('pauseAmount', DEFAULT.pauseAmount);
    const [resetAmount, setResetAmount] = useChromeStorageLocal('resetAmount', DEFAULT.resetAmount);
    const [newWebsite, setNewWebsite] = useState('');
    const [blockWebsitesChanged, setBlockWebsitesChanged] = useState(0);

    const onChangePauseAmount = e => {
        e.preventDefault();
        setPauseAmount(e.target.value);
    }

    const onChangeResetAmount = e => {
        e.preventDefault();
        setResetAmount(e.target.value);
    }

    const onChangeWebSite = (e, index) => {
        // e.preventDefault();
        // blockWebsitesState[blockWebsitesState.findIndex(website => website.url === oldWebsite)].url = e.target.value;
        // setBlockWebsitesState(blockWebsitesState);
        setBlockWebsitesState(produce(blockWebsitesState, v => {
            v[index].url = e.target.value;
        }));
    }

    const commitBlockWebsites = e => {
        e.preventDefault();
        setBlockWebsitesStorage(blockWebsitesState);
    }

    const onKeyDownAddWebSite = e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            const newWebsiteRecord = { url: newWebsite, active: true };
            T.addKey(newWebsiteRecord)
            blockWebsitesStorage.push(newWebsiteRecord);
            setBlockWebsitesStorage(blockWebsitesStorage);
            setNewWebsite('');
        }
    }

    const onChangeAddWebSite = e => {
        e.preventDefault();
        setNewWebsite(e.target.value);
    }

    const onActivateWebsite = (e, webURL) => {
        e.preventDefault();
        const index = blockWebsitesStorage.findIndex(website => website.url === webURL);
        blockWebsitesStorage[index].active = !blockWebsitesStorage[index].active;
        setBlockWebsitesStorage(blockWebsitesStorage);
    }

    const removeWebsite = (e, removeWeb) => {
        e.preventDefault();
        const removeWebsiteIndex = blockWebsitesStorage.findIndex(website => website.url === removeWeb);
        blockWebsitesStorage.splice(removeWebsiteIndex, 1);
        setBlockWebsitesStorage(blockWebsitesStorage);
    }

    useEffect(() => {
        if (blockWebsitesChanged === 1) {
            blockWebsitesStorage.sort((a,b) => b.active - a.active);
            setBlockWebsitesStorage(blockWebsitesStorage);
        }
        setBlockWebsitesState(blockWebsitesStorage);
        setBlockWebsitesChanged(blockWebsitesChanged + 1);
    }, [blockWebsitesStorage])

    return (
        <div className="option">
            <div className='row' style={{ justifyContent: 'center' }}>
                <h1>FOCUS</h1>
            </div>
            <div className='row mt-3'>
                <div className='col'>
                    <label>
                        Pause Amount (minutes):&nbsp;
                        <input id='pauseAmount' className='form-control custom-input' value={pauseAmount} onChange={onChangePauseAmount} />
                    </label>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col'>
                    <label>
                        Reset Amount (minutes):&nbsp;
                        <input id='resetAmount' className='form-control custom-input' value={resetAmount} onChange={onChangeResetAmount} />
                    </label>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col'>
                    <label>Block Websites:</label>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-xxl-6 offset-xxl-3 col-xl-8 offset-xl-2 col-md-10 offset-md-1'>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Favicon</th>
                            <th scope="col">URL</th>
                            <th scope="col">Activate</th>
                            <th scope="col">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockWebsitesState.map((website, index) => (
                                <tr key={website.key}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <MemoFavicon src={website.url} />
                                    </td>
                                    <td><input id={website.key} className="form-control custom-table-input" value={website.url} onChange={e => onChangeWebSite(e, index)} onBlur={commitBlockWebsites} /></td>
                                    <td>
                                        <label class="switch">
                                            <input type="checkbox" checked={website.active} onClick={e => onActivateWebsite(e, website.url)} />
                                            <span class="slider round"/>
                                        </label>
                                    </td>
                                    <td><button className='btn btn-danger' onClick={e => removeWebsite(e, website.url)}>&times;</button></td>
                                </tr>
                            ))}
                            <tr>
                                <th>Add more</th>
                                <td></td>
                                <td><input id='new' className="form-control custom-table-input" type='text' value={newWebsite} onChange={onChangeAddWebSite} onKeyDown={onKeyDownAddWebSite} /></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default Options
