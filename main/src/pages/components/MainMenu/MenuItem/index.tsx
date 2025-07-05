import { ReactNode } from 'react';
import './index.less';

interface IitemButton{
    name:string,
    count:number,
    active:boolean,
    onclick:()=>void,
    icon?:ReactNode,
}

export default function MenuItem(props:IitemButton) {
    const {name,count,onclick,active,icon} =props
  return (
    //active为true时，最终类名为："menu-item menu-item-active"
    <button className={`menu-item ${active ? 'menu-item-active' : ''}`} onClick={onclick}>  
        <span className='menu-item_name'>{name}</span>
        <span className='menu-item_count'>{count}</span>
    </button>    
);
}
