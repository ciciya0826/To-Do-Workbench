import { CalendarIcon, ListIcon } from '@/assets/icons/Icons';
import './index.less'

export default function TaskToolBar() {

    return (
        <div className='task-tool-bar'>
                <div className='bar-icons'>
                    <div className='list-icon'>
                        <ListIcon />
                    </div>
                    <div className='calendar-icon'>
                        <CalendarIcon />
                    </div>
                </div>
        </div>
    );
}
