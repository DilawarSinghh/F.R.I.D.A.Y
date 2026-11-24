import { useId, useState, type FormEvent } from 'react';
import { prepareFridayRequest, type FridayWorkflow } from '../../shared/friday-workflows';
import { desktopRuntimeAvailable } from '../lib/desktop';
import { Button, Notice } from './ui';

export function FridayWorkflows({
  busy,
  hasDraft,
  onPrepare,
}: {
  busy: boolean;
  hasDraft: boolean;
  onPrepare(request: string): void;
}) {
  const id = useId();
  const [workflow, setWorkflow] = useState<FridayWorkflow>('research');
  const [urls, setUrls] = useState('');
  const [details, setDetails] = useState('');
  const [app, setApp] = useState('Text Editor');
  const [error, setError] = useState('');
  const native = desktopRuntimeAvailable();
  function prepare(event: FormEvent) {
    event.preventDefault();
    if (busy || hasDraft) return;
    try {
      onPrepare(prepareFridayRequest({ workflow, urls, details, app }));
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }
  return (
    <details className="friday-workflows">
      <summary>
        F.R.I.D.A.Y workflows <span>Prepare a task</span>
      </summary>
      <form onSubmit={prepare}>
        <p>
          Prepare an editable request, then review and send it in chat. Results appear with the
          task. A connected model and running browser/workspace are required.
        </p>
        <label htmlFor={`${id}-workflow`}>Workflow</label>
        <select
          id={`${id}-workflow`}
          value={workflow}
          onChange={(event) => {
            setWorkflow(event.target.value as FridayWorkflow);
            setError('');
          }}
        >
          <option value="research">Research and export</option>
          <option value="form">Prepare a form for review</option>
          <option value="desktop">Summary into a desktop editor</option>
        </select>
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
            <p role="status">
              {native
                ? 'Desktop bridge detected. Enable Computer use in Settings. Accessibility and app support still need checking; Wayland limits foreground actions.'
                : 'Native control is unavailable in this client. Open the local desktop application to run this workflow. Saving a file alone does not demonstrate desktop control.'}
            </p>
          </>
        )}
        {workflow === 'form' && (
          <p>
            Preparation stops before submission. Missing required facts will be requested. Sign in
            through browser takeover; never put passwords or verification codes here.
          </p>
        )}
        {hasDraft && (
          <p role="status">Send or clear your current draft before preparing another request.</p>
        )}
        {error && <Notice>{error}</Notice>}
        <Button
          type="submit"
          size="sm"
          disabled={busy || hasDraft || (workflow === 'desktop' && !native)}
        >
          Prepare in composer
        </Button>
        <div className="friday-workflow-links">
          <a href="/browser">Browser and takeover</a>
          <a href="/settings/models">Model connection</a>
        </div>
      </form>
    </details>
  );
}
