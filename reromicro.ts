enum LineSensors {
    //% block=left
    Left = 0,
    //% block=center
    Center = 1,
    //% block=right
    Right = 2
}

enum Motors {
    //% block="left motor"
    Left = 0,
    //% block="right motor"
    Right = 1,
    //% block="both motors"
    Both = 2
}


/**
 * rero:micro Blocks
 */
//% weight=99 color=#ff8000 icon="\uf121" block="rero:micro"
namespace reromicro {

    //==============================================
    //  Ultrasonic Sensor (HC-SR04)
    //==============================================
    let trig = DigitalPin.P2
    let echo = DigitalPin.P2
    let maxCmDistance = 255

    /**
     * Read distance in centimeters (cm) with ultrasonic sensor.
     * Distance = 3cm - 255cm.
     * Note: It returns '255' if distance >255cm or no echo is detected.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-read-ultrasonic block="ultrasonic distance(cm)"
    //% blockGap=30
    //% weight=90
    export function ReadUltrasonic(): number {

        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 38);

        if (d == 0) {
            return 255
        }

        return Math.idiv(d, 38) // tuned for microbit to get the right value in cm
    }


    //==============================================
    //  I2C EEPROM
    //==============================================
    const AT24_I2C_ADDR = 80;
    const lineEepromAddress = 100

    /**
     * read 32-bit data from address
     * @param addr eeprom address, eg: 4
     */
    function EE_Read32bit(addr: number): number {
        pins.i2cWriteNumber(AT24_I2C_ADDR, addr, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(AT24_I2C_ADDR, NumberFormat.UInt32BE);
    }


    //==============================================
    //  Line Sensors
    //==============================================
    let rightLineSensor = DigitalPin.P13
    let centerLineSensor = DigitalPin.P14
    let leftLineSensor = DigitalPin.P15
    // X[left, center, right]
    let lineSensorPins = [leftLineSensor, centerLineSensor, rightLineSensor]
    let lineSensorMax = [1500, 1500, 1500]
    let lineSensorMin = [0, 0, 0]
    let lineSensorValues = [0, 0, 0]
    let lineSensorThreshold = [580, 580, 580]
    
    // read line sensors max & min values from EEPROM
    let ui32EeData = 0
    ui32EeData = EE_Read32bit(lineEepromAddress)
    // verify magic number 'rero'
    if (ui32EeData == 1919251055) {
        for (let i = 0; i < 3; i++) {
            ui32EeData = EE_Read32bit(lineEepromAddress + 4 + (i * 4))
            lineSensorMax[i] = ui32EeData >> 16
            lineSensorMin[i] = ui32EeData & 0xFFFF
            lineSensorThreshold[i] = ((lineSensorMax[i] + lineSensorMin[i]) >> 1) - ((lineSensorMax[i] - lineSensorMin[i]) >> 2)
        }
    }
    // debug
    // for (let i = 0; i < 3; i++) {
    //     serial.writeString("Max:")
    //     serial.writeNumber(lineSensorMax[i])
    //     serial.writeString(" Min:")
    //     serial.writeNumber(lineSensorMin[i])
    //     serial.writeString(" Thres:")
    //     serial.writeNumber(lineSensorThreshold[i])
    //     serial.writeLine("")
    // }


    /**
     * Read line sensors.
     * This function reads all three IR pairs (line sensors) and stores the values in variables.
     * Retrieve these values using "X sensor detects line" and/or "X line sensor IR intensity" blocks.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-readsensors
    //% block="read line sensors"
    //% blockGap=10
    //% weight=85
    export function ReadLineSensors(): void {

        let bFlag = true
        let nTimer = 1500
        let nMaxTimer = 1500
        let nStartTime = 0
        let bPinState = 1

        // Read sensors
        for (let i = 0; i < 3; i++) {
            nTimer = 1500
            bFlag = true
            if (input.runningTimeMicros() >= 62536) {
                control.waitMicros(3000)
            }
            nStartTime = input.runningTimeMicros()
            pins.digitalWritePin(lineSensorPins[i], 1)
            control.waitMicros(10)
            pins.setPull(lineSensorPins[i], PinPullMode.PullNone)
            while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimer) {
                bPinState = pins.digitalReadPin(lineSensorPins[i])
                if (bPinState == 0) {
                    nTimer = input.runningTimeMicros() - nStartTime
                    bFlag = false
                }
            }
            lineSensorValues[i] = Math.clamp(0, 1500, nTimer)
        }
    }

    /**
     * ! Use "read line sensors" function first before this.
     * This function returns ''true'' if the sensor detects dark line, otherwise ''false''
     * @param sensor position, eg: LineSensors.center
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-sensordetectsline
    //% block="|%sensor|sensor detects line"
    //% blockGap=10
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=3
    //% sensor.fieldOptions.width="200"
    //% weight=84
    export function LineSensorDetectsLine(sensor: LineSensors): boolean {

        return ((lineSensorValues[sensor] > lineSensorThreshold[sensor]) ? true : false)
    }

    /**
     * ! Use "read line sensors" function first before this.
     * This function returns a single sensor's reflected infrared intensity value,
     * between 0 and 1500.
     * @param sensor position, eg: LineSensors.Left
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-irintensity
    //% block="|%sensor|line sensor IR intensity"
    //% blockGap=20
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=3
    //% sensor.fieldOptions.width="200"
    //% weight=83
    export function LineIrIntensity(sensor: LineSensors): number {

        return lineSensorValues[sensor]
    }

    /**
     * Only use this function once in "on start" if your robot doesn't detect the line properly.
     * This function sets the threshold value for each IR pair to determine white and black surfaces.
     * @param leftThreshold value, eg: 580
     * @param centerThreshold value, eg: 580
     * @param rightThreshold value, eg: 580
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-adjustthresholds
    //% block="calibrate line sensors: left|%leftThreshold| center|%centerThreshold| right|%rightThreshold|"
    //% leftThreshold.min=200 leftThreshold.max=1200
    //% centerThreshold.min=200 centerThreshold.max=1200
    //% rightThreshold.min=200 rightThreshold.max=1200
    //% blockGap=20
    //% weight=80
    export function LineAdjustThresholds(leftThreshold: number, centerThreshold: number, rightThreshold: number): void {

        lineSensorThreshold[0] = leftThreshold
        lineSensorThreshold[1] = centerThreshold
        lineSensorThreshold[2] = rightThreshold
    }




    //==============================================
    //  Motors
    //==============================================

    // Initialization
    // Set PWM frequency to 10kHz.
    // Note: If set to 20kHz, PWM duty cycle may be inverted in certain condition.
    Brake()
    pins.analogSetPeriod(AnalogPin.P8, 100)
    pins.analogSetPeriod(AnalogPin.P16, 100)


    /**
     * Move Forward.
     * Speed = 0 - 100
     * @param speed selected speed, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-move-forward 
    //% block="move forward at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=99
    export function MoveForward(speed: number): void {
        speed = Math.clamp(0, 100, speed)
        speed = 511 + speed * 512 / 100

        pins.analogWritePin(AnalogPin.P8, speed)
        pins.analogWritePin(AnalogPin.P16, speed)
        // pins.analogSetPeriod(AnalogPin.P8, 50)
        // pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Move Backward.
     * Speed = 0 - 100
     * @param speed selected speed, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-move-backward 
    //% block="move backward at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=98
    export function MoveBackward(speed: number): void {
        speed = Math.clamp(0, 100, speed)
        speed = 512 - speed * 512 / 100

        pins.analogWritePin(AnalogPin.P8, speed)
        pins.analogWritePin(AnalogPin.P16, speed)
        // pins.analogSetPeriod(AnalogPin.P8, 50)
        // pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Turn to the Left.
     * Speed = 0 - 100
     * @param speed selected speed, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-turn-left 
    //% block="turn left at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=97
    export function TurnLeft(speed: number): void {
        speed = Math.clamp(0, 100, speed)
        let nLeftSpeed = 512 - speed * 512 / 100
        let nRightSpeed = 511 + speed * 512 / 100

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        // pins.analogSetPeriod(AnalogPin.P8, 50)
        // pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Turn to the Right.
     * Speed = 0 - 100
     * @param speed selected speed, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-turn-right 
    //% block="turn right at|%speed|"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=96
    export function TurnRight(speed: number): void {
        speed = Math.clamp(0, 100, speed)
        let nLeftSpeed = 511 + speed * 512 / 100
        let nRightSpeed = 512 - speed * 512 / 100

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        // pins.analogSetPeriod(AnalogPin.P8, 50)
        // pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Brake Both Motors.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-brake block="brake"
    //% blockGap=20
    //% weight=95
    export function Brake(): void {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.analogWritePin(AnalogPin.P8, 512)
        pins.analogWritePin(AnalogPin.P16, 512)
    }

    /**
     * Run Motor(s) at selected speed.
     * Speed = -100 (reverse) to 100 (forward), 0 to brake.
     * @param motor selected motor, eg: Motors.Left
     * @param speed selected speed, eg: 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-run-motor
    //% block="run|%motor| at|%speed|"
    //% speed.min=-100 speed.max=100
    //% blockGap=10
    //% weight=90
    export function RunMotor(motor: Motors, speed: number): void {
        speed = (100 + speed) * 1024 / 200
        speed = Math.clamp(0, 1023, speed)
        if (motor == Motors.Left) {
            pins.analogWritePin(AnalogPin.P8, speed)
            // pins.analogSetPeriod(AnalogPin.P8, 50)
            pins.digitalWritePin(DigitalPin.P12, 1)
        }
        else if (motor == Motors.Right) {
            pins.analogWritePin(AnalogPin.P16, speed)
            // pins.analogSetPeriod(AnalogPin.P16, 50)
            pins.digitalWritePin(DigitalPin.P12, 1)
        }
        else {
            pins.analogWritePin(AnalogPin.P8, speed)
            pins.analogWritePin(AnalogPin.P16, speed)
            // pins.analogSetPeriod(AnalogPin.P8, 50)
            // pins.analogSetPeriod(AnalogPin.P16, 50)
            pins.digitalWritePin(DigitalPin.P12, 1)
        }
    }


}