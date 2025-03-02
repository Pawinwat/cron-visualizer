import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

interface BaseEchartProps {
    option: echarts.EChartsOption;
    style?: React.CSSProperties;
}

const BaseEchart: React.FC<BaseEchartProps> = ({ option, style }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            registerTheme()

            // Initialize ECharts instance
            chartInstance.current = echarts.init(chartRef.current, 'dark');
            // Set initial option
            chartInstance.current.setOption(option);
        }

        return () => {
            // Dispose ECharts instance on unmount
            chartInstance.current?.dispose();
        };
    }, []);

    useEffect(() => {
        // Update chart when `option` changes
        if (chartInstance.current) {
            chartInstance.current.setOption(option);
        }
    }, [JSON.stringify(option)]);

    return (
        <div
            ref={chartRef}
            style={{
                height: '400px',
                width: '100%',
                ...style,
            }}
        />
    );
};

const registerTheme = () => {
    var contrastColor = '#B9B8CE';
    var backgroundColor = 'rgba(0,0,0,0)';
    var axisCommon = function () {
        return {
            axisLine: {
                lineStyle: {
                    color: contrastColor
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#484753'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)']
                }
            },
            minorSplitLine: {
                lineStyle: {
                    color: '#20203B'
                }
            }
        };
    };

    var colorPalette = [
        '#4992ff',
        '#7cffb2',
        '#fddd60',
        '#ff6e76',
        '#58d9f9',
        '#05c091',
        '#ff8a45',
        '#8d48e3',
        '#dd79ff'
    ];
    var theme = {
        darkMode: true,

        color: colorPalette,
        backgroundColor: backgroundColor,
        axisPointer: {
            lineStyle: {
                color: '#817f91'
            },
            crossStyle: {
                color: '#817f91'
            },
            label: {
                // TODO Contrast of label backgorundColor
                color: '#fff'
            }
        },
        legend: {
            textStyle: {
                color: contrastColor
            }
        },
        textStyle: {
            color: contrastColor
        },
        title: {
            textStyle: {
                color: '#EEF1FA'
            },
            subtextStyle: {
                color: '#B9B8CE'
            }
        },
        toolbox: {
            iconStyle: {
                borderColor: contrastColor
            }
        },
        dataZoom: {
            borderColor: '#71708A',
            textStyle: {
                color: contrastColor
            },
            brushStyle: {
                color: 'rgba(135,163,206,0.3)'
            },
            handleStyle: {
                color: '#353450',
                borderColor: '#C5CBE3'
            },
            moveHandleStyle: {
                color: '#B0B6C3',
                opacity: 0.3
            },
            fillerColor: 'rgba(135,163,206,0.2)',
            emphasis: {
                handleStyle: {
                    borderColor: '#91B7F2',
                    color: '#4D587D'
                },
                moveHandleStyle: {
                    color: '#636D9A',
                    opacity: 0.7
                }
            },
            dataBackground: {
                lineStyle: {
                    color: '#71708A',
                    width: 1
                },
                areaStyle: {
                    color: '#71708A'
                }
            },
            selectedDataBackground: {
                lineStyle: {
                    color: '#87A3CE'
                },
                areaStyle: {
                    color: '#87A3CE'
                }
            }
        },
        visualMap: {
            textStyle: {
                color: contrastColor
            }
        },
        timeline: {
            lineStyle: {
                color: contrastColor
            },
            label: {
                color: contrastColor
            },
            controlStyle: {
                color: contrastColor,
                borderColor: contrastColor
            }
        },
        calendar: {
            itemStyle: {
                color: backgroundColor
            },
            dayLabel: {
                color: contrastColor
            },
            monthLabel: {
                color: contrastColor
            },
            yearLabel: {
                color: contrastColor
            }
        },
        timeAxis: axisCommon(),
        logAxis: axisCommon(),
        valueAxis: axisCommon(),
        categoryAxis: axisCommon(),

        line: {
            symbol: 'circle'
        },
        graph: {
            color: colorPalette
        },
        gauge: {
            title: {
                color: contrastColor
            }
        },
        candlestick: {
            itemStyle: {
                color: '#FD1050',
                color0: '#0CF49B',
                borderColor: '#FD1050',
                borderColor0: '#0CF49B'
            }
        }
    };

    // theme.categoryAxis.splitLine.show = false;
    echarts.registerTheme('dark', theme);
}

export default BaseEchart;
