const menuButtons = document.querySelectorAll(".menu-btn");
const pageTitle = document.getElementById("pageTitle");
const dashboardPage = document.getElementById("dashboardPage");
const dynamicPage = document.getElementById("dynamicPage");

const newTaskBtn = document.getElementById("newTaskBtn");
const createTaskBtn = document.getElementById("createTaskBtn");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("managerTasks")) || [];

function saveTasks() {
  localStorage.setItem("managerTasks", JSON.stringify(tasks));
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.filter(task => !task.completed).length;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("progressTasks").textContent = pending;
  document.getElementById("pendingTasks").textContent = pending;

  document.getElementById("overviewCompleted").textContent = completed;
  document.getElementById("overviewPending").textContent = pending;

  const percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  document.getElementById("progressPercent").textContent =
    `${percent}%`;
}

function renderRecentTasks() {
  const container = document.getElementById("recentTasks");

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✓</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started.</p>
        <button class="primary-btn" id="createTaskBtn">
          + Create task
        </button>
      </div>
    `;

    document
      .getElementById("createTaskBtn")
      .addEventListener("click", showAddTaskPage);

    return;
  }

  container.innerHTML = tasks
    .slice(-5)
    .reverse()
    .map(task => `
      <div class="task-item ${task.completed ? "completed" : ""}">
        <div class="task-info">
          <h4>${escapeHTML(task.title)}</h4>
          <p>${escapeHTML(task.description || "No description")}</p>
        </div>

        <div class="task-actions">
          <button
            class="small-btn complete-btn"
            data-id="${task.id}"
          >
            ${task.completed ? "Undo" : "Complete"}
          </button>

          <button
            class="small-btn delete-btn"
            data-id="${task.id}"
          >
            Delete
          </button>
        </div>
      </div>
    `)
    .join("");

  addTaskActionEvents();
}

function addTaskActionEvents() {
  document.querySelectorAll(".complete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      tasks = tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed
          };
        }

        return task;
      });

      saveTasks();
      updateStats();
      renderRecentTasks();

      if (!dynamicPage.classList.contains("hidden")) {
        renderTasksPage();
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      tasks = tasks.filter(task => task.id !== id);

      saveTasks();
      updateStats();
      renderRecentTasks();

      if (!dynamicPage.classList.contains("hidden")) {
        renderTasksPage();
      }
    });
  });
}

function showDashboard() {
  dashboardPage.classList.remove("hidden");
  dynamicPage.classList.add("hidden");

  pageTitle.textContent = "Good morning, Xumoyun.";

  updateStats();
  renderRecentTasks();
}

function showAddTaskPage() {
  dashboardPage.classList.add("hidden");
  dynamicPage.classList.remove("hidden");

  pageTitle.textContent = "Create a new task";

  dynamicPage.innerHTML = `
    <div class="page-title">
      <h2>Create a new task</h2>
      <p>Add a new task to your workspace.</p>
    </div>

    <div class="content-card form-card">

      <div class="form-group">
        <label for="taskTitle">Task title</label>
        <input
          id="taskTitle"
          class="form-input"
          type="text"
          placeholder="Enter task title"
        >
      </div>

      <div class="form-group">
        <label for="taskDescription">Description</label>
        <textarea
          id="taskDescription"
          class="form-input"
          placeholder="Enter task description"
        ></textarea>
      </div>

      <button id="saveTaskBtn" class="primary-btn">
        Save task
      </button>

      <button id="cancelTaskBtn" class="text-btn">
        Cancel
      </button>

      <p id="taskMessage"></p>

    </div>
  `;

  document.getElementById("saveTaskBtn").addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value.trim();
    const description =
      document.getElementById("taskDescription").value.trim();

    const message = document.getElementById("taskMessage");

    if (!title) {
      message.textContent = "Task nomini kiriting.";
      return;
    }

    tasks.push({
      id: Date.now(),
      title,
      description,
      completed: false
    });

    saveTasks();
    updateStats();
    renderRecentTasks();

    message.textContent = "Task muvaffaqiyatli saqlandi.";

    setTimeout(() => {
      showDashboard();
    }, 600);
  });

  document
    .getElementById("cancelTaskBtn")
    .addEventListener("click", showDashboard);
}

function renderTasksPage() {
  dashboardPage.classList.add("hidden");
  dynamicPage.classList.remove("hidden");

  pageTitle.textContent = "My Tasks";

  dynamicPage.innerHTML = `
    <div class="page-title">
      <h2>My Tasks</h2>
      <p>Manage all your tasks here.</p>
    </div>

    <div class="content-card">
      <div class="card-header">
        <h3>All tasks</h3>

        <button id="addFromTasks" class="primary-btn">
          + Add task
        </button>
      </div>

      <div id="allTasksList" class="task-list"></div>
    </div>
  `;

  const list = document.getElementById("allTasksList");

  if (tasks.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>No tasks available</h3>
        <p>Add your first task.</p>
      </div>
    `;
  } else {
    list.innerHTML = tasks.map(task => `
      <div class="task-item ${task.completed ? "completed" : ""}">
        <div class="task-info">
          <h4>${escapeHTML(task.title)}</h4>
          <p>${escapeHTML(task.description || "No description")}</p>
        </div>

        <div class="task-actions">
          <button
            class="small-btn complete-btn"
            data-id="${task.id}"
          >
            ${task.completed ? "Undo" : "Complete"}
          </button>

          <button
            class="small-btn delete-btn"
            data-id="${task.id}"
          >
            Delete
          </button>
        </div>
      </div>
    `).join("");

    addTaskActionEvents();
  }

  document
    .getElementById("addFromTasks")
    .addEventListener("click", showAddTaskPage);
}

function showCalendarPage() {
  dashboardPage.classList.add("hidden");
  dynamicPage.classList.remove("hidden");

  pageTitle.textContent = "Calendar";

  const today = new Date().toLocaleDateString("uz-UZ");

  dynamicPage.innerHTML = `
    <div class="page-title">
      <h2>Calendar</h2>
      <p>Today: ${today}</p>
    </div>

    <div class="calendar-box">
      <h3>Today's schedule</h3>
      <p>
        Bu bo‘limda keyinchalik tasklar uchun sana va vaqt belgilash
        funksiyasini qo‘shish mumkin.
      </p>
    </div>
  `;
}

function showAnalyticsPage() {
  dashboardPage.classList.add("hidden");
  dynamicPage.classList.remove("hidden");

  pageTitle.textContent = "Analytics";

  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.filter(task => !task.completed).length;

  dynamicPage.innerHTML = `
    <div class="page-title">
      <h2>Analytics</h2>
      <p>Your task statistics.</p>
    </div>

    <div class="analytics-box">
      <h3>Task overview</h3>

      <p>Total tasks: <b>${total}</b></p>
      <p>Completed tasks: <b>${completed}</b></p>
      <p>Pending tasks: <b>${pending}</b></p>
    </div>
  `;
}

function showSettingsPage() {
  dashboardPage.classList.add("hidden");
  dynamicPage.classList.remove("hidden");

  pageTitle.textContent = "Settings";

  dynamicPage.innerHTML = `
    <div class="page-title">
      <h2>Settings</h2>
      <p>Customize your workspace.</p>
    </div>

    <div class="settings-box">

      <h3>Workspace settings</h3>

      <div class="form-group">
        <label for="userName">Your name</label>

        <input
          id="userName"
          class="form-input"
          value="${localStorage.getItem("userName") || "Xumoyun"}"
        >
      </div>

      <button id="saveNameBtn" class="primary-btn">
        Save settings
      </button>

      <p id="settingsMessage"></p>

    </div>
  `;

  document.getElementById("saveNameBtn").addEventListener("click", () => {
    const name = document.getElementById("userName").value.trim();

    localStorage.setItem("userName", name || "Xumoyun");

    document.getElementById("settingsMessage").textContent =
      "Settings saved successfully.";
  });
}

function openPage(page) {
  document.querySelectorAll(".menu-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  if (page === "dashboard") {
    showDashboard();
  }

  if (page === "tasks") {
    renderTasksPage();
  }

  if (page === "calendar") {
    showCalendarPage();
  }

  if (page === "analytics") {
    showAnalyticsPage();
  }

  if (page === "settings") {
    showSettingsPage();
  }
}

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });
});

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;

    if (page) {
      openPage(page);
    }
  });
});

newTaskBtn.addEventListener("click", showAddTaskPage);
createTaskBtn.addEventListener("click", showAddTaskPage);

/* DARK MODE */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️ Light mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDark
    ? "☀️ Light mode"
    : "🌙 Dark mode";

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );
});

/* START */

showDashboard();
