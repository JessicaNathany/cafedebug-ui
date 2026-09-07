import type { AboutImpactMetric } from "../types";

export function AboutImpactMetrics({ metrics }: { metrics: readonly AboutImpactMetric[] }) {
  return (
    <dl aria-label="Métricas de impacto na comunidade" className="grid min-w-0 grid-cols-1 rounded-m border border-border bg-card md:grid-cols-2 xl:min-h-[176px] xl:grid-cols-4 xl:divide-x xl:divide-border">
      {metrics.map((metric) => (
        <div className="flex min-w-0 flex-col gap-2 p-6 xl:p-8" key={metric.id}>
          <dt className="order-2 font-secondary text-base font-semibold leading-[1.3] text-foreground">{metric.label}</dt>
          <dd className="order-1 font-primary text-[42px] font-bold leading-[1.1] text-primary">{metric.value}</dd>
          <dd className="order-3 font-secondary text-[13px] leading-[1.5] text-muted-foreground">{metric.description}</dd>
        </div>
      ))}
    </dl>
  );
}
