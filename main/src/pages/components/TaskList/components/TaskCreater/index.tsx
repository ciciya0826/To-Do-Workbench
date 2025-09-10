import { PlusIcon } from '@/assets/icons/Icons';
import './index.less'
import { Button, DatePicker, Input, Tag } from 'antd';
import { useState } from 'react';
import { quickTimeConfig } from '../../config';
import dayjs, { Dayjs } from 'dayjs';
import { TASK_STATUS } from '@/const';
import { taskT } from '../..';

interface iprops {
    onCreate: (task: taskT) => void
}

export default function TaskCreator(props: iprops) {
    const { onCreate } = props;
    const [isCreate, setIsCreate] = useState(false);  //是否继续展示DatePicker和tags
    const [DDL, setDDL] = useState<Dayjs | null>(null);
    const [curTitle, setCurTitle] = useState<string>('');

    const onChange = (value: any, dateString: string | string[]) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        setDDL(value);
    }
    const onOk = (value: any) => {
        console.log('onOk: ', value);
    };
    const handleQuickCreate = (value: number) => {
        let time = dayjs().add(value, 'day');
        setDDL(time);
    }
    const handleCreate = () => {
        const taskid = Date.now().toString();
        const newTasks = {
            taskID: taskid,
            title: curTitle,
            desc: '',
            startTime: DDL,
            endTime: DDL,
            status: TASK_STATUS.DOING,
            finishTime:null,
        }
        onCreate(newTasks);
        setCurTitle('');
        setIsCreate(false);
        setDDL(null);
    }

    return (
        <div className='add-task-btn'>
            <div className='add-task-btn_inner'>
                <PlusIcon />
                <Input className='text' placeholder='创建任务' value={curTitle} onChange={(e) => setCurTitle(e.target.value)} onFocus={() => setIsCreate(true)} />
            </div>
            {isCreate && <div className='tags-container'>
                <div className='tags-btn'>
                    {quickTimeConfig.map(i => (
                        <Tag key={i.offset} className='tags' color={i.color} onClick={() => handleQuickCreate(i.offset)}>{i.title}</Tag>
                    ))}
                </div>
                <DatePicker value={DDL} className='datepicker' showTime onChange={onChange} onOk={onOk} placeholder='选择任务截止日期' />
                <div className='buttons'>
                    <Button className='cancel-btn' onClick={() => {
                        setCurTitle('');
                        setIsCreate(false);
                        setDDL(null);
                    }}>取消</Button>
                    <Button type="primary" className='confirm-btn' onClick={handleCreate} disabled={curTitle === '' || DDL === null} >确认添加</Button>
                </div>
            </div>}
        </div>
    );
}
