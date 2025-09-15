import { SortIcon } from '@/assets/icons/Icons';
import './index.less'
import { useState } from 'react';

interface iprops{
    sortByStartTime:()=>void,
    sortByEndTime:()=>void,
}

export default function TaskToolBar(props:iprops) {
    const {sortByStartTime,sortByEndTime}=props;
    const [isEnter, setIsEnter] = useState<boolean>(false);

    const handleIconEnter=()=>{
        setIsEnter(true);
    }
    const handleIconLeave=()=>{
        setIsEnter(false);
    }

    return (
        <div className='task-tool-bar'>
            <div className='task-sort' onMouseEnter={handleIconEnter} onMouseLeave={handleIconLeave}>
                <div className='sort-icon'>
                    <SortIcon />
                </div>
                {isEnter && <div className='sort-div'>
                    <div className='sort-div_startTime' onClick={sortByStartTime}>按任务开始时间</div>
                    <div className='sort-div_endTime' onClick={sortByEndTime}>按任务截止时间</div>
                </div>}
            </div>
        </div>
    );
}
