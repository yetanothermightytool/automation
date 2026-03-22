# BackupPaw 🐾

> **Work in Progress** — functionality and documentation are subject to change.

Everyone is talking about the Claw 🦞 autonomously clawing its way through your systems at 3am. BackupPaw makes sure there's actually something left to recover when it does. 🐾

An n8n AI agent for interacting with **Veeam Backup & Replication** via natural language chat. The agent queries the VBR REST API to answer questions, report status, and trigger backup operations.

---

## Requirements

- n8n **2.9.4** (tested) — later versions have known issues with the Chat Trigger node, compatibility will be verified with a future release
- Veeam Backup & Replication 13.0.1 (REST API v1.3-rev1)
- **Veeam Data Platform REST API** credential node — [yetanothermightytool/automation/n8n](https://github.com/yetanothermightytool/automation/tree/main/n8n)

---

## DataTable Configuration

The agent requires an n8n **DataTable** named `Env-Settings` with the following entry:

| Column | Value |
|---|---|
| `item` | `vCenter` |
| `value` | `<your vCenter FQDN>` |

The DataTable is referenced by the `Get vCenter Information` tool and must exist before activating the workflow.

---

## Workflow Structure

```
Chat Input
    └── 🧠 The Brain
            ├── Simple Memory (Buffer Window)
            ├── Think (internal reasoning)
            ├── [Tools - see below]
            └── Split Out
```

### Tools

| Tool | Description |
|---|---|
| Get vCenter Information | Reads vCenter FQDN from `Env-Settings` DataTable |
| VBR Get Inventory Object | Fetches VM details and `objectId` from VBR |
| VBR Get All Repositories States | Storage capacity and free space |
| VBR Get All Sessions | Session history with optional `hostName` filter |
| VBR Get Restore Points | Available restore points filtered by VM name |
| VBR Get All Tasks | Currently running background tasks |
| VBR Get All Malware Events | Malware detection events |
| VBR Get All Authorization Events | Security and permission-related audit events |
| Backup Job Management Agent | Sub-agent for all backup job operations (list, start, create, edit) |
| BackupPaw Research Agent | Sub-agent for CVE lookups and Veeam release checks |
| Entra ID Agent | Sub-agent for Entra ID backup queries and comparisons |

Each tool is implemented as a separate sub-workflow called via `toolWorkflow` node.

---

## Sub-Workflow Setup

Import all sub-workflow JSON files into n8n, then replace the placeholders in the `BackupPaw 🐾` workflow with the actual workflow IDs assigned after import.

Assign the **Veeam Data Platform REST API** credential to the `Get Bearer Token` node in each VBR sub-workflow.

---

## Backup Job Management Agent

The **Backup Job Management Agent** is a separate sub-agent using Claude Haiku that handles all backup job operations. The Brain delegates all job-related requests to this agent.

| Sub-Workflow | Description |
|---|---|
| VBR Get All Jobs | Lists backup job configurations, optional name filter |
| VBR Get All Job States | Current job status (running / finished / failed) |
| VBR Get All Repositories | Repository list with IDs and free space |
| VBR Start Job | Starts a scheduled job by `jobId` |
| VBR Create Quick Backup | Ad-hoc backup for a VM using `objectId` |
| VBR Create Backup Job | Creates a new scheduled backup job for a VM |
| VBR Add VM to Job | Adds a VM to an existing backup job |

**Notes:**
- The agent always asks for explicit confirmation before creating or modifying jobs
- If a VM is not in any job, the agent will suggest adding it to an existing job or creating a new one
- Jobs using tag- or container-based selection (ResourcePool, Folder, Cluster, etc.) cannot have individual VMs added — the agent will report this and suggest alternatives
- `VBR Add VM to Job` reads the full job configuration first and writes back the complete model — partial updates are not supported by the API
- `VBR Create Backup Job` and `VBR Add VM to Job` require `vmName`, `objectId` and `hostName` (vCenter FQDN). The Brain resolves these automatically via the inventory lookup — the user does not need to provide them

---

## Research Agent

The **BackupPaw Research Agent** is a separate sub-agent using Claude Haiku to minimize token costs. It has two tools:

| Sub-Workflow | Description |
|---|---|
| NVD CVE Lookup | Searches the NIST NVD for CVEs by keyword and date range |
| Veeam Release Check | Fetches latest VBR release versions from Veeam KB2680 |

**NVD API Key (optional):** Without a key, requests are rate-limited to 5 per 30 seconds. To add one, create a **Generic Credential Type → Header Auth** credential with header name `apiKey` and assign it to the `NVD CVE Search` node in the `NVD CVE Lookup` sub-workflow.

---

## Entra ID Agent

The **Entra ID Agent** is a separate sub-agent using Claude Haiku to query Entra ID backup data via the VBR REST API. It has two tools:

| Sub-Workflow | Description |
|---|---|
| VBR Entra ID Check Backup | Checks if a User, Group, or Application exists in the backup |
| VBR Entra ID Compare Production | Checks backup existence and compares item properties with current production state |

The agent determines which tool to use based on the query — simple existence checks use `VBR Entra ID Check Backup`, while change detection uses `VBR Entra ID Compare Production`.

---

## Example Questions

- `Is VM prod-web-01 protected by a backup job?`
- `When was vm-db-02 last backed up?`
- `Are there any malware events in the last 24 hours?`
- `How much free space is left on the backup repositories?`
- `Start a quick backup for vm-app-03.` *(requires confirmation)*
- `VM app-07 is not in any backup job — what should I do?`
- `Add vm-db-05 to the job 'Daily-Prod-Backup'.` *(requires confirmation)*
- `Create a new backup job for vm-web-02.` *(agent will ask for parameters)*
- `Are there any critical CVEs for Veeam in the last 7 days?`
- `What is the latest VBR release?`
- `Is user john.doe@contoso.com backed up in Entra ID?`
- `What changed for group 'IT-Admins' compared to the backup?`

---

## Disclaimer
**This integration and workflows are not officially supported by Veeam Software. Use it at your own risk.**

---

## Version History
- 0.1 (February 2026)
   - Initial version

---

## Agent Behavior

- **VM lookups** always follow the chain: vCenter → Inventory Object → store `vmName`, `objectId` and `hostName` (vCenter FQDN)
- **Actions** (start job, quick backup, create job, add VM) require explicit user confirmation before execution
- **Default timeframe** is the last 24 hours when none is specified
- **Last backup queries** use `VBR Get Restore Points` after VM lookup
- **Job, Research, and Entra ID queries** are delegated to dedicated sub-agents running Claude Haiku
