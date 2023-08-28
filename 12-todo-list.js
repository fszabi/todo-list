const todoName = document.querySelector(".todo-name");
const todoDate = document.querySelector(".todo-date");
const todoContainer = document.querySelector(".todo-container");
const addButton = document.querySelector(".btn--add");
const bodyElement = document.querySelector("body");
const listSelector = document.querySelector(".list-selector");
const createListButton = document.querySelector(".btn--create-list");
const deleteListButton = document.querySelector(".btn--delete-list");

// Initialize the currentList to the first list or create an empty list
let currentList = JSON.parse(localStorage.getItem("todoLists")) || [
  {
    name: "Default",
    todos: [],
  },
];

// Clear existing options
listSelector.innerHTML = "";

currentList.forEach((list) => {
  const listName = list.name;

  const newListOption = document.createElement("option");
  newListOption.value = listName;
  newListOption.textContent = listName;
  listSelector.appendChild(newListOption);
});

// Function to save the lists to localStorage
function saveToStorage() {
  localStorage.setItem("todoLists", JSON.stringify(currentList));
}

// Function to render the selected list
function renderTodoList() {
  const selectedListName = listSelector.value;

  // Find the selected list in currentList
  const selectedList = currentList.find(
    (list) => list.name === selectedListName
  );

  if (selectedList) {
    // Check if the selected list exists
    let todoListHTML = "";

    selectedList.todos.forEach((todoObject, index) => {
      const { name, dueDate, done } = todoObject;

      const html = `
              <div class="grid col-4">
                  <p>${name}</p>
                  <p>${dueDate}</p>
                  <button class="btn--delete">Delete</button>
                  <input type="checkbox" class="todo-check" ${
                    done ? "checked" : ""
                  }/>
              </div>
          `;
      todoListHTML += html;
    });

    todoContainer.innerHTML = todoListHTML;

    document.querySelectorAll(".btn--delete").forEach((deleteButton, index) => {
      deleteButton.addEventListener("click", () => {
        if (selectedList.todos) {
          selectedList.todos.splice(index, 1);
          renderTodoList();
          saveToStorage();
        }
      });
    });

    document.querySelectorAll(".todo-check").forEach((checkbox, index) => {
      checkbox.addEventListener("change", () => {
        if (selectedList.todos) {
          selectedList.todos[index].done = checkbox.checked;
          saveToStorage();
        }
      });
    });
  } else {
    // If the selected list does not exist, clear the todoContainer
    todoContainer.innerHTML = "";
  }
}

// Function to add a new todo to the selected list
function addTodo() {
  const name = todoName.value;
  const dueDate = todoDate.value;
  const selectedListName = listSelector.value;

  if (name !== "" && dueDate !== "") {
    // Find the selected list in currentList
    const selectedList = currentList.find(
      (list) => list.name === selectedListName
    );

    selectedList.todos.push({
      name,
      dueDate,
      done: false, // Initialize the done property to false
    });
    todoName.value = "";

    renderTodoList();

    saveToStorage();
  }
}

// Function to create a new list
function createNewList() {
  const newListName = prompt("Enter the name of the new list:");

  if (newListName) {
    // Check if a list with the same name already exists
    const listExists = currentList.some((list) => list.name === newListName);

    if (!listExists) {
      currentList.push({
        name: newListName,
        todos: [],
      });

      // Create a new option element
      const newListOption = document.createElement("option");
      newListOption.value = newListName;
      newListOption.textContent = newListName;

      // Append the new option to the list selector
      listSelector.appendChild(newListOption);

      // Set the list selector value to the new list
      listSelector.value = newListName;

      renderTodoList();

      // Save the updated currentList to localStorage
      saveToStorage();
    } else {
      alert("A list with the same name already exists.");
    }
  }
}

// Function to delete the currently selected list
function deleteCurrentList() {
  const selectedListName = listSelector.value;

  // Confirm the deletion with the user
  const confirmDelete = confirm(
    `Are you sure you want to delete the list "${selectedListName}"?`
  );

  if (confirmDelete) {
    // Find the index of the selected list in currentList
    const listIndex = currentList.findIndex(
      (list) => list.name === selectedListName
    );

    if (listIndex !== -1) {
      // Remove the selected list from currentList
      currentList.splice(listIndex, 1);

      // Remove the corresponding option from the list selector
      listSelector.remove(listSelector.selectedIndex);

      // Set the list selector value to the first list (if available)
      if (listSelector.options.length > 0) {
        listSelector.value = listSelector.options[0].value;
      } else {
        // If there are no lists left, clear the todoContainer
        todoContainer.innerHTML = "";
      }

      renderTodoList();

      // Save the updated currentList to localStorage
      saveToStorage();
    }

    // If the selected list was "Default" and there are no lists left, create a new default list
    if (currentList.length === 0) {
      currentList.push({
        name: "Default",
        todos: [],
      });

      // Add a new "Default" option to the list selector
      listSelector.innerHTML += '<option value="Default">Default</option>';
      listSelector.value = "Default";

      renderTodoList();

      // Save the updated currentList to localStorage
      saveToStorage();
    }
  }
}

// Event listeners
addButton.addEventListener("click", () => {
  addTodo();
});

bodyElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

listSelector.addEventListener("change", () => {
  renderTodoList();
});

createListButton.addEventListener("click", () => {
  createNewList();
});

deleteListButton.addEventListener("click", () => {
  deleteCurrentList();
});

// Initial rendering of the todo list
renderTodoList();
