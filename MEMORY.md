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

## 6.5 HD PowerPoint Template

* 公司标准 PPT 模板：`~/.openclaw/workspace-gabriel/templates/HD_template.pptx`（Global PowerPoint Template, Feb 2025）。
* 触发词："HD格式" / "HD模板" → 用此模板；未指定时用默认或用户指定的格式。
* 详细 layout / 配色 / 字体清单见 `memory/hd-template.md`。
* 关键规格：16:9（15.11"×8.50"），Arial 字体，主色 #F08100（橙），17 个 layouts，自带 21 页 demo（生成新 deck 时需先清空）。

## 7. Current Important Projects

* AI_System / McClaw & Company multi-agent operating system.
* WeChat article ingestion workflow.
* Personal intelligence system.
* Investment agent: "多想一步".
* Circle / stablecoin research sample project.

## 7.5 Topic 任务追踪机制（2026-06-03 启用）

* 每个 Telegram topic 配一份任务簿：`~/.openclaw/workspace-gabriel/topics/<topic-slug>/tasks.md`
* 已建：`topics/chief-of-staff/tasks.md`（🧠 Chief of Staff，topic 5）
* 结构：Active / Waiting / Blocked / Done 四段
* 行为规则：
  1. Gabriel 在 topic 里布置任务 → 立刻 append 到 Active
  2. 任务有进展/状态变化 → 同步更新对应行（带时间戳）
  3. Gabriel 问"进度"/"现状" → **先读对应 topic 的 tasks.md 再答**
  4. 完成 → 移 Done；卡住 → 移 Blocked 并注明原因
  5. 进入某 topic 且 Active 非空 → 主动汇报当前状态
* 这是解决跨消息"失忆"的标准手段，比 TaskFlow（plugin/runtime API）更适合对话场景。

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
