const API_URL = "http://127.0.0.1:8000";


async function loadTodos() {
    const response = await fetch(`${API_URL}/todos`);
    const todos = await response.json();

    const todoList = document.getElementById("todoList");

    todoList.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");

        const titleSpan = document.createElement("span");
        titleSpan.textContent = todo.title;

        if (todo.completed) {
            titleSpan.style.textDecoration = "line-through";
        }

        const completeButton = document.createElement("button");
        completeButton.textContent = todo.completed ? "Undo" : "Complete";
        completeButton.onclick = () => toggleTodo(
            todo.id,
            todo.completed,
            todo.title
        );

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editTodo(
            todo.id,
            todo.title,
            todo.completed
        );

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTodo(todo.id);

        li.appendChild(titleSpan);
        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    });
}


async function addTodo() {
    const input = document.getElementById("todoInput");

    const title = input.value.trim();

    if (!title) {
        return;
    }

    await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title
        })
    });

    input.value = "";

    loadTodos();
}


async function editTodo(id, currentTitle, completed) {
    const newTitle = prompt("Edit your todo:", currentTitle);

    if (newTitle === null) {
        return;
    }

    const title = newTitle.trim();

    if (!title) {
        return;
    }

    await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            completed: completed
        })
    });

    loadTodos();
}


async function deleteTodo(id) {
    await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE"
    });

    loadTodos();
}


async function toggleTodo(id, completed, title) {
    await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            completed: !completed
        })
    });

    loadTodos();
}


loadTodos();