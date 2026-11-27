import { useId, useState, type FormEvent } from 'react';
import { prepareFridayRequest, type FridayWorkflow } from '../../shared/friday-workflows';
import { desktopRuntimeAvailable } from '../lib/desktop';
import { ArrowRight, ChevronDown, FileText, Globe, Monitor, X } from './icons';
import { Button, Notice } from './ui';

const workflows = [
  {
    id: 'research',
    number: '01',
    title: 'Research & compare',
    description: 'A clear comparison, with sources and an export.',
    icon: Globe,
  },
  {
    id: 'form',
    number: '02',
    title: 'Prepare a form',
    description: 'Your information, ready for your final review.',
    icon: FileText,
  },
  {
    id: 'desktop',
    number: '03',
    title: 'Write to an app',
    description: 'Take a summary into a supported desktop editor.',
    icon: Monitor,
  },
] as const;

export function FridayWorkflows({
  busy,
  hasDraft,
  onPrepare,
  compact = false,
}: {
  busy: boolean;
  hasDraft: boolean;
  onPrepare(request: string): void;
  compact?: boolean;
}) {
  const id = useId();
  const [workflow, setWorkflow] = useState<FridayWorkflow>('research');
  const [expanded, setExpanded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [urls, setUrls] = useState('');
  const [details, setDetails] = useState('');
  const [app, setApp] = useState('Text Editor');
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState(false);
  const native = desktopRuntimeAvailable();
  const selected = workflows.find((item) => item.id === workflow)!;
  function prepare(event: FormEvent) {
    event.preventDefault();
    if (busy || hasDraft || (workflow === 'desktop' && !native)) return;
    try {
      onPrepare(prepareFridayRequest({ workflow, urls, details, app }));
      setError('');
      setPrepared(true);
      setFormOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }
  return (
    <section className="friday-workflows" aria-label="Guided workflows">
      <div className="friday-workflow-heading">
        <span className="friday-eyebrow">
          {compact ? 'START SOMETHING NEW' : 'PICK A STARTING POINT'}
        </span>
        {compact && (
          <button
            className="friday-workflow-toggle"
            type="button"
            aria-expanded={expanded}
            aria-controls={`${id}-choices`}
            onClick={() => setExpanded((value) => !value)}
          >
            Guided workflows <ChevronDown size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      <div id={`${id}-choices`} hidden={compact && !expanded}>
        <div className="friday-workflow-grid" role="group" aria-label="Choose a workflow">
          {workflows.map(({ id: kind, number, title, description, icon: Icon }) => (
            <button
              key={kind}
              type="button"
              className="friday-workflow-card"
              aria-pressed={formOpen && workflow === kind}
              aria-controls={`${id}-form`}
              onClick={() => {
                setWorkflow(kind);
                setFormOpen(true);
                setPrepared(false);
                setError('');
              }}
            >
              <span className="friday-workflow-card-top">
                <Icon size={20} aria-hidden="true" />
                <span>{number}</span>
              </span>
              <strong>{title}</strong>
              <span className="friday-workflow-description">{description}</span>
              <span className="friday-workflow-card-bottom">
                {kind === 'desktop' && !native ? 'Local desktop app required' : 'Set up task'}
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
        <form
          id={`${id}-form`}
          hidden={!formOpen}
          onSubmit={prepare}
          className="friday-workflow-form"
        >
          <div className="friday-workflow-form-heading">
            <div>
              <span className="friday-eyebrow">TASK BRIEF</span>
              <h3>{selected.title}</h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close task brief"
              onClick={() => setFormOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>
          <p className="friday-workflow-hint">
            Add the details. We’ll prepare an editable request for you to review and send in the
            conversation.
          </p>
          <label htmlFor={`${id}-urls`}>
            {workflow === 'research' ? 'Source URLs (up to three)' : 'Source URL'}
            {workflow === 'desktop' ? ' (optional with supplied text)' : ''}
          </label>
          <textarea
            id={`${id}-urls`}
            value={urls}
            onChange={(event) => setUrls(event.target.value)}
            rows={2}
            maxLength={6000}
            placeholder="https://example.com/source"
            required={workflow !== 'desktop'}
          />
          <label htmlFor={`${id}-details`}>
            {workflow === 'research'
              ? 'Fields to compare and decision criteria'
              : workflow === 'form'
                ? 'Facts you supply for the form'
                : 'Text to summarise, or summary requirements'}
          </label>
          <textarea
            id={`${id}-details`}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={3}
            maxLength={8000}
            placeholder={
              workflow === 'research'
                ? 'Compare eligibility, deadlines and fees. Mark anything the source does not establish.'
                : workflow === 'form'
                  ? 'Only facts you want entered. Never include passwords or verification codes.'
                  : 'Paste a paragraph, or describe the summary you need.'
            }
            required
          />
          {workflow === 'desktop' && (
            <>
              <label htmlFor={`${id}-app`}>Installed text editor</label>
              <input
                id={`${id}-app`}
                value={app}
                onChange={(event) => setApp(event.target.value)}
                maxLength={100}
                required
              />
              <Notice kind="info">
                {native
                  ? 'Enable Computer use in Settings. The editor and its accessibility controls must be available; Wayland limits foreground actions.'
                  : 'This web client cannot control desktop apps. Open the local desktop application to use this workflow.'}
              </Notice>
            </>
          )}
          {workflow === 'form' && (
            <p className="friday-workflow-hint">
              Fields are prepared for review. Submission, signatures and consent stay with you. Sign
              in through browser takeover.
            </p>
          )}
          {hasDraft && (
            <Notice kind="info">
              Send or clear your existing draft before preparing another request.
            </Notice>
          )}
          {error && <Notice>{error}</Notice>}
          <div className="friday-workflow-actions">
            <span>Preparation does not start the task.</span>
            <Button
              type="submit"
              disabled={busy || hasDraft || (workflow === 'desktop' && !native)}
            >
              Prepare request <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      </div>
      {prepared && hasDraft && (
        <p className="friday-workflow-prepared" role="status">
          Your request is in the composer. Review it, then send when you’re ready.
        </p>
      )}
    </section>
  );
}
