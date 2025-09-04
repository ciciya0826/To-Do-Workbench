import { Moment } from 'moment';
import './index.less';
import { useState } from 'react';

interface iTaskItem {
  title: string
  desc: string
  // startTime: string
  endTime: Moment
  // status: 'doing' | 'finished'
  active: boolean
  onClick:()=>void
  onFinish:()=>void
}

export default function TaskItem(props: iTaskItem) {
  const { title, desc, endTime, active=false, onClick, onFinish} = props

  return (
    <div className='task-item'>
      <div className={`task-item_info ${active?'task-item_info--active':''}`} onClick={onClick}>
        <div className='task-item_title'>{title}</div>
        <div className='task-item_ddl'>{endTime}</div>
        {/* <div className='task-item_desc'>{desc}</div> */}
      </div>
      <div className='task-item_status'>
        <button className='task-item_finish-btn' onClick={onFinish}>完成</button>
        <button className='task-item_delete-btn' onClick={onClick}>删除</button>
      </div>
    </div >
  );
}
