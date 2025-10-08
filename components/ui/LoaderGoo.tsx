import styles from './LoaderGoo.module.css';

interface LoaderGooProps {
  label?: string;
}

export function LoaderGoo({ label = 'Preparing downloads' }: LoaderGooProps) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className={styles.wrapper}>
        <span className={styles.blob} />
        <span className={styles.blob} />
        <span className={styles.blob} />
      </div>
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
    </div>
  );
}
