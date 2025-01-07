//inputs
const taskName = document.getElementById('task-name');
const dueDate = document.getElementById('deadline');
const taskLocation = document.getElementById('location');
const taskType = document.getElementById('task-type');
const taskDescription = document.getElementById('description');

//container
const mainC = document.getElementById('cmain-container');
const mainV = document.getElementById('vmain-container');
const currentC = document.getElementById('current-tab');
const deletedC = document.getElementById('deleted-tab');
const concludedC = document.getElementById('concluded-tab');
const taskContainer = document.getElementById('tasks-container');

//button
const createBtn = document.getElementById('create-btn');
const btn = document.getElementById('btn-container');

//functions & variables

let taskData = JSON.parse(localStorage.getItem("Task")) || [];
let deletedData = JSON.parse(localStorage.getItem("deleted")) || [];
let concludedData = JSON.parse(localStorage.getItem("concluded")) || [];

createBtn.addEventListener('click', () => {

  const reformatDate = date => {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`
  };
  
  taskData.push({
    id: Math.random() * 99,
    tName: taskName.value,
    dDate: reformatDate(dueDate.value),
    location: taskLocation.value,
    type: taskType.value,
    desc: taskDescription.value
  });

  console.log(taskData);

  localStorage.setItem("Task", JSON.stringify(taskData));
  
  return mainC.innerHTML = `
    <div class="success-container">
    <h1>You have successfully created your task!</h1>
    <p>What would you like to do next?</p>
    <div class="btn-container">
      <a href="view-task.html"><button id="view-btn">VIEW TASKS</button></a>
      <a href="create-task.html"><button id="create-btn">NEW TASK</button></a>
    </div>
  </div>
  `
});



currentC.addEventListener("click", () => {
  currentC.classList.add('selected');
  deletedC.classList.remove('selected');
  concludedC.classList.remove('selected');
  generateTask();
});
  
const generateTask = () => {
  if (taskData.length !== 0) {
    /* coded with GPT's help */
    const uniqueTasks = [... new Set(taskData.map(obj => obj.type))];

    taskContainer.innerHTML = "";

    uniqueTasks.forEach(type => {

      const tasksOfType = taskData.filter(obj => obj.type === type);

      const typeBlock = `
      <fieldset class="task-box" id="task-box">
          <legend>${type}</legend>
          ${tasksOfType
            .map(({ tName, dDate, location, desc, id }) => {
              return `
                <div class="task-box-div">
                  <div class="closing-tag">
                    <i class="fa-solid fa-square-check" id="check" onclick="concludedTask(${id})"></i>
                    <button class="edit-btn" onclick="editTask(${id})">
                      Edit <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <i class="fa-solid fa-square-xmark" id="close" onclick="deleteTask(${id})"></i>
                  </div>
                  <p><strong>Title: </strong>${tName}</p>
                  <p><strong>In: </strong>${dDate}</p>
                  <p><strong>At: </strong>${location}</p>
                  <p><strong>About: </strong>${desc}</p>
                </div>
              `;
            })
            .join("")}
        </fieldset>
      `;

      taskContainer.innerHTML += typeBlock;

    });
  } else {
    taskContainer.innerHTML = `
      <div class="empty-container">
        <h1>No tasks available</h1>
        <img src="https://cdn.pixabay.com/photo/2020/05/02/08/11/sleeping-5120269_1280.png" alt="lazy-sloth">
      </div>
    `;
  };

  btn.classList.remove('hidden'); //line 289
  mainV.classList.remove('expand'); //line 290
  taskContainer.classList.remove('modify'); //line 180
};

generateTask();


deletedC.addEventListener("click", () => {
  deletedC.classList.add('selected');
  currentC.classList.remove('selected');
  concludedC.classList.remove('selected');
  generateDeletedTask();
});

const generateDeletedTask = () => {
  if (deletedData.length !== 0) {
    /* coded with GPT's help */
    const uniqueTasks = [... new Set(deletedData.map(obj => obj.type))];

    taskContainer.innerHTML = "";

    uniqueTasks.forEach(type => {

      const tasksOfType = deletedData.filter(obj => obj.type === type);

      const typeBlock = `
      <fieldset class="task-box">
          <legend>${type}</legend>
          ${tasksOfType
            .map(({ tName, dDate, location, desc, id }) => {
              return `
                <div class="task-box-div-deleted">
                  <div class="closing-tag-deleted">
                    <button class="pdelete-btn" onclick="areYouSure(${id})">
                      Delete <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <button class="restore-btn" onclick="restoreTask(${id})">
                      Restore <i class="fa-solid fa-window-restore"></i>
                    </button>
                  </div>
                  <p><strong>Title: </strong>${tName}</p>
                  <p><strong>In: </strong>${dDate}</p>
                  <p><strong>At: </strong>${location}</p>
                  <p><strong>About: </strong>${desc}</p>
                </div>
              `;
            })
            .join("")}
        </fieldset>
      `;

      taskContainer.innerHTML += typeBlock;

    });
  } else {
    taskContainer.innerHTML = `
      <div class="empty-container">
        <h1>No Deleted Tasks</h1>
        <img src="https://cdn.pixabay.com/photo/2020/05/02/08/11/sleeping-5120269_1280.png" alt="lazy-sloth">
      </div>
    `;
  };

  btn.classList.remove('hidden'); // ard line 184
  taskContainer.classList.remove('modify');//ard line 183
};

const areYouSure = obj => {

  const selectedTask = deletedData.find(x => x.id === obj);

  const {tName, id, type} = selectedTask;

  if (selectedTask) {
    taskContainer.classList.add('modify');
    btn.classList.add('hidden');
    return taskContainer.innerHTML = `
      <h1 class="confirm-alert">
        ARE YOU SURE YOU WANT TO DELETE <strong class="red-color">${tName.toUpperCase()}</strong> TASK?
      </h1>
      <p class="info-p">This <strong class="green-color">${type}</strong> task will be forever lost!</p>
      <div class="yn-container">
        <button class="yes-btn" onclick="permDeleteTask(${id})">
          YES
        </button>
        <button class="no-btn" onclick="generateDeletedTask()">
          NO
        </button>
      </div>
    `;
  } else {
    console.log("Task not found");
  };
  
};

const permDeleteTask = obj => {
  deletedData = deletedData.filter(x => x.id !== obj);
  localStorage.setItem("deleted", JSON.stringify(deletedData));
  generateDeletedTask();
};


concludedC.addEventListener("click", () => {
  concludedC.classList.add('selected');
  currentC.classList.remove('selected');
  deletedC.classList.remove('selected');
  generateConcludedTask();
});



const generateConcludedTask = () => {
  if (concludedData.length !== 0) {
    /* coded with GPT's help */
    const uniqueTasks = [... new Set(concludedData.map(obj => obj.type))];

    taskContainer.innerHTML = "";

    uniqueTasks.forEach(type => {

      const tasksOfType = concludedData.filter(obj => obj.type === type);

      const typeBlock = `
      <fieldset class="task-box">
          <legend>${type}</legend>
          ${tasksOfType
            .map(({ tName, dDate, location, desc, id }) => {
              return `
                <div class="task-box-div-concluded">
                  <div class="closing-tag-concluded">
                    <button class="dismiss-btn" onclick="dismissTask(${id})">
                      Dismiss <i class="fa-solid fa-medal"></i>
                    </button>
                  </div>
                  <p><strong>Title: </strong>${tName}</p>
                  <p><strong>In: </strong>${dDate}</p>
                  <p><strong>At: </strong>${location}</p>
                  <p><strong>About: </strong>${desc}</p>
                </div>
              `;
            })
            .join("")}
        </fieldset>
      `;

      taskContainer.innerHTML += typeBlock;

    });
  } else {
    taskContainer.innerHTML = `
      <div class="empty-container">
        <h1>No Concluded Tasks</h1>
        <img src="https://cdn.pixabay.com/photo/2020/05/02/08/11/sleeping-5120269_1280.png" alt="lazy-sloth">
      </div>
    `;
  };
};



const deleteTask = (obj) => {
  const taskBeingDeleted = taskData.find(x => x.id === obj);
  deletedData.push(taskBeingDeleted);
  taskData = taskData.filter(x => x.id !== obj);
  localStorage.setItem("Task", JSON.stringify(taskData));
  localStorage.setItem('deleted', JSON.stringify(deletedData));
  generateTask();
};

const concludedTask = (obj) => {
  const taskBeingConcluded = taskData.find(x => x.id === obj);
  concludedData.push(taskBeingConcluded);
  taskData = taskData.filter(x => x.id !== obj);
  localStorage.setItem("Task", JSON.stringify(taskData));
  localStorage.setItem('concluded', JSON.stringify(concludedData));
  generateTask();
};

const editTask = obj => {

  const selectedTask = taskData.find(x => x.id === obj);

  const { tName, dDate, location, desc, id, type } = selectedTask;

  if (selectedTask) {
    mainV.classList.add('expand');
    btn.classList.add('hidden');
    return taskContainer.innerHTML = `
      <section id="user-data">
      
        <label for="task-name">Task name:</label>
        <input type="text" id="task-name" placeholder="Study JavaScript..." value="${tName}" class="task-name" required>
        <label for="deadline">Due date:</label>
        <input type="date" id="deadline" value="${dDate}" class="task-date" required>
        <label for="location">Location (optional):</label>
        <input type="text" id="location" value="${location}" placeholder="123 Main St..." class="task-location">

        <label for="task-type">Task Type:</label>
        <select name="task-type" id="task-type" class="task-type">
          <option value="${type}">Default</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Errand">Errand</option>
        </select>

        <div class="for-textarea">
          <label for="description">Description:</label>
          <textarea name="description" id="description" placeholder="Code a lot..." rows="10" class="task-desc">${desc}</textarea>
        </div>

        <div class="edit-container">
          <button class="save-btn" onclick="saveEditedTask(${id})">
            Save
          </button>
          <button class="discard-btn" onclick="generateTask()">
            Discard
          </button>
        </div>

      </section>
    `
  } else {
    console.log("Error");
  }
};

const dismissTask = obj => {
  concludedData = concludedData.filter(x => x.id !== obj);
  localStorage.setItem("concluded", JSON.stringify(concludedData));
  generateConcludedTask();
};

const saveEditedTask = obj => {
  //const selectedTask = taskData.filter(x => x.id !== obj);
  const name = document.querySelector('.task-name').value;
  const date = document.querySelector('.task-date').value;
  const location = document.querySelector('.task-location').value;
  const desc = document.querySelector('.task-desc').value;
  const type = document.querySelector('.task-type').value;
  taskData = taskData.filter(x => x.id !== obj);
  obj = Math.random() * 99;
  taskData.push({
    id: obj,
    tName: name,
    dDate: date,
    location: location,
    type: type,
    desc: desc
  });
  localStorage.setItem("Task", JSON.stringify(taskData));
  generateTask();
  console.log(name, date, location, type, desc, obj);
};

const restoreTask = obj => {
  const taskBeingRestored = deletedData.find(x => x.id === obj);
  taskData.push(taskBeingRestored);
  deletedData = deletedData.filter(x => x.id !== obj);
  localStorage.setItem("Task", JSON.stringify(taskData));
  localStorage.setItem('deleted', JSON.stringify(deletedData));
  generateDeletedTask();
};