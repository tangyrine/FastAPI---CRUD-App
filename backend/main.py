from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
import models
import schemas
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Todo API is running"}


@app.post("/todos", response_model=schemas.TodoResponse)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    
    new_todo = models.Todo(title=todo.title)

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo

@app.get("/todos", response_model=list[schemas.TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).all()

@app.put("/todos/{todo_id}", response_model=schemas.TodoResponse)
def update_todo(
    todo_id: int,
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db)
):
    existing_todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id
    ).first()

    if existing_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    existing_todo.title = todo.title
    existing_todo.completed = todo.completed

    db.commit()
    db.refresh(existing_todo)

    return existing_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id
    ).first()

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted successfully"}
