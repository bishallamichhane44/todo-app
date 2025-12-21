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

@app.get("/api/todos", response_model=List[Todo])
def get_todos():
    return todos

@app.post("/api/todos", response_model=Todo)
def add_todo(todo: Todo):
    global current_id
    current_id += 1
    new_todo = Todo(id=current_id, title=todo.title)
    todos.append(new_todo)
    return new_todo

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todos
    # Filter out the todo with the given ID
    todos = [t for t in todos if t.id != todo_id]
    return {"message": "Todo deleted"}
