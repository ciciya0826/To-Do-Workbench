import './index.less';
// @ts-nocheck
import GridLayout from 'react-grid-layout';
import '../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../node_modules/react-resizable/css/styles.css'
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Statistic, StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { getLocalStorage, saveLocalStorage } from '@/utils';

interface countItem {
  doingCount: number,
  doneCount: number,
}

interface iprops {
  count: countItem;
  todayFinishCount: number;
  todayRemainCount:number;
}

//获取Echarts中的数据
const getOption = (data: countItem) => {
  return {
    color: ['pink', 'lightblue'],
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '所选任务',
        type: 'pie',
        radius: ['50%', '95%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'black',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: data.doingCount, name: '正在进行中' },
          { value: data.doneCount, name: '已完成' },
        ]
      }
    ]
  };
}

//statistic数据
const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

export default function TaskStatistics(props: iprops) {
  const LAYOUT_KEY='lay-out';
  const { count, todayFinishCount,todayRemainCount } = props;
  const initialLayout = [
    { i: "allFinishCount", x:6, y: 6, w: 3, h: 10 ,minW:1, minH:7},
    { i: "todayFinishCount", x: 1, y: 0, w: 3, h: 10,minW:1, minH:7 },
    { i: "todayRemainCount", x: 3, y: 2, w: 3, h: 10 ,minW:1, minH:7},
    { i: "pie-charts", x: 0, y: 1, w: 3, h: 15 ,minW:2, minH:12 }
  ];
  const [layout,setLayout]=useState(getLocalStorage(LAYOUT_KEY,initialLayout));
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chartRef.current) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);
      const option = getOption(count);
      myChart.setOption(option);
      // 窗口大小变化时自动 resize
      const resizeObserver = new ResizeObserver(() => {
        myChart.resize();
      });
      resizeObserver.observe(chartDom);

      return () => {
        resizeObserver.disconnect();
        myChart.dispose();
      };
    }
  }, [count]);

  const renderCard = () => {
    const cardConfig = [
      {
        title: '任务完成量',
        color:'linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)',
        className: 'allFinishCount',
        content: () => {
          return (
            <Statistic className="my-statistic"  title="累计已完成任务量" value={count.doneCount} formatter={formatter} />
          );
        },
      },
      {
        title: '任务完成量',
        color: 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)',
        className: 'todayFinishCount',
        content: () => {
          return (
            <Statistic className="my-statistic"  title="今日已完成任务量" value={todayFinishCount} formatter={formatter} />
          );
        },
      },
      {
        title: '任务完成量',
        className: 'todayRemainCount',
        color: 'linear-gradient(to top, #f77062 0%, #fe5196 100%)',
        content: () => {
          return (
            <Statistic className="my-statistic"  title="今日剩余任务量" value={todayRemainCount} formatter={formatter} />
          );
        },
      },
      {
        title: '',
        className: 'pie-charts',
        color: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
        content: () => {
          return (
            <>
              <div className='pie-charts_text'>任务完成比</div>
              <div className='pie-charts_item' ref={chartRef} style={{ width: '100%', height: '400px' }} />
            </>
          );
        },
      }
    ];
    return cardConfig.map(i =>
    (
      <div key={i.className} className={i.className} style={{ backgroundImage: i.color }}>
        <div className='card-title'>{i.title}</div>
        {i.content()}
      </div>
    )
    )
  }

  const handleLayoutChange=(l:any)=>{
    console.log(l);
    saveLocalStorage(LAYOUT_KEY,l);
    setLayout(l);
  }

  return (
    <div className='task-charts'>
      <GridLayout
        className="layout"
        layout={layout}
        maxRows={Infinity}
        compactType={null}
        cols={20}
        rowHeight={10}
        width={1200}
        onLayoutChange={handleLayoutChange}
      >
        {renderCard()}
      </GridLayout>
    </div>
  );
}
