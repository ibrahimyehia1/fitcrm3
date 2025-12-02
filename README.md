
# FitCRM — Assignment 2 (Adjusted)

This release includes all required files and additional modules for clarity and maintainability.

## What changed (matching your comments)
- Added `age` field and validation (age must be > 0 and realistic)
- Email format validation and phone pattern validation
- Split JavaScript into modules:
  - `js/clients.js` — storage and helper functions
  - `js/client.js` — validation and client model creation
  - `js/main.js` — UI, event handling, rendering
- Included `data/clients.json` sample file (can import via the UI "Import sample data" button)
- Improved visual design with blue & white theme
- All required features implemented (Add/Edit/Delete/Search/View, localStorage persistence, suggested exercises via Wger)

## Files
- index.html
- css/styles.css
- js/clients.js
- js/client.js
- js/main.js
- data/clients.json
- README.md

## Run locally
Serve with a simple static server for full functionality:

```bash
python -m http.server 8000
# open http://localhost:8000
```

Note: Wger API calls require network; fallback list exists if unavailable.
