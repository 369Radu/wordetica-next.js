"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type {
  ActiveElement,
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
} from "chart.js";

export interface ChartClickPayload {
  event: ChartEvent;
  active: ActiveElement[];
}

interface ChartCanvasProps {
  type: ChartType;
  data: ChartData;
  options?: ChartConfiguration["options"];
  onChartClick?: (payload: ChartClickPayload) => void;
}

/**
 * React port of the Angular `chart-canvas.directive.ts`. Creates a chart.js
 * instance on mount, updates data/options in place when props change, recreates
 * on type change and destroys on cleanup.
 */
export function ChartCanvas({ type, data, options, onChartClick }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const clickRef = useRef<typeof onChartClick>(onChartClick);
  clickRef.current = onChartClick;

  // Recreate the chart when the type changes (mirrors the directive's behaviour).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type,
      data,
      options: {
        ...options,
        onClick: (event, elements) => {
          clickRef.current?.({
            event: event as ChartEvent,
            active: elements as ActiveElement[],
          });
        },
      },
    });
    chartRef.current = chart;

    return () => {
      chart.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Update data in place.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data = data;
    chart.update();
  }, [data]);

  // Update options in place.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.options = {
      ...(options ?? {}),
      onClick: (event, elements) => {
        clickRef.current?.({
          event: event as ChartEvent,
          active: elements as ActiveElement[],
        });
      },
    };
    chart.update();
  }, [options]);

  return <canvas ref={canvasRef}></canvas>;
}
