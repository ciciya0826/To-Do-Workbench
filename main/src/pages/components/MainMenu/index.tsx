import './index.less';
import MenuItem from './MenuItem';
import Config from './config';
import { useState } from 'react';
import { tabKey } from '@/const';

interface iprops{
    activeKey:number;
    onClick:(key:number)=>void;
}

export default function MainMenu(props:iprops) {
    const {activeKey,onClick}=props;
    return (
        <div className='main-menu'>
            <div>
                <h1 className='title'>主菜单</h1>
            </div>
            {Config.map((i) => {
                return (<MenuItem
                    name={i.name}
                    count={i.count}
                    active={ activeKey === i.key }
                    icon={i.icon}
                    key={i.key}
                    onclick={() => onClick(i.key)} />)
            })}
        </div>
    );
}
