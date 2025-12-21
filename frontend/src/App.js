import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo, is_completed: false }),
      });
      if (response.ok) {
        setNewTodo('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, is_completed: !todo.is_completed }),
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const remainingTodos = todos.filter(t => !t.is_completed).length;

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Your To Do</h1>
        </header>

        <form onSubmit={handleAddTodo} className="input-group">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task"
          />
          <button type="submit" className="add-btn">+</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
              <div className="checkbox-container" onClick={() => handleToggleTodo(todo)}>
                {todo.is_completed && <span className="checkmark">✔</span>}
              </div>
              <span className="todo-text" onClick={() => handleToggleTodo(todo)}>{todo.title}</span>
              <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>
                ✖
              </button>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <p className="remaining">Your remaining todos : {remainingTodos}</p>
          <p className="quote">"Doing what you love is the cornerstone of having abundance in your life." - Wayne Dyer</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
