import './index.less';

interface iTaskItem {
  title: string
  desc: string
  // startTime: string
  endTime: string
  // status: 'doing' | 'finished'
}

export default function TaskItem(props: iTaskItem) {
  const { title, desc, endTime,  } = props
  return (
    <div className='task-item'>
      <div className='task-item_info'>
        <div className='task-item_title'>
          {title}
        </div>
        <div className='task-item_desc'>
          {desc}
        </div>
      </div>
      <div className='task-item_status'>
        <div className='task-item_ddl'>
          {endTime}
        </div>
        <button className='task-item_finish-btn'>
          完成
        </button>
      </div>
    </div>
  );
}
