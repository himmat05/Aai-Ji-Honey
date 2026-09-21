import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

/**
 * Core Web Vitals Real User Monitoring (RUM) Logger
 * Measures LCP (Largest Contentful Paint), INP (Interaction to Next Paint),
 * CLS (Cumulative Layout Shift), FCP (First Contentful Paint), and TTFB (Time to First Byte)
 */
export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
  } else if (import.meta.env.DEV) {
    const logMetric = (metric) => {
      const color =
        metric.rating === 'good'
          ? '#16a34a'
          : metric.rating === 'needs-improvement'
          ? '#ca8a04'
          : '#dc2626';
      console.log(
        `%c⚡ [Web Vitals] ${metric.name}: ${Math.round(metric.value * 100) / 100}${
          metric.name === 'CLS' ? '' : 'ms'
        } (${metric.rating})`,
        `color: ${color}; font-weight: bold;`
      );
    };

    onCLS(logMetric);
    onINP(logMetric);
    onLCP(logMetric);
    onFCP(logMetric);
    onTTFB(logMetric);
  }
}
