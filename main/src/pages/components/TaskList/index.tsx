import { PlusIcon } from '@/assets/icons/PlusIcon';
import './index.less';
import TaskItem from './TaskItem';
import { DatePicker, Input, Tag } from 'antd';
import { useState } from 'react';

export default function TaskList() {
  const onChange=(value:any, dateString:string | string[]) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }
  const onOk = (value:any) => {
  console.log('onOk: ', value);
};
  const [isCreate,setIsCreate] = useState(false);
  const handleFocus=()=>{
    setIsCreate(true);
  }
  return (
    <div className='task-container'>
      <h1 className='title'>任务列表</h1>
      <div className='add-task-btn'>
        <div className='add-task-btn_inner'>
          <PlusIcon />
          <Input className='text' placeholder='创建任务' onFocus={handleFocus} onBlur={()=>setIsCreate(false)}/>
        </div>
        {isCreate && <div className='tags-container'>
          <Tag className='tags' color="success">今天</Tag>
          <Tag className='tags' color="processing">明天</Tag>
          <Tag className='tags' color="cyan">其他时间</Tag>
          </div>}
      </div>
      {/* <DatePicker  className='datepicker' showTime onChange={onChange} onOk={onOk} placeholder='选择任务截止日期'/> */}
      <div className='task-list'>
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
        <TaskItem title='测试' desc='测试描述' endTime='7月5日' />
      </div>
    </div>
  );
}
