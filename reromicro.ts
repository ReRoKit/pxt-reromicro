
/**
 * rero:micro Blocks
 */
//% weight=99 color=#ff8000 icon="\uf00c" block="Rero Micro"
namespace reromicro {

    //==============================================
    //  Line Sensors
    //==============================================

    let rightLineSensor = DigitalPin.P13
    let centerLineSensor = DigitalPin.P14
    let leftLineSensor = DigitalPin.P15

    let bFlag = true
    let nTimer = 1000
    let nMaxTimer = 1000
    let nStartTime = 0
    let bPinState = 1;
    let nLineThreshold = 500

    export enum LineSensors {
        Left = 0,
        Center = 1,
        Right = 2
    }


    /**
     * This function reads a single micro:Racer's Line Sensor.
     * Returns true if line is detected on the selected sensor,
     * else returns false.
     * @param sensor position, eg: LineSensors.Center
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-detect-line-existence 
    //% block="line detected at|%sensor|sensor"
    //% blockGap=10
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=3
    //% sensor.fieldOptions.width="200"
    //% weight=82
    export function DetectLineExistence(sensor: LineSensors): boolean {

        nTimer = 1000
        let pinSensor = rightLineSensor;
        if (sensor == LineSensors.Left) {
            pinSensor = leftLineSensor;
        }
        else if (sensor == LineSensors.Center) {
            pinSensor = centerLineSensor;
        }

        // Read sensor
        bFlag = true
        nStartTime = input.runningTimeMicros()
        pins.digitalWritePin(pinSensor, 1)
        control.waitMicros(10)
        pins.setPull(pinSensor, PinPullMode.PullNone)
        while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimer) {
            bPinState = pins.digitalReadPin(pinSensor)
            if (bPinState == 0) {
                nTimer = input.runningTimeMicros() - nStartTime
                bFlag = false
            }
        }

        if (nTimer > nLineThreshold) {
            return true
        }
        return false
    }

    /**
     * This function reads a single micro:Racer's Line Sensor.
     * Returns the reflected infrared intensity value.
     * @param sensor position, eg: LineSensors.Center
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-read-ir-intensity
    //% block="read|%sensor|sensor"
    //% blockGap=10
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=3
    //% sensor.fieldOptions.width="200"
    //% weight=80
    export function ReadLineIrIntensity(sensor: LineSensors): number {

        nTimer = 1000
        let pinSensor = rightLineSensor;
        if (sensor == LineSensors.Left) {
            pinSensor = leftLineSensor;
        }
        else if (sensor == LineSensors.Center) {
            pinSensor = centerLineSensor;
        }

        // Read sensor
        bFlag = true
        nStartTime = input.runningTimeMicros()
        pins.digitalWritePin(pinSensor, 1)
        control.waitMicros(10)
        pins.setPull(pinSensor, PinPullMode.PullNone)
        while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimer) {
            bPinState = pins.digitalReadPin(pinSensor)
            if (bPinState == 0) {
                nTimer = input.runningTimeMicros() - nStartTime
                bFlag = false
            }
        }

        return nTimer
    }





    //==============================================
    //  Ultrasonic Sensor (Analog output)
    //==============================================

    /**
     * Read distance (cm) using ultrasonic sensor.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-read-ultrasonic block="ultrasonic distance(cm)"
    //% blockGap=10
    //% weight=70
    export function ReadUltrasonic(): number {

        let raw = pins.analogReadPin(AnalogPin.P2)

        return Math.abs(raw / 10)
    }





    //==============================================
    //  Motors
    //==============================================

    export enum SelectMotors {
        //% block="Left Motor"
        Left = 0,
        //% block="Right Motor"
        Right = 1,
        //% block="Both Motors"
        Both = 2
    }

    /**
     * Move Forward.
     * Speed = 0 - 100
     * @param speed to move forward, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-move-forward 
    //% block="move forward at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=99
    export function MoveForward(speed: number): void {
        speed = Math.clamp(0, 100, speed);
        let nLeftSpeed = (100 - speed) * 1023 / 200
        let nRightSpeed = (100 + speed) * 1023 / 200

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        pins.analogSetPeriod(AnalogPin.P8, 50)
        pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Move Backward.
     * Speed = 0 - 100
     * @param speed to move backward, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-move-backward 
    //% block="move backward at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=98
    export function MoveBackward(speed: number): void {
        speed = Math.clamp(0, 100, speed);
        let nLeftSpeed = (100 + speed) * 1023 / 200
        let nRightSpeed = (100 - speed) * 1023 / 200

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        pins.analogSetPeriod(AnalogPin.P8, 50)
        pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Turn to the Left.
     * Speed = 0 - 100
     * @param speed to turn to the left, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-turn-left 
    //% block="turn left at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=97
    export function TurnLeft(speed: number): void {
        speed = Math.clamp(0, 100, speed);
        let nLeftSpeed = (100 + speed) * 1023 / 200
        let nRightSpeed = (100 + speed) * 1023 / 200

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        pins.analogSetPeriod(AnalogPin.P8, 50)
        pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Turn to the Right.
     * Speed = 0 - 100
     * @param speed to turn to the right, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-turn-right 
    //% block="turn right at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=96
    export function TurnRight(speed: number): void {
        speed = Math.clamp(0, 100, speed);
        let nLeftSpeed = (100 - speed) * 1023 / 200
        let nRightSpeed = (100 - speed) * 1023 / 200

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        pins.analogSetPeriod(AnalogPin.P8, 50)
        pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Brake Both Motors.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-brake block="brake"
    //% blockGap=10
    //% weight=95
    export function Brake(): void {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.analogWritePin(AnalogPin.P8, 511)
        pins.analogWritePin(AnalogPin.P16, 511)
    }

    /**
     * Run Motor(s) at selected speed.
     * Speed = -100 (reverse) to 100 (forward)
     * @param motor selected motor, eg: Motors.Left
     * @param speed selected speed, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-run-motor
    //% block="run|%motor| at|%speed|"
    //% speed.min=-100 speed.max=100
    //% blockGap=10
    //% weight=90
    export function RunMotor(motor: SelectMotors, speed: number): void {
        if (motor == 0) {
            let nLeftSpeed = (100 - speed) * 1023 / 200
            nLeftSpeed = Math.clamp(0, 1023, nLeftSpeed);

            pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
            pins.analogSetPeriod(AnalogPin.P8, 50)
            pins.digitalWritePin(DigitalPin.P12, 1)
        }
        else if (motor == 1) {
            let nRightSpeed = (100 + speed) * 1023 / 200
            nRightSpeed = Math.clamp(0, 1023, nRightSpeed);

            pins.analogWritePin(AnalogPin.P16, nRightSpeed)
            pins.analogSetPeriod(AnalogPin.P16, 50)
            pins.digitalWritePin(DigitalPin.P12, 1)
        }
        else {
            let nLeftSpeed = (100 - speed) * 1023 / 200
            nLeftSpeed = Math.clamp(0, 1023, nLeftSpeed);
            let nRightSpeed = (100 + speed) * 1023 / 200
            nRightSpeed = Math.clamp(0, 1023, nRightSpeed);

            pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
            pins.analogWritePin(AnalogPin.P16, nRightSpeed)
            pins.analogSetPeriod(AnalogPin.P8, 50)
            pins.analogSetPeriod(AnalogPin.P16, 50)
            pins.digitalWritePin(DigitalPin.P12, 1)
        }
    }




    //==============================================
    //  Neopixel RGB LEDs (WS2812B)
    //==============================================

    let RgbLeds: neopixel.Strip;

    /**
     * Initialize Neopixel RGB LEDs on rero:micro.
     * Set brightness to 150 (range: 0-255).
     */
    //% subcategory=LEDs
    //% blockId=rero-micro-init-rgb-leds
    //% block="initialize RGB LEDs"
    //% blockGap=10
    //% weight=99
    export function InitRgbLeds(): void {

        if (!RgbLeds) {
            RgbLeds = neopixel.create(DigitalPin.P0, 6, NeoPixelMode.RGB)
            RgbLeds.setBrightness(150)
        }
    }


    /**
     * Show Rainbow Colors
     */
    //% subcategory=LEDs
    //% blockId=rero-micro-show-rainbow
    //% block="show rainbow"
    //% blockGap=10
    //% weight=90
    export function ShowRainbow(): void {

        RgbLeds.showRainbow(15, 300)
        RgbLeds.show()
    }


    /**
     * Expose Initialized RGB LEDs Object
     */
    //% subcategory=LEDs
    //% blockId=rero-micro-rgb-leds
    //% block="rero:micro's RGB LEDs"
    //% blockGap=10
    //% weight=80
    export function reroRgbLeds(): neopixel.Strip {

        return RgbLeds
    }




}
