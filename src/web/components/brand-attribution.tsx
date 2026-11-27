export function BrandAttribution() {
  return (
    <details className="friday-about">
      <summary>About F.R.I.D.A.Y</summary>
      <div>
        <strong>F.R.I.D.A.Y · fish eye</strong>
        <p>
          Personal assistant prototype built on{' '}
          <a href="https://github.com/n8n-io/nod" target="_blank" rel="noreferrer">
            Nod by n8n
          </a>
          . Nod supplies the agent runtime and existing integrations.
        </p>
        <p>
          Copyright 2026 n8n GmbH. Foundation licensed under Apache 2.0. F.R.I.D.A.Y adds its
          interface, guided workflows and startup improvements.
        </p>
        <a
          href="https://github.com/DilawarSinghh/F.R.I.D.A.Y/blob/codex/friday-desktop-assistant/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          Licence
        </a>
        {' · '}
        <a
          href="https://github.com/DilawarSinghh/F.R.I.D.A.Y/blob/codex/friday-desktop-assistant/NOTICE"
          target="_blank"
          rel="noreferrer"
        >
          Third-party notices
        </a>
      </div>
    </details>
  );
}
