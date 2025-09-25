import { SortIcon } from '@/assets/icons/Icons';
import './index.less'
import { useState } from 'react';
import { AutoComplete, AutoCompleteProps, Dropdown, Space } from 'antd';
import { CloseSquareFilled } from '@ant-design/icons';
import { taskT } from '../..';

interface iprops {
    tasks: taskT[],
    sortByStartTime: () => void,
    sortByEndTime: () => void,
    onSearchChange: (ids: string[]) => void,
    handleValueClear: () => void,
}

export default function TaskToolBar(props: iprops) {
    const { sortByStartTime, sortByEndTime, tasks, onSearchChange, handleValueClear } = props;
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<{ value: string, id: string }[]>([]);
    const [value, setValue] = useState('');

    //任务排序
    const handleMenuClick = (e: any) => {
        if (e.key === 'startTime') {
            sortByStartTime();
        }
        if (e.key === 'endTime') {
            sortByEndTime();
        }
    };
    const handleOpenChange = (nextOpen: any, info: any) => {
        if (info.source === 'trigger' || nextOpen) {
            setOpen(nextOpen);
        }
    };
    const items = [
        {
            label: '按任务开始时间',
            key: 'startTime',
        },
        {
            label: '按任务截止时间',
            key: 'endTime',
        },
    ];

    //任务搜索
    const getPanelValue = (searchText: string) => {
        return (tasks.filter(i => i.title.includes(searchText)).
            map(i => ({ value: i.title, id: i.taskID })))
    }
    const onSelect = (_value: string, options: { value: string, id: string }) => {
        onSearchChange([options.id]);
    };
    const onChange = (data: string) => {
        setValue(data);
    };
    const handleKeyEnter = (options: { value: string, id: string }[]) => {
        const searchIDs = options.map(i => i.id);
        console.log(options)
        onSearchChange(searchIDs);
    }

    return (
        <div className='task-tool-bar'>
            <div className='task-tool-bar_items'>
                <div className='task-search'>
                    <AutoComplete
                        value={value}
                        options={options}
                        style={{ width: 220 }}
                        onChange={onChange}
                        onSelect={onSelect}
                        onSearch={(text) => setOptions(getPanelValue(text))}
                        placeholder="搜索任务名称"
                        allowClear={{ clearIcon: <CloseSquareFilled /> }}
                        onClear={()=>{
                            handleValueClear();
                            setValue('');
                            console.log(options)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleKeyEnter(options);
                            }
                        }}
                    />
                </div>
                <div className='task-sort'>
                    <Dropdown
                        menu={{
                            items,
                            onClick: handleMenuClick,
                        }}
                        placement='bottom'
                        onOpenChange={handleOpenChange}
                        open={open}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <div className='sort-icon'>
                                    <SortIcon />
                                </div>
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}
