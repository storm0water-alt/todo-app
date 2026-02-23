"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

const STORAGE_KEY = "todos"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [editText, setEditText] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTodos(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse todos:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  const addTodo = () => {
    if (newTodo.trim() === "") return
    
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
    }
    
    setTodos([todo, ...todos])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const openEditDialog = (todo: Todo) => {
    setEditTodo(todo)
    setEditText(todo.text)
    setIsDialogOpen(true)
  }

  const saveEdit = () => {
    if (!editTodo || editText.trim() === "") return
    
    setTodos(
      todos.map((todo) =>
        todo.id === editTodo.id ? { ...todo, text: editText.trim() } : todo
      )
    )
    setIsDialogOpen(false)
    setEditTodo(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setIsDialogOpen(false)
    setEditTodo(null)
    setEditText("")
  }

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  if (!isLoaded) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6">
      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              Todo List
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new todo */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Todo list */}
            <div className="space-y-2">
              {todos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No todos yet. Add one above!
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-900 group"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      className={`flex-1 break-words ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(todo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>
              Make changes to your todo here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              placeholder="Edit your todo..."
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
