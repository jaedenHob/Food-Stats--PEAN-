const express = require('express')
const app = express()
const port = 8070

app.get('/', (req, res) => {
    res.send("<h1>API works!</h1>")
})

app.listen(port, () => console.log(`Express Server listening on port ${port}`));