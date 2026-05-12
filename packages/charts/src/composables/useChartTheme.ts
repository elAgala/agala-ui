/**
 * Reads HSL design tokens from the document at runtime and returns
 * an ECharts-compatible theme palette.
 *
 * Falls back to sensible defaults if the tokens aren't found
 * (SSR or test environments).
 */
export function useChartTheme() {
  function getToken(name: string, fallback: string): string {
    if (typeof document === 'undefined') return fallback
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
    return value || fallback
  }

  function hslVar(name: string, fallback: string): string {
    const token = getToken(name, fallback)
    return `hsl(${token})`
  }

  const primary   = hslVar('--agala-primary', '239 84% 57%')
  const success   = hslVar('--agala-success', '142 71% 45%')
  const warning   = hslVar('--agala-warning', '43 96% 50%')
  const danger    = hslVar('--agala-danger', '0 84.2% 60.2%')
  const muted     = hslVar('--agala-muted-foreground', '240 3.8% 46.1%')
  const bg        = hslVar('--agala-card', '0 0% 100%')
  const fg        = hslVar('--agala-foreground', '240 10% 3.9%')
  const border    = hslVar('--agala-border', '240 5.9% 90%')

  /** Color palette for ECharts series */
  const colorPalette = [primary, success, warning, danger, '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']

  /** Base ECharts option defaults for each chart type */
  function getBaseOption(type: 'line' | 'bar' | 'pie') {
    const base: Record<string, unknown> = {
      color: colorPalette,
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: getToken('--agala-font-sans', 'system-ui, sans-serif'),
        color: fg,
      },
      animation: true,
      animationDuration: 500,
    }

    if (type === 'pie') {
      return {
        ...base,
        tooltip: {
          trigger: 'item',
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
          textStyle: { color: fg },
        },
        legend: {
          textStyle: { color: fg },
        },
      }
    }

    return {
      ...base,
      tooltip: {
        trigger: 'axis',
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1,
        textStyle: { color: fg },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLine: { lineStyle: { color: border } },
        axisLabel: { color: muted },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: muted },
        splitLine: {
          lineStyle: { color: border, type: 'dashed' as const },
        },
      },
    }
  }

  return { getBaseOption, colorPalette }
}
