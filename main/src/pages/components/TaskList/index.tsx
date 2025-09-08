import { PlusIcon } from '@/assets/icons/PlusIcon';
import './index.less';
import TaskItem from './components/TaskItem';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import TaskDetail from './components/TaskDetail';
import dayjs, { Dayjs } from 'dayjs';
import { api, getApi, postApi } from '@/api';
import { apiConfig } from '@/api/config';
import { tabKey, TASK_STATUS } from '@/const';
import TaskCreator from './components/TaskCreater';

export type taskT = {
  taskID: string;
  title: string;
  desc: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  status: number;
}

interface iprops {
  activeKey: number,
}

export default function TaskList(props: iprops) {
  const { activeKey } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [tasks, setTasks] = useState<taskT[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTaskKey, setActiveTaskKey] = useState('');  //当前被激活的taskID

  useEffect(() => {
    getLatestList(activeKey);
  }, [activeKey]);

  //获取最新列表
  const getLatestList = (activeKey: number) => {
    getApi(apiConfig.list.url, { tab: activeKey }).then(res => {
      if (res.code === 1) {
        const latestTasks = res.data.map((i: taskT) => {
          return Object.assign(i, { endTime: dayjs(i.endTime) })
        })
        setTasks(latestTasks);
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
  const handleDelete = (key: string) => {
    // setActiveTaskKey(key)
    postApi(apiConfig.remove.url, { taskID: key }).then(res => {
      if (res.code === 1) {
        getLatestList(0);
        messageApi.open({
          type: 'success',
          content: '删除成功',
          duration: 0.9,
        })
      } else {
        message.error(res.msg);
      }
    })
    // setTasks(tasks.filter(i => i.taskID !== key))
  }

  //完成任务
  const handleFinish = (key: string) => {
    postApi(apiConfig.update.url, {
      taskID: key,
      status: TASK_STATUS.DONE,
    }).then(res => {
      if (res.code === 1) {
        getLatestList(0);
        messageApi.open({
          type: 'success',
          content: '修改成功',
          duration: 0.9,
        });
      } else {
        message.error(res.msg);
      }
    })
    // setActiveTaskKey(key)
    // setTasks(tasks.filter(i => i.taskID !== key))
  }

  //侧边栏中确认修改
  const onConfirm = (taskID: string, title: string, desc: string, startTime: Dayjs | null, endTime: Dayjs | null, status: 0 | 1) => {
    setOpen(false);
    postApi(apiConfig.update.url, {
      taskID: taskID,
      title: title,
      desc: desc,
      startTime: startTime,
      endTime: endTime,
      status: TASK_STATUS.DOING,
    }).then(res => {
      if (res.code === 1) {
        getLatestList(0);
        messageApi.open({
          type: 'success',
          content: '任务完成',
          duration: 0.9,
        });
      } else {
        message.error(res.msg);
      }
    })
    // setTasks([...tasks.filter(i => i.taskID !== taskID), {
    //   taskID: Date.now().toString(),
    //   title: title,
    //   desc: desc,
    //   startTime:startTime,
    //   endTime: endTime,
    //   status:0,
    // }]);
  }

  return (
    <>
      {contextHolder}
      <div className='task-container'>
        <h1 className='title'>任务列表</h1>
        {activeKey === tabKey.DOING&&<TaskCreator onCreate={handleCreate} />}
        <div className='task-list'>
          {tasks.map((task) => (
            <TaskItem
              key={task.taskID}
              title={task.title}
              desc={task.desc}
              endTime={task.endTime ? task.endTime : null}
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
