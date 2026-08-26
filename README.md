[![Live Site](https://img.shields.io/badge/site-parity.smokeystack.dev-6aa84f)](https://parity.smokeystack.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js 18+](https://img.shields.io/badge/node-18%2B-339933)](https://nodejs.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82)](https://nuxt.com)

# *How Long Since...?*

A live tracker for feature parity between **Minecraft: Java Edition** and **Minecraft: Bedrock Edition**. For every feature that exists on Java but not Bedrock, the site shows a live counter of exactly how long since it was introduced in Java.

**Live site:** https://parity.smokeystack.dev

## Contents

- [Pages](#pages)
- [Tech stack](#tech-stack)
- [Running locally](#running-locally)
- [Contributing](#contributing)
- [Data format](#data-format)
- [License](#license)
- [Disclaimer](#disclaimer)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Features still missing in Bedrock |
| `/implemented-features` | Features that were later added to Bedrock, with total time-to-parity |
| `/vanilla-item-tags` | Java item tags not yet exposed to Bedrock add-ons |
| `/vanilla-block-tags` | Java block tags not yet exposed to Bedrock add-ons |

Every card can be copied as a PNG (the clipboard icon) for easy sharing.

## Tech stack

- [Nuxt 3](https://nuxt.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn-vue](https://www.shadcn-vue.com)

## Running locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

Other useful commands:

```bash
npm run generate
npm run preview
```

- `npm run generate` - builds the static production site
- `npm run preview` - previews the generated production build locally

## Contributing

Contributions are welcome, including:
- parity data updates
- bug fixes
- UI improvements
- documentation improvements

For parity data changes, see [Adding parity data](#adding-parity-data).

For bugs or feature ideas, open an [issue](https://github.com/SmokeyStack/parity/issues) first if you'd like to discuss the change.

### Suggested PR title format

- `data: add /test command parity entry`
- `docs: clarify date sourcing rules`
- `ui: improve card PNG export spacing`

## Adding parity data

Content lives as **one YAML file per entry** under `app/content/`, split into four collections:

- `app/content/features/` - Home page (features still missing from Bedrock)
- `app/content/implemented/` - Implemented features (`introduced` / `implemented` timestamp pair)
- `app/content/tags-items/` - Missing item tags
- `app/content/tags-blocks/` - Missing block tags

Adding an entry means adding a single new file - there's no shared array to merge into, no manual re-sorting, and no risk of an unrelated merge conflict with someone else's entry. Files are loaded and sorted by date automatically at build time (see `app/composables/useContent.ts`).

### Checklist

1. Find the Java introduction date from a reliable source.
2. Add one new YAML file to the appropriate directory under `app/content/` (see [Data format](#data-format) below for the filename convention and fields).
3. Use an existing `category` value where applicable.
4. Limit markup in `title` and `description` to `<code>` tags only.
5. Include your source link in the PR description.
6. Run `npm run validate` and confirm it passes.
7. Run the site locally and confirm the card renders correctly.

### Guidelines

- `date` / `introduced` / `implemented` should represent when the feature first became available in a Java snapshot, pre-release, or release candidate build, in ISO format (`YYYY-MM-DDTHH:MM:SS`, or `YYYY-MM-DD` if no more precise time is known).
- Source dates from the [Minecraft Wiki](https://minecraft.wiki), official changelogs, or [SlicedLime](https://x.com/slicedlime) or [Jay Wells](https://x.com/Mega_Spud) as they tweet about new changelogs.
- Please link your source in the PR description.
- `category` is one of the existing kebab-case categories (`general`, `commands`, `add-ons`, etc.). Tag files (`tags-items`, `tags-blocks`) don't use a `category` field.
- Markup in `title` / `description` is limited to `<code>` tags - no other HTML.
- `description` may be a string or an array of strings (rendered as a list).

### Before submitting

- run `npm run validate` - CI runs this same check on every pull request
- preserve existing category names
- use ISO timestamps without timezone suffixes
- run the project locally to confirm the card renders correctly

## Data format

Every collection is a directory of YAML files under `app/content/`, one file per entry, named `YYYY-MM-DD-<slug-of-title>.yaml` (the date prefix matches the entry's `date`/`introduced` field; the slug is the title lowercased with `<code>` tags and punctuation stripped). `npm run validate` (Zod-based, see `scripts/validate-content.mjs`) enforces the schemas below and runs in CI on every pull request and on push to `main`.

### `app/content/features/*.yaml`

Tracks features still missing from Bedrock.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `category` | string | Yes | Must match an existing kebab-case category |
| `date` | string | Yes | ISO timestamp (`YYYY-MM-DDTHH:MM:SS` or `YYYY-MM-DD`), or `""` if the introduction date isn't documented |
| `title` | string | Yes | Supports `<code>` tags only |
| `description` | string or string[] | Yes | Rendered as text or a list |

Example (`app/content/features/2025-01-15-test-command.yaml`):

```yaml
category: commands
date: "2025-01-15T10:02:00"
title: <code>/test</code> command
description: since Java got the <code>/test</code> command and disparity occurred.
```

### `app/content/implemented/*.yaml`

Tracks features that later reached Bedrock, using an `introduced` / `implemented` timestamp pair.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `category` | string | Yes | Must match an existing kebab-case category |
| `introduced` | string | Yes | When the feature landed in Java (`YYYY-MM-DDTHH:MM:SS` or `YYYY-MM-DD`) |
| `implemented` | string | Yes | When the feature landed in Bedrock (`YYYY-MM-DDTHH:MM:SS` or `YYYY-MM-DD`); must not be before `introduced` |
| `title` | string | Yes | Supports `<code>` tags only |
| `description` | string or string[] | No | Not currently rendered on this page, but preserved where present in the source data |

Example (`app/content/implemented/2024-01-10-example-command.yaml`):

```yaml
category: commands
introduced: "2024-01-10T12:00:00"
implemented: "2025-03-25T16:00:00"
title: <code>/example</code> command
```

### `app/content/tags-items/*.yaml` and `app/content/tags-blocks/*.yaml`

Track Java item/block tags that are not yet available to Bedrock add-ons.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `date` | string | Yes | ISO timestamp (`YYYY-MM-DDTHH:MM:SS` or `YYYY-MM-DD`) the tag was added in Java |
| `title` | string | Yes | Tag name, e.g. `minecraft:logs` (**not** `name` - despite older docs, the field the site reads is `title`) |
| `description` | string or string[] | Yes | Additional context |

Example (`app/content/tags-items/2018-05-08-minecraft-logs.yaml`):

```yaml
date: "2018-05-08"
title: minecraft:logs
description: Available in Java but not currently exposed to Bedrock add-ons.
```

## Development notes

- Content is sourced from one-file-per-entry YAML under `app/content/`, loaded via `app/composables/useContent.ts`
- `npm run validate` runs the Zod schema checks in `scripts/validate-content.mjs`; this also runs in CI (`.github/workflows/validate.yml`)
- The site is statically generated with Nuxt
- Each route renders cards from one of the content collections above
- Card PNG export is available from each card via the clipboard icon

## Scope

This project tracks:

- gameplay and command parity gaps between Java and Bedrock
- vanilla item and block tags relevant to Bedrock add-on creators

It does not aim to:

- predict if or when parity will happen
- track every behavioral difference between editions
- include unofficial or modded features

## License

- Source code in this repository is licensed under the [MIT License](LICENSE).
- `public/fonts/Mojangles.ttf` is not covered by the MIT license.
- The Minecraft name and all referenced game content remain the property of Mojang AB / Microsoft.
- See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for third-party notices and vendored code licenses.

## Disclaimer

> **NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.**

Parity is an unofficial, non-commercial fan project. Minecraft is a trademark of Mojang AB / Microsoft Corporation. All game content, names, and assets referenced by this site belong to their respective owners.
