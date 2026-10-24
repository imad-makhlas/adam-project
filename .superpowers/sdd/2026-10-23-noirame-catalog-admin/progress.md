# SDD ledger — plan: docs/superpowers/plans/2026-10-23-noirame-catalog-admin.md

Execution mode: inline, explicitly selected by the user.

Global ruling: The user explicitly prohibited Git operations, so the executing-plans Git workspace, BASE/commit ranges, commit steps, and Git-based review package are replaced by this local ledger plus direct test evidence. Cost if wrong: no automatic commit-range recovery; the plan checklist and test logs remain the progress record.

Pre-flight: Task 1 `Product`/`ProductInput` schemas → Tasks 2, 3, 4, 5: compatible. `ProductInput` excludes generated `id`; repository creation generates a stable UUID.
Pre-flight: Task 2 repository CRUD → Task 3 API routes: compatible; repository owns row mapping and route layer owns HTTP status mapping.
Pre-flight: Task 3 public/admin endpoints → Tasks 4, 5, 6 clients: compatible; all responses use shared schemas and stable JSON errors.
Pre-flight: Task 4 catalog/cart reconciliation → existing WhatsApp checkout: compatible; only currently available fetched products can reach the message builder.
Pre-flight: Task 5 saved image metadata → Task 6 Cloudinary lifecycle: compatible; replacement persists new metadata before cleanup.

Ruling: Admin IDs are generated server-side with `crypto.randomUUID()` because the approved admin form does not expose an ID field. Cost if wrong: importing external product IDs later would require an explicit import path.
Ruling: Cloudflare Access is the production authentication boundary; the Worker header check is defense in depth, and the production deployment must not expose an unprotected workers.dev route. Cost if wrong: a misconfigured edge route could weaken admin protection.

Environment ruling: The installed `npm.cmd` resolves its CLI through an incomplete user-level npm prefix (`AppData/Roaming/npm`) although the valid npm CLI exists under `C:/Program Files/nodejs/node_modules/npm`. Project commands will invoke that valid CLI explicitly. No machine-level installation is modified. Cost if wrong: commands would fail before reaching project scripts, which is immediately visible.

Task 1: Ruling: Replace planned `@cloudflare/vitest-pool-workers` with its official successor `@cloudflare/vitest-plugin`; the installed package README marks the pool package deprecated and redirects to the plugin. Cost if wrong: Worker tests would require a configuration adjustment, isolated from production runtime code.
