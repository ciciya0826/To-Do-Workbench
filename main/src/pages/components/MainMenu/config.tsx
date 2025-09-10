import { CalendarIcon, DoingIcon, DoneIcon } from "@/assets/icons/Icons";


const Config=[
    {
        name:'日历视图',
        key:10,
        icon:(<div className="my-icon" >
            <CalendarIcon />
        </div>
        )
    },
    {
        name:'进行中',
        key:0,
        // countKey:'doingCount',
        icon:(<div className="my-icon">
            <DoingIcon/>
        </div>)
    },
    {
        name:'已完成',
        key:1,
        // countKey:'doneCount',
        icon:(<div className="my-icon">
            <DoneIcon/>
        </div>)
    }
]

export default Config;