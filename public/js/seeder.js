(() => {
    let trace = (text) => console.log('[SEEDER] ' + text)

    var peer = new Peer({ host: '/', path: 'api' });

    peer.on('open', (id) => {
        trace('My seeder ID is: ' + id);
    });

    peer.on('error', (err) => {
        trace(err);
    });

    peer.on('connection', (connection) => {
        connection.on('data', (data) => {
            console.log('Received: ' + data);
            sendBack(data.key, connection)
        });
    });

    function sendBack(blobKey, connection) {
        let blobLink = localStorage.getItem(blobKey)

        if (!blobLink) {
            trace('No such blob!')
        }
        else {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', blobLink, true);
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                if (this.status == 200) {
                    trace('Sending blob back...')
                    connection.send({ data: new Blob([this.response]) })
                }
                else {
                    trace('Blob expired')
                }
            };
            xhr.send();
        }
    }
})()