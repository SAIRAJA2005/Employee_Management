// API URL
const apiUrl = "http://localhost:8080/api/employees";

// DOM elements
const tableBody = document.getElementById("employeeTableBody");
const modal = document.getElementById("employeeModal");
const form = document.getElementById("employeeForm");
const modalTitle = document.getElementById("modalTitle");
const searchInput = document.getElementById("searchInput");
const totalEmployeesSpan = document.getElementById("totalEmployees");
const recentlyAddedSpan = document.getElementById("recentlyAdded");
const toastContainer = document.getElementById("toastContainer");
const welcomePage = document.getElementById("welcomePage");
const employeeListPage = document.getElementById("employeeListPage");
const emptyState = document.getElementById("emptyState");

// State
let editMode = false;
let employees = [];
let filteredEmployees = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadEmployees();
    setupEventListeners();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Event listeners
function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Page navigation
function showWelcome() {
    welcomePage.style.display = 'block';
    employeeListPage.style.display = 'none';
    updateNavLinks('home');
}

function showEmployeeList() {
    welcomePage.style.display = 'none';
    employeeListPage.style.display = 'block';
    updateNavLinks('employees');
    renderEmployees();
}

function updateNavLinks(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (activePage === 'home') {
        navLinks[0].classList.add('active');
    } else if (activePage === 'employees') {
        navLinks[1].classList.add('active');
    }
}

// Toast notifications
function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconSvg = {
        success: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        error: '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    };
    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${iconSvg[type]}
        </svg>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.id.toString().includes(searchTerm)
    );
    renderEmployees();
}

// Fetch employees from backend
async function loadEmployees() {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch employees');
        employees = await res.json();
        filteredEmployees = [...employees];
        updateStats();
        renderEmployees();
    } catch (error) {
        console.error('Error loading employees:', error);
        showToast('error', 'Error', 'Failed to load employees. Please try again.');
        employees = [];
        filteredEmployees = [];
        renderEmployees();
    }
}

// Render employees table
function renderEmployees() {
    if (filteredEmployees.length === 0) {
        tableBody.innerHTML = "";
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";
    tableBody.innerHTML = "";
    filteredEmployees.forEach((emp, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.firstName}</td>
            <td>${emp.lastName}</td>
            <td>${emp.email}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editEmployee(${emp.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteEmployee(${emp.id})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    totalEmployeesSpan.textContent = employees.length;
    recentlyAddedSpan.textContent = Math.min(employees.length, 3);
}

// Modal functions
function openAddEmployeeModal() {
    modal.classList.add('show');
    form.reset();
    editMode = false;
    modalTitle.textContent = "Add Employee";
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('firstName').focus(), 100);
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Edit employee
async function editEmployee(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch employee');
        const emp = await res.json();
        document.getElementById("employeeId").value = emp.id;
        document.getElementById("firstName").value = emp.firstName;
        document.getElementById("lastName").value = emp.lastName;
        document.getElementById("email").value = emp.email;
        modalTitle.textContent = "Edit Employee";
        editMode = true;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('firstName').focus(), 100);
    } catch (error) {
        console.error('Error fetching employee:', error);
        showToast('error', 'Error', 'Failed to load employee data');
    }
}

// Delete employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error('Failed to delete employee');
        await loadEmployees();
        showToast('success', 'Success', 'Employee deleted successfully');
    } catch (error) {
        console.error('Error deleting employee:', error);
        showToast('error', 'Error', 'Failed to delete employee');
    }
}

// Form submit handler
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const employee = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim()
        };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employee.email)) {
            throw new Error('Please enter a valid email address');
        }
        if (editMode) {
            const id = parseInt(document.getElementById("employeeId").value);
            const res = await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
            if (!res.ok) throw new Error('Failed to update employee');
            showToast('success', 'Success', 'Employee updated successfully');
        } else {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
            if (!res.ok) throw new Error('Failed to create employee');
            showToast('success', 'Success', 'Employee added successfully');
        }
        closeModal();
        await loadEmployees();
    } catch (error) {
        console.error('Error saving employee:', error);
        showToast('error', 'Error', error.message || 'Failed to save employee');
    }
});
