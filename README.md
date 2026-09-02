# oxc-transform corruption repro

Minimal reproduction for [angular/angular-cli issue](https://github.com/angular/angular-cli/issues/33973).

## What this is

A fresh `ng new` Angular app depending only on `quill` + `quill-mention`
(public packages), each used from its own component, deferred via
`@defer` so the production build's `advancedOptimizations`/`oxc-transform`
pass processes each as a separate lazy chunk. `quill`'s `parchment`
dependency (the exact file that fails to parse in our real project) is
confirmed present in the built output (`grep Parchment dist/repro/browser/*.js`).

**This reproduces the bug 100% of the time.** The critical variable is
**musl libc (Alpine)** - the build fails with the exact same
`Unexpected "}"` parse error we see in our real project when run inside
an `alpine:3.23` container, but succeeds on a plain glibc-based Linux
host. Dependency/chunk count is irrelevant here; these two small
libraries (2 lazy chunks total) are enough.

## Why this repo exists

The underlying bug does **not** reproduce reliably on emulated/translated
environments (e.g. Apple Silicon via Rosetta 2 x86_64 emulation, or
Docker/QEMU x86_64 emulation) - only on native x86_64 hardware combined
with musl libc (Alpine). It has been 100% reproducible for us on our own
GitLab CI's native x86_64, Alpine-based Docker runners.

This repo reproduces the same bug using only public dependencies, by
running the build inside an `alpine:3.23` container on GitHub Actions
(native x86_64, no QEMU emulation) - closely matching our production CI
environment.

## How to run

- Push this repo to GitHub and check the "Reproduce oxc-transform
  corruption" workflow run under the Actions tab (runs automatically on
  push to `main`, or trigger manually via "Run workflow"). It runs
  several build attempts in parallel, in case the failure is
  timing/concurrency dependent rather than 100% deterministic.
- Or clone and run `bun install --frozen-lockfile && bun run build`
  yourself inside an `alpine:3.23` container on native x86_64 Linux (see
  the workflow file for the exact setup steps: `gcompat`/`libstdc++` for
  glibc compat so Node-based GitHub Actions can run, then installing bun
  the same way our production CI Docker image does).


## Status

- [x] Reproduces on GitHub Actions, native x86_64, inside an
      `alpine:3.23` container (musl libc) - identical error to our real
      project
- [x] Does NOT reproduce on a plain glibc-based Linux host (same
      hardware, same dependencies)
- [x] Does NOT reproduce locally on Apple Silicon (arm64), even under
      Rosetta 2 x86_64 emulation, or under Docker/QEMU x86_64 emulation
      (including inside an Alpine 3.23 container) - emulation appears to
      mask the bug regardless of libc

**Root cause confirmed: musl libc (Alpine), not glibc (Debian/Ubuntu),
combined with native x86_64 execution (no emulation), is both necessary
and sufficient to trigger this bug.** Dependency count/chunk count is
irrelevant.

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
