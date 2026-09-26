// select a form
const form = document.querySelector("form");
const selectCategory = document.querySelector("#category");
const taskContainer = document.querySelector("#taskContainer");
const emptyState = document.querySelector("#emptyState");
const deleteAll = document.querySelector(".delete");
const search = document.querySelector("#search");

// arr is created to store task
let task = JSON.parse(localStorage.getItem("task")) || [];

// Start counter from the highest existing ID
let counter = task.length > 0 ? Math.max(...task.map((obj) => obj.id)) + 1 : 1;

const saveTasks = () => {
  localStorage.setItem("task", JSON.stringify(task));
};

//  search task functionality
search.addEventListener("input", () => {
  const val = search.value.toLowerCase();

  const inp = task.filter((elem) => elem.title.toLowerCase().includes(val));

  taskContainer.innerHTML = "";
  inp.forEach((obj) => {
    createTaskCard(obj);
  });
});

// to select count variables
let count1 = document.querySelector("#count1");
let count2 = document.querySelector("#count2");
let count3 = document.querySelector("#count3");

// click on top all work study personal
// select first
const all = document.querySelector("#all");
const study = document.querySelector("#study");
const work = document.querySelector("#work");
const personal = document.querySelector("#personal");

// to scroll at taskcontainer
const taskScroll = () => {
  const section1 = document.querySelector("#section1");
  const main = document.querySelector("main");

  main.scrollTo({
    top: section1.offsetTop,
    behavior: "smooth",
  });
};

all.addEventListener("click", () => {
  filterTask("All");
  taskScroll();
});

study.addEventListener("click", () => {
  filterTask("Study");
  taskScroll();
});

work.addEventListener("click", () => {
  filterTask("Work");
  taskScroll();
});

personal.addEventListener("click", () => {
  filterTask("Personal");
  taskScroll();
});

// form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let title = e.target[0].value;
  let category = e.target[1].value;
  // console.log(category);
  // console.log(taskInput);

  // validation
  if (title.trim() === "") {
    alert("Please enter your task...");
    return;
  }

  // object created
  let obj = {
    id: counter,
    title,
    category,
    status: "pending",
  };

  counter++;

  task.push(obj);
  saveTasks();

  console.log(task);

  createTaskCard(obj);
  updateCounts();

  // form reset
  form.reset();
});

// create task card
const createTaskCard = (obj) => {
  // create element
  const taskCard = document.createElement("div");
  const taskTop = document.createElement("div");
  const taskTitle = document.createElement("div");
  const taskSpan = document.createElement("span");

  const btnsAll = document.createElement("div");
  const categoryDiv = document.createElement("div");
  const categoryBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const completeBtn = document.createElement("button");
  const delBtn = document.createElement("button");

  // class add
  taskCard.classList.add("taskcard");
  taskSpan.classList.add("span");
  taskTop.classList.add("tasktop");
  taskTitle.classList.add("task-title");
  btnsAll.classList.add("btnsall");
  editBtn.classList.add("edit-btn");
  completeBtn.classList.add("complete-btn");
  delBtn.classList.add("delbtn");

  // to append
  taskContainer.append(taskCard);
  taskCard.append(taskTop, categoryDiv);
  categoryDiv.append(categoryBtn);
  taskTop.append(taskTitle);
  taskTitle.append(taskSpan);
  taskTop.append(btnsAll);
  btnsAll.append(editBtn, completeBtn, delBtn);

  // taskContainer.style.backgroundColor = "white";
  taskContainer.style.border = "none";
  emptyState.style.display = "none";

  taskSpan.textContent = obj.title;

  editBtn.textContent = "✏️Edit";
  completeBtn.textContent = "✅Done";
  delBtn.textContent = "❌Delete";

  if (obj.status === "completed") {
    taskSpan.style.textDecoration = "line-through";
    completeBtn.textContent = "↩️Undo";
  } else {
    taskSpan.style.textDecoration = "none";
    completeBtn.textContent = "✅Done";
  }

  let categoryIcon = "";

  if (obj.category === "Study") {
    categoryIcon = "📚";
  } else if (obj.category === "Work") {
    categoryIcon = "💼";
  } else if (obj.category === "Personal") {
    categoryIcon = "👤";
  }

  const categoryText = document.createTextNode(
    `${categoryIcon} ${obj.category}`,
  );
  categoryBtn.classList.add("categorybtn");
  categoryBtn.append(categoryText);
  categoryBtn.setAttribute("data-category", obj.category);

  delBtn.addEventListener("click", () => {
    const index = task.indexOf(obj);
    deleteTask(index);
  });

  editBtn.addEventListener("click", () => {
    // const index = task.findIndex((elem) => elem.title === obj.title);
    // const newTitle = prompt('Enter a new task:',obj.title);

    // if(newTitle === null || newTitle.trim() === ""){
    //   return;
    // }

    // task[index].title = newTitle;

    // taskSpan.textContent = newTitle;

    const index = task.indexOf(obj);
    editTask(index, taskSpan);
  });

  completeBtn.addEventListener("click", () => {
    const index = task.indexOf(obj);
    doneTask(index, taskSpan, completeBtn);
  });
};

const deleteTask = (index) => {
  task.splice(index, 1);
  saveTasks();

  taskContainer.innerHTML = "";
  updateCounts();

  if (task.length === 0) {
    emptyState.style.display = "flex";
    taskContainer.append(emptyState);
    return;
  }

  task.forEach((obj) => {
    createTaskCard(obj);
  });
};

deleteAll.addEventListener("click", () => {
  const result = confirm("Are you sure you want to delete all tasks?");
  if (result) {
    deleteAllTask();
  }
});

const deleteAllTask = () => {
  task = [];
  saveTasks();
  taskContainer.innerHTML = "";
  emptyState.style.display = "flex";
  taskContainer.append(emptyState);

  updateCounts();
};

const editTask = (index, taskSpan) => {
  const oldTitle = task[index].title;
  const newTitle = prompt("Enter a new task", oldTitle);

  if (newTitle === null || newTitle.trim() === "") {
    return;
  }

  task[index].title = newTitle;
  taskSpan.textContent = newTitle;

  updateCounts();
  localStorage.setItem("task", JSON.stringify(task));
};

const doneTask = (index, taskSpan, completeBtn) => {
  if (task[index].status === "pending") {
    task[index].status = "completed";
    taskSpan.style.textDecoration = "line-through";
    completeBtn.textContent = "↩️Undo";
  } else {
    task[index].status = "pending";
    taskSpan.style.textDecoration = "none";
    completeBtn.textContent = "✅Done";
  }

  saveTasks();
  updateCounts();
};

const updateCounts = () => {
  const total = task.length;
  count1.textContent = total;

  const complete = task.filter((elem) => elem.status === "completed");
  count2.textContent = complete.length;

  const pending = task.filter((elem) => elem.status === "pending");
  count3.textContent = pending.length;
};

// filter task

const filterTask = (category) => {
  let filteredTasks;

  if (category === "All") {
    filteredTasks = task;
  } else if (category === "Study") {
    filteredTasks = task.filter((elem) => elem.category === "Study");
  } else if (category === "Work") {
    filteredTasks = task.filter((elem) => elem.category === "Work");
  } else if (category === "Personal") {
    filteredTasks = task.filter((elem) => elem.category === "Personal");
  }

  taskContainer.innerHTML = "";

  if (filteredTasks.length === 0) {
    emptyState.style.display = "flex";
    taskContainer.append(emptyState);
    return;
  }

  filteredTasks.forEach((obj) => {
    createTaskCard(obj);
  });
};

taskContainer.innerHTML = "";

if (task.length === 0) {
  emptyState.style.display = "flex";
  taskContainer.append(emptyState);
} else {
  task.forEach((obj) => {
    createTaskCard(obj);
  });
}

updateCounts();

// Event Bubbling

const grand = document.querySelector(".grand");
const parent = document.querySelector(".parent");
const child = document.querySelector(".child");
const output = document.querySelector("#output");
const para = document.querySelector(".para");
const right = document.querySelector(".right");
const toggleBtn = document.querySelector("#toggleBtn");
const clearBtn = document.querySelector("#clear");

let isBubbling = true;

function grandClick() {
  showOutput("Grand");
}

function parentClick() {
  showOutput("Parent");
}

function childClick() {
  showOutput("Child");
}

function showOutput(text) {
  para.style.display = "none";
  right.style.overflowY = "scroll";
  output.innerHTML += `<p>${text}</p>`;
}

function addEvents() {
  grand.addEventListener("click", grandClick, !isBubbling);
  parent.addEventListener("click", parentClick, !isBubbling);
  child.addEventListener("click", childClick, !isBubbling);
}

function removeEvents() {
  grand.removeEventListener("click", grandClick, !isBubbling);
  parent.removeEventListener("click", parentClick, !isBubbling);
  child.removeEventListener("click", childClick, !isBubbling);
}

toggleBtn.addEventListener("click", () => {
  removeEvents();

  isBubbling = !isBubbling;

  addEvents();
  if (isBubbling) {
    toggleBtn.textContent = "Mode: Bubbling";
  } else {
    toggleBtn.textContent = "Mode: Capturing";
  }
});

addEvents();

clearBtn.addEventListener("click", () => {
  output.innerHTML = "";
});

// Property vs Attribute
function compareInput() {
  let input = document.getElementById("demoInput");

  document.getElementById("propertyOutput").textContent = input.value;

  document.getElementById("attributeOutput").textContent =
    input.getAttribute("value");
}

// Save theme
function saveTheme(theme) {
  localStorage.setItem("theme", theme);
}

// Toggle theme
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

// Load saved theme after refresh
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";

  document.body.dataset.theme = savedTheme;
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (savedTheme === "dark") {
    themeToggle.textContent = "🌙";
  } else {
    themeToggle.textContent = "☀️";
  }
}

loadTheme();
