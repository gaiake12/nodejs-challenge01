import { buildRoutePath } from "./utils/build-route-path.js"
import { Database } from './database/index.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const {title, description} = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      database.insert('tasks', task)

      return res.writeHead(201).end()

    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      }: null)

      res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {

      const { id } = req.params
      const {title, description} = req.body

      const task = database.update('tasks', id, {title, description})

      res.writeHead(200).end(JSON.stringify(task))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {

      const { id } = req.params

      const updatedTask = database.updateComplete('tasks', id)

      res.writeHead(204).end(JSON.stringify(updatedTask))

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {

      const { id } = req.params

      database.delete('tasks', id)

      res.writeHead(204).end()

    }
  },
]