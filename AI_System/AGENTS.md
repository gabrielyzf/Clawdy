# AI_System — Operating Guide

## Architecture Summary

| Layer | Tool | Role |
| ----- | ---- | ---- |
| Interaction | Telegram / McClaw & Company | Discuss, assign, receive updates |
| Working Source of Truth | `~/AI_System/projects/<project>/` | All research, drafts, artifacts |
| Task Tracking | `~/AI_System/tasks/tasks.md` | Master ledger of all active work |
| Notion Staging | `~/AI_System/notion_sync/` | Curated outputs ready to archive |
| Long-term Archive | Notion | Final verified knowledge base |

## Directory Map

```
~/AI_System/
├── inbox/                  ← Raw incoming material
│   ├── wechat/
│   ├── articles/
│   ├── pdfs/
│   ├── links/
│   ├── random_ideas/
│   └── telegram_exports/
├── projects/               ← One folder per project (source of truth)
│   └── circle_stablecoin_2026/
├── tasks/
│   └── tasks.md            ← Master task ledger
├── templates/
│   └── project_template/   ← Copy this to start a new project
├── notion_sync/            ← Staging area for Notion-ready outputs
│   ├── knowledge_base/
│   ├── research_projects/
│   ├── source_library/
│   └── sync_log.md
└── archive/                ← Completed projects (cold storage)
```

## Command Reference

| You say | What happens |
| ------- | ------------ |
| `Create a project: [name]` | New folder under projects/, template copied, brief initialized, tasks.md updated, Telegram topic recommended |
| `Assign Research to [project]` | Write/update 01_research_brief.md + 02_sources.md, update task_log.md + README.md |
| `Assign Verification to [project]` | Read research, write/update 03_verification_report.md, update logs |
| `Assign Investment Analyst to [project]` | Read research + verification, write/update 04_investment_thesis.md, update logs |
| `Prepare Notion archive for [project]` | Write 05_final_summary.md + 06_notion_archive.md, stage under notion_sync/, update all logs |
| `Archive [project] to Notion` | Sync to Notion (if API available) or deliver clean Markdown + instructions |

## Agent Roles

| Agent | Responsibility |
| ----- | -------------- |
| Chief of Staff | Task intake, project setup, README/task_log/tasks.md maintenance |
| Research Agent | Source collection, 01_research_brief.md, 02_sources.md |
| Verification Agent | Fact-checking, 03_verification_report.md |
| Investment Analyst | Thesis construction, 04_investment_thesis.md |
| Knowledge Librarian | Final summary, 06_notion_archive.md, notion_sync/ staging |
| Coding Agent | Scripts, automation, GitHub work inside approved folders only |

## Operating Rules

1. Telegram = discussion layer only. Not source of truth.
2. Project workspace = working source of truth.
3. README.md = project dashboard. Always keep it current.
4. tasks.md = master ledger. Every project gets a row.
5. Only verified/curated output goes to notion_sync/ and Notion.
6. Drafts and unverified material stay in the project folder.
7. Do not touch credentials, SSH keys, wallets, or sensitive data.
