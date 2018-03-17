(() => {
    //создание словаря 
    let trace = (text) => console.log('[SEEDER] ' + text)
    //создание нового пира, в данном случае сидера
    var peer = new Peer({ host: '/', path: 'api' })
    //создание переменной для id
    var peerid = undefined
    //'включение' сидера, присвоение ему id
    peer.on('open', (id) => {
        //написание в консоли id
        trace('My seeder ID is: ' + id)
        peerid = id
        document.querySelector('.id-holder').textContent = 'My peer id is: ' + id
    })
    //в случае ошибки эта функция перенаправляет ошибки
    peer.on('error', (err) => {
        //написать в консоль
        trace(err)
    })
    //запускается когда новое соединение для передачи данных устанавливается с удаленного узла
    peer.on('connection', (connection) => {
        
        connection.on('open', () => {

            connection.on('data', (data) => {
                //написать в консоль
                trace('Received: ' + data)
                //включение функции sendBack
                sendBack(data.key, connection)
            })
            //Когда соединение закрывается, написать это в консоль
            connection.on('close', () => {
                //написать в консоль
                trace('Connection closed')
            })
            //Если соединения нет, написать это в консоль
            connection.on('error', () => {
                //написать в консоль
                trace('Connection error')
            })
            //Написать это в консоль
            trace('Connection opened')
        })
        //Написать это в консоль
        trace('New connection')
    })
    //функция sendBack 
    function sendBack(blobKey, connection) {
        //создание словаря blobLink
        let blobLink = localStorage.getItem(blobKey)

        if (!blobLink) {
            //написать в консоль
            trace('No such blob!')
        }
        else {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', blobLink, true)
            xhr.responseType = 'blob'
            xhr.onload = function (e) {
                if (this.status == 200) {
                    //написать в консоль
                    trace('Sending blob back...')
                    connection.send({ data: new Blob([this.response]) })
                }
                else {
                    //написать в консоль
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
                //написать в консоль
                trace(http.responseText)
            }
        }
        http.send(params)
    }
})()

//функция запоминания местоположения файла
function storeFile(filename, data) {
    localStorage.setItem(filename, data)
}
