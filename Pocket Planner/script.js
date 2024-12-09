let budgetData = JSON.parse(localStorage.getItem('budgetData')) || [];
const budgetTable = document.getElementById('tableBody');
const totalAmountElement = document.getElementById('totalAmount');
const resetBtn = document.getElementById('resetBtn');
const newEntryBtn = document.getElementById('newEntryBtn');
const budgetPieChart = document.getElementById('budgetPieChart');

// Function to update the table with current data
function updateTable() {
    budgetTable.innerHTML = '';
    let total = 0;

    budgetData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="align:center">${entry.date}</td>
            <td>${entry.description}</td>
            <td>${entry.type}</td>
            <td>${entry.category}</td>
            <td>₹${parseFloat(entry.amount).toFixed(2)}</td>
            <td>
                <button class="btn btn-primary btn-sm my-2 me-2" onclick="editEntry(${index})">&#128393;</button>
                <button class="btn btn-danger btn-sm my-2" onclick="removeEntry(${index})">&#x2715;</button>
            </td>
        `;
        budgetTable.appendChild(row);

        total += (entry.type === 'Income' ? 1 : -1) * parseFloat(entry.amount);
    });

    totalAmountElement.textContent = total.toFixed(2);  // Showing INR total
    updatePieChart();
    updateCategoryPieChart();
}

// Function to update the pie chart with Income and Expense data
function updatePieChart() {
    const incomeData = budgetData.filter(entry => entry.type === 'Income');
    const expenseData = budgetData.filter(entry => entry.type === 'Expense');

    // Sum the amounts for Income and Expense
    const totalIncome = incomeData.reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
    const totalExpense = expenseData.reduce((acc, entry) => acc + parseFloat(entry.amount), 0);

    // Data for the Pie Chart
    const data = {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [totalIncome, totalExpense], // Total Income and Expense
            backgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(220, 53, 69, 0.7)'], // Blue for Income, Red for Expense
            borderColor: ['rgba(0, 123, 255, 1)', 'rgba(220, 53, 69, 1)'], // Border color for segments
            borderWidth: 1
        }]
    };

    // If an existing pie chart instance exists, destroy it before creating a new one
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    // Create a new Pie Chart
    window.pieChartInstance = new Chart(budgetPieChart, {
        type: 'pie',  // Regular Pie Chart
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',  // Position the legend at the top
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            // Format the label to show the amount with INR currency
                            const value = tooltipItem.raw.toFixed(2);
                            return `${tooltipItem.label}: ₹${value}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to add a new entry
function newEntryForm() {
    Swal.fire({
        title: 'New Entry',
        html: `
            <input type="date" id="date" class="swal2-input" required />
            <input type="text" id="description" class="swal2-input" placeholder="Description" required />
            <select id="type" class="swal2-input" onchange="toggleCategoryOptions()">
                <option value="select">Select Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
            </select>
            <select id="category" class="swal2-input">
                <option value="select">Select Category</option>
                <option value="salary">Salary</option>
                <option value="business">Business and Self-Employment Income</option>
                <option value="investent">Investment Income</option>
                <option value="benefits">Government and Social Benefits</option>
                <option value="retirement">Retirement Income</option>
                <option value="miscellaneousIncome">Miscellaneous Income</option>
                <option value="taxRefunds">Tax Refunds</option>
                <option value="scholarships">Education-Related Income</option>
                
                <option value="housing">Housing</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="health">Health and Medical</option>
                <option value="childrenEducation">Childcare and Education</option>
                <option value="clothing">Clothing</option>
                <option value="personalCare">Personal Care</option>
                <option value="entertainment">Entertainment and Recreation</option>
                <option value="saving">Savings and Investments</option>
                <option value="miscellaneousExpense">Miscellaneous Expense</option>
            </select>
            <input type="number" id="amount" class="swal2-input" placeholder="Amount" required />
        `,
        preConfirm: () => {
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value;
            const type = document.getElementById('type').value;
            const category = document.getElementById('category').value;
            const amount = document.getElementById('amount').value;

            if (!date || !description || !amount) {
                Swal.showValidationMessage('Please fill all fields');
            }

            return { date, description, type, category, amount };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { date, description, type, category, amount } = result.value;
            budgetData.push({ date, description, type, category, amount });
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            updateTable();
        }
    });
}

// Function to remove entry
function removeEntry(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
    }).then((result) => {
        if (result.isConfirmed) {
            budgetData.splice(index, 1);
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            updateTable();
        }
    });
}

// Function to edit entry
function editEntry(index) {
    const entry = budgetData[index];
    Swal.fire({
        title: 'Edit Entry',
        html: `
            <input type="date" id="date" class="swal2-input" value="${entry.date}" required />
            <input type="text" id="description" class="swal2-input" value="${entry.description}" placeholder="Description" required />
            <select id="type" class="swal2-input" onchange="toggleCategoryOptions()">
                <option value="Income" ${entry.type === 'Income' ? 'selected' : ''}>Income</option>
                <option value="Expense" ${entry.type === 'Expense' ? 'selected' : ''}>Expense</option>
            </select>
            <select id="category" class="swal2-input">
                <option value="salary" ${entry.category === 'Salary' ? 'selected' : ''}>Salary</option>
                <option value="business" ${entry.category === 'Business and Self-Employment Income' ? 'selected' : ''}>Business and Self-Employment Income</option>
                <option value="investment" ${entry.category === 'Investment Income' ? 'selected' : ''}>Investment Income</option>
                <option value="benefits" ${entry.category === 'Government and Social Benefits' ? 'selected' : ''}>Government and Social Benefits</option>
                <option value="retirement" ${entry.category === 'Retirement Income' ? 'selected' : ''}>Retirement Income</option>
                <option value="miscellaneous" ${entry.category === 'Miscellaneous Income' ? 'selected' : ''}>Miscellaneous Income</option>
                <option value="taxRefunds" ${entry.category === 'Tax Refunds' ? 'selected' : ''}>Tax Refunds</option>
                <option value="scholarships" ${entry.category === 'Education-Related Income' ? 'selected' : ''}>Education-Related Income</option>

                <option value="housing" ${entry.category === 'Housing' ? 'selected' : ''}>Housing</option>
                <option value="food" ${entry.category === 'Food' ? 'selected' : ''}>Food</option>
                <option value="transportation" ${entry.category === 'Transportation' ? 'selected' : ''}>Transportation</option>
                <option value="health" ${entry.category === 'Health and Medical' ? 'selected' : ''}>Health and Medical</option>
                <option value="childrenEducation" ${entry.category === 'Childcare and Education' ? 'selected' : ''}>Childcare and Education</option>
                <option value="clothing" ${entry.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
                <option value="personalCare" ${entry.category === 'Personal Care' ? 'selected' : ''}>Personal Care</option>
                <option value="entertainment" ${entry.category === 'Entertainment and Recreation' ? 'selected' : ''}>Entertainment and Recreation</option>
                <option value="saving" ${entry.category === 'Savings and Investments' ? 'selected' : ''}>Savings and Investments</option>
                <option value="miscellaneous" ${entry.category === 'Miscellaneous Expense' ? 'selected' : ''}>Miscellaneous Expense</option>
            </select>
            <input type="number" id="amount" class="swal2-input" value="${entry.amount}" required />
        `,
        preConfirm: () => {
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value;
            const type = document.getElementById('type').value;
            const category = document.getElementById('category').value;
            const amount = document.getElementById('amount').value;

            if (!date || !description || !amount) {
                Swal.showValidationMessage('Please fill all fields');
            }

            return { date, description, type, category, amount };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { date, description, type, category, amount } = result.value;
            budgetData[index] = { date, description, type, category, amount };
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            updateTable();
        }
    });
}

// Function to reset all data (clear localStorage)
resetBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "This will remove all data!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reset!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('budgetData');
            budgetData = [];
            updateTable();
        }
    });
});

// Function to handle category options based on the selected type
function toggleCategoryOptions() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';

    if (type === 'Income') {
        const incomeCategories = ['Salaries and Wages', 'Business and Self-Employment Income', 'Investment Income', 'Government and Social Benefits', 'Retirement Income', 'Miscellaneous Income', 'Tax Refunds', 'Education-Related Income'];
        incomeCategories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } else if (type === 'Expense') {
        const expenseCategories = ['Housing', 'Food', 'Transportation', 'Health and Medical', 'Childcare and Education', 'Clothing', 'Personal Care', 'Entertainment and Recreation', 'Savings and Investments', 'Miscellaneous Expense'];
        expenseCategories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Initialize the page and render the data
document.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

// Trigger new entry form when button is clicked
newEntryBtn.addEventListener('click', newEntryForm);


// export as pdf
document.getElementById('exportBtn').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;

    // Get the content element
    const content = document.getElementById('content');
    const buttonsToRemove = document.querySelectorAll('.remove-on-export');

    // Hide buttons
    buttonsToRemove.forEach(button => button.style.display = 'none');

    // Use html2canvas to convert the content into a canvas
    html2canvas(content, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Create a new jsPDF instance
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Calculate dimensions
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add the canvas image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save the PDF
        pdf.save('page.pdf');
    }).catch(err => console.error('Error generating PDF:', err));
});

