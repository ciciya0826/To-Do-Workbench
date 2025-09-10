import { ReactNode } from 'react';
import './index.less';

interface IitemButton{
    name:string,
    count:number,
    active:boolean,
    onclick:()=>void,
    icon:ReactNode,
}

export default function MenuItem(props:IitemButton) {
    const {name,count,onclick,active,icon} =props
    const realCount=(name!=='进行中'&&name!=='已完成')?0:count;
  return (
    //active为true时，最终类名为："menu-item menu-item-active"
    <button className={`menu-item ${active ? 'menu-item-active' : ''}`} onClick={onclick}>  
        {icon}
        <span className='menu-item_name'>{name}</span>
        {realCount>0&&<span className='menu-item_count'>{realCount}</span>}
    </button>    
);
}
