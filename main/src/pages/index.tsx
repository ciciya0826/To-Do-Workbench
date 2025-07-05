import './index.less'
import MainMenu from './components/MainMenu';
import TaskList from './components/TaskList';

export default function IndexPage() {
  return (
    <div className='page container'>
      <MainMenu />
      <TaskList />
    </div>
  );
}
