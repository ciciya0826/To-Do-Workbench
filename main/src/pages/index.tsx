import './index.less'
import MainMenu from './components/MainMenu';
import TaskList, { taskT } from './components/TaskList';
import { useEffect, useState } from 'react';
import { tabKey } from '@/const';
import TaskToolBar from './components/TaskList/components/TaskToolBar';
import TaskCalendar from './components/TaskCalendar';
import { api, getApi } from '@/api';
import { apiConfig } from '@/api/config';
import TaskStatistics from './components/TaskStatistics';
import dayjs from 'dayjs';

//任务数量
interface countItem {
  doingCount: number,
  doneCount: number,
}

export default function IndexPage() {
  const [tab, setTab] = useState(tabKey.DOING);
  const [isChange, setIsChange] = useState(false);
  const [count, setCount] = useState<countItem>(
    {
      doingCount: 0,
      doneCount: 0,
    }
  )
  const [todayFinishCount, setTodayFinishCount] = useState(0);

  const getCount = () => {
    api(apiConfig.count.url).then(res =>
      setCount(res.data)
    )
  }

  const getFinishCount = () => {
    getApi(apiConfig.list.url, { tab: tabKey.DONE }).then(res => {
      if (res.code === 1) {
        const todayStart=dayjs().startOf('day');
        const latestTasks = res.data.filter((i: taskT) => 
        {
          const finishTime=dayjs(i.finishTime);
          return finishTime.isBefore(todayStart);
        }
        );
        setTodayFinishCount(latestTasks.length);
      }
      else { }
    }).catch((e) => { console.log('Error:', e); });
  }

  useEffect(() => {
    getCount();
    getFinishCount();
  }, [isChange]);


  return (
    <div className='page container'>
      <MainMenu activeKey={tab} onClick={setTab} count={count} />
      <div className='right-page'>
        <TaskToolBar />
        {[tabKey.DOING, tabKey.DONE].includes(tab) &&
          <TaskList activeKey={tab} isChange={isChange} onClick={setIsChange} />
        }
        {tab === tabKey.CALENDAR && <TaskCalendar />}
        {tab === tabKey.CHARTS && <TaskStatistics count={count} todayFinishCount={todayFinishCount}/>}
      </div>
    </div>
  );
}
