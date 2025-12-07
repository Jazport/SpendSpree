# Budget Tracker (SASS + JavaScript)

A lightweight Budget Tracker app built using SASS and JavaScript, demonstrating object-oriented design with classes and encapsulation.

## Features
- Add **income** and **expenses** with description and amount.
- Dynamic calculation of **total income**, **total expenses**, and **total budget** (income - expenses).
- Items stored in separate arrays (`incomes` and `expenses`) encapsulated in a `Budget` class.
- Validation prevents empty descriptions and invalid/negative amounts.
- Simple localStorage persistence (so your data persists between reloads).
- SASS design system with variables, `primary-color` variable, `gradient` mixin, and optional `animations` mixin.
- Delete items from income or expenses lists.
- Comments throughout the code to explain logic.

## Files
- `index.html` — main UI
- `styles.scss` — SASS source (includes design system, variables, mixins)
- `script.js` — JavaScript implementation (classes + DOM handling)
- `styles.css` — **generated** CSS (you need to compile `styles.scss` into `styles.css`)
- `README.md` — this file

## How to run locally
1. Clone or copy the project files into a folder.
2. Install a SASS compiler (if you don't have it):
   - Option A: [Dart Sass](`https://sass-lang.com/install`) (recommended)
   - Option B: Use a code editor extension (e.g., Live SASS Compiler in VSCode)

3. Compile `styles.scss` to `styles.css`. 
