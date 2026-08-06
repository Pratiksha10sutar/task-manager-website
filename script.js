let tasks = [];
let currentFilter = "all";
let taskIdCounter = 1;

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const categorySelect = document.querySelector("#categorySelect");
const clearAllBtn = document.querySelector("#clearAllBtn");
const taskContainer = document.querySelector("#taskContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const totalCount = document.getElementById("totalCount");
const taskCount = document.getElementById("taskCount");
const themeToggle = document.getElementById("themeToggle");
const attributeInput = document.querySelector("#attributeInput");
const checkAttributeBtn = document.querySelector("#checkAttributeBtn");
const attributeResult = document.querySelector("#attributeResult");
const grandparent = document.querySelector("#grandparent");
const parent = document.querySelector("#parent");
const childBtn = document.querySelector("#childBtn");
const captureToggle = document.querySelector("#captureToggle");
const clearLogBtn = document.querySelector("#clearLogBtn");
const propLog = document.querySelector("#propLog");

// 2. LOCAL STORAGE
function loadFromStorage() {
    const saved = localStorage.getItem("taskflow_tasks");
    if (saved) {
        tasks = JSON.parse(saved);
        if (tasks.length > 0) {
            taskIdCounter = Math.max(...tasks.map(t => t.id)) + 1;
        }
    }
}

function saveToStorage() {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}

function loadTheme() {
    const saved = localStorage.getItem("taskflow_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    document.body.setAttribute("data-theme", saved);
    themeToggle.textContent = saved === "dark" ? "🌙" : "☀️";
}

function saveTheme(theme) {
    localStorage.setItem("taskflow_theme", theme);
}

// 3. CREATE TASK CARD — Using createElement() + createTextNode()
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";

    // Set data-* attributes
    card.setAttribute("data-id", task.id);
    card.setAttribute("data-status", task.status);
    card.setAttribute("data-category", task.category);

    // ---- HEADER ----
    const header = document.createElement("div");
    header.className = "task-header";

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.appendChild(document.createTextNode(task.title));

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "task-title-input";
    titleInput.value = task.title;
    titleInput.setAttribute("aria-label", "Edit task title");

    // ---- ACTIONS ----
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "task-btn edit";
    editBtn.setAttribute("data-action", "edit");
    editBtn.appendChild(document.createTextNode("✏️ Edit"));

    const completeBtn = document.createElement("button");
    completeBtn.className = "task-btn complete";
    completeBtn.setAttribute("data-action", "complete");
    completeBtn.appendChild(
        document.createTextNode(task.status === "completed" ? "↩ Undo" : "✅ Done")
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "task-btn delete";
    deleteBtn.setAttribute("data-action", "delete");
    deleteBtn.appendChild(document.createTextNode("🗑 Del"));

    actions.append(editBtn, completeBtn, deleteBtn);
    header.append(titleSpan, titleInput, actions);

    // ---- FOOTER ----
    const footer = document.createElement("div");
    footer.className = "task-footer";

    const tag = document.createElement("span");
    tag.className = "task-tag";
    tag.setAttribute("data-cat", task.category);
    const labels = { work: "💼 Work", personal: "🏠 Personal", study: "📚 Study" };
    tag.appendChild(document.createTextNode(labels[task.category] || task.category));

    const idBadge = document.createElement("span");
    idBadge.className = "task-id";
    idBadge.appendChild(document.createTextNode(`#${task.id}`));

    footer.append(tag, idBadge);
    card.append(header, footer);

    // Apply completed style
    if (task.status === "completed") {
        titleSpan.style.textDecoration = "line-through";
        card.style.opacity = "0.6";
    }

    return card;
}

//    4. RENDER TASKS — Using DocumentFragment
function renderTasks(data = tasks) {
    // Remove existing task cards
    const existingCards = taskContainer.querySelectorAll(".task-card");
    existingCards.forEach(card => card.remove());

    // Filter logic
    const query = searchInput.value.toLowerCase().trim();
    const filtered = data.filter(task => {
        const matchesFilter = currentFilter === "all" || task.category === currentFilter;
        const matchesSearch = task.title.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    // Toggle empty state
    emptyState.style.display = filtered.length === 0 ? "flex" : "none";

    // Update task count
    taskCount.textContent = `${filtered.length} task${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) return;

    // Use DocumentFragment for batch insertion
    const fragment = document.createDocumentFragment();
    filtered.forEach(task => {
        fragment.appendChild(createTaskCard(task));
    });
    taskContainer.append(fragment);

    updateCounters();
}

//    5. COUNTERS
function updateCounters() {
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = tasks.filter(t => t.status === "pending").length;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
    totalCount.textContent = tasks.length;
}

// 6. ADD TASK
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = taskInput.value.trim();
    if (!title) {
        taskInput.focus();
        taskInput.style.borderColor = "var(--accent-red)";
        setTimeout(() => { taskInput.style.borderColor = ""; }, 800);
        return;
    }

    const newTask = {
        id: taskIdCounter++,
        title: title,
        category: categorySelect.value,
        status: "pending"
    };

    tasks.unshift(newTask);
    saveToStorage();
    taskInput.value = "";
    taskInput.focus();
    renderTasks();
});

// 7. EVENT DELEGATION — One listener on taskContainer
taskContainer.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    if (!action) return;

    const card = e.target.closest(".task-card");
    if (!card) return;

    const taskId = parseInt(card.getAttribute("data-id"));
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    if (action === "delete") {
        deleteTask(card, taskIndex);
    } else if (action === "complete") {
        completeTask(card, taskIndex);
    } else if (action === "edit") {
        editTask(card, taskIndex);
    }
});

// 8. TASK OPERATIONS
function deleteTask(card, taskIndex) {
    card.style.transition = "opacity 0.2s, transform 0.2s";
    card.style.opacity = "0";
    card.style.transform = "scale(0.9)";

    setTimeout(() => {
        card.remove();
        tasks.splice(taskIndex, 1);
        saveToStorage();
        updateCounters();
        if (tasks.length === 0) emptyState.style.display = "flex";
        taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    }, 200);
}

function completeTask(card, taskIndex) {
    const task = tasks[taskIndex];
    const titleSpan = card.querySelector(".task-title");
    const btn = card.querySelector('[data-action="complete"]');

    if (task.status === "pending") {
        task.status = "completed";
        card.setAttribute("data-status", "completed");
        titleSpan.style.textDecoration = "line-through";
        btn.textContent = "↩ Undo";
        card.style.opacity = "0.6";
    } else {
        task.status = "pending";
        card.setAttribute("data-status", "pending");
        titleSpan.style.textDecoration = "";
        btn.textContent = "✅ Done";
        card.style.opacity = "1";
    }

    tasks[taskIndex] = task;
    saveToStorage();
    updateCounters();
}

function editTask(card, taskIndex) {
    const titleSpan = card.querySelector(".task-title");
    const titleInput = card.querySelector(".task-title-input");
    const editBtn = card.querySelector('[data-action="edit"]');

    const isEditing = card.hasAttribute("data-editing");

    if (!isEditing) {
        card.setAttribute("data-editing", "true");
        titleSpan.style.display = "none";
        titleInput.style.display = "block";
        titleInput.value = tasks[taskIndex].title;
        titleInput.focus();
        titleInput.select();
        editBtn.textContent = "💾 Save";

        const saveHandler = (e) => {
            if (e.key === "Enter") {
                saveEdit(card, taskIndex, titleSpan, titleInput, editBtn);
                titleInput.removeEventListener("keydown", saveHandler);
            }
        };
        titleInput.addEventListener("keydown", saveHandler);
    } else {
        saveEdit(card, taskIndex, titleSpan, titleInput, editBtn);
    }
}

function saveEdit(card, taskIndex, titleSpan, titleInput, editBtn) {
    const newTitle = titleInput.value.trim();
    if (!newTitle) return;

    tasks[taskIndex].title = newTitle;
    saveToStorage();

    titleSpan.textContent = newTitle;
    titleSpan.style.display = "";
    titleInput.style.display = "none";
    editBtn.textContent = "✏️ Edit";
    card.removeAttribute("data-editing");
}

// 9. SEARCH & FILTER
searchInput.addEventListener("input", renderTasks);

document.querySelector(".filter-tabs").addEventListener("click", (e) => {
    if (!e.target.classList.contains("filter-btn")) return;

    filterBtns.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentFilter = e.target.getAttribute("data-filter");
    renderTasks();
});

// 10. CLEAR ALL
clearAllBtn.addEventListener("click", () => {
    if (tasks.length === 0) return;
    if (!confirm("Delete all tasks? ⚠️")) return;

    tasks = [];
    saveToStorage();
    renderTasks();
});

// 11. THEME TOGGLE
themeToggle.addEventListener("click", () => {
    const body = document.body;
    const isDark = body.dataset.theme === "dark";

    if (isDark) {
        body.dataset.theme = "light";
        document.documentElement.setAttribute("data-theme", "light");
        themeToggle.textContent = "☀️";
        saveTheme("light");
    } else {
        body.dataset.theme = "dark";
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "🌙";
        saveTheme("dark");
    }
});

// 12. ATTRIBUTE vs PROPERTY DEMO
checkAttributeBtn.addEventListener("click", () => {
    const propertyValue = attributeInput.value;
    const attributeValue = attributeInput.getAttribute("value");

    const propBadge = attributeResult.querySelector(".prop em");
    const attrBadge = attributeResult.querySelector(".attr em");

    propBadge.textContent = propertyValue || "(empty)";
    attrBadge.textContent = attributeValue || "(empty)";

    // Also update initial demo display
    const propSpan = document.querySelector('.result-badge.prop');
    const attrSpan = document.querySelector('.result-badge.attr');

    // Update the display with styling
    const results = document.querySelectorAll('.result-badge em');
    results[0].textContent = propertyValue || "(empty)";
    results[1].textContent = attributeValue || "(empty)";
});

// 13. EVENT PROPAGATION DEMO
let propagationListeners = [];

function setupPropagationDemo() {
    cleanupPropagationListeners();

    const isCapturing = captureToggle.checked;

    function makeLogger(label, cssClass) {
        return function (e) {
            if (e.target === clearLogBtn) return;

            const entry = document.createElement("div");
            entry.className = `log-entry ${cssClass}`;

            const mode = isCapturing ? "[CAPTURE]" : "[BUBBLE]";
            const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
            entry.textContent = `${time} ${mode} → ${label} fired`;

            const hint = propLog.querySelector(".log-hint");
            if (hint) hint.remove();

            // prepend() — adds at the top
            propLog.prepend(entry);
        };
    }

    const gpHandler = makeLogger("Grandparent 🔵", "grandparent-log");
    const pHandler = makeLogger("Parent 🟢", "parent-log");
    const cHandler = makeLogger("Child 🟣", "child-log");

    grandparent.addEventListener("click", gpHandler, isCapturing);
    parent.addEventListener("click", pHandler, isCapturing);
    childBtn.addEventListener("click", cHandler, isCapturing);

    propagationListeners = [
        { el: grandparent, fn: gpHandler, capture: isCapturing },
        { el: parent, fn: pHandler, capture: isCapturing },
        { el: childBtn, fn: cHandler, capture: isCapturing },
    ];
}

function cleanupPropagationListeners() {
    propagationListeners.forEach(({ el, fn, capture }) => {
        el.removeEventListener("click", fn, capture);
    });
    propagationListeners = [];
}

captureToggle.addEventListener("change", () => {
    setupPropagationDemo();
    propLog.innerHTML =
        `<p class="log-hint">Mode: ${captureToggle.checked ? "CAPTURING ▼▼▼" : "BUBBLING ▲▲▲"} — Click the button!</p>`;
});

clearLogBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    propLog.innerHTML = `<p class="log-hint">Log cleared. Click the button!</p>`;
});

// 14. INIT

function init() {
    loadTheme();
    loadFromStorage();

    // Seed sample tasks if empty
    if (tasks.length === 0) {
        saveToStorage();
    }

    renderTasks();
    setupPropagationDemo();

    // Update attribute demo initial display
    const propBadge = attributeResult.querySelector(".prop em");
    const attrBadge = attributeResult.querySelector(".attr em");
    propBadge.textContent = attributeInput.value;
    attrBadge.textContent = attributeInput.getAttribute("value");
}

init();