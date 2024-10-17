
import fs from 'node:fs/promises'

const databasePath = new URL('./db.json',import.meta.url)

export class Database {

  #database = {}
  
  constructor() {
    fs.readFile(databasePath, 'utf8').then(
      data => {
        this.#database = JSON.parse(data)
      }).catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search && data.length > 0) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, task) {

    if (!task.title && !task.description) {
      return { errorMessage: 'As informações title e description devem constar no corpo da requisição' }
    }

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(task)
    } else {
      this.#database[table] = [task]
    }

    this.#persist()

    return task
  }

  update(table, id, data) {


    if (!data) {
      return { errorMessage: 'Alguma das informações fornecidas não está correta, favor verificar' }
    }


    const dataIndex = this.#database[table].findIndex((row) => row.id === id)

    if (dataIndex > -1) {

       const updatedTask = {
        ...this.#database[table][dataIndex],
        title: data.title,
        description: data.description,
        updatedAt: new Date()
      }

      this.#database[table][dataIndex] = updatedTask

      this.#persist()

      return updatedTask
    }

    return { errorMessage: 'id informado não existe, favor verifica' }

  }

  updateComplete(table, id) {
    const dataIndex = this.#database[table].findIndex((row) => row.id === id)

    if (dataIndex > -1) {
      const taksToBeUpdated = this.#database[table][dataIndex]

      const updatedTask = {
        ...taksToBeUpdated,
        completed_at: taksToBeUpdated.completed_at ? null : new Date()
      }

      this.#database[table][dataIndex] = updatedTask

      this.#persist()

      return updatedTask
    }

    return { errorMessage: "id informado não existe, favor verificar" }
  }

  delete(table, id) {
    const dataIndex = this.#database[table].findIndex((row) => row.id === id)

    if (dataIndex > -1) {
      this.#database[table].splice(dataIndex, 1)
      this.#persist()

    }

  }
}