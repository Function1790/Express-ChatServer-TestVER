var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

const print = (value) => console.log(value)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (client) => {
    client.on('login', function (data) {
        client.uid = data.uid
        client.name = data.name
        print(`[Onjoin] >> ${client.name}<${client.uid}>`)
        client.emit('login', true)
    })

    client.on('chat', (data) => {
        var msg = {
            from: {
                name: client.name,
                uid: client.uid
            },
            content: data
        }

        print(`[Chat] ${msg.from.name}\t>> ${msg.content}`)
        client.broadcast.emit('chat', msg)
    })

    client.on('forceDisconnect', function () {
        client.disconnect();
    })

    client.on('disconnect', function () {
        console.log('[Exit] >> ' + client.name);
    })
})

server.listen(5500, () => {
    print("Server listening on localhost:5500")
})