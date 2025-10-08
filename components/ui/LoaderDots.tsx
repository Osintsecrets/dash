export function UiLoaderDots({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-2 text-sm text-slate-300">
      <div className="flex items-center gap-1">
        <span className="h-2.5 w-2.5 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-brand-accent"></span>
        <span className="h-2.5 w-2.5 animate-[pulse_1s_ease-in-out_infinite_.2s] rounded-full bg-brand-accent2"></span>
        <span className="h-2.5 w-2.5 animate-[pulse_1s_ease-in-out_infinite_.4s] rounded-full bg-brand-accent"></span>
      </div>
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}
