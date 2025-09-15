import './index.less';
import TaskItem from './components/TaskItem';
import { Empty, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import TaskDetail from './components/TaskDetail';
import dayjs, { Dayjs } from 'dayjs';
import { api, getApi, postApi } from '@/api';
import { apiConfig } from '@/api/config';
import { tabKey, TASK_STATUS } from '@/const';
import TaskCreator from './components/TaskCreater';
import TaskToolBar from './components/TaskToolBar';

export type taskT = {
  taskID: string;
  title: string;
  desc: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  status: number;
  finishTime: Dayjs | null;
}

interface iprops {
  activeKey: number,
  isChange: boolean,
  onClick: (key: boolean) => void;
}

export default function TaskList(props: iprops) {
  const { activeKey, isChange, onClick } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [tasks, setTasks] = useState<taskT[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTaskKey, setActiveTaskKey] = useState('');  //当前被激活的taskID

  useEffect(() => {
    getLatestList(activeKey);
    // onClick(!isChange);
  }, [activeKey]);

  //获取最新列表
  const getLatestList = (activeKey: number) => {
    getApi(apiConfig.list.url, { tab: activeKey }).then(res => {
      if (res.code === 1) {
        const latestTasks = res.data.map((i: taskT) => (
          {
            ...i,
            startTime: i.startTime ? dayjs(i.startTime) : null,
            endTime: i.endTime ? dayjs(i.endTime) : null,
            finishTime: i.finishTime ? dayjs(i.finishTime) : null
          }
        ))
        setTasks(latestTasks);
        onClick(!isChange);
      }
      else { }
    }).catch((e) => { console.log('Error:', e); });
  }

  const activeTask = useMemo(() => {
    return tasks.find(i => i.taskID === activeTaskKey)
  }, [tasks, activeTaskKey]);

  //创建任务
  const handleCreate = (newTasks: taskT) => {
    postApi(apiConfig.create.url, newTasks).then(data => {
      getLatestList(0);
      // setTasks([...tasks, newTasks])
      // setCurTitle('');
      // setIsCreate(false);
      // setDDL(null);
      messageApi.open({
        type: 'success',
        content: '创建成功',
        duration: 0.9,
      })
      console.log(data);
    })
  }

  //打开侧边栏
  const OpenTask = (taskID: string) => {
    setOpen(true);
    setActiveTaskKey(taskID)
  }

  //删除任务
  const handleDelete = (key: string, activeKey: number) => {
    postApi(apiConfig.remove.url, { taskID: key, tab: activeKey }).then(res => {
      if (res.code === 1) {
        getLatestList(res.data);
        messageApi.open({
          type: 'success',
          content: '删除成功',
          duration: 0.9,
        })
      } else {
        message.error(res.msg);
      }
    })
  }

  //完成任务 activeKey在哪种列表 status写入哪个文件
  const handleFinish = (key: string, activeKey: number, finishTime: Dayjs | null) => {
    postApi(apiConfig.update.url, {
      taskID: key,
      status: !activeKey,
      tab: activeKey,
      finishTime: finishTime,
    }).then(res => {
      if (res.code === 1) {
        getLatestList(activeKey);
        messageApi.open({
          type: 'success',
          content: '修改成功',
          duration: 0.9,
        });
      } else {
        message.error(res.msg);
      }
    })
  }

  //侧边栏中确认修改
  const onConfirm = (taskID: string, title: string, desc: string, startTime: Dayjs | null, endTime: Dayjs | null, activeKey: number, finishTime: Dayjs | null) => {
    setOpen(false);
    postApi(apiConfig.update.url, {
      taskID: taskID,
      title: title,
      desc: desc,
      startTime: startTime,
      endTime: endTime,
      status: activeKey,
      tab: activeKey,
      finishTime: finishTime,
    }).then(res => {
      if (res.code === 1) {
        getLatestList(activeKey);
        messageApi.open({
          type: 'success',
          content: '任务完成',
          duration: 0.9,
        });
      } else {
        message.error(res.msg);
      }
    })
  }

  //按任务开始时间排序
  const sortByStartTime = (activeKey: number) => {
    getApi(apiConfig.sort.url,{tab:activeKey,sort:'start'}).then(res=>{
      if(res.code===1){
        console.log('1');
        getLatestList(activeKey);
      }
    })
  }
  //按任务截止时间排序
  const sortByEndTime = (activeKey: number) => {
    getApi(apiConfig.sort.url,{tab:activeKey,sort:'end'}).then(res=>{
      if(res.code===1){
        console.log('1');
        getLatestList(activeKey);
      }
    })
  }


  return (
    <>
      {contextHolder}
      <TaskToolBar sortByStartTime={() => sortByStartTime(activeKey)} sortByEndTime={() => sortByEndTime(activeKey)} />
      <div className='task-container'>
        {activeKey === tabKey.DOING && <TaskCreator onCreate={handleCreate} />}
        <div className='task-list'>
          {tasks.length === 0 && <Empty description={activeKey === 0 ? '暂无正在进行中的任务' : '还没有完成过任务哦'} />}
          {tasks.map((task) => (
            <TaskItem
              key={task.taskID}
              title={task.title}
              desc={task.desc}
              startTime={task.startTime}
              endTime={task.endTime ? task.endTime : null}
              onClick={() => OpenTask(task.taskID)}
              active={activeTaskKey === task.taskID}
              onFinish={() => handleFinish(task.taskID, activeKey, dayjs())}
              onDelete={() => handleDelete(task.taskID, activeKey)}
              activeKey={activeKey}
              finishTime={task.finishTime ? task.finishTime : null}
            />
          ))}
        </div>
        <TaskDetail task={activeTask} activeKey={activeKey} onClose={() => setOpen(false)} open={open} key={activeTaskKey} onConfirm={onConfirm} />
      </div>
    </>
  );
}
