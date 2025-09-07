import './index.less'
import { quickTimeConfig } from '../../config';
import { Tag, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';


interface iDate {
    value?: Dayjs|null
    onChange?:(value:Dayjs|null)=>void
}

export default function QuickDatePicker(props: iDate) {
    const { value,onChange } = props;
    
    const onOk = (value: any) => {
        console.log('onOk: ', value);
    };
    const handleQuickCreate = (value: number) => {
        let time = dayjs().add(value, 'd');
        onChange?.(time);
      }

    return (
        <div className='datepicker-container'>
            <DatePicker value={value} size='large' className='datepicker' showTime onChange={onChange} onOk={onOk} placeholder='选择任务截止日期' />
            <div className='tags-btn'>
                {quickTimeConfig.map(i => (
                    <Tag key={i.offset}
                        className='tags'
                        color={i.color}
                        onClick={() => handleQuickCreate(i.offset)}>{i.title}</Tag>
                ))}
            </div>
        </div>
    );
}
