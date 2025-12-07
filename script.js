// Format a number as USD currency

function formatCurrency(num) {
  return num.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

// Safely convert input values into numbers

function parseAmount(val) {
  const n = Number(val);
  return Number.isFinite(n) ? n : NaN;
}

//  OOP Classes

// Base class for all transactions (income & expense)

class Transaction {

  // Create a new transaction with a description and amount

  constructor(description, amount) {
    this.id = Transaction.generateId();  // unique ID
    this.description = description.trim();
    this.amount = amount;
    this.createdAt = new Date();        // timestamp
  }

  // Make a pseudo-random ID for each transaction

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Class for income transactions

class Income extends Transaction {
  constructor(description, amount) {
    super(description, amount);
    this.type = 'income';
  }
}

// Class for expense transactions

class Expense extends Transaction {
  constructor(description, amount) {
    super(description, amount);
    this.type = 'expense';
  }
}

// Main Budget class (stores incomes, expenses, and calculations)

class Budget {
  constructor() {
    this.incomes = [];   // list of Income objects
    this.expenses = [];  // list of Expense objects
  }

  // Add a new income and validate input

  addIncome(description, amount) {
    if (!description || description.trim().length === 0) {
      throw new Error('Income description cannot be empty.');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Income amount must be a positive number.');
    }

    const income = new Income(description, amount);
    this.incomes.push(income);
    return income;
  }

  // Add a new expense and validate input

  addExpense(description, amount) {
    if (!description || description.trim().length === 0) {
      throw new Error('Expense description cannot be empty.');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Expense amount must be a positive number.');
    }

    const expense = new Expense(description, amount);
    this.expenses.push(expense);
    return expense;
  }

  // Remove any transaction by ID

  removeById(id) {
    const iIndex = this.incomes.findIndex(i => i.id === id);
    if (iIndex >= 0) {
      this.incomes.splice(iIndex, 1);
      return true;
    }

    const eIndex = this.expenses.findIndex(e => e.id === id);
    if (eIndex >= 0) {
      this.expenses.splice(eIndex, 1);
      return true;
    }

    return false;
  }

  // Calculate total income

  getTotalIncome() {
    return this.incomes.reduce((sum, inc) => sum + inc.amount, 0);
  }

  // Calculate total expenses

  getTotalExpenses() {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  // Final budget (income minus expenses)

  getBudget() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  // Return numbers together: income, expenses, budget

  getSummary() {
    return {
      income: this.getTotalIncome(),
      expenses: this.getTotalExpenses(),
      budget: this.getBudget()
    };
  }
}


// DOM + Application Logic


const app = (function () {

  // Get DOM elements

  const incomeForm = document.getElementById('income-form');
  const expenseForm = document.getElementById('expense-form');
  const incomeList = document.getElementById('income-list');
  const expenseList = document.getElementById('expense-list');
  const incomeTotalEl = document.getElementById('income-total');
  const expensesTotalEl = document.getElementById('expenses-total');
  const budgetTotalEl = document.getElementById('budget-total');

  const clearIncomeBtn = document.getElementById('clear-income');
  const clearExpenseBtn = document.getElementById('clear-expense');

  // Create the Budget instance

  const budget = new Budget();

  // Show an alert for errors

  function showError(msg) {
    alert(msg);
  }

  // Update totals shown on screen

  function updateSummary() {
    const summary = budget.getSummary();
    incomeTotalEl.textContent = formatCurrency(summary.income);
    expensesTotalEl.textContent = formatCurrency(summary.expenses);
    budgetTotalEl.textContent = formatCurrency(summary.budget);

    // Turn budget red if it's negative

    if (summary.budget < 0) {
      budgetTotalEl.style.color = '#d62828';
    } else {
      budgetTotalEl.style.color = '';
    }
  }

  // Rebuild the income & expense lists on the page

  function renderLists() {

    //Income list 

    incomeList.innerHTML = '';

    if (budget.incomes.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'No income added yet.';
      incomeList.appendChild(li);
    } else {
      budget.incomes.forEach(item => {
        const li = document.createElement('li');
        li.className = 'income-item';
        li.dataset.id = item.id;

        li.innerHTML = `
          <div class="meta">
            <div class="desc">${escapeHtml(item.description)}</div>
            <div class="date" title="${item.createdAt.toISOString()}">${item.createdAt.toLocaleString()}</div>
          </div>
          <div>
            <span class="amount">${formatCurrency(item.amount)}</span>
            <span class="item-actions">
              <button class="delete" title="Delete income">✕</button>
            </span>
          </div>
        `;

        // Delete button for income

        li.querySelector('.delete').addEventListener('click', () => {
          if (confirm('Delete this income item?')) {
            budget.removeById(item.id);
            persist();
            renderLists();
            updateSummary();
          }
        });

        incomeList.appendChild(li);
      });
    }

    //Expense list    
    
    expenseList.innerHTML = '';

    if (budget.expenses.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'No expenses added yet.';
      expenseList.appendChild(li);
    } else {
      budget.expenses.forEach(item => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.dataset.id = item.id;

        li.innerHTML = `
          <div class="meta">
            <div class="desc">${escapeHtml(item.description)}</div>
            <div class="date" title="${item.createdAt.toISOString()}">${item.createdAt.toLocaleString()}</div>
          </div>
          <div>
            <span class="amount">-${formatCurrency(item.amount)}</span>
            <span class="item-actions">
              <button class="delete" title="Delete expense">✕</button>
            </span>
          </div>
        `;

        // Delete button for expense

        li.querySelector('.delete').addEventListener('click', () => {
          if (confirm('Delete this expense item?')) {
            budget.removeById(item.id);
            persist();
            renderLists();
            updateSummary();
          }
        });

        expenseList.appendChild(li);
      });
    }
  }

  // Escape HTML characters so input is safe

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Save incomes & expenses in localStorage

  function persist() {
    try {
      const payload = {
        incomes: budget.incomes,
        expenses: budget.expenses
      };
      localStorage.setItem('budget_data_v1', JSON.stringify(payload));
    } catch (e) {
      console.warn('Persist failed', e);
    }
  }

  // Load saved data from localStorage into the app

  function hydrate() {
    try {
      const raw = localStorage.getItem('budget_data_v1');
      if (!raw) return;

      const { incomes = [], expenses = [] } = JSON.parse(raw);

      incomes.forEach(i => {
        const obj = new Income(i.description, Number(i.amount));
        obj.id = i.id || obj.id;
        obj.createdAt = i.createdAt ? new Date(i.createdAt) : new Date();
        budget.incomes.push(obj);
      });

      expenses.forEach(e => {
        const obj = new Expense(e.description, Number(e.amount));
        obj.id = e.id || obj.id;
        obj.createdAt = e.createdAt ? new Date(e.createdAt) : new Date();
        budget.expenses.push(obj);
      });

    } catch (err) {
      console.warn('Hydrate failed', err);
    }
  }

  // Set up event listeners for submit buttons

  function attachEventHandlers() {
    incomeForm.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const desc = document.getElementById('income-desc').value;
      const amtRaw = document.getElementById('income-amount').value;
      const amount = parseAmount(amtRaw);

      try {
        budget.addIncome(desc, amount);
        persist();
        renderLists();
        updateSummary();
        incomeForm.reset();
      } catch (err) {
        showError(err.message);
      }
    });

    expenseForm.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const desc = document.getElementById('expense-desc').value;
      const amtRaw = document.getElementById('expense-amount').value;
      const amount = parseAmount(amtRaw);

      try {
        budget.addExpense(desc, amount);
        persist();
        renderLists();
        updateSummary();
        expenseForm.reset();
      } catch (err) {
        showError(err.message);
      }
    });

    clearIncomeBtn.addEventListener('click', () => {
      incomeForm.reset();
    });

    clearExpenseBtn.addEventListener('click', () => {
      expenseForm.reset();
    });
  }

  // Start the app

  function init() {
    hydrate();
    attachEventHandlers();
    renderLists();
    updateSummary();
  }

  return { init, budget };
})();

// Start after DOM finishes loading

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
