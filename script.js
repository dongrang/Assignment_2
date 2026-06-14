// expense form 
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
dateInput.value = new Date().toISOString().split('T')[0];
const errorMessage = document.getElementById('error-message');

// controls 
const filterCategory = document.getElementById('filter-category');
const sortBy = document.getElementById('sort-by');

// empty expense list
const expenseList = document.getElementById('expense-list');
const emptyMessage = document.getElementById('empty-message');

// totals 
const totals = document.getElementById('totals');
const overallTotal = document.getElementById('overall-total');
const categoryTotal = document.getElementById('category-total');
const expenseCount = document.getElementById('count');

// let expenses = [];
let activeFilter = 'All';
let activeSort = 'date-newest';

// testing set
/*let expenses = [
  { id: 1, description: "Coffee", amount: 3.50, category: "Food", date: "2026-06-14" }
];
*/

function renderExpenses() 
{
    expenseList.innerHTML = '';

    if(expenses.length === 0)
    {
        expenseList.innerHTML = '<p id="empty-message">No expense added yet.</p>';
        return;
    }

    expenses.forEach(expense => {
        const row = document.createElement('div');
        row.innerHTML = `
            <span>${expense.description}</span>
            <span>${expense.amount}</span>
            <span>${expense.category}</span>
            <span>${expense.date}</span>
            <button data-id="${expense.id}">Delete</button>
        `;
        expenseList.appendChild(row);
    });
}

renderExpenses();