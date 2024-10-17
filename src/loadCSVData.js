import { parse } from 'csv-parse'
import fs from 'node:fs'
import axios from 'axios'

export async function loadCSVData() {

  // const parser = generate({
  //   columns: [String(), String()],
  //   length: 100,
  // }).pipe(parse())

  const filePath = new URL('./assets/tasks.csv', import.meta.url)

  const parser = fs.createReadStream(filePath).pipe(parse())

  process.stdout.write('start')

  //const tasks = []

  for await (const task of parser) {

    const taskObject = {
      title: task[0],
      description: task[1],
    }

    await axios.post('http://localhost:3333/tasks', taskObject)

    //tasks.push(taskObject)

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  //return tasks  
}

loadCSVData()