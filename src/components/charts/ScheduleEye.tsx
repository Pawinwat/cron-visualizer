// components/ScheduleEye.tsx
import * as echarts from 'echarts';
import { SeriesOption } from 'echarts';
import React, { CSSProperties } from 'react';
import { getCronRunTimesWithValuesInDay } from '../../utils/cronUtils';
import BaseEchart from './base/BaseEchart';
import { palette } from '../../theme';


interface ScheduleEyeProps {
  style?: CSSProperties
  cronExpression: string;
  timeZoneOffset: number
}
const ScheduleEye: React.FC<ScheduleEyeProps> = ({
  style,
  cronExpression,
  timeZoneOffset
}: ScheduleEyeProps) => {

  const scheduleData = getCronRunTimesWithValuesInDay(cronExpression,timeZoneOffset)
  // Define the series option with explicit typing
  const series: SeriesOption[] = [
    {
      type: 'bar',
      coordinateSystem: 'polar',
      encode: { angle: 'time', radius: 'value' },
      label: { show: false },
      itemStyle: {
        color:palette.main
      },
    },
  ];

  // Define the option configuration as a regular variable
  const option: echarts.EChartsOption = {
    // title: { text: 'Pipeline Eye - Radial Polar Bar Chart' },
    polar: { radius: [30, '80%'] },
    dataset: {
      dimensions: ['time', 'value'],
      source: scheduleData
    },
    radiusAxis: {
      max: 1,
      axisLabel: {
        show: false
      }
    },
    angleAxis: {
      type: 'category',
      startAngle: 90,
      axisTick: {
        interval: 30
      },
      axisLabel: {
        interval: (_index: number, value: string) => value?.includes(':00')
      }
    },
    tooltip: {
      valueFormatter:()=>''
    },
    series,  // Pass the typed series array here
    animation: false,
  };

  return (
    <BaseEchart option={option} style={{ height: '400px', width: '100%', ...style }} />
  );
};

export default ScheduleEye;
