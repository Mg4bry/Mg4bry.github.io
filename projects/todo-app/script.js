// Seleziona gli elementi DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Array per memorizzare i task
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Inizializza l'app
function init() {
  renderTasks();
  updateTaskCount();
  
  // Aggiungi alcuni task di esempio se non ce ne sono
  if (tasks.length === 0) {
    addTask('Completare il progetto portfolio');
    addTask('Studiare JavaScript avanzato');
    addTask('Fare esercizio fisico');
  }
}

// Aggiungi un nuovo task
function addTask(text) {
  if (text.trim() === '') return;
  
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };
  
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateTaskCount();
  
  // Resetta l'input
  if (taskInput.value) {
    taskInput.value = '';
  }
}

// Rimuovi un task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  updateTaskCount();
}

// Cambia lo stato di un task (completato/non completato)
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  
  saveTasks();
  renderTasks();
  updateTaskCount();
}

// Filtra i task in base allo stato
function filterTasks(filter) {
  currentFilter = filter;
  
  filterBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    }
  });
  
  renderTasks();
}

// Cancella tutti i task completati
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  updateTaskCount();
}

// Renderizza i task nella lista
function renderTasks() {
  taskList.innerHTML = '';
  
  let filteredTasks = tasks;
  
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }
  
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    
    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
    if (task.completed) {
      checkbox.innerHTML = '<i class="fas fa-check"></i>';
    }
    
    const taskText = document.createElement('span');
    taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
    taskText.textContent = task.text;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteButton);
    
    taskList.appendChild(li);
    
    // Event listeners
    checkbox.addEventListener('click', () => toggleTask(task.id));
    deleteButton.addEventListener('click', () => deleteTask(task.id));
  });
}

// Aggiorna il conteggio dei task rimanenti
function updateTaskCount() {
  const remainingTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${remainingTasks} task ${remainingTasks === 1 ? 'rimasto' : 'rimasti'}`;
}

// Salva i task nel localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
addBtn.addEventListener('click', () => addTask(taskInput.value));
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
  }
});
clearCompletedBtn.addEventListener('click', clearCompleted);
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => filterTasks(btn.dataset.filter));
});

// Inizializza l'applicazione al caricamento
init();