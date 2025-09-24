import './index.less';
import GridLayout from 'react-grid-layout';
import '../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../node_modules/react-resizable/css/styles.css'
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Checkbox, Dropdown, Space, Statistic, StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { getLocalStorage, saveLocalStorage } from '@/utils';
import { FilterIcon } from '@/assets/icons/Icons';


interface countItem {
  doingCount: number,
  doneCount: number,
}

interface iprops {
  count: countItem;
  todayFinishCount: number;
  todayRemainCount: number;
}

//获取饼图中的数据
const getPieOption = (data: countItem) => {
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
//获取仪表盘中的数据
const getGaugeOption = (data: countItem) => {
  return {
    series: [
      {
        type: 'gauge',
        radius: '95%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,  //分割份数
        itemStyle: {
          color: 'red',
          shadowColor: 'rgba(29, 29, 29, 0.45)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: { //进度条
          show: true,
          roundCap: true, //看起来更圆润
          width: 21,
        },
        pointer: {  //指针
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '75%',
          width: 20,
          offsetCenter: [0, '5%']
        },
        axisLine: { //轴线
          roundCap: true,
          lineStyle: {
            width: 20
          }
        },
        axisTick: { //刻度线
          splitNumber: 2,
          lineStyle: {
            width: 1,
            color: 'white'
          }
        },
        splitLine: {  //分割线
          length: 6,
          lineStyle: {
            width: 2,
            color: 'white'
          }
        },
        axisLabel: {  //标签
          distance: 25,
          color: 'white',
          fontSize: 15
        },
        title: {  //标题
          show: false
        },
        detail: {
          backgroundColor: '#fff',
          borderColor: '#999',
          borderWidth: 1,
          width: '60%',
          lineHeight: 20,
          height: 25,
          borderRadius: 8,
          offsetCenter: [0, '30%'],
          valueAnimation: true, //有动画效果
          padding: [10, 0, 0, 3],
          formatter: (v: number) => v.toFixed(0) + '%',
          rich: {
            value: {
              fontSize: 25,
              fontWeight: 'bolder',
              color: '#777',
              align: 'center',
              verticalAlign: 'middle'
            },
          }
        },
        data: [
          {
            max: 100,
            value: (data.doneCount / (data.doneCount + data.doingCount)) * 100
          }
        ]
      }
    ]
  }
}

//statistic数据
const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);


export default function TaskStatistics(props: iprops) {
  const LAYOUT_KEY = 'lay-out';
  const VISIBLE_CARD = 'visible-card';
  const { count, todayFinishCount, todayRemainCount } = props;
  const initialLayout = [
    { i: "allFinishCount", x: 13, y: 0, w: 6, h: 13, minW: 1, minH: 7 },
    { i: "todayFinishCount", x: 0, y: 24, w: 6, h: 12, minW: 1, minH: 7 },
    { i: "todayRemainCount", x: 7, y: 19, w: 6, h: 14, minW: 1, minH: 7 },
    { i: "pie-charts", x: 6, y: 0, w: 6, h: 17, minW: 2, minH: 12 },
    { i: "allRemainCount", x: 14, y: 19, w: 6, h: 12, minW: 1, minH: 7 },
    { i: "gauge-charts", x: 0, y: 0, w: 5, h: 23, minW: 2, minH: 12 },
  ];
  const visibleCards = [
    { i: "allFinishCount", title: "累计已完成任务量" },
    { i: "todayFinishCount", title: "今日已完成任务量" },
    { i: "todayRemainCount", title: "今日剩余任务量" },
    { i: "pie-charts", title: "任务完成比" },
    { i: "allRemainCount", title: "总剩余任务量" },
    { i: "gauge-charts", title: "任务完成进度" }
  ]
  const [layout, setLayout] = useState(getLocalStorage(LAYOUT_KEY, initialLayout));
  const [visibleCard, setVisibleCard] = useState<string[]>(getLocalStorage(VISIBLE_CARD, visibleCards.map(card => card.i)));
  const [open, setOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);

  //饼图
  useEffect(() => {
    if (chartRef.current) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);
      const pieOption = getPieOption(count);
      myChart.setOption(pieOption);
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
  //仪表盘
  useEffect(() => {
    if (gaugeRef.current) {
      const gaugeDom = gaugeRef.current;
      const myGauge = echarts.init(gaugeDom);
      const gaugeOption = getGaugeOption(count);
      myGauge.setOption(gaugeOption);
      // 窗口大小变化时自动 resize
      const resizeObserver = new ResizeObserver(() => {
        myGauge.resize();
      });
      resizeObserver.observe(gaugeDom);

      return () => {
        resizeObserver.disconnect();
        myGauge.dispose();
      };
    }
  }, [count]);

  const renderCard = () => {
    const cardConfig = [
      {
        // isShow:showAllFinish,
        title: '任务完成量',
        color: 'linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)',
        className: 'allFinishCount',
        content: () => {
          return (
            <Statistic className="my-statistic" title="累计已完成任务量" value={count.doneCount} formatter={formatter} />
          );
        },
      },
      {
        // isShow:showTodayFinish,
        title: '任务完成量',
        color: 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)',
        className: 'todayFinishCount',
        content: () => {
          return (
            <Statistic className="my-statistic" title="今日已完成任务量" value={todayFinishCount} formatter={formatter} />
          );
        },
      },
      {
        // isShow:showTodayRemain,
        title: '任务完成量',
        className: 'todayRemainCount',
        color: 'linear-gradient(to top, #f77062 0%, #fe5196 100%)',
        content: () => {
          return (
            <Statistic className="my-statistic" title="今日剩余任务量" value={todayRemainCount} formatter={formatter} />
          );
        },
      },
      {
        // isShow:showPie,
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
      },
      {
        // isShow:showAllRemain,
        title: '任务完成量',
        color: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
        className: 'allRemainCount',
        content: () => {
          return (
            <Statistic className="my-statistic" title="总剩余任务量" value={count.doingCount} formatter={formatter} />
          );
        },
      },
      {
        // isShow:showGauge,
        title: '',
        className: 'gauge-charts',
        color: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
        content: () => {
          return (
            <>
              <div className='gauge-charts_text'>任务完成进度</div>
              <div className='gauge-charts_item' ref={gaugeRef} style={{ width: '100%', height: '400px' }} />
            </>
          );
        },
      },
    ];
    return cardConfig.map(i =>
    (
      
      <div key={i.className} className={`${i.className} ${visibleCard.includes(i.className)? "":'unVisible'}`} style={{ backgroundImage: i.color }}>
        <div className='card-title'>{i.title}</div>
        {i.content()}
      </div>
    )
    )
  }

  const handleLayoutChange = (l: any) => {
    // console.log(l);
    saveLocalStorage(LAYOUT_KEY, l);
    setLayout(l);
  }

  const handleMenuClick = (e: any) => {
    if (e.key === '3') {
      // setOpen(false);
    }
  };

  const handleOpenChange = (nextOpen: any, info: any) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };

  useEffect(()=>{
    console.log("visibleCard",visibleCard);
  },[visibleCard])

  const handleCheckBoxFocused = (cardId: string) => {
    const item = localStorage.getItem(VISIBLE_CARD);
    const currentItem = item ? JSON.parse(item) : [];
    if (currentItem?.includes(cardId)) return;
    const newItem = [...currentItem, cardId];
    saveLocalStorage(VISIBLE_CARD, newItem);
    setVisibleCard(newItem);
  };
  const handleCheckBoxBlured = (cardId: string) => {
    const item = localStorage.getItem(VISIBLE_CARD);
    const currentItem = item ? JSON.parse(item) : [];
    if (!currentItem?.includes(cardId)) return;
    const newItem = currentItem.filter((id: string) => id !== cardId);
    saveLocalStorage(VISIBLE_CARD, newItem);
    setVisibleCard(getLocalStorage(VISIBLE_CARD, null));
  }

  const items =
    visibleCards.map(i => (
      {
        label: (<Checkbox checked={getLocalStorage(VISIBLE_CARD,null).includes(i.i)} onChange={e => {
          if (e.target.checked) {
            handleCheckBoxFocused(i.i);
          } else {
            handleCheckBoxBlured(i.i);
          }
        }}>{i.title}</Checkbox>),
        key: i.i,
        type: "item" as const,
      }
    ));

  return (
    <>
      <div className='tabbar'>
        <div className='card-fliter' >
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            onOpenChange={handleOpenChange}
            open={open}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <div className='fliter-icon'>
                  <FilterIcon />
                </div>
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <div className='task-charts'>
        <GridLayout
          className="layout"
          layout={layout}
          allowOverlap={true}       // 允许卡片重叠
          compactType={null}
          cols={20}
          rowHeight={5} //每行多少px
          maxRows={40}  //最多的行数
          width={1160}
          onLayoutChange={handleLayoutChange}
        >
          {renderCard()}
        </GridLayout>
      </div>
    </>
  );
}
