(() => {
    let trace = (text) => console.log('[SEEDER] ' + text)

    var peer = new Peer({ host: '/', path: 'api' })
    var peerid = undefined

    peer.on('open', (id) => {
        trace('My seeder ID is: ' + id)
        peerid = id
        document.querySelector('.id-holder').textContent = 'My peer id is: ' + id
    })

    peer.on('error', (err) => {
        trace(err)
    })

    peer.on('connection', (connection) => {
        connection.on('open', () => {
            connection.on('data', (data) => {
                trace('Received: ' + data)
                sendBack(data.key, connection)
            })
            connection.on('close', () => {
                trace('Connection closed')
            })
            connection.on('error', () => {
                trace('Connection error')
            })
            trace('Connection opened')
        })
        trace('New connection')
    })

    function sendBack(blobKey, connection) {
        let blobLink = localStorage.getItem(blobKey)

        if (!blobLink) {
            trace('No such blob!')
        }
        else {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', blobLink, true)
            xhr.responseType = 'blob'
            xhr.onload = function (e) {
                if (this.status == 200) {
                    trace('Sending blob back...')
                    connection.send({ data: new Blob([this.response]) })
                }
                else {
                    trace('Blob expired')
                }
            }
            xhr.send()
        }
    }

    window.fileStoredMessage = filename => {
        var http = new XMLHttpRequest()
        var url = "/stored/"
        var params = JSON.stringify({
            filename: filename,
            peerid: peerid
        })
        http.open("POST", url, true)
        http.setRequestHeader("Content-type", "application/json")

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                trace(http.responseText)
            }
        }
        http.send(params)
    }
})()


function storeFile(filename, data) {
    localStorage.setItem(filename, data)
}
