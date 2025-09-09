import './index.less';
import MenuItem from './MenuItem';
import Config from './config';
import { useEffect, useState } from 'react';
import { api } from '@/api';
import { apiConfig } from '@/api/config';

interface iprops {
    activeKey: number;
    isChange:boolean;
    onClick: (key: number) => void;
}
interface countItem {
    doingCount: number,
    doneCount: number,
}

export default function MainMenu(props: iprops) {
    const [count, setCount] = useState<countItem>(
        {
            doingCount: 0,
            doneCount: 0,
        }
    )
    const getCount = () => {
        api(apiConfig.count.url).then(res =>
            setCount(res.data)
            // console.log('res.data',res.data)
        )
    }
    const { activeKey,isChange, onClick } = props;

    useEffect(() => {
        getCount()
    }, [isChange]);
    return (
        <div className='main-menu'>
            <div>
                <h1 className='title'>主菜单</h1>
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
