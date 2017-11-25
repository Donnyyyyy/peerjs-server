(() => {
    let trace = (text) => console.log('[LEECHER] ' + text)
    let idInput = document.getElementById('seeder-id')

    var peer = new Peer({ host: '/', path: 'api' });

    peer.on('open', (id) => {
        trace('My leecher ID is: ' + id);
    });

    peer.on('error', (err) => {
        trace(err);
    });

    window.requestData = () => {
        if (!peer.disconnected) {
            trace('Requesting ' + idInput.value)
            let connection = peer.connect(idInput.value);
            connection.on('open', function () {
                connection.on('data', function (data) {
                    trace('Received:' + data);
                    console.log(data)
                    let blob = new Blob([data.data], { "type": "video\/mp4" });
                    var blobLink = URL.createObjectURL(blob);
                    setSource(blobLink)

                });
                connection.send({ key: 'futurama' });
            });
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
})()