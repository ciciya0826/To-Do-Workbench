import './index.less';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { tabKey } from '@/const';
import { useEffect } from 'react';

interface iTaskItem {
  title: string
  desc: string
  startTime: Dayjs | null
  endTime: Dayjs | null
  // status: 'doing' | 'finished'
  active: boolean
  onClick: () => void
  onDelete: () => void
  onFinish: () => void
  activeKey: number
  finishTime: Dayjs | null
}

//tags中的时间
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');
dayjs.locale('zh-cn');

const isBetween = (target: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs): boolean => {
  const targetUnix = target.unix();
  const startUnix = start.unix();
  const endUnix = end.unix();
  // 判断 target 是否在 [start, end) 区间内（可根据需求调整为闭区间）
  return targetUnix >= startUnix && targetUnix < endUnix;
};

export default function TaskItem(props: iTaskItem) {
  const { title, startTime, endTime, active = false, onClick, onDelete, onFinish, activeKey, finishTime } = props

  const overTime = dayjs(endTime).fromNow() //截止时间
  const handleTime = dayjs(finishTime).fromNow()

  const isInRange = (activeKey === tabKey.DOING) && isBetween((endTime?endTime:dayjs(endTime)), dayjs(), dayjs().add(3, 'day'))
  // useEffect(()=>{
  //   console.log(title,isInRange)
  //   console.log('endTime',endTime)
  //   console.log('now',dayjs().toString())
  //   console.log('later',dayjs().add(3,'day').toString())
  //   console.log(isBetween(dayjs(endTime), dayjs(), dayjs().add(3, 'day')))
  // },[])

  return (
    <div className='task-item'>
      <div className={`task-item_info ${active ? 'task-item_info--active' : ''}`} onClick={onClick}>
        <div className='task-item_title'>{title}</div>
      </div>
      <div className='task-item_status'>
        <button className='task-item_finish-btn' onClick={onFinish}>{activeKey===tabKey.DOING&&'完成'}{activeKey===tabKey.DONE&&'未完成'}</button>
        <button className='task-item_delete-btn' onClick={onDelete}>删除</button>
      </div>
      <div className='divide'></div>
      <div className='task-item_tags'>
        <div className='task-item-start'>
          <div className='task-item-start_text'>开始时间</div>
          <div className='task-item-start_time'>{startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : null}</div>
        </div>
        <div className='task-item-ddl'>
          <div className='task-item-ddl_text'>结束时间</div>
          <div className='task-item-ddl_time'>{endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : null}</div>
        </div>
        {isInRange && <div className={`task-item-timeout ${dayjs(endTime).isBefore(dayjs()) || activeKey===tabKey.DOING ? 'task-item_timeout_over' : ''}`}>
          <div className='task-item-timeout_text'>截止状态</div>
          <div className={`task-item-timeout_time ${dayjs(endTime).isBefore(dayjs()) || activeKey === tabKey.DOING ? 'task-item_timeout_over' : ''}`}>{activeKey === tabKey.DONE ? overTime : handleTime}{activeKey === tabKey.DONE ? '截止' : '完成'}</div>
        </div>}
      </div>
    </div >
  );
}
