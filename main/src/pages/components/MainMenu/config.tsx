import { DoingIcon, DoneIcon } from "@/assets/icons/MainIcon";

const Config=[
    {
        name:'进行中',
        key:0,
        // countKey:'doingCount',
        icon:(<span className="my-icon">
            <DoingIcon/>
        </span>)
    },
    {
        name:'已完成',
        key:1,
        // countKey:'doneCount',
        icon:(<span className="my-icon">
            <DoneIcon/>
        </span>)
    }
]

export default Config;