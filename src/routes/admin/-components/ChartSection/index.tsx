import TextButton from "@/components/TextButton";
import "./style.scss";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type ChartSectionProps = {
  labels: string[];
  dataPoints: number[];
};

const LINE_COLOR = "#4361ee";

const ChartSection = ({ labels, dataPoints }: ChartSectionProps) => {
  const { t } = useTranslation();

  const option: EChartsOption = useMemo(
    () => ({
      grid: {
        left: 30,
        right: 16,
        top: 12,
        bottom: 24,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 500,
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        splitLine: {
          lineStyle: { color: "#e2e8f0", width: 1 },
        },
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 500,
        },
      },
      series: [
        {
          type: "line",
          data: dataPoints,
          smooth: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: LINE_COLOR, width: 2.5 },
          itemStyle: { color: LINE_COLOR },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(67, 97, 238, 0.25)" },
                { offset: 1, color: "rgba(67, 97, 238, 0.02)" },
              ],
            },
          },
        },
      ],
      tooltip: {
        trigger: "axis",
      },
    }),
    [labels, dataPoints]
  );

  return (
    <div className="admin-chart">
      <div className="admin-chart__header">
        <h2 className="admin-chart__title">{t("admin.chart.title")}</h2>
        <TextButton
          size="tiny"
          type="secondary"
          typeSecondary="navy"
          text="Last 7 days"
          onClick={() => {}}
          leftIcon={false}
        />
      </div>

      <div className="admin-chart__body">
        <ReactECharts
          option={option}
          style={{ width: "100%", height: 200 }}
          notMerge
          lazyUpdate
        />
      </div>
    </div>
  );
};

export default ChartSection;
