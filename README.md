# AI Business OS

A responsive dashboard prototype for the AI Business OS PRD, using the sample workspace **Style Street**.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Included in this prototype

- Overview dashboard with sample contacts, pipeline, AI activity, and reminders.
- Workspace navigation matching the PRD.
- Search across the sample lead list and add a lead.
- AI task composer and review controls for sample drafts.
- Responsive sidebar and dashboard layout.
- Responsive login and registration prototype at `/login`.
- Five-step onboarding wizard prototype at `/onboarding`, opening on Business details.
- AI Employees workspace with configurable agent cards, permission controls, and a starter chat panel.
- AI Task History table with agent, status, and date filters plus a review detail drawer.
- Three-column Inbox prototype with simulated social conversations, AI reply suggestions, and customer details.
- Contacts table and detail drawer, plus a draggable five-stage CRM pipeline with lead creation.
- Marketing Studio with editable draft options and a weekly saved-content calendar; Campaigns with draft creation and brief export.

The interface currently uses local sample data. Authentication, database persistence, Ollama orchestration, inbox messaging, and background jobs still need backend implementation from the PRD.
