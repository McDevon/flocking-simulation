import * as Vec2D from 'vector2d'

Vec2D.Vector.prototype.rotate = function (angle) {
    const x = this._x, y = this._y
    this._x = x * Math.cos(angle) - y * Math.sin(angle)
    this._y = x * Math.sin(angle) + y * Math.cos(angle)
    return this
}

Vec2D.Vector.prototype.rotateTrig = function (sinAngle, cosAngle) {
    const x = this._x, y = this._y
    this._x = x * cosAngle - y * sinAngle
    this._y = x * sinAngle + y * cosAngle
    return this
}

Vec2D.Vector.prototype.angle = function () {
    return Math.atan2(this._y, this._x)
}

Vec2D.Vector.prototype.clampSq = function (maxLength, maxLengthSq) {
    if (this.lengthSq() > maxLengthSq) {
        this.unit().multiplyByScalar(maxLength)
    }
    return this
}
