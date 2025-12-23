import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDetail, setEditDetail] = useState('');

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
        if (expandedTodoId === id) {
             setExpandedTodoId(null);
             setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleExpand = (todo) => {
    if (expandedTodoId === todo.id) {
      setExpandedTodoId(null);
      setIsEditing(false);
    } else {
      setExpandedTodoId(todo.id);
      setIsEditing(false);
      // Pre-fill for potential editing
      setEditTitle(todo.title);
      setEditDetail(todo.detail || '');
    }
  };

  const handleStartEdit = (todo) => {
     setEditTitle(todo.title);
     setEditDetail(todo.detail || '');
     setIsEditing(true);
  };

  const handleUpdateTodo = async (todoId) => {
    if (!editTitle.trim()) return;
    
    // Find the current todo to get other properties
    const currentTodo = todos.find(t => t.id === todoId);
    if (!currentTodo) return;

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           ...currentTodo,
           title: editTitle,
           detail: editDetail
        }),
      });
      if (response.ok) {
        fetchTodos();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
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
          {todos.map((todo) => {
            const isExpanded = expandedTodoId === todo.id;
            
            return (
            <li key={todo.id} className={`todo-item ${todo.is_completed ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}>
              <div className="todo-header-row">
                  <div className="checkbox-container" onClick={() => handleToggleTodo(todo)}>
                    {todo.is_completed && <span className="checkmark">✔</span>}
                  </div>
                  <span className="todo-text text-truncate" onClick={() => toggleExpand(todo)}>
                    {todo.title}
                  </span>
                  <button className={`view-more-btn ${isExpanded ? 'rotated' : ''}`} onClick={() => toggleExpand(todo)} title={isExpanded ? "Collapse" : "Expand"}>
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                     )}
                  </button>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteTodo(todo.id); }}>
                    ✖
                  </button>
              </div>
              
              {isExpanded && (
                  <div className="todo-body">
                      {isEditing ? (
                         <div className="edit-form-inline">
                            <input
                              className="edit-input"
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Task Title"
                            />
                            <textarea
                              className="edit-textarea"
                              value={editDetail}
                              onChange={(e) => setEditDetail(e.target.value)}
                              placeholder="Add details..."
                            />
                            <div className="action-row">
                                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={() => handleUpdateTodo(todo.id)}>Save</button>
                            </div>
                         </div>
                      ) : (
                          <div className="detail-view">
                              <p className="detail-label">Details:</p>
                              <div className="detail-text">
                                 {todo.detail ? todo.detail : <em style={{color: '#999'}}>No details provided.</em>}
                              </div>
                              <div className="action-row">
                                  <button className="btn btn-secondary" onClick={() => handleStartEdit(todo)}>Edit</button>
                              </div>
                          </div>
                      )}
                  </div>
              )}
            </li>
          )})}
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
