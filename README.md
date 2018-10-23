# rero:micro Package for Microsoft MakeCode

This MakeCode package/extension/library provides driver for rero:micro educational robot (product page URL to be added).

![rero:micro](https://raw.githubusercontent.com/rerokit/pxt-reromicro/master/icon.png)  


## Colour Splash!

### ~ hint
This robot also has 7x NeoPixels (programmable RGB LEDs) built-in. See [Microsoft/pxt-neopixel](https://makecode.microbit.org/pkg/microsoft/pxt-neopixel) for NeoPixels support. 
### ~

```blocks
// Create a NeoPixel strip at pin P1 with 7 LEDs and either standard RGB format.
strip = neopixel.create(DigitalPin.P1, 7, NeoPixelMode.RGB)

// Reduce the brightness to 50.
strip.setBrightness(50)

// Show red colour for 1 sec.
strip.showColor(neopixel.colors(NeoPixelColors.Red))
basic.pause(1000)

// Show blue colour for 1 sec.
strip.showColor(neopixel.colors(NeoPixelColors.Blue))
basic.pause(1000)

// Show rainbow colours
strip.showRainbow(1, 310)
```


## Let's move it, move it~

```blocks
// Play melody once at program start-up
music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)

// rero:micro move forward at speed 50 (range: 0 - 100), for 1 second
reromicro.MoveForward(50)
basic.pause(1000)

// rero:micro turn left at speed 30 (range: 0 - 100), for 500 miliseconds
reromicro.TurnLeft(30)
basic.pause(500)

// rero:micro brakes
reromicro.Brake()
```

* Use ``||RunMotor||`` to control the motors individually. Negative speed reverses the robot (eg: ``-50``), positive speed runs it forward (eg: ``80``) and set to zero (``0``) to brake. Note that the direction refers to robot's movement, NOT each motor's rotating direction (clockwise/counter-clockwise).

* rero:micro's built-in piezo buzzer also works with the default ``||Music||`` blocks comes with MakeCode.


## Sensing obstacle

```blocks
// Forever loop
basic.forever(function () {

    // Brake rero:micro when obstacle is detected at 15cm away or nearer.
    // Otherwise, keep moving forward at speed 50.
    if (reromicro.ReadUltrasonic() < 15) {
        reromicro.Brake()

    } else {
        reromicro.MoveForward(50)
    }
}
```


## Line tracking

```blocks
// Forever loop
basic.forever(function () {

    // read all three line sensors first
    reromicro.ReadLineSensors()

    // Move forward if only center sensor detects line.
    // Turn right if only right sensor detects line.
    // Turn left if only left sensor detects line.
    // Note: This simple program ignores all other possible conditions.
    if (reromicro.LineSensorDetectsLine(LineSensors.Center)) {
        reromicro.MoveForward(50)

    } else if (reromicro.LineSensorDetectsLine(LineSensors.Right)) {
        reromicro.TurnRight(40)

    } else if (reromicro.LineSensorDetectsLine(LineSensors.Left)) {
        reromicro.TurnLeft(40)
    }
}
```

* Use ``||LineSensorDetectsLine||`` to get the boolean value of line detection. Returns ``true`` when line is detected, otherwise ``false``.

* Use ``||LineIrIntensity||`` to get the reflected infrared (IR) intensity value, ranging from ``0`` to ``1000``.

### ~ hint
``||ReadLineSensors()||`` function must be called to read all three line sensors first before using ``||lineSensorDetectsLine||`` and/or ``||LineIrIntensity||`` to get the result.
### ~


## License

MIT

## Supported targets

* for PXT/microbit

```package
reromicro=github:ReRoKit/pxt-reromicro
```
