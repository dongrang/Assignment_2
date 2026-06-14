// expense form 
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date').value = new Date().toISOString.split('T')[0];
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

let list = [];
let activeFilter = 'All';
let activeSort = 'date-newest';

// testing set
let expenses = [
  { id: 1, description: "Coffee", amount: 3.50, category: "Food", date: "2026-06-14" }
];

function renderExpenses() 
{
    expenseList.innerHTML = '';

    if(expenses.length == 0)
    {
        list.innerHTML = '<p id="empty-message">No expense added yet.</p>';
        return;
    }

    displayed.forEach(expense => {
        
    })
}