let list: number[] = []
let bMode = false
input.onButtonPressed(Button.A, function () {
    bMode = true
    basic.showLeds(`
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        `)
})
input.onButtonPressed(Button.B, function () {
    bMode = false
    basic.clearScreen()
})
basic.showIcon(IconNames.Heart)
music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
basic.pause(3000)
bMode = true
basic.forever(function () {
    reromicro.ReadLineSensors()
    if (bMode == true) {
        if (reromicro.ReadUltrasonic() < 15) {
            reromicro.Brake()
        } else {
            if (reromicro.LineSensorDetectsLine(LineSensors.Right) && reromicro.LineSensorDetectsLine(LineSensors.Center)) {
                reromicro.RunMotor(Motors.Left, 30)
                reromicro.RunMotor(Motors.Right, 15)
            } else if (reromicro.LineSensorDetectsLine(LineSensors.Left) && reromicro.LineSensorDetectsLine(LineSensors.Center)) {
                reromicro.RunMotor(Motors.Left, 15)
                reromicro.RunMotor(Motors.Right, 30)
            } else if (reromicro.LineSensorDetectsLine(LineSensors.Center)) {
                reromicro.MoveForward(30)
            } else if (reromicro.LineSensorDetectsLine(LineSensors.Right)) {
                reromicro.RunMotor(Motors.Left, 30)
                reromicro.RunMotor(Motors.Right, 0)
            } else if (reromicro.LineSensorDetectsLine(LineSensors.Left)) {
                reromicro.RunMotor(Motors.Left, 0)
                reromicro.RunMotor(Motors.Right, 30)
            }
        }
    } else {
        list = [reromicro.LineIrIntensity(LineSensors.Right), reromicro.LineIrIntensity(LineSensors.Center), reromicro.LineIrIntensity(LineSensors.Left), reromicro.ReadUltrasonic()]
        serial.writeNumbers(list)
        serial.writeString("")
    }
})
