const vendorCheck = () => {
    const vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
}

const startRender = (canvas, item) => {
    if (typeof (canvas.getContext) === undefined) {
        return
    }

    vendorCheck()

    let cx = canvas.getContext('2d'),
        lastTime = (new Date()).getTime(),
        currentTime = 0,
        dt = 0,
        fixedDeltaCounter = 0,
        fixedCount = 0
    
    const maxLoops = 1,
        fixedDelta = 1.0/60
    
    canvas.simulation = item
    item.init(canvas)

    const simulationLoop = () => {
        window.requestAnimationFrame(simulationLoop)

        currentTime = (new Date()).getTime()
        dt = Math.min((currentTime - lastTime) / 1000, 0.03)

        fixedDeltaCounter += dt		
        fixedCount = 0
		
		if (fixedDeltaCounter < fixedDelta) {
			fixedDeltaCounter = fixedDelta
		}
		
		while (fixedDeltaCounter >= fixedDelta && fixedCount < maxLoops) {
			item.fixedUpdate(fixedDelta)
			fixedDeltaCounter -= fixedDelta
			fixedCount++
		}
		
		if (fixedCount >= maxLoops) {
			fixedDeltaCounter = 0
		}

        item.update(dt)

        item.render(cx)

        lastTime = currentTime
    }

    simulationLoop()
}

export default startRender