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
| VBR Get All Jobs | Lists backup job configurations, optional `hostName` filter |
| VBR Get All Job States | Current job status (running / finished / failed) |
| VBR Start Job | Starts a scheduled job by `jobId` |
| VBR Create Quick Backup | Ad-hoc backup for a VM using `objectId` |
| VBR Get All Repositories | Repository list and configuration |
| VBR Get All Repositories States | Storage capacity and free space |
| VBR Get All Sessions | Session history with optional `hostName` filter |
| VBR Get Restore Points | Available restore points filtered by VM name |
| VBR Get All Tasks | Currently running background tasks |
| VBR Get All Malware Events | Malware detection events |
| VBR Get All Authorization Events | Security and permission-related audit events |

Each tool is implemented as a separate sub-workflow called via `toolWorkflow` node.

---

## Sub-Workflow Setup

Import all sub-workflow JSON files into n8n, then replace the placeholder in the `BackupPaw 🐾`  workflow with the actual workflow IDs assigned after import:

Assign the **Veeam Data Platform REST API** credential to the `Get Bearer Token` node in each sub-workflow.

---

## Example Questions

- `Is VM prod-web-01 protected by a backup job?`
- `When was vm-db-02 last backed up?`
- `Are there any malware events in the last 24 hours?`
- `How much free space is left on the backup repositories?`
- `Start a quick backup for vm-app-03.` *(requires confirmation)*

---

## Disclaimer
**This integration and workflows are not officially supported by Veeam Software. Use it at your own risk.**

---

## Version History
- 0.1 (February 2026)
   - Initial version
     
---

## Agent Behavior

- **VM lookups** always follow the chain: vCenter → Inventory Object → store `objectId`
- **Actions** (start job, quick backup) require explicit user confirmation before execution
- **Default timeframe** is the last 24 hours when none is specified
- **Last backup queries** use `VBR Get Restore Points` after VM lookup
