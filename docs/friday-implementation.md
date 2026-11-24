# F.R.I.D.A.Y implementation

Team fish eye builds on Nod revision `40956c97754477cfecbeccf26f212b33d4e709d3`, retaining its history and Apache-2.0 notices. This document identifies the fork's original work and the evidence limits.

## Changes

- Added a chat workflow panel for bounded research, form preparation and summary-to-editor requests. Requests are editable before execution. Existing drafts cannot be overwritten by the launcher, and preparing does not send a message.
- Added a shared request builder that rejects non-HTTPS/credential-bearing source URLs and bounds source counts and task details. Server network guards remain authoritative.
- Added the `friday-workflows` guide to the existing skill library. It requires saved-file readback, form review, native text readback, manual sign-in takeover and honest partial/blocked results. It grants no permission and adds no engine.
- Changed the main chat identity, onboarding wordmark, composer, sidebar and runtime self-identification to F.R.I.D.A.Y. Internal protocol names remain compatible with the foundation. Packaged release branding is unfinished.
- Added a dependency-free readiness command and source/setup guidance. Added source-input regression coverage to existing URL safety tests.

## Foundation code traced

| Concern                               | Existing implementation                                                                                                                |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| React entry, application and chat     | `src/web/main.tsx`, `src/web/app.tsx`, `src/web/pages/chat.tsx`                                                                        |
| Electron, bridge and private runtime  | `desktop/main/main.mjs`, `desktop/main/engine.mjs`, `desktop/main/computer-helper.mjs`, `desktop/runtime/index.mjs`                    |
| Server and provider selection         | `src/server/index.ts`, `src/server/app.ts`, `src/server/composition.ts`                                                                |
| Models and encrypted credentials      | `src/server/models.ts`, `src/server/model-store.ts`, `src/providers/pi/models.ts`, `src/server/vault.ts`, `src/server/vault-crypto.ts` |
| Agent loop, sessions and discovery    | `src/runtime/index.ts`, `src/runtime/tools.ts`, `src/runtime/prompt.ts`, `src/providers/pi/index.ts`, `src/providers/pi/skills.ts`     |
| Browser, isolation and saved sessions | `src/providers/container-browser/`, `src/providers/agent-browser/`, `src/server/browser-connections.ts`, `src/web/pages/browser.tsx`   |
| Native app policy and transport       | `src/server/computer-use.ts`, `src/providers/desktop.ts`, `src/ports/desktop.ts`, `desktop/main/computer-helper.mjs`                   |
| Workspace, local files and exports    | `src/providers/docker/`, `src/server/local-files.ts`, `src/server/artifacts.ts`, `src/runtime/skills/artifacts/SKILL.md`               |
| Tasks, history and memory             | `src/server/tasks.ts`, `src/server/thread.ts`, `src/server/history.ts`, `src/server/memory.ts`, `src/server/db.ts`                     |
| Local authentication and persistence  | `src/server/access.ts`, `src/server/authenticator.ts`, `src/server/account-store.ts`, `src/server/vault.ts`, PostgreSQL and `.local/`  |
| Authorization and cancellation        | `src/server/trust.ts`, `src/server/approvals.ts`, `src/server/locks.ts`, `src/server/turn-cancellation.ts`, `src/runtime/turn.ts`      |
| Progress and results                  | `src/server/activity.ts`, `src/web/components/live-line.tsx`, `src/web/components/task-stack.tsx`, existing artifacts UI               |
| Voice                                 | `src/server/speech.ts`, `src/providers/elevenlabs/`, `src/server/composition.ts`                                                       |
| Development and packaging             | `package.json`, `scripts/start.mjs`, `compose.yaml`, `desktop/scripts/`, `CONTRIBUTING.md`                                             |

The existing runtime observes, discovers tools, checks Trust, executes, reads results and continues or asks for help. Every turn write still goes through its turn lock. No Trust bypass, cookie import, untrusted-content policy change, host command tool or second browser stack was added.

## Validation status

### Implemented and tested

- Locked root, desktop and documentation dependency installation succeeded.
- `pnpm run typecheck`, `pnpm run lint` and `pnpm run build` passed. The build compiles the web and desktop setup clients; it is not a packaged application. Existing bundle-size and mixed-import warnings remain.
- `tests/url-guards.test.ts`: 15 passed, 1 browser-dependent test skipped because no test browser executable was configured. This includes the new workflow source guard coverage.
- Five selected `tests/agent-guard.test.ts` contracts passed: Stop against an unresponsive source, skill path isolation, untrusted result boundaries, live-page/session-bound browser handoff, and cancellation before private-entry observation.
- Three selected `tests/approvals.test.ts` contracts passed: cancellation choices, failure-state presentation and browser confirmation context.
- `pnpm --dir docs build` passed and reported all internal site links valid. The new root Markdown guides are linked from README and their local targets were checked separately.
- The actual workflow component was exercised in an explicitly labelled browser fixture outside the repository: research/form requests reached the editable draft, preparation protected an existing draft, embedded URL credentials produced an error, and the web client refused desktop workflow preparation. This verifies component behavior, not an integrated agent task.
- The actual installed `agent-desktop` 1.3.1 helper reported Linux accessibility granted. `/dev/kvm` was accessible.

### Failed or blocked

- The full desktop contract command was attempted. A separately captured settings/bridge run reports 335 tests, 328 passed, 6 failed and 1 skipped. Five connector proxy/catalog cases return `IntegrationCatalogFailure` with status 503; their parent test also fails. This is a fixture/contract failure, not evidence of a live service outage. The connector and desktop fixture implementations were not changed by this fork. Do not report the desktop suite as passing.
- Actual source startup (`node scripts/start.mjs`) fails with `spawn docker ENOENT`. Docker, Compose and Buildx are absent at the time of validation. The owner is installing Docker; rerun readiness and startup after it is available.
- `pnpm run desktop:dev` downloaded Electron and launched its process, but this does not establish a ready assistant. Source desktop runtime assets are absent. No packaged Linux release was built or tested.
- A real native bridge check found the installed `org.gnome.TextEditor`, invoked its existing launch operation, then failed with `ACTION_FAILED: Text Editor was started but its window didn't appear within 10 seconds`. A subsequent filtered app listing returned no matching app, and window lookup returned `APP_NOT_FOUND`. No text was entered, no document was saved, and desktop workflow C remains blocked. Accessibility permission alone did not establish usable app access.
- No model is connected. Live model validation, browser navigation/research/export, prepared website fields, sign-in takeover/return, end-to-end Stop/approval and persistence/restart checks remain unverified. Passing fixture contracts does not establish these live outcomes.

### Unconfigured or planned

Email, ElevenLabs and AWS services remain unconfigured and untested. No billable infrastructure was created. Packaged release branding and a fork-owned update channel remain unfinished. The three complete live demonstrations must be verified before presenting this as a finished functional prototype.
