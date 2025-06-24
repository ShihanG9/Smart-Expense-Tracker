// Expense Tracker Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initApp();
});

// Global variables
let currentProfile = null;
let expenses = [];
let goals = [];
let achievements = [];
let categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Rent', 'Other'];
let currencySymbol = '₹';
let theme = 'dark';
let pinEnabled = false;
let pinCode = '';

// Initialize the application
function initApp() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('expenseTrackerTheme');
    if (savedTheme) {
        theme = savedTheme;
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-select').value = theme;
    }
    
    // Check for PIN lock
    const savedPin = localStorage.getItem('expenseTrackerPin');
    if (savedPin) {
        pinEnabled = true;
        pinCode = savedPin;
        document.getElementById('pin-toggle').checked = true;
        document.getElementById('pin-settings').style.display = 'block';
    }
    
    // Check for saved currency
    const savedCurrency = localStorage.getItem('expenseTrackerCurrency');
    if (savedCurrency) {
        currencySymbol = savedCurrency;
        document.getElementById('currency-select').value = currencySymbol;
    }
    
    // Load profiles
    loadProfiles();
    
    // Set today's date as default in date fields
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
    
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome screen
    showScreen('welcome');
}

// Set up event listeners
function setupEventListeners() {
    // Expense form submission
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addExpense();
    });
    
    // Date filter change
    document.getElementById('filter-date').addEventListener('change', function() {
        if (this.value === 'custom') {
            document.getElementById('custom-date-range').style.display = 'flex';
        } else {
            document.getElementById('custom-date-range').style.display = 'none';
        }
    });
    
    // Import file change
    document.getElementById('import-file').addEventListener('change', function() {
        if (this.files.length > 0) {
            // File selected, ready for import
        }
    });
    
    // Auto theme by time
    if (theme === 'auto') {
        setAutoTheme();
        // Update every minute
        setInterval(setAutoTheme, 60000);
    }
}

// Navigation between screens
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Show the selected screen
    document.getElementById(screenId).style.display = 'block';
    
    // Update UI based on screen
    switch(screenId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'view-expenses':
            loadExpenses();
            break;
        case 'charts':
            updateCharts();
            break;
        case 'goals':
            loadGoals();
            loadAchievements();
            break;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Profile management
function loadProfiles() {
    const profiles = JSON.parse(localStorage.getItem('expenseTrackerProfiles')) || [];
    const profileList = document.getElementById('profile-list');
    profileList.innerHTML = '';
    
    if (profiles.length === 0) {
        // No profiles exist, create default
        const defaultProfile = {
            id: 'default',
            name: 'Default Profile',
            avatar: 'user',
            createdAt: new Date().toISOString()
        };
        profiles.push(defaultProfile);
        localStorage.setItem('expenseTrackerProfiles', JSON.stringify(profiles));
    }
    
    profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';
        profileCard.innerHTML = `
            <i class="fas fa-${profile.avatar}"></i>
            <h3>${profile.name}</h3>
            <p>Created ${new Date(profile.createdAt).toLocaleDateString()}</p>
        `;
        profileCard.addEventListener('click', () => selectProfile(profile.id));
        profileList.appendChild(profileCard);
    });
}

function addNewProfile() {
    const profileName = prompt('Enter profile name:');
    if (profileName) {
        const profiles = JSON.parse(localStorage.getItem('expenseTrackerProfiles')) || [];
        const newProfile = {
            id: 'profile-' + Date.now(),
            name: profileName,
            avatar: 'user-circle',
            createdAt: new Date().toISOString()
        };
        profiles.push(newProfile);
        localStorage.setItem('expenseTrackerProfiles', JSON.stringify(profiles));
        loadProfiles();
    }
}

function selectProfile(profileId) {
    const profiles = JSON.parse(localStorage.getItem('expenseTrackerProfiles')) || [];
    currentProfile = profiles.find(p => p.id === profileId);
    
    if (currentProfile) {
        // Load profile data
        loadProfileData(profileId);
        showScreen('dashboard');
    }
}

function loadProfileData(profileId) {
    // Load expenses
    const profileExpenses = JSON.parse(localStorage.getItem(`expenseTrackerExpenses_${profileId}`)) || [];
    expenses = profileExpenses;
    
    // Load goals
    const profileGoals = JSON.parse(localStorage.getItem(`expenseTrackerGoals_${profileId}`)) || [];
    goals = profileGoals;
    
    // Load achievements
    const profileAchievements = JSON.parse(localStorage.getItem(`expenseTrackerAchievements_${profileId}`)) || [];
    achievements = profileAchievements;
    
    // Update UI
    updateDashboard();
}

// Expense management
function addExpense() {
    const title = document.getElementById('expense-title').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;
    const category = document.getElementById('expense-category').value;
    const notes = document.getElementById('expense-notes').value;
    
    if (!title || isNaN(amount) || !date || !category) {
        showToast('Please fill all required fields');
        return;
    }
    
    const newExpense = {
        id: 'exp-' + Date.now(),
        title,
        amount,
        date,
        category,
        notes,
        createdAt: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    saveExpenses();
    
    // Reset form
    document.getElementById('expense-form').reset();
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    
    // Show success message
    showToast('Expense added successfully!');
    
    // Update dashboard
    updateDashboard();
    
    // Check for achievements
    checkForAchievements();
    
    // Show dashboard
    showScreen('dashboard');
}

function loadExpenses() {
    const expenseList = document.getElementById('expense-list');
    const expenseTimeline = document.getElementById('expense-timeline');
    const filteredExpenses = filterExpenses();
    
    // Clear existing
    expenseList.innerHTML = '';
    expenseTimeline.innerHTML = '';
    
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = '<p class="no-expenses">No expenses found</p>';
        return;
    }
    
    // Calculate total
    let total = 0;
    
    // List view
    filteredExpenses.forEach(expense => {
        total += expense.amount;
        
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <div class="expense-info">
                <div class="expense-title">${expense.title}</div>
                <div class="expense-category">${expense.category}</div>
            </div>
            <div class="expense-amount">${currencySymbol}${expense.amount.toFixed(2)}</div>
            <button class="expense-delete" onclick="deleteExpense('${expense.id}')"><i class="fas fa-trash"></i></button>
        `;
        expenseList.appendChild(expenseItem);
    });
    
    // Timeline view
    // Group by date
    const expensesByDate = {};
    filteredExpenses.forEach(expense => {
        if (!expensesByDate[expense.date]) {
            expensesByDate[expense.date] = [];
        }
        expensesByDate[expense.date].push(expense);
    });
    
    // Create timeline items
    for (const date in expensesByDate) {
        const dateExpenses = expensesByDate[date];
        let dateTotal = 0;
        
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const dateHeader = document.createElement('div');
        dateHeader.className = 'timeline-date';
        dateHeader.textContent = new Date(date).toLocaleDateString();
        
        timelineItem.appendChild(dateHeader);
        
        dateExpenses.forEach(expense => {
            dateTotal += expense.amount;
            
            const expenseCard = document.createElement('div');
            expenseCard.className = 'timeline-expense';
            expenseCard.innerHTML = `
                <div class="timeline-expense-info">
                    <span class="timeline-expense-title">${expense.title}</span>
                    <span class="timeline-expense-category">${expense.category}</span>
                </div>
                <span class="timeline-expense-amount">${currencySymbol}${expense.amount.toFixed(2)}</span>
            `;
            timelineItem.appendChild(expenseCard);
        });
        
        const dateFooter = document.createElement('div');
        dateFooter.className = 'timeline-total';
        dateFooter.textContent = `Total: ${currencySymbol}${dateTotal.toFixed(2)}`;
        
        timelineItem.appendChild(dateFooter);
        expenseTimeline.appendChild(timelineItem);
    }
    
    // Update total
    document.getElementById('filtered-total').textContent = `${currencySymbol}${total.toFixed(2)}`;
    
    // Update category filter options
    updateCategoryFilter();
}

function filterExpenses() {
    const categoryFilter = document.getElementById('filter-category').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    let filtered = [...expenses];
    
    // Apply category filter
    if (categoryFilter) {
        filtered = filtered.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    if (dateFilter === 'today') {
        filtered = filtered.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= today;
        });
    } else if (dateFilter === 'week') {
        filtered = filtered.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfWeek;
        });
    } else if (dateFilter === 'month') {
        filtered = filtered.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfMonth;
        });
    } else if (dateFilter === 'year') {
        filtered = filtered.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfYear;
        });
    } else if (dateFilter === 'custom') {
        const startDate = document.getElementById('filter-start').value;
        const endDate = document.getElementById('filter-end').value;
        
        if (startDate && endDate) {
            filtered = filtered.filter(expense => {
                return expense.date >= startDate && expense.date <= endDate;
            });
        }
    }
    
    return filtered;
}

function applyFilters() {
    loadExpenses();
}

function resetFilters() {
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-date').value = 'month';
    document.getElementById('custom-date-range').style.display = 'none';
    loadExpenses();
}

function updateCategoryFilter() {
    const categorySelect = document.getElementById('filter-category');
    const currentValue = categorySelect.value;
    
    // Clear existing options except "All Categories"
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    
    // Get unique categories from expenses
    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];
    
    // Add options
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Restore selected value
    if (currentValue && uniqueCategories.includes(currentValue)) {
        categorySelect.value = currentValue;
    }
}

function deleteExpense(expenseId) {
    showModal(
        'Delete Expense',
        'Are you sure you want to delete this expense?',
        'Delete',
        () => {
            expenses = expenses.filter(expense => expense.id !== expenseId);
            saveExpenses();
            loadExpenses();
            updateDashboard();
            showToast('Expense deleted');
        }
    );
}

function saveExpenses() {
    if (currentProfile) {
        localStorage.setItem(`expenseTrackerExpenses_${currentProfile.id}`, JSON.stringify(expenses));
    }
}

// Dashboard functions
function updateDashboard() {
    if (!currentProfile) return;
    
    // Calculate monthly spending
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const thisMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth;
    });
    
    const lastMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfLastMonth && expenseDate <= endOfLastMonth;
    });
    
    const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyChange = lastMonthTotal > 0 ? 
        ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 
        'N/A';
    
    document.getElementById('monthly-spending').textContent = `${currencySymbol}${thisMonthTotal.toFixed(2)}`;
    document.getElementById('monthly-change').textContent = monthlyChange === 'N/A' ? 
        'No previous data' : 
        `${monthlyChange}% vs last month`;
    
    // Calculate daily spending
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const yesterdayEnd = new Date(todayStart);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    const todayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= todayStart;
    });
    
    const yesterdayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= yesterdayStart && expenseDate <= yesterdayEnd;
    });
    
    const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const yesterdayTotal = yesterdayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const dailyChange = yesterdayTotal > 0 ? 
        ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(1) : 
        'N/A';
    
    document.getElementById('daily-spending').textContent = `${currencySymbol}${todayTotal.toFixed(2)}`;
    document.getElementById('daily-change').textContent = dailyChange === 'N/A' ? 
        'No previous data' : 
        `${dailyChange}% vs yesterday`;
    
    // Calculate savings (simplified - would integrate with goals)
    const income = 0; // Would come from income tracking feature
    const savings = income - thisMonthTotal;
    document.getElementById('savings-amount').textContent = `${currencySymbol}${savings.toFixed(2)}`;
    document.getElementById('savings-goal').textContent = 'Set goals in Goals tab';
    
    // Find top category
    const categoryTotals = {};
    thisMonthExpenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    let topCategory = '-';
    let topCategoryAmount = 0;
    
    for (const category in categoryTotals) {
        if (categoryTotals[category] > topCategoryAmount) {
            topCategory = category;
            topCategoryAmount = categoryTotals[category];
        }
    }
    
    document.getElementById('top-category').textContent = topCategory;
    document.getElementById('top-category-amount').textContent = `${currencySymbol}${topCategoryAmount.toFixed(2)}`;
    
    // Show recent expenses (last 5)
    const recentExpenses = expenses.slice(-5).reverse();
    const recentExpensesContainer = document.getElementById('recent-expenses');
    recentExpensesContainer.innerHTML = '';
    
    if (recentExpenses.length === 0) {
        recentExpensesContainer.innerHTML = '<p class="no-expenses">No recent expenses</p>';
        return;
    }
    
    recentExpenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <div class="expense-info">
                <div class="expense-title">${expense.title}</div>
                <div class="expense-category">${expense.category}</div>
            </div>
            <div class="expense-amount">${currencySymbol}${expense.amount.toFixed(2)}</div>
        `;
        recentExpensesContainer.appendChild(expenseItem);
    });
}

// Chart functions
function initCharts() {
    // Initialize chart canvases
    // Actual chart creation happens in updateCharts()
}

function updateCharts() {
    // Update pie chart
    updatePieChart();
    
    // Update line chart
    updateLineChart();
    
    // Update prediction
    updatePrediction();
    
    // Update heatmap
    updateHeatmap();
    
    // Update insights
    updateInsights();
}

function updatePieChart() {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    
    // Generate colors
    const backgroundColors = categories.map((_, i) => {
        const hue = (i * 360 / categories.length) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    });
    
    // Destroy previous chart if exists
    if (window.pieChart) {
        window.pieChart.destroy();
    }
    
    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Update legend
    const legendContainer = document.getElementById('pie-legend');
    legendContainer.innerHTML = '';
    
    categories.forEach((category, i) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${backgroundColors[i]}"></div>
            <span>${category}: ${currencySymbol}${amounts[i].toFixed(2)}</span>
        `;
        legendContainer.appendChild(legendItem);
    });
}

function updateLineChart() {
    const ctx = document.getElementById('line-chart').getContext('2d');
    
    // Prepare data for the line chart
    const labels = expenses.map(expense => expense.date);
    const data = expenses.map(expense => expense.amount);
    
    // Destroy previous chart if exists
    if (window.lineChart) {
        window.lineChart.destroy();
    }
    
    window.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                borderColor: 'hsl(200, 70%, 50%)',
                backgroundColor: 'rgba(200, 70%, 50%, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}