import './index.less';
import TaskItem from './TaskItem';

export default function TaskList() {
  return (
    <div className='task-container'>
      <h1 className='title'>任务列表</h1>
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
