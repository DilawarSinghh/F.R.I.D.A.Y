import { BrandMark } from './brand';
import { ArrowUpRight, ShieldCheck } from './icons';

export function FridayCommandHeader({
  configured,
  issue = false,
}: {
  configured: boolean;
  issue?: boolean;
}) {
  return (
    <header className="friday-command-header">
      <div>
        <span className="friday-eyebrow">YOUR PERSONAL WORKSPACE</span>
        <h1>Command center</h1>
      </div>
      <a href="/settings/models" className="friday-model-state" data-ready={configured && !issue}>
        <span aria-hidden="true" />
        {issue ? 'Model needs attention' : configured ? 'Model configured' : 'Connect a model'}
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </header>
  );
}

export function FridayWelcome() {
  return (
    <section className="friday-welcome" aria-labelledby="friday-welcome-title">
      <div className="friday-welcome-symbol">
        <BrandMark />
        <span>F.R.I.D.A.Y</span>
      </div>
      <h2 id="friday-welcome-title">What’s the mission?</h2>
      <p>Research a decision. Prepare the paperwork. Turn information into something useful.</p>
      <div className="friday-control-note">
        <ShieldCheck size={16} aria-hidden="true" />
        You choose the task. You stay in control.
      </div>
    </section>
  );
}
