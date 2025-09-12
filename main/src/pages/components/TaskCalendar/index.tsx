import './index.less'
import '../../scrollbar.less'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from 'react'
import { api, getApi } from '@/api';
import { apiConfig } from '@/api/config';
import { taskT } from '../TaskList';
import { tabKey } from '@/const';
import dayjs, { Dayjs } from 'dayjs';
import zhCN from '@fullcalendar/core/locales/zh-cn';

function formatTimeToChinese(isoTime: string | null): string | null {
    if (isoTime === null) return null;
    const time = dayjs(isoTime);
    const hour = time.hour(); // 获取24小时制的小时数（0-23）
    const minute = time.minute();
    const minuteStr = minute === 0 ? '' : `${minute}分`;
    let period: string;
    if (hour >= 0 && hour < 5) {
        period = '凌晨';
    } else if (hour >= 5 && hour < 9) {
        period = '早上';
    } else if (hour >= 9 && hour < 11) {
        period = '上午';
    } else if (hour === 11) {
        period = '中午';
    } else if (hour >= 12 && hour < 14) {
        period = '中午';
    } else if (hour >= 14 && hour < 18) {
        period = '下午';
    } else {
        period = '晚上';
    }
    const hour12 = hour % 12 || 12;
    return `${period}${hour12}点${minuteStr}`;
}
function formatDateToMonthDay(isoTime: string | null): string | null {
    if (isoTime === null) return null;
    const time = dayjs(isoTime);
    return `${time.month() + 1}月${time.date()}日`;
}

const eventContent = (arg: any) => {
    const start = arg.event.start;
    const finishTime = arg.event.extendedProps.finishTime;
    const end = finishTime ? new Date(finishTime) : arg.event.end;
    let isShort = true; // 是否小于1天
    let timeText = '';
    if (start && end) {
        const diff = end.getTime() - start.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        isShort = diff < oneDay;
        if (isShort) {
            const endTimeStr = formatTimeToChinese(end.toISOString());
            timeText = endTimeStr ? `${endTimeStr} ` : '';
        } else {
            const startDateStr = formatDateToMonthDay(start.toISOString());
            const endDateStr = formatDateToMonthDay(end.toISOString());
            timeText = startDateStr && endDateStr ? `${startDateStr}-${endDateStr} ` : '';
        }
    }
    return (
        <div className='task-display'>

            <div className='task-text'>{isShort && (
                <span className={`task-dot ${arg.event.extendedProps.finishTime === null ? 'dot-red ' : 'dot-green'}`}></span>
            )}{timeText}{arg.event.title}</div>
        </div>
    );
}

export default function TaskCalendar() {
    const [tasks, setTasks] = useState<taskT[]>([]);

    useEffect(() => {
        const getTasks = async () => {
            const doingData = await getApi(apiConfig.list.url, { tab: tabKey.DOING });
            console.log('doingData', doingData.data);
            const doneData = await getApi(apiConfig.list.url, { tab: tabKey.DONE });
            const allData: taskT[] = [...doingData.data, ...doneData.data];
            setTasks(allData);
        }
        getTasks();
    }, []);
    console.log('tasks', tasks);

    const calendarRef = useRef(null)

    return (
        <div className='task-calendar'>
            <FullCalendar
                dayMaxEventRows={true}  // 超出时折叠成“+n more”
                fixedWeekCount={false}   // 强制显示 6 周
                showNonCurrentDates={true}
                locale={zhCN}
                height='auto'       // 日历总高度
                contentHeight="auto"  // 内容高度自动适应
                expandRows={true}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}    //加载功能模块,月视图,周/日视图,交互
                initialView="dayGridMonth"  //默认显示的视图
                headerToolbar={{    //顶部工具栏
                    left: "",
                    center: "title",
                    right: "today prev,next",
                }}
                events={tasks ? tasks.map((task) => {
                    const actualEndTime = task.finishTime ? task.finishTime : task.endTime;
                    const start = dayjs(task.startTime).toDate();
                    const end = dayjs(actualEndTime).toDate();
                    const diff = end.getTime() - start.getTime();
                    const oneDay = 24 * 60 * 60 * 1000;
                    let isShort = diff < oneDay;
                    return {
                        id: task.taskID,
                        title: task.title,
                        start: start,
                        end: end,
                        extendedProps: {
                            desc: task.desc,
                            status: task.status,
                            finishTime: task.finishTime ? dayjs(task.finishTime).toDate() : '',
                        },
                        className: isShort ? 'normal' : `drag${task.finishTime === null ? '-none' : '-ok'}`, //是拖拽条还是单独的
                    }
                }) : []}
                eventContent={(arg) => eventContent(arg)}
                editable={false} //事件可拖拽
                selectable={true}   //可在日历上框选时间
                select={(info) => { //选择时间段时触发
                    // alert(`选择了 ${info.startStr} 到 ${info.endStr}`);
                }}
                eventClick={(info) => { //点击某事件时触发
                    // alert(`点击了事件：${info.event.title}`);
                }}
            />
        </div>
    );
}
