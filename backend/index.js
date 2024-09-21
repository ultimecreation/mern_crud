
import { createServer } from 'http'
import { Server } from 'socket.io'


const httpServer = createServer()
const socketIo = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
let crudData = []

socketIo.on("connection", (socket) => {

    socket.on("create", (data) => {
        crudData = [...crudData, data]
        console.log('From CREATE: ', crudData)
        socket.emit("read", crudData)
    })
    socket.on("update", (incomingData) => {
        crudData = crudData.map(data => {
            return data.id === incomingData.id
                ? { ...incomingData }
                : data
        })
        socket.emit("read", crudData)
    })
    socket.on("delete", id => {
        crudData = crudData.filter(data => data.id !== id)
        socket.emit("read", crudData)
    })
})

httpServer.listen(3001, () => {
    console.log('server started')
})