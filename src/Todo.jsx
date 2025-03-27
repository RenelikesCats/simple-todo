import { useState, useEffect } from "react";

function Todo() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null); // ID of the task being edited (null if not editing)
  const [editedText, setEditedText] = useState(""); // The text currently in the edit input field

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(e) {
    setNewTask(e.target.value);
  }

  function handleNewTask() {
    if (newTask.trim() !== "") {
      const newTaskObj = {
        id: Date.now() + Math.random(),
        text: newTask.charAt(0).toUpperCase() + newTask.slice(1),
      };
      setTasks((t) => [...t, newTaskObj]);
      setNewTask("");
    }
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function editTask(id) {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditingId(id);
      setEditedText(taskToEdit.text); // Initialize the edit input with the current task text
    }
  }

  function updateTask() {
    if (editedText.trim() !== "") {
      const updatedTasks = tasks.map((task) =>
        task.id === editingId ? { ...task, text: editedText.charAt(0).toUpperCase() + editedText.slice(1) } : task
      );
      setTasks(updatedTasks); 
      setEditingId(null); // Exit edit mode
      setEditedText("");  // Clear the edit input
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditedText("");
  }

  function moveUp(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks)
    }
  }

  function moveDown(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editingId === null) {
        handleNewTask();
      } else {
        updateTask();
      }
    }
  };

  const handleEditInputChange = (e) => {
    setEditedText(e.target.value);
  }

  const renderEditing = ( // Conditional rendering ->  when user clicks on edit
    <>
      <input
        type="text"
        value={editedText}
        onChange={handleEditInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
        maxLength={50}
        placeholder="Edit text here..." />

      <button className="save-button" onClick={updateTask}> Save </button>
      <button className="cancel-button" onClick={cancelEdit}> Cancel </button>
    </>


  )

  return (
    <>
      <div>
        <h1 className="todo-h1"> To do list</h1>

        <div className="todo-container">
          <input
            type="text"
            id="input"
            value={newTask}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            maxLength="50"
            placeholder="Add new task..." />

          <button className="add-button" id="btn" onClick={handleNewTask}> Add </button>
        </div>
        
        <ol>
          {tasks.map((task) => (
            <li key={task.id} className="list">
              {editingId === task.id ? renderEditing : (
                <>
                  <span className="text">{task.text}</span>

                  <button className="moveButton" onClick={() => moveUp(task.id)}>⬆️</button>
                  <button className="moveButton" onClick={() => moveDown(task.id)}>⬇️</button>

                  <button className="edit-button" onClick={() => editTask(task.id)}> Edit </button>
                  <button className="delete-button" onClick={() => deleteTask(task.id)}> Delete </button>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default Todo ;