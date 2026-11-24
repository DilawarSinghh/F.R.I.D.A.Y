# F.R.I.D.A.Y

Personal AI assistant prototype by **fish eye** (team ID `6a021fdc`), built on [Nod by n8n](https://github.com/n8n-io/nod). It uses Nod's existing Pi agent runtime, Fastify server, React interface, isolated Chromium browser, PostgreSQL storage, approval system and native desktop bridge. Those foundation features were not implemented from scratch by our team.

**Status:** workflow preparation is implemented. Live AI/browser workflows and packaged desktop startup are not yet verified in this environment. This is not a claim of a finished assistant. See [setup, demonstrations and limitations](docs/friday.md) and [implementation and validation](docs/friday-implementation.md).

## Start

Requires Node.js **24.21.0+**, the repository's **pnpm 10.34.5**, and running **Docker with Compose v2 and Buildx** for source mode. Use the checked-in lockfiles.

```sh
cd /home/nullspace/Projects/F.R.I.D.A.Y
pnpm install --frozen-lockfile
node scripts/friday-doctor.mjs
pnpm start
```

Open the private access link printed by the server. Keep its access token private. Connect your model through **Settings → Models**. Other supported providers, compatible endpoints and Nod's supported ChatGPT sign-in remain available. An API key is separate from a chat subscription; provider access and usage limits apply. Never paste keys or sign-in codes into chat. `.env.example` contains placeholders only; `.env` and `.local/` are ignored.

For automatic reload, use `pnpm run dev`. To stop, press Ctrl-C and run `docker compose stop`. For native applications, follow the [desktop requirements](docs/friday.md#native-desktop-control); a web/server launch does not enable them.

## Use

Expand **F.R.I.D.A.Y workflows** above the chat composer:

- **Research and export:** supply up to three HTTPS pages and the fields to compare. The existing agent reads pages, creates a Markdown comparison with source links, reads the file back, then delivers it.
- **Prepare a form:** supply one form URL and your facts. The agent prepares supported fields, reports missing information and stops before submission for your review.
- **Summary into a desktop editor:** in the local desktop app, name an installed editor and supply text or a page. The agent must enter and read back the text through native tools. File creation alone is not desktop success.

**Prepare in composer** creates an editable request; it does not start execution. Existing unsent drafts are protected. Review it and send in chat. Existing progress, Stop, approvals, Browser takeover and downloadable results remain in use. No configured model connection means no live agent execution; no canned model fallback is included.

F.R.I.D.A.Y cannot guarantee arbitrary websites or applications, bypass account security, or operate foreground-only apps on Linux Wayland. Browser sessions belong to its separate browser; it never imports your normal Chrome or Firefox profile. See the detailed guide for signing in, removing sessions, optional voice and capability status.

## Team and attribution

- Dilawar Singh — student ID `25etre409011`
- Ishika Singh — student ID `26etmc412011`
- M S Ramaiah University of Applied Sciences, Bengaluru

Foundation revision: `40956c97754477cfecbeccf26f212b33d4e709d3`. Keep [LICENSE](LICENSE), [NOTICE](NOTICE), [third-party desktop notices](desktop/licenses) and bundled asset licences with distributions. The upstream README and history remain available through the `upstream` remote. Upstream documentation is in [docs](docs/README.md). No AWS infrastructure has been deployed; sponsor integrations are not claimed as configured or tested.
