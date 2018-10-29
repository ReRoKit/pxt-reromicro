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
bMode = true
basic.forever(function () {
    reromicro.ReadLineSensors()
    if (bMode == true) {
        if (reromicro.ReadUltrasonic() < 15) {
            reromicro.Brake()
        } else {
            if (reromicro.LineSensorDetectsLine(LineSensors.Center)) {
                reromicro.MoveForward(50)
            } else if (reromicro.LineSensorDetectsLine(LineSensors.Right)) {
                reromicro.RunMotor(Motors.Left, 50)
                reromicro.RunMotor(Motors.Right, 0)
            } else if (reromicro.LineSensorDetectsLine(LineSensors.Left)) {
                reromicro.RunMotor(Motors.Left, 0)
                reromicro.RunMotor(Motors.Right, 50)
            }
        }
    } else {
        list = [reromicro.LineIrIntensity(LineSensors.Right), reromicro.LineIrIntensity(LineSensors.Center), reromicro.LineIrIntensity(LineSensors.Left), reromicro.ReadUltrasonic()]
        serial.writeNumbers(list)
        serial.writeString("")
    }
})
