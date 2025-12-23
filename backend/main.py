from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# In-memory storage
todos = []

# ID counter to simulate auto-increment
current_id = 0

class Todo(BaseModel):
    id: Optional[int] = None
    title: str
    detail: Optional[str] = None
    is_completed: bool = False

@app.get("/api/todos", response_model=List[Todo])
def get_todos():
    return todos

@app.post("/api/todos", response_model=Todo)
def add_todo(todo: Todo):
    global current_id
    current_id += 1
    new_todo = Todo(id=current_id, title=todo.title, detail=todo.detail, is_completed=todo.is_completed)
    todos.append(new_todo)
    return new_todo

@app.put("/api/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated_todo: Todo):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            todos[i] = updated_todo
            todos[i].id = todo_id # Ensure ID stays same
            return todos[i]
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todos
    todos = [t for t in todos if t.id != todo_id]
    return {"message": "Todo deleted"}
