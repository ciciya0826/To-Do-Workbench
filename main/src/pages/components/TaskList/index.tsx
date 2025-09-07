import { PlusIcon } from '@/assets/icons/PlusIcon';
import './index.less';
import TaskItem from './components/TaskItem';
import { DatePicker, Input, Tag, Button, message } from 'antd';
import { useMemo, useState } from 'react';
import { quickTimeConfig } from './config';
import TaskDetail from './components/TaskDetail';
import dayjs, { Dayjs } from 'dayjs';
import { api, getApi, postApi } from '@/api';
import { apiConfig } from '@/api/config';

export default function TaskList() {

  type taskT = {
    taskID: string
    title: string
    desc: string
    //startTime: Moment
    endTime: Dayjs
  }

  const [messageApi, contextHolder] = message.useMessage();
  const [isCreate, setIsCreate] = useState(false);  //是否继续展示DatePicker和tags
  const [DDL, setDDL] = useState<Dayjs | null>(null);
  const [curTitle, setCurTitle] = useState<string>('');
  const [tasks, setTasks] = useState<taskT[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTaskKey, setActiveTaskKey] = useState('');  //当前被激活的taskID

  const activeTask = useMemo(() => {
    return tasks.find(i => i.taskID === activeTaskKey)
  }, [tasks, activeTaskKey]);

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

  const handleCreate = () => {  //创建任务
    const taskid = Date.now().toString();
    const newTasks = {
      taskID: taskid,
      title: curTitle,
      desc: '',
      endTime: DDL
    }

    postApi(apiConfig.create.url, newTasks).then(data => {
      setTasks([...tasks, newTasks])
      setCurTitle('');
      setIsCreate(false);
      setDDL(null);
      messageApi.open({
      type: 'success',
      content: '创建成功',
      duration: 0.9,
    })
      console.log(data);
    })
  }

  const OpenTask = (taskID: string) => {  //打开侧边栏
    setOpen(true);
    setActiveTaskKey(taskID)
  }

  const handleDelete = (key: string) => { //删除任务
    setActiveTaskKey(key)
    setTasks(tasks.filter(i => i.taskID !== key))
  }

  const handleFinish = (key: string) => {  //完成任务
    setActiveTaskKey(key)
    setTasks(tasks.filter(i => i.taskID !== key))
  }
  const onConfirm = (taskID: string, title: string, desc: string, endTime: Moment | null) => {
    setOpen(false);
    setTasks([...tasks.filter(i => i.taskID !== taskID), {
      taskID: Date.now().toString(),
      title: title,
      desc: desc,
      endTime: endTime
    }]);
    messageApi.open({
      type: 'success',
      content: '修改成功',
      duration: 0.9,
    });
  }

  return (
    <>
      {contextHolder}
      <div className='task-container'>
        <h1 className='title'>任务列表</h1>
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
        <div className='task-list'>
          {tasks.map((task) => (
            <TaskItem
              key={task.taskID}
              title={task.title}
              desc={task.desc}
              endTime={task.endTime.format('YYYY-MM-DD HH:mm:ss')}
              onClick={() => OpenTask(task.taskID)}
              active={activeTaskKey === task.taskID}
              onFinish={() => handleFinish(task.taskID)}
              onDelete={() => handleDelete(task.taskID)}
            />
          ))}
        </div>
        <TaskDetail task={activeTask} onClose={() => setOpen(false)} open={open} key={activeTaskKey} onConfirm={onConfirm} />
      </div>
    </>
  );
}
