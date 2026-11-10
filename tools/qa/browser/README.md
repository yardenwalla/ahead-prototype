# Browser checks

Things the node checks can't see because they need a real page. Serve the app (`python3 -m http.server 8765`), then run:

- `python3 tools/qa/browser/home_checks.py`: the monthly Home. A birthday shows the photo banner or a question, never both; the question comes back after the photo; nothing runs off a 320px phone; every Home tap works.
