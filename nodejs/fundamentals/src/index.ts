import express from 'express'

interface ICourse {
  id: number
  name: string
  description: string
  tags: string[]
}

const app = express()

app.use(express.json())

let courses: ICourse[] = [
  {
    id: 1,
    name: 'NodeJS',
    description: 'NodeJS course by Abner Borgonha',
    tags: ['backend', 'node', 'express']
  }
]

app.get('/courses', (request, response) => {
  return response.json(courses)
})

app.post('/courses', (request, response) => {
  const data = request.body

  courses.push(data)

  return response.json(courses)
})

app.put('/courses/:id', (request, response) => {
  const { id: courseId } = request.params
  const data: ICourse = request.body

  const updatedCourse = courses.filter(course => {
    if (!(course.id === Number(courseId))) return course
  })

  courses = updatedCourse
  courses.push(data)
  
  return response.json(courses)
})

app.delete('/courses/:id', (request, response) => {
  const { id: courseId } = request.params

  const deletedCourse = courses.filter(course => {
    if (!(course.id === Number(courseId))) return course
  })

  courses = deletedCourse
  
  return response.status(204).send()
})

app.listen(3033, () => {
  console.log('Server linsten on port 3033')
})
