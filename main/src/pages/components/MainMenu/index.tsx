import './index.less';
import MenuItem from './MenuItem';
import Config from './config';
import { useState } from 'react';

export default function MainMenu() {
    const[activeKey,setActiveKey]=useState('doing')
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
                    key={i.key}
                    onclick={() => setActiveKey(i.key)} />)
            })}
        </div>
    );
}
