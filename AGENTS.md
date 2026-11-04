# Architecture rules
- Keep physical clinic coverage separate from appointment location choices: Online is a virtual appointment mode, not a new licensed region.
- Determine Online eligibility from verified, nonempty online regional coverage; preserve regional coverage on clinician records.
- Manage location question wording, card display content, and clinic logo URLs through existing administrator-only site settings; keep canonical choice values fixed so content edits cannot change matching or regional coverage.
- Hide the session-mode question for Online and submit Virtually so the quiz cannot collect contradictory answers.