
const container = document.querySelector('.container')
const colorPick = document.querySelector('#color-pick')

const compBtn = document.querySelector('.comp')
const analBtn = document.querySelector('.anal')
const triBtn = document.querySelector('.tri')
const tetBtn = document.querySelector('.tet')
const monoBtn = document.querySelector('.mono')
const startingColor = document.querySelector('.starting-color')

const valuesContainer = document.querySelector('.values-container')
const hsl = document.querySelector('.hsl')
const hex = document.querySelector('.hex')
const rgb = document.querySelector('.rgb')


// color picker
let colorHue = Number(colorPick.value)
colorPick.addEventListener('mouseup', () => {
    colorHue = Number(colorPick.value)
    startingColor.style.backgroundColor = `hsl(${colorHue},100%,50%)`
    console.log({ colorHue })
})


function getComplimentary(hue) {
    return [`hsl(${hue < 180 ? hue + 180 : hue - 180},100%,50%)`]
}

function getAnalogous(hue) {
    return [
        `hsl(${hue > 329 ? hue - 330 : hue + 30},100%,50%)`,
        // `hsl(${hue},100%,50%)`,
        `hsl(${hue < 30 ? hue + 330 : hue - 30},100%,50%)`
    ]
}

function getTriadic(hue) {
    return [
        // `hsl(${hue},100%,50%)`,
        `hsl(${hue > 239 ? hue - 240 : hue + 120},100%,50%)`,
        `hsl(${hue < 120 ? hue + 340 : hue - 120},100%,50%)`
    ]
}

function getTetradic(hue) {
    return [
        // `hsl(${hue},100%,50%)`,
        `hsl(${hue > 269 ? hue - 270 : hue + 90},100%,50%)`,
        `hsl(${hue > 179 ? hue - 180 : hue + 180},100%,50%)`,
        `hsl(${hue > 90 ? hue - 90 : hue + 270},100%,50%)`
    ]
}

function getMonochromatic(hue) {
    return [
        `hsl(${hue},25%,25%)`,
        `hsl(${hue},50%,50%)`,
        `hsl(${hue},75%,75%)`
    ]
}

function display(colors) {
    console.log(colors)
    let widthPcent = 100 / colors.length
    for (let color of colors) {
        console.log(color)
        let divvy = document.createElement('div')
        divvy.classList.add('box')
        divvy.style.width = `${widthPcent}%`
        divvy.style.backgroundColor = color
        divvy.dataset.dataColor = color
        divvy.innerHTML = `
        <button class="box-option save">Save</button>
        <span> ${color} </span>
        <button class="box-option delete">delete</button>
        `

        divvy.addEventListener('mouseover', (e) => {
            // for each child node of the div in the event
            for (let child of e.target.children) {
                child.style.opacity = '1'
            }

            divvy.addEventListener('mouseleave', (e) => {
                for (let child of e.target.children) {
                    child.style.opacity = '0'
                }
            })
        })

        divvy.addEventListener('click', (e) => [
            console.log(e.target.dataset.dataColor)
        ])
        container.appendChild(divvy)

    }
    let boxOptions = document.querySelectorAll('.box-option')  // this has to be after the node is appended
    console.log(boxOptions)
}

// button event listeners

compBtn.addEventListener('click', () => {
    display(getComplimentary(colorHue))
})
analBtn.addEventListener('click', () => {
    display(getAnalogous(colorHue))
})

triBtn.addEventListener('click', () => {
    display(getTriadic(colorHue))
})
tetBtn.addEventListener('click', () => {
    display(getTetradic(colorHue))
})
monoBtn.addEventListener('click', () => {
    display(getMonochromatic(colorHue))
})

hsl.innerText = `hsl(${colorPick.value},50%,50%)`
hex.innerText = hslToHex(colorPick.value, 50, 50)
rgb.innerText = `rgb(${hslToRGB(colorPick.value, 50, 50)})`

setInterval(() => {
    hsl.innerText = `hsl(${colorPick.value},50%,50%)`
}, 100)

setInterval(() => {
    hex.innerText = hslToHex(colorPick.value, 50, 50)
}, 100)

setInterval(() => {
    rgb.innerText = `rgb(${hslToRGB(colorPick.value, 50, 50)})`
}, 100)

//  TODO - make readings pasteboard clickable
const readingsArray = Array.from(valuesContainer.children)
console.log({ readingsArray })
for (let reading of readingsArray) {
    console.dir(reading.textContent)
    let text = reading.childNodes[0].data

    reading.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(text);
            console.log(`Content ${text} copied to clipboard`);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    })
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hslToRGB(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    result = [255 * f(0), 255 * f(8), 255 * f(4)];
    return result.map(x => x.toFixed(1))
};

