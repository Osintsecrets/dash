import { ProvenanceList } from '@/components/ProvenanceList';
import { loadProvenance } from '@/lib/server-data';

export default async function AboutPage() {
  const sources = await loadProvenance();
  return (
    <div className="space-y-4">
      <header className="card space-y-2">
        <h1 className="text-lg font-semibold text-slate-100">Sources & neutrality policy</h1>
        <p className="text-sm text-slate-300">
          This platform surfaces primary texts, authenticated narrations, and recognized tafsīr excerpts. Content is sourced
          from official repositories with licensing respected. Interpretations vary among scholars; users should review multiple
          references.
        </p>
        <p className="text-sm text-slate-400">
          Neutrality statement: This is a study tool. It presents evidence without prescriptions and prohibits harassment or
          discrimination.
        </p>
      </header>
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Attribution & licensing</h2>
        <ProvenanceList sources={sources} />
      </section>
      <section className="card space-y-2 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">Product principles</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Expose sources; avoid prescriptions.</li>
          <li>Provide transparent provenance, including edition metadata and canonical URLs.</li>
          <li>Offer offline access with integrity verification and user control.</li>
          <li>Maintain neutral descriptions and contextual notes.</li>
        </ul>
      </section>
    </div>
  );
}
