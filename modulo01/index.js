const express = require ('express');

const server = express();

server.use(express.json());

const users = [{name: 'Joao'}, {name: 'Pedro'}, {name: 'Victor'}]


server.use((req, res, next) => {
    console.time('Request')

    console.log(`Method: ${req.method}, URL: ${req.url}`)

    next(); //continue to request

    console.timeEnd('Request')
})

function checkUserExists(req, res, next) {
    if(!req.body.name)
        return res.status(400).json({error: 'User name required'})
    
    return next() 
}


function checkUserIndex(req, res, next) {
    const { index } = req.params
    if(index >= users.length)
        return res.status(400).json({message: "User doesn't exist"})
    
    return next() 

}

server.get('/users', (req, res) =>{
    return res.json(users)
})

server.get('/users/:index', checkUserIndex, (req, res) => {
    const { name } = req.query
    const { email } = req.query

    const { index } = req.params

    return res.json({user: users[index]})
})

server.post('/users', checkUserExists, (req, res) =>{
    const { name } = req.body

    users.push({name: name})

    return res.json(users)
})

server.put('/users/:index', checkUserExists, checkUserIndex, (req, res) =>{
    const { index } = req.params
    const { name } = req.body

    users[index] = {name: name}

    return res.json({message: "User updated"})
})

server.delete('/users/:index', checkUserIndex, (req, res) =>{
    const { index } = req.params

    users.splice(index, 1)

    return res.json({message: "User deleted"})
})

server.listen(3000)