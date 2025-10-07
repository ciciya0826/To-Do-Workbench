import './index.less';
import MenuItem from './MenuItem';
import Config from './config';
import logo from "../../../assets/logoIn.png";

interface countItem {
    doingCount: number,
    doneCount: number,
}

interface iprops {
    activeKey: number;
    count:countItem;
    onClick: (key: number) => void;
}

export default function MainMenu(props: iprops) {
    const { activeKey, onClick ,count} = props;

    return (
        <div className='main-menu'>
                <img className='logo-div' src={logo} />
                <h3>Todo_workbench</h3>
            {Config.map((i) => {
                return (<MenuItem
                    name={i.name}
                    count={i.key === 0 ? count.doingCount : count.doneCount}
                    active={activeKey === i.key}
                    icon={i.icon}
                    key={i.key}
                    onclick={() => onClick(i.key)} />)
            })}
        </div>
    );
}
