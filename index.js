const app = require('./app')

const port = 3003

app.listen(port, () => {
    console.log('Server is up on port number: ' + port)
})
