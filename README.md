# rero:micro Extension for Microsoft MakeCode

This MakeCode package/extension/library provides driver for rero:micro educational robot (https://www.cytron.io/micro:bit/p-reromicro).

![rero:micro](https://raw.githubusercontent.com/rerokit/pxt-reromicro/master/icon.png)  



## Let's make some noise!

* rero:micro's built-in piezo buzzer works with the default ``||Music||`` blocks that come with MakeCode.

```blocks
// Play melody once at program start-up
music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
```



## Let's move it, move it~

* Use ``||move forward at (speed)||``, ``||move backward at (speed)||``, ``||turn left at (speed)||`` and ``||turn right at (speed)||`` to navigate rero:micro. The value for speed is between 0 and 100.

* Use ``||brake||`` to brake rero:micro.

* Use ``||run (motor) at (speed)||`` to control the each motor individually. Negative speed (-100 to -1) reverses the robot (eg: ``-50``), positive speed (1 to 100) moves it forward (eg: ``80``) and zero speed (``0``) brakes the motor. Note that the direction refers to rero:micro's movement, NOT motor's rotating direction.

```blocks
// rero:micro move forward at speed 50, for 1 second
reromicro.MoveForward(50)
basic.pause(1000)

// rero:micro turn left at speed 30, for 500 miliseconds
reromicro.TurnLeft(30)
basic.pause(500)

// rero:micro brakes
reromicro.Brake()
```



## Sensing obstacle

* ``||ultrasonic distance(cm)||`` returns the distance in centimeter between ultrasonic sensor and any obstacle in front of it.

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
})
```



## Line tracking

### ~ hint
``||read line sensors||`` function must be called to read all three line sensors first before using ``||(x) sensor detects line||`` and/or ``||(x) line sensor IR intensity||`` to get the result.
### ~

* Use ``||(x) sensor detects line||`` to get the boolean value of line detection. Returns ``true`` when line is detected, otherwise ``false``.

* Use ``||(x) line sensor IR intensity||`` to get the reflected infrared (IR) intensity value, ranging from ``0`` to ``1000``.

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
})
```



## Colour Splash!

* This robot also has 7x NeoPixels (WS2812B programmable RGB LEDs) built-in. 

### ~ hint
See [Microsoft/pxt-neopixel](https://makecode.microbit.org/pkg/microsoft/pxt-neopixel) for NeoPixels support. 
### ~

```blocks
// Create a NeoPixel strip at pin P1 with 7 LEDs and either standard RGB format.
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P1, 7, NeoPixelMode.RGB)

// Reduce the brightness to 50.
strip.setBrightness(50)

// Show red colour for 1 sec.
strip.showColor(neopixel.colors(NeoPixelColors.Red))
basic.pause(1000)

// Show blue colour for 1 sec.
strip.showColor(neopixel.colors(NeoPixelColors.Blue))
basic.pause(1000)

// Show rainbow colours.
strip.showRainbow(1, 310)
```



## License

MIT

## Supported targets

* for PXT/microbit

```package
reromicro=github:ReRoKit/pxt-reromicro
```
