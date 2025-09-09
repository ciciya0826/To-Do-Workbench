import { useEffect, useMemo, useState } from 'react';
import './index.less'
import { Drawer, Form, Input, Button } from 'antd';
import QuickDatePicker from '../QuickDatePicker';
import { Dayjs } from 'dayjs';
import { taskT } from '../..';
import { TASK_STATUS } from '@/const';

interface iDrawer {
    task?: taskT
    activeKey:number
    onClose: () => void
    open: boolean
    onConfirm:(taskID:string,title:string,desc:string,startTime:Dayjs|null,endTime:Dayjs|null,status:number)=>void
}

export default function TaskDetail(props: iDrawer) {
    const { task,activeKey, onClose, open,onConfirm } = props
    const { TextArea } = Input;
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [realDDL, setRealDDL] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (open && task) {  //刚打开
            setTitle(task?.title || '');
            setDesc(task?.desc || '');
            setRealDDL(task?.endTime || null);
        }
    }, [open, task]);
    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    }
    const renderTitle = (task?: taskT) => {
        return (
            <Input value={title} onChange={handleTitleChange} size='large'/>
        )
    }
    const onFinish = (e: any) => {
        if(realDDL===null || title===null){

        }
        console.log('Success:', e, title, desc, realDDL);
    }
    const onFinishFailed= (e:any) => {
        console.log('Failed:', e);
      };
    const onDescChange = (e:any) => {
        setDesc(e.target.value)
    };

    return (
        <Drawer title={renderTitle(task)}
            closable={false}
            onClose={onClose}
            open={open}
        >
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Form.Item>
                    <QuickDatePicker value={realDDL} onChange={(val: Dayjs | null) => setRealDDL(val)} />
                </Form.Item>
                <Form.Item>
                    <TextArea
                        value={desc}
                        onChange={onDescChange}
                        placeholder="在此输入任务描述"
                        autoSize={{ minRows: 5 }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block size='large' onClick={()=>onConfirm(task?.taskID||'',title,desc,task?.startTime||null,realDDL,activeKey)}>确认</Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}
