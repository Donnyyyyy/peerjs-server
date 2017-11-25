(() => {
    const BLOB_KEY = 'futurama'

    let trace = (text) => console.log('[BLOB] ' + text)

    if (localStorage.getItem(BLOB_KEY) !== null) {
        checkBlob(localStorage.getItem(BLOB_KEY), () => {
            trace('Reusing blob')
            setSource(localStorage.getItem(BLOB_KEY))
        }, () => {
            trace('Blob expired')
            localStorage.removeItem(BLOB_KEY)
            getDataBlob('futurama.mp4', (data) => {
                var blob = new Blob([data], { "type": "video\/mp4" });
                var blobLink = URL.createObjectURL(blob);
                trace('Blob (' + blob.size + ') created')
                storeData(blobLink, BLOB_KEY)
                setSource(blobLink)
            })
        })
    }
    else
        getDataBlob('futurama.mp4', (data) => {
            var blob = new Blob([data], { "type": "video\/mp4" });
            var blobLink = URL.createObjectURL(blob);
            trace('Blob (' + blob.size + ') created')
            storeData(blobLink, BLOB_KEY)
            setSource(blobLink)
        })


    function getDataBlob(src, onload) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            if (this.status == 200) {
                trace('Data recieved')
                onload(this.response)
            }
        };
        xhr.send();
    }

    function setSource(blobLink) {
        let source = document.createElement('source')
        source.src = blobLink
        source.type = 'video/mp4'
        let video = document.getElementById('video')
        video.appendChild(source)
        trace('New blob source: ' + blobLink)
    }

    function storeData(data, key) {
        localStorage.setItem(key, data)
        trace('Data stored as ' + key)
    }

    function checkBlob(src, onsuccess, onfail) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status == 200) {
                onsuccess()
            }
            else {
                onfail()
            }
        };
        xhr.send();
    }
})()