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
import dayjs from 'dayjs';
import zhCN from '@fullcalendar/core/locales/zh-cn';

/** 时间格式化为中文：凌晨/早上/上午... */
function formatTimeToChinese(isoTime: string | null): string | null {
    if (isoTime === null) return null;
    const time = dayjs(isoTime);
    const hour = time.hour();
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

/** 日期格式化为 X月X日 */
function formatDateToMonthDay(isoTime: string | null): string | null {
    if (isoTime === null) return null;
    const time = dayjs(isoTime);
    return `${time.month() + 1}月${time.date()}日`;
}

/** 自定义事件内容 */
const eventContent = (arg: any) => {
    const start = arg.event.start;
    const finishTime = arg.event.extendedProps.finishTime;
    const end = finishTime ? new Date(finishTime) : arg.event.end;

    let isShort = true; // 只要开始和结束不在同一天就为 false
    let timeText = '';

    if (start && end) {
        // ✅ 新逻辑：同一天才是短任务
        isShort = dayjs(start).isSame(end, 'day');

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
            <div className='task-text'>
                {isShort && (
                    <span
                        className={`task-dot ${arg.event.extendedProps.finishTime === null ? 'dot-red' : 'dot-green'}`}
                    ></span>
                )}
                {timeText}{arg.event.title}
            </div>
        </div>
    );
};

export default function TaskCalendar() {
    const [tasks, setTasks] = useState<taskT[]>([]);

    useEffect(() => {
        const getTasks = async () => {
            const doingData = await getApi(apiConfig.list.url, { tab: tabKey.DOING });
            const doneData = await getApi(apiConfig.list.url, { tab: tabKey.DONE });
            const allData: taskT[] = [...doingData.data, ...doneData.data];
            setTasks(allData);
        };
        getTasks();
    }, []);

    const calendarRef = useRef(null);

    return (
        <div className='task-calendar'>
            <FullCalendar
                dayMaxEventRows={true}          // 超出时折叠成“+n more”
                fixedWeekCount={false}          // 不强制显示6周
                showNonCurrentDates={true}
                locale={zhCN}
                height='auto'                   // 日历总高度
                contentHeight="auto"            // 内容高度自动适应
                expandRows={true}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "",
                    center: "title",
                    right: "today prev,next",
                }}
                events={
                    tasks
                        ? tasks.map((task) => {
                              const actualEndTime = task.finishTime ? task.finishTime : task.endTime;
                              // ✅ 同一天才是短任务
                              const isShort = dayjs(task.startTime).isSame(actualEndTime, 'day');

                              return {
                                  id: task.taskID,
                                  title: task.title,
                                  start: task.startTime,
                                  end: actualEndTime,
                                  extendedProps: {
                                      desc: task.desc,
                                      status: task.status,
                                      finishTime: task.finishTime ? dayjs(task.finishTime).toDate() : '',
                                  },
                                  className: isShort
                                      ? 'normal'
                                      : `drag${task.finishTime === null ? '-none' : '-ok'}`,
                              };
                          })
                        : []
                }
                eventContent={(arg) => eventContent(arg)}
                editable={false}
                selectable={true}
                select={(info) => {
                    // 选择时间段回调
                }}
                eventClick={(info) => {
                    // 点击事件回调
                }}
            />
        </div>
    );
}
