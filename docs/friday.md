# Run F.R.I.D.A.Y

F.R.I.D.A.Y extends Nod rather than starting another agent or browser engine. The workflow panel prepares owner requests in the existing chat. The server's existing Trust, owner isolation, turn locks and cancellation still decide whether tools run.

## Requirements and setup

Use Node.js 24.21.0 or newer and pnpm 10.34.5 from `package.json`. Install with `pnpm install --frozen-lockfile`. Source startup requires Docker, Compose v2 and Buildx, with a reachable daemon. Run `node scripts/friday-doctor.mjs` first. It uses bounded local probes, does not read secrets or call a model, and exits nonzero when a source runtime requirement is missing. A successful readiness check is not an end-to-end demonstration.

Run `pnpm start` for production source mode or `pnpm run dev` for reload. Startup first checks Docker daemon access, Compose v2 and Buildx before installing dependencies or building. It then installs changed dependencies and prepares PostgreSQL, the isolated workspace, its firewall and the Chromium browser. It prints a private loopback access link on port 4310. Keep that link private. Source data lives in `.local/` and Docker volumes; keep the Linux Vault master key with backups. Never replace the key for existing encrypted data.

Use the existing `.env.example` for optional configuration. Copy only settings you need into ignored `.env`; do not commit credentials. Configure a model in Settings → Models, using its encrypted provider credential interface or the existing supported sign-in flow. Other providers, local compatible models and ChatGPT sign-in stay supported by Nod. No provider was preselected or authenticated for this fork. The startup check does not infer API access from a chat subscription.

## Native desktop control

Native computer use requires the **local Electron application**, not the web interface or a desktop client connected to a remote server. Run `pnpm --dir desktop install --frozen-lockfile` to install its pinned dependencies. `pnpm run desktop:dev` launches it, but its private runtime assets must also be prepared using the foundation's `pnpm run desktop:prepare` workflow. Read the source revision's desktop build instructions before packaging. Runtime preparation needs Docker image builds/exports and downloads; it is not part of a successful web build.

Linux x64 native use relies on bundled `agent-desktop`, the host session D-Bus and AT-SPI accessibility. Enable Computer use in Settings. On macOS grant Accessibility; Screen Recording is optional for window pictures. Windows does not need an extra permission, but administrator apps are view-only. Linux must have a working desktop accessibility service. The Linux private desktop runtime requires read/write access to `/dev/kvm`. The foundation's Flatpak sandbox currently prevents the native helper from discovering host accessibility; use a source/unconfined desktop build when demonstrating native control.

This machine uses GNOME Wayland. The helper reports accessibility granted. Wayland cannot activate a window for the helper, so operations needing the foreground can fail. Do not bypass a refused operation with shell injection or another tool. The product must report a blocked desktop step separately from an independently generated summary. Terminals, system settings, password managers and file managers remain refused; browsers and code editors remain view-only. Use an ordinary editor such as GNOME Text Editor.

## Browser sign-in and takeover

Use Browser to inspect the assistant's separate browser and take manual control when sign-in is requested. Complete authentication and verification in the website, then return control to the assistant. It must observe the new page before proceeding. Never paste passwords, OTPs, recovery codes or cookies into chat. No normal browser profile is imported.

The foundation can save supported sessions in Vault. Remove a saved session there to disconnect; active work must stop before removal. Signing out at a site and removing a saved profile are distinct actions. Expired sessions require a fresh manual sign-in. Google may refuse automated-browser sign-in; do not bypass it. Nod also provides a Gmail account connection when configured. Email is optional and has not been tested here.

## Demonstrations

Use non-sensitive, disposable data. Samples are not live service integrations. Workflow fields are held in React state, not automatically written to local storage. Preparing a task copies its details into the normal chat draft, which follows the foundation's draft/history persistence. Do not enter credentials in task details.

### Research and comparison

Supply one to three publicly accessible HTTPS pages and a consistent field list, such as name, eligibility, deadline and fee. Choose Research and export, prepare the request and review it in the composer. Send it. Check that the task inspected the requested pages, marks unsupported facts, provides source URLs, and delivers a Markdown comparison. Open the attachment and check the expected rows and fields. Missing pages make the result partial. Public-network checks remain on the server; frontend URL validation is only input guidance.

### Form preparation

Use a supported disposable form and explicitly supply synthetic facts such as name `Alex Example` and email `alex@example.com`. Prepare in composer and send. Check fields through Browser; missing required facts must stay unknown. Stop before Submit, Send, consent, signatures or payment. Verify there is no submission receipt. This launcher does not provide an automatic submit command.

### Text into a desktop editor

From the local desktop application with Computer use enabled, choose the desktop workflow. Name the installed editor by its known application name, supply a short sample paragraph or source URL, prepare and send. Verify native controls were observed, the summary entered, and the expected text read back. Report Save separately and verify the editor state if it succeeds. A file attached in chat does not satisfy this demonstration. In web/remote clients, the launcher explicitly disables this workflow.

### Stop, review and restart

During active work, select the existing Stop control. Confirm no later write starts. For a pending approval, refuse it and confirm the action does not run. Inspect actual form state after returning browser control. Restart the runtime and confirm the same task/history and saved sessions are available; interrupted or uncertain writes must not be retried automatically. These live checks require the runtime and model and are not verified by unit tests alone.

## Voice, AWS and costs

Nod already includes ElevenLabs speech recognition and synthesis, OpenAI/OpenRouter voice and local speech options. Configure supported credentials and voice selection in Settings. Microphone recording is explicit; text remains usable. Voice cloning is outside scope. No sponsor key or quota has been configured or tested.

AWS Bedrock is an existing model option if an authorized account is configured. No custom AWS hosting or export storage was added, and no billable infrastructure was deployed. Model/voice providers can charge for usage after you configure them; use the foundation's usage limits. Native actions always run on the user's machine. Existing foundation connections, telemetry and privacy settings retain their documented behavior; review Settings → Privacy & data before using private content.

## Known limitations

Docker, Compose v2 and Buildx are installed, the owner account can access Docker, and the PostgreSQL, browser, workspace and firewall containers were running during the November 27 interface work. Live model-driven demonstrations still require verification. The local Electron app needs prepared private runtime assets, which are not produced by `vite build`. The real Text Editor bridge launch timed out without an accessible matching app, so no native text entry has been demonstrated. The Electron shell launched, but private runtime startup has not been verified. The desktop contract suite also has five connector catalog case failures (503) plus the failed parent test; see the implementation summary. No model is connected. No Gmail account, ElevenLabs key or AWS service is configured. Website compatibility and native app accessibility vary. Do not describe inherited features, fixture tests or a compiled UI as a successfully demonstrated assistant.

The fork has no release/update channel. Do not publish it through n8n's release infrastructure or use an upstream auto-update to replace a customized build. Packaged release validation and a fork-owned update channel remain incomplete; development source mode is the supported build target for this change.

## Startup troubleshooting

If the terminal prints `spawn docker ENOENT` after a successful web build, the Docker executable is absent from the launcher's PATH. The bundle-size and dynamic-import warnings are not the cause of this failure. The launcher now checks Docker before rebuilding and gives a recovery message. The same check runs in development and production source mode.

On this Ubuntu host, the package index provides `docker.io`, `docker-compose-v2` and `docker-buildx`. Install these in your own terminal with administrator access:

```sh
sudo apt update
sudo apt install docker.io docker-compose-v2 docker-buildx
sudo systemctl start docker
docker info
docker compose version
docker buildx version
```

The Codex execution session cannot run `sudo` because its operating system sets `no-new-privileges`. Enter your password only in your own terminal. If Docker is installed but `docker info` reports permission denied, your normal user still needs an authorized Docker access setup. Do not run the entire F.R.I.D.A.Y application with sudo or make the Docker socket world-writable. Use Docker's documented non-root or rootless setup, then retry `docker info` from a fresh terminal. Docker group membership grants root-level host privileges and should be an explicit owner choice.

After all three checks succeed, run `node scripts/friday-doctor.mjs` and `pnpm start` from the project directory. A ready Docker installation removes this startup blocker; it does not verify the model connection or native desktop workflow.

## F.R.I.D.A.Y interface

The workspace uses an original geometric F emblem, an neutral visual identity with a restrained blue accent, task cards, a scrollable task brief and a persistent conversation composer. Research, form preparation and native editor cards prepare editable requests; they never send automatically. In an existing conversation, expand Guided workflows to create another brief. Existing drafts remain protected, and desktop preparation stays disabled in a web/remote client.

The model indicator reports configuration state, not a guarantee of model availability. Stop, review cards, browser takeover, keyboard navigation, theme preferences and existing routes remain available. The visual changes add no graphics framework, external fonts or model calls. About F.R.I.D.A.Y in the sidebar and onboarding retains the Nod/n8n foundation credit and links to licence and notices. Privacy disclosures and third-party identities stay accurate. Internal compatibility identifiers and release infrastructure are not represented as original team work.
