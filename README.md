# Artillery Usage Guide

This repository contains Artillery test scenarios for different logical groups (barangay, building, city, department, team). Use this README to install Artillery, edit test files by size and target URL, run tests, and generate basic reports.

---

## Table of contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project structure](#project-structure)
- [How to edit test files](#how-to-edit-test-files)

  - [Key settings you’ll change per size](#key-settings-youll-change-per-size)
  - [Setting the target URL](#setting-the-target-url)
  - [Example test templates (load & stress)](#example-test-templates-load--stress)

- [Run tests (CLI examples)](#run-tests-cli-examples)
- [Generate a report](#generate-a-report)
- [Tips & troubleshooting](#tips--troubleshooting)
- [License](#license)

---

## Overview

Artillery is a modern, powerful & easy-to-use load testing toolkit for HTTP, WebSocket and other protocols. This repo contains example scenarios split by logical area (e.g., `barangay`, `building`, `city`, `department`, `team`) with two flavors of test files in each directory:

- `load.yml` — steady-state / smoke load test (smaller scale)
- `stress.yml` — larger, high-intensity stress test

Use these as starting points and adapt arrival rates, durations and virtual user flows to match your performance goals.

---

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node) or yarn
- A terminal / shell with access to the repository

---

## Installation

Install Artillery globally (CLI) or as a dev dependency for the project.

**Globally (handy for quick runs):**

```bash
npm install -g artillery
```

**Local to the project (recommended for CI):**

```bash
npm install --save-dev artillery
# or
yarn add --dev artillery
```

If you install locally, use `npx artillery` (npm) or `yarn artillery` to run commands.

---

## Project structure

Example tree (provided):

```
README.md
├── barangay
│   ├── load.yml
│   └── stress.yml
├── building
│   ├── load.yml
│   └── stress.yml
├── city
│   ├── load.yml
│   └── stress.yml
├── department
│   ├── load.yml
│   └── stress.yml
└── team
    ├── load.yml
    └── stress.yml
```

Each directory contains one `load.yml` and one `stress.yml` — copy/modify as needed.

---

## How to edit test files

**Only change the `target` value — do not modify phases, scenario flows, or payloads.**

Open the relevant `load.yml` or `stress.yml` for the area you want to test and only update the `config.target` field to point to the environment you want to run against (for example, staging or production). Leave all other fields (`phases`, `scenarios`, `defaults`, `processor`, etc.) unchanged unless you explicitly intend to create a different test profile.

This ensures everyone runs the same test logic and only changes the system under test.

### Setting the target URL (only)

Set the target in the `config` section of each YAML. Example — **change only the URL**:

```yaml
config:
  target: "https://api.example.com" # <<-- CHANGE THIS ONLY
  phases:
    - duration: 60
      arrivalRate: 20
```

If you need multiple environments, keep separate copies of the same YAML (for example `load.staging.yml`, `load.prod.yml`) where the only difference is the `target` value.

---

## Example test templates (load & stress)

**load.yml (example)**

```yaml
config:
  target: "https://example.com" # change this
  phases:
    - duration: 120
      arrivalRate: 20
  defaults:
    headers:
      Content-Type: application/json
scenarios:
  - name: simple-get
    flow:
      - get:
          url: "/health"
      - get:
          url: "/api/v1/items"
```

**stress.yml (example)**

```yaml
config:
  target: "https://example.com" # change this
  phases:
    - duration: 60
      arrivalRate: 50
    - duration: 120
      arrivalRate: 200
    - duration: 300
      arrivalRate: 500
scenarios:
  - name: heavy-workflow
    flow:
      - get:
          url: "/api/v1/items"
      - post:
          url: "/api/v1/orders"
          json:
            item_id: 1
            qty: 1
```

Adjust JSON payloads and endpoints to match your API.

---

## Run tests (CLI examples)

**Run a single file (global install):**

```bash
artillery run ./barangay/load.yml
```

**Run with local installation using npx:**

```bash
npx artillery run ./building/stress.yml
```

**Save a raw JSON summary to a file:**

```bash
artillery run ./city/load.yml -o ./reports/city-load-result.json
```

**Run multiple tests in sequence (simple script):**

```bash
#!/usr/bin/env bash
npx artillery run ./barangay/load.yml -o ./reports/barangay-load.json
npx artillery run ./building/load.yml -o ./reports/building-load.json
```

---

## Generate a report

After producing a JSON output with `-o`, create a human-readable HTML report:

```bash
artillery report ./reports/city-load-result.json -o ./reports/city-load-report.html
# then open ./reports/city-load-report.html in your browser
```

If you didn't produce JSON output, you can still create a report from the default results file if present.

---

## Tips & troubleshooting

- **Run small first.** Always validate scenarios locally with small arrival rates before scaling up.
- **Monitoring.** Run server-side metrics (CPU, memory, request latency, DB metrics) together with load so you can correlate behavior.
- **Rate-limiting & authentication.** If your API requires auth or has rate-limits, include tokens and exponential backoff or adjust arrival rates.
- **Network & client limits.** Your load generator machine has limits — for very large RPS use distributed load generation or a more powerful machine(s).
- **Error handling.** Inspect Artillery’s console output and the produced JSON for error rates and failed requests.
- **CI integration.** Add `npx artillery run` commands to your CI pipeline and fail the build if error rate exceeds a threshold.

---

## License

This guide is provided as-is. Adapt and reuse as needed for your team.
