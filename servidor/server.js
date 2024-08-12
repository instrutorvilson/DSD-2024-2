const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const app = express()

const dados = ['Maria', 'Jose', 'Antonio']

app.use(cors())

app.get('/',(req, res) => {
    res.status(200).send('Ola')
})

app.get('/contatos',(req, res) => {
    res.status(200).send(dados)
})

app.listen(PORT, () => console.log(`servidor executando na porta ${PORT}`))