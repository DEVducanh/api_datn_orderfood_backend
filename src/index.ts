import express from 'express'

const app = express()
const port = 8080

app.get('/', (req, res) => {
  console.log('hello World')
  res.send('hello')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
