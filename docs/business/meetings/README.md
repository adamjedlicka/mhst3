# Business-owner review records

There have been **no rewrite business-owner reviews recorded yet**.

Use one Markdown file per review, named `YYYY-MM-DD-short-topic.md`. Each
meeting should focus on a small number of questions and a running/example
workflow. Link the record from answered questions, approved scenarios, and
the progress board.

Do not store customer names, contacts, addresses, PDFs, spreadsheet data,
credentials, or recordings here without approved anonymization/storage.
Record an approved fixture ID or safe evidence location instead.

## Template

```md
# YYYY-MM-DD — Topic

## Participants and authority

- Participants:
- Business decision-maker:
- Prepared by:

## Goal

Questions/scenarios in scope; what we need to decide today.

## Examples examined

- Scenario ID:
- Synthetic/anonymized fixture reference:
- Catalogue/price/rule versions:
- Expected calculation and actual result:

## Decisions

| Question | Decision | Decider | Approved example | Consequence |
| --- | --- | --- | --- | --- |

## Deferred and unknown

What remains unresolved, why, and what would settle it.

## Scope

Included now:
Explicitly deferred:
Intentional changes from legacy:

## Actions

| Action | Responsible person | Next checkpoint | Task/scenario |
| --- | --- | --- | --- |

## Confirmation

How and by whom this record was confirmed.
If not confirmed, say “draft awaiting confirmation.”
```

After review:

1. Change question status only with a linked decision.
2. Update the canonical finding without erasing the original observed behavior.
3. Populate exact expected scenario values.
4. Add implementation/test tasks and update `docs/PROGRESS.md`.
5. Before coding an intentional legacy difference, make it visible in both the
   scenario and the relevant decision record.
