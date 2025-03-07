import * as echarts from 'echarts';
import React, { useMemo } from 'react';
import { getCronRunDays, modifyCronField } from '../../utils/cronUtils';
import BaseEchart from './base/BaseEchart';
import { palette } from '../../theme';

interface YearlyChartProps {
    cronExpression: string;
    year: number;
}

const YearlyChart: React.FC<YearlyChartProps> = ({ cronExpression, year }) => {
    const hourCron = modifyCronField(cronExpression, 0, '0')
    const minCron = modifyCronField(hourCron, 1, '0')

    // Use useMemo to avoid unnecessary recalculations
    const days = useMemo(() => getCronRunDays(minCron, year), [minCron, year]);

    const option: echarts.EChartsOption = useMemo(() => ({

        visualMap: {
            max: 1,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 25,
            show: false,
            inRange: {
                color: [palette.main]
            },
        },
        calendar: {
            range: year.toString(),
            cellSize: ['auto', 20],
            yearLabel: { show: true },
            monthLabel: { show: true },

        },
        grid: {
            left: 10,
            right: 30,
            top: 0
        },
        tooltip: {
            valueFormatter(_value, dataIndex) {
                return days?.[dataIndex]?.[0] || ''
            },
        },
        series: [
            {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: days as any[],

            },
        ],
    }), [days, year]);

    return <BaseEchart option={option} style={{ height: '220px' }} />;
};

export default YearlyChart;
