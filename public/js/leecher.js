(() => {
    let trace = (text) => console.log('[LEECHER] ' + text)

    var peer = new Peer({ host: '/', path: 'api' })
    var seederId = undefined

    peer.on('open', (id) => {
        trace('My leecher ID is: ' + id)
        document.querySelector('.id-holder').textContent = 'My peer id is: ' + id
        askForFile()
    })

    peer.on('error', (err) => {
        trace(err)
    })

    window.requestData = () => {
        if (!peer.disconnected) {
            trace('Requesting ' + seederId)
            let connection = peer.connect(seederId)
            connection.on('open', function () {
                connection.on('data', function (data) {
                    trace('Received:' + data)
                    console.log(data)
                    let blob = new Blob([data.data], { "type": "video\/mp4" })
                    var blobLink = URL.createObjectURL(blob)
                    setSource(blobLink)
                    
                })
                connection.send({ key: 'futurama' })
                trace('Connection opened')
            })
        }
        else {
            trace('Peer is not conected')
        }
    }

    function setSource(blobLink) {
        let source = document.createElement('source')
        source.src = blobLink
        source.type = 'video/mp4'
        let video = document.getElementById('video')
        video.appendChild(source)
        trace('New blob source: ' + blobLink)
    }

    function askForFile() {
        var http = new XMLHttpRequest()
        var url = "/getseeder/"
        var params = JSON.stringify({
            filename: 'futurama',
        })
        http.open("POST", url, true)
        http.setRequestHeader("Content-type", "application/json")

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                document.querySelector('.seeder-id-holder').textContent = 'Seeder id is: ' + http.responseText
                seederId = http.responseText
            }
        }
        http.send(params)
    }
})()

function requestFileSeeder(filename) {

}

function sendData(data, onload) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', src, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function (e) {
        if (this.status == 200) {
            trace('Data recieved')
            onload(this.response)
        }
    }
    xhr.send()
}