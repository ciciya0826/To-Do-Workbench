import { SortIcon } from '@/assets/icons/Icons';
import './index.less'
import { useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteProps, Dropdown, Space } from 'antd';
import { CloseSquareFilled } from '@ant-design/icons';
import { taskT } from '../..';
import { tabKey } from '@/const';

interface iprops {
    tasks: taskT[],
    sortByStartTime: () => void,
    sortByEndTime: () => void,
    onSearchChange: (ids: string[]) => void,
    handleValueClear: () => void,
    showTodayTask: () => void,
    showTodayOver: () => void,
    showHavenOver: () => void,
    activeKey:number,
}

export const leftTarget = {
    ALL_TASK: 1,
    TODAY_TASK: 2,
    TODAY_OVER: 3,
    HAVEN_OVER: 4
}

export default function TaskToolBar(props: iprops) {
    const { sortByStartTime, sortByEndTime, tasks, onSearchChange, handleValueClear, showHavenOver, showTodayOver, showTodayTask,activeKey } = props;
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<{ value: string, id: string }[]>([]);
    const [value, setValue] = useState('');
    const [sortManner, setSortManner] = useState<'endTime' | 'startTime'>('endTime');
    const [showManner, setShowManner] = useState(leftTarget.ALL_TASK)

    //任务排序
    const handleMenuClick = (e: any) => {
        if (e.key === 'startTime') {
            setSortManner('startTime');
            sortByStartTime();
        }
        if (e.key === 'endTime') {
            setSortManner('endTime');
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

    useEffect(() => {
        switch (showManner) {
            case leftTarget.ALL_TASK: {
                if (sortManner === 'startTime') {
                    sortByStartTime();
                }
                if (sortManner === 'endTime') {
                    sortByEndTime();
                }
                break;
            }
            case leftTarget.TODAY_TASK:
                showTodayTask(); break;
            case leftTarget.TODAY_OVER:
                showTodayOver(); break;
            case leftTarget.HAVEN_OVER:
                showHavenOver(); break;
        }
    }, [showManner])

    return (
        <div className='task-tool-bar'>
            {activeKey === tabKey.DOING &&
                <div className='task-tool-bar_left'>
                    <div className={`all-task ${showManner === leftTarget.ALL_TASK ? 'active' : ''}`} onClick={() => setShowManner(leftTarget.ALL_TASK)}>全部</div>
                    <div className={`today-task ${showManner === leftTarget.TODAY_TASK ? 'active' : ''}`} onClick={() => setShowManner(leftTarget.TODAY_TASK)}>今日任务</div>
                    <div className={`today-over ${showManner === leftTarget.TODAY_OVER ? 'active' : ''}`} onClick={() => setShowManner(leftTarget.TODAY_OVER)}>今日截止</div>
                    <div className={`haven-over ${showManner === leftTarget.HAVEN_OVER ? 'active' : ''}`} onClick={() => setShowManner(leftTarget.HAVEN_OVER)}>已截止</div>
                </div>}
            <div className='task-tool-bar_right'>
                <div className='task-search'>
                    <AutoComplete
                        className='task-search-input'
                        value={value}
                        options={options}
                        style={{ width: 220 }}
                        onChange={onChange}
                        onSelect={onSelect}
                        onSearch={(text) => setOptions(getPanelValue(text))}
                        placeholder="搜索任务名称"
                        allowClear={{ clearIcon: <CloseSquareFilled /> }}
                        onClear={() => {
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
