import './index.less';
import MenuItem from './MenuItem';
import Config from './config';
import { useEffect, useState } from 'react';

interface countItem {
    doingCount: number,
    doneCount: number,
}

interface iprops {
    activeKey: number;
    count:countItem;
    onClick: (key: number) => void;
}

export default function MainMenu(props: iprops) {
    
    const { activeKey, onClick ,count} = props;

    
    return (
        <div className='main-menu'>
            <div>
                {/* <h1 className='title'>//</h1> */}
            </div>
            {Config.map((i) => {
                return (<MenuItem
                    name={i.name}
                    count={i.key === 0 ? count.doingCount : count.doneCount}
                    active={activeKey === i.key}
                    icon={i.icon}
                    key={i.key}
                    onclick={() => onClick(i.key)} />)
            })}
        </div>
    );
}
