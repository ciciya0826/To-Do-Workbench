import { DoingIcon, DoneIcon } from "@/assets/icons/MainIcon";
import { icons } from "antd/es/image/PreviewGroup";

const Config=[
    {
        name:'进行中',
        key:0,
        count:1,
        icon:(<span className="my-icon">
            <DoingIcon/>
        </span>)
    },
    {
        name:'已完成',
        key:1,
        count:10,
        icon:(<span className="my-icon">
            <DoneIcon/>
        </span>)
    }
]

export default Config;