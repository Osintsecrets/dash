import { Card } from '@/components/ui';

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, actions, children, className }: SectionProps) {
  return (
    <Card className={className}>
      <div className="space-y-4">
        {(title || description || actions) && (
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
              {description ? <p className="text-sm text-slate-400">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </header>
        )}
        <div className="space-y-4 text-slate-200">{children}</div>
      </div>
    </Card>
  );
}
