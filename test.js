const A_COEFF = 1
const B_COEFF = 2

function filldata() {
    let data = []
    for (let i = 0; i < 100; i++) {
        data.push({
            a: Math.random(),
            b: Math.random()
        })
    }

    return data;
}

function filterSomehow(data) {
    data.sort(
        function (a, b) {
            if (a < b) {
                return -1
            }
            if (b > a) {
                return 1
            }
            return 0
        }
    )
}


let data = filldata()

let filteredData = filterSomehow(data)

console.log(data)