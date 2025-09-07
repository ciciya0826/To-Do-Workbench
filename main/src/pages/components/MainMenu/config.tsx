import { DoingIcon, DoneIcon } from "@/assets/icons/MainIcon";
import { icons } from "antd/es/image/PreviewGroup";

const Config=[
    {
        name:'进行中',
        key:'doing',
        count:1,
        icon:(<span className="my-icon">
            <DoingIcon/>
        </span>)
    },
    {
        name:'已完成',
        key:'finished',
        count:10,
        icon:(<span className="my-icon">
            <DoneIcon/>
        </span>)
    }
]

export default Config;