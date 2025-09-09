import './index.less';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

interface iTaskItem {
  title: string
  desc: string
  // startTime: string
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

export default function TaskItem(props: iTaskItem) {
  const { title, desc, endTime, active = false, onClick, onDelete, onFinish, activeKey, finishTime } = props

  const overTime = dayjs(endTime).fromNow() //截止时间
  const handleTime = dayjs(finishTime).fromNow()

  return (
    <div className='task-item'>
      <div className={`task-item_info ${active ? 'task-item_info--active' : ''}`} onClick={onClick}>
        <div className='task-item_title'>{title}</div>
        <div className='task-item_tags'>
          <div className='task-item_ddl'>{endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : null}</div>
          <div className={`task-item_timeout ${dayjs(endTime).isBefore(dayjs()) || activeKey === 1 ? 'task-item_timeout_over' : ''}`}>{activeKey === 0 ? overTime : handleTime}{activeKey === 0 ? '截止' : '完成'}</div>

        </div>
        {/* <div className='task-item_desc'>{desc}</div> */}
      </div>
      <div className='task-item_status'>
        <button className='task-item_finish-btn' onClick={onFinish}>完成</button>
        <button className='task-item_delete-btn' onClick={onDelete}>删除</button>
      </div>
    </div >
  );
}
