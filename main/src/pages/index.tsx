import './index.less'
import MainMenu from './components/MainMenu';
import TaskList from './components/TaskList';
import { useState } from 'react';
import { tabKey } from '@/const';
import TaskToolBar from './components/TaskList/components/TaskToolBar';
import TaskCalendar from './components/TaskCalendar';

export default function IndexPage() {
  const [tab, setTab] = useState(tabKey.DOING);
  const [isChange, setIsChange] = useState(false);

  return (
    <div className='page container'>
      <MainMenu activeKey={tab} isChange={isChange} onClick={setTab} />
      <div className='right-page'>
        <TaskToolBar />
        {[tabKey.DOING, tabKey.DONE].includes(tab) &&
          <TaskList activeKey={tab} isChange={isChange} onClick={setIsChange} />
        }
        {tab === tabKey.CALENDAR && <TaskCalendar />}
      </div>
    </div>
  );
}
