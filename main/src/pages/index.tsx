import './index.less'
import MainMenu from './components/MainMenu';
import TaskList from './components/TaskList';
import { useState } from 'react';
import { tabKey } from '@/const';

export default function IndexPage() {
  const [tab,setTab]=useState(tabKey.DOING);

  return (
    <div className='page container'>
      <MainMenu activeKey={tab} onClick={setTab}/>
      <TaskList activeKey={tab}/>
    </div>
  );
}
