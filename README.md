
# FitCRM — Assignment 2 (Final Submission)

This project implements Assignment 2 requirements for FitCRM — Simple Client Manager (Frontend-only).

## Pages
- **Page 1 (index.html)** — New Client form (add / edit with validation)
- **Page 2 (list.html)** — Client List (search, edit, delete, view)
- **Page 3 (view.html)** — Client View (detailed view, training history, suggested exercises)

## Features implemented (all requirements)
- Add Client: saves to localStorage (persist across refresh).
- Edit Client: edit form repopulates existing data (use index.html?edit=<id> or Edit button on list).
- Delete Client: removes from list and localStorage with confirmation.
- Search: fetch by name and filter list.
- View: click client to go to Page 3 (view.html?id=<id>) and display required fields.
- Client View displays: Name, Email, Phone, Fitness Goal, Membership Start Date, Training history (array), Exercises for next session.
- Suggested exercises: fetches 5 exercises from Wger API; falls back to local suggestions if unavailable.
- Validations: name/email/phone/age (age &gt; 0 &lt;= 120), email format, phone pattern.
- Responsive layout and blue & white visual theme.
- File structure matches suggested layout.

## Files included
- index.html, list.html, view.html
- css/styles.css
- js/clients.js, js/client.js, js/new_client.js, js/list.js, js/view.js
- data/clients.json (sample two clients)
- README.md

## Notes
- To test the sample data import: open `list.html` and click "Import sample data" (it will not duplicate if your localStorage already has entries).
- For full API functionality, serve the folder via a simple static server (recommended):
  ```bash
  python -m http.server 8000
  ```
  then open http://localhost:8000/list.html

