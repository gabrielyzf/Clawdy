# Gabriel Memory

## 1. User Identity and Preferences

* User: Gabriel
* Preferred language: Chinese for conceptual discussion; English for work emails and professional documents when requested.
* Style preference: direct, structured, analytical, consulting-quality.
* Avoid vague answers. Separate facts, assumptions, and recommendations.

## 2. Current OpenClaw Architecture

* OpenClaw runs on an AWS cloud server in US West.
* OpenClaw version: 2026.4.27.
* There are two isolated assistant instances:

  * Clawdy (Gabriel), accessed via Telegram.
  * Clawdy (Elin), accessed via Feishu.
* Gabriel's workspace:
  ~/.openclaw/workspace-gabriel/
* Elin's workspace:
  ~/.openclaw/workspace-elin/

## 3. Gabriel's AI System Design

* Telegram Super Group: McClaw & Company.
* Telegram is the interaction layer, not the source of truth.
* Project workspace is the working source of truth.
* Notion is the final long-term knowledge base.
* Root working directory:
  ~/AI_System/

## 4. AI_System Operating Model

* Organize by project, not by agent chat history.
* Each serious project should have:

  * Telegram topic
  * Project workspace
  * README.md as dashboard
  * task_log.md
  * research / verification / thesis / final summary files
  * Notion archive draft

## 5. Agent Roles

* Chief of Staff: task intake, routing, project setup, status tracking.
* Research Agent: source collection, research brief, sources file.
* Verification Agent: fact-checking, contrary evidence, confidence levels.
* Investment Analyst: thesis, second-order implications, asset mapping.
* Knowledge Librarian: final summary, Notion-ready archive.
* Coding Agent: scripts, GitHub, automation, implementation.

## 6. Standard Project Workflow

1. Create project workspace.
2. Create or recommend Telegram topic.
3. Draft project brief.
4. Research Agent writes research brief and sources.
5. Verification Agent checks claims and evidence.
6. Investment Analyst writes thesis if relevant.
7. Knowledge Librarian prepares final Notion archive.
8. Final knowledge is deposited into Notion.

## 7. Current Important Projects

* AI_System / McClaw & Company multi-agent operating system.
* WeChat article ingestion workflow.
* Personal intelligence system.
* Investment agent: "多想一步".
* Circle / stablecoin research sample project.

## 8. Operating Rules

* Do not scatter outputs across agent-specific folders.
* Do not archive unverified drafts into Notion.
* Do not touch sensitive files, credentials, browser data, wallets, SSH keys, or company confidential folders unless explicitly authorized.
* Prefer clarity, traceability, and low operational complexity.
* Keep MEMORY.md concise and updated only with durable facts, decisions, and operating rules.

## 9. Memory Update Protocol

Update MEMORY.md only when:

* The user explicitly says "remember this" or asks to update memory.
* A durable architecture decision is made.
* A project reaches a stable milestone.
* A long-term preference or workflow rule changes.

Do not write temporary tasks, random questions, or short-lived chat context into MEMORY.md.
