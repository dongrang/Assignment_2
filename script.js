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

// conversion
const convertButton = document.getElementById('convert-btn');
const euroTotal = document.getElementById('eur-total');
const convertError = document.getElementById('convert-error');

// let expenses = [];
let activeFilter = 'All';
let activeSort = 'date-newest';

// testing set
let expenses = [
  { id: 1, description: "Groceries", amount: 45.20, category: "Food", date: "2026-06-01" },
  { id: 2, description: "Bus Pass", amount: 30.00, category: "Transport", date: "2026-06-03" },
  { id: 3, description: "Netflix", amount: 15.99, category: "Entertainment", date: "2026-06-05" },
  { id: 4, description: "New Jeans", amount: 59.99, category: "Clothing", date: "2026-06-07" },
  { id: 5, description: "Electricity Bill", amount: 120.00, category: "Housing/Utilities", date: "2026-06-08" },
  { id: 6, description: "Gym Membership", amount: 40.00, category: "Health/Wellness", date: "2026-06-09" },
  { id: 7, description: "Student Loan", amount: 200.00, category: "Loan Repayment", date: "2026-06-10" },
  { id: 8, description: "Coffee", amount: 3.50, category: "Food", date: "2026-06-11" },
  { id: 9, description: "Taxi", amount: 18.75, category: "Transport", date: "2026-06-12" },
  { id: 10, description: "Concert Ticket", amount: 85.00, category: "Entertainment", date: "2026-06-14" }
];


function renderExpenses() 
{
    expenseList.innerHTML = '';

    if(expenses.length === 0)
    {
        expenseList.innerHTML = '<p id="empty-message">No expense added yet.</p>';
        return;
    }

    getDisplayedExpenses().forEach(expense => {
        const row = document.createElement('div');
        row.innerHTML = `
            <span>${expense.description}</span>
            <span>${formatCurrency(expense.amount)}</span>
            <span>${expense.category}</span>
            <span>${expense.date}</span>
            <button data-id="${expense.id}">Delete</button>
        `;
        expenseList.appendChild(row);
    });
    updateTotals();
    saveToLocalStorage();
}

// adding a new expense to the list
form.addEventListener('submit',function(e){
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    // bad input handling
    if(!description){
        errorMessage.textContent = 'Enter a description.';
        return;
    }

    if(amount <= 0 ){
        errorMessage.textContent = 'Enter an amount greater than 0.';
        return;
    }

    if(!category){
        errorMessage.textContent = 'Enter a category.';
        return;
    }

    if(!date){
        errorMessage.textContent = 'Enter a valid date.';
        return;
    }

    errorMessage.textContent = '';

    // new expense object
    const newExpense = {
        id: Date.now(),
        description,
        amount,
        category,
        date
    }

    expenses.push(newExpense);
    renderExpenses();
    form.reset();

    // new Date() returns a date object, which must be converted to a string
    // the strings has a T in it which must be split, returning an array with date and time.
    // [0] returns just the date and NOT the time
    dateInput.value = new Date().toISOString().split('T')[0];
});

// deleting an expense from the list
expenseList.addEventListener('click',function(e){
    if(e.target.tagName === 'BUTTON'){
        const id = Number(e.target.dataset.id);

        // replace expenses with a new array without the expense that matches the id of the 
        // expense to delete
        expenses = expenses.filter(expense => expense.id !== id);
        renderExpenses();
    }
});

// totals
function updateTotals(){
    const displayed = getDisplayedExpenses();

    // overall total
    // reduce sums up everything in the expense array, starting at sum which is 0
    const total = displayed.reduce((sum,expense) => sum + expense.amount,0);
    overallTotal.textContent = formatCurrency(total);

    // count
    expenseCount.textContent = displayed.length;

    // category totals
    const categoryTotals = displayed.reduce((acc,expense) => {
        if(!acc[expense.category]) {    acc[expense.category] = 0;  }
        acc[expense.category] += expense.amount;
        return acc;
    }, {});

    categoryTotal.innerHTML = '';
    for (const[category,amount] of Object.entries(categoryTotals)) {
        categoryTotal.innerHTML += `<p>${category}: ${formatCurrency(amount)}</p>`;
    }
}

// currency formating
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// filter change listener
filterCategory.addEventListener('change',function(e){
    activeFilter = e.target.value;
    renderExpenses();
});

// sort change listener
sortBy.addEventListener('change',function(e){
    activeSort = e.target.value;
    renderExpenses();
});

// filter and sort
function getDisplayedExpenses(){
    let result = [...expenses];

    // filter by category
    if (activeFilter !== 'All'){
        result = result.filter((expense => expense.category === activeFilter));
    }

    // sort
    if (activeSort === 'date-newest'){
        result.sort((a,b) => new Date(b.date) - new Date(a.date));
    }   else if (activeSort === 'date-oldest') {
        result.sort((a,b) => new Date(a.date) - new Date(b.date));
    }   else if (activeSort === 'amount-lowest') {
        result.sort((a,b) => a.amount - b.amount);
    }   else if(activeSort === 'amount-highest'){
        result.sort((a,b) => b.amount - a.amount);
    }

    return result;
}

/**
 * PART 2: local storage
 */

function saveToLocalStorage() {
    localStorage.setItem('expenses',JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('expenses');
        if(stored){
            expenses = JSON.parse(stored);
        }
    }   
    catch {
        expenses = [];
    }
}

/**
 * PART 3: ASYNC
 */
convertButton.addEventListener('click',converttoEUR);

async function converttoEUR(){
    convertButton.disabled = true;
    convertButton.textContent = 'Converting...';
    convertError.textContent = '';
    euroTotal.textContent = '';

    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');

        if(!response.ok) {
            throw new Error('Bad server response.');
        }

        const data = await response.json();
        const rate = data.rates.EUR;
        const total = getDisplayedExpenses().reduce((sum,expense) => sum + expense.amount,0);
        const converted = total * rate;
        euroTotal.textContent = `(€${converted.toFixed(2)} EUR)`;
    } catch (error) {
        convertError.textContent = 'Error converting';
    }

    convertButton.disabled = false;
    convertButton.textContent = 'Convert to EUR';
}

/**
 * load and render
 */
loadFromLocalStorage();
renderExpenses();