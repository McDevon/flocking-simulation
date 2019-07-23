
class SpatialHash {

    constructor(size) {
        this.spaces = {}
        this.spaceSize = size
    }

    clear() {
        for (let spaceName in this.spaces) {
            if (this.spaces.hasOwnProperty(spaceName)) {
                this.spaces[spaceName].length = 0
            }
        }
    }

    resize(newSize) {
        this.spaceSize = newSize
        this.clear()
    }

    createSpace(spaceX, spaceY, spaceName) {
        const newSpace = []
        newSpace.neighbors = []
        this.spaces[spaceName] = newSpace
        for (let x = spaceX - 1; x <= spaceX + 1; x++) {
            for (let y = spaceY - 1; y <= spaceY + 1; y++) {
                const name = `${x},${y}`
                if (this.spaces.hasOwnProperty(name)) {
                    const space = this.spaces[name]
                    space.neighbors.push(newSpace)
                    if (space !== newSpace) {
                        newSpace.neighbors.push(space)
                    }
                }
            }
        }
    }

    registerPosition(item, position) {
        const spaceX = Math.floor(position.x / this.spaceSize)
        const spaceY = Math.floor(position.y / this.spaceSize)
        const spaceName = `${spaceX},${spaceY}`

        if (item.__space !== spaceName) {
            if (this.spaces.hasOwnProperty(item.__space)) {
                const space = this.spaces[item.__space]
                for (var i = 0; i < space.length; i++) {
                    if (space[i] === item) {
                        space.splice(i, 1);
                        break
                    }
                }
            }
            item.__space = spaceName
            if (!this.spaces.hasOwnProperty(spaceName)) {
                this.createSpace(spaceX, spaceY, spaceName)
            }
            if (!this.spaces[spaceName].includes(item)) {
                this.spaces[spaceName].push(item)
            }
        }
    }

    itemsFromAdjacentSpaces(position) {
        const spaceX = Math.floor(position.x / this.spaceSize)
        const spaceY = Math.floor(position.y / this.spaceSize)
        const spaceName = `${spaceX},${spaceY}`

        if (!this.spaces.hasOwnProperty(spaceName)) {
            return []
        }

        const space = this.spaces[spaceName]
        const items = []

        /*for (let x = 0, xlen = space.length; x < xlen; x++) {
            items.push(space[x])
        }*/
        for (let i = 0, len = space.neighbors.length; i < len; i++) {
            const neighbor = space.neighbors[i]
            for (let k = 0, klen = neighbor.length; k < klen; k++) {
                items.push(neighbor[k])
            }
        }

        return items
    }
}

export default SpatialHash