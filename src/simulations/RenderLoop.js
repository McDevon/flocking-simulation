const vendorCheck = () => {
    const vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
}

const startRender = (canvas, items = []) => {
    if (typeof (canvas.getContext) === undefined) {
        return
    }

    vendorCheck()

    let cx = canvas.getContext('2d'),
        cw = canvas.width,
        ch = canvas.height,
        lastTime = (new Date()).getTime(),
        currentTime = 0,
        dt = 0
    
    items.forEach(it => it.init(canvas))

    const simulationLoop = () => {
        window.requestAnimationFrame(simulationLoop);

        currentTime = (new Date()).getTime();
        dt = Math.min((currentTime - lastTime) / 1000, 0.03);

        cx.clearRect(0, 0, cw, ch);

        items.forEach(it => it.update(dt, cx))

        lastTime = currentTime
    }

    simulationLoop()
}

export default startRender