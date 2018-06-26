
/**
 * Custom blocks
 */
//% weight=99 color=#ff8000 icon="\uf00c" block="Rero Micro"
namespace custom {

    let rightLineSensor = DigitalPin.P13
    let centerLineSensor = DigitalPin.P14
    let leftLineSensor = DigitalPin.P15

    let bFlag = true
    let nTimers = [1000, 1000, 1000]
    let nMinTimers = [250, 250, 250]
    let nMinTotalTimers = nMinTimers[0] + nMinTimers[1] + nMinTimers[2]
    let nMaxTimers = [1000, 1000, 1000]
    let nMaxTotalTimers = nMaxTimers[0] + nMaxTimers[1] + nMaxTimers[2]
    let nLineCenterValue = 1200
    let nLinePosition = 1000
    let nPrevLinePos = 1000
    let nStartTime = 0
    let bPinState = 1;
    let nLineThreshold = 500

    export enum LineSensors {
        Left = 0,
        Center = 1,
        Right = 2
    }

    export enum LinePositions {
        Left = 4,
        CL = 5,
        Center = 6,
        CR = 7,
        Right = 8,
        // blockId="Rout" block="R >>"
        //Rout = 9
    }
    let nSegment = 150 //Math.floor((nMaxTimers[0] - nMinTimers[0]) / 5)



    //=== Motors ============================================

    /**
     * Forward.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-forward block="forward at|speed %speed"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=99
    export function Forward(speed: number = 50): void {
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
     * Reverse.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-reverse block="reverse at|speed %speed"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=98
    export function Reverse(speed: number = 50): void {
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
     * Spin Left.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-spinleft block="spin left at|speed %speed"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=97
    export function SpinLeft(speed: number = 50): void {
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
     * Spin Right.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-spinright block="spin right at|speed %speed"
    //% speed.min=0 speed.max=100
    //% blockGap=10
    //% weight=96
    export function SpinRight(speed: number = 50): void {
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
     * Dual Motors Speed Control.
     * @param left motor speed, eg: -50, 50
     * @param right motor speed, eg: -50, 50
     */
    //% subcategory=Motors
    //% blockId=rero-micro-motors block="motors|left %nLeftSpeed|right %nRightSpeed"
    //% left.min=-100 left.max=100
    //% right.min=-100 right.max=100
    //% blockGap=10
    //% weight=95
    export function RunMotors(nLeftSpeed: number = 50, nRightSpeed: number = 50): void {
        nLeftSpeed = (100 - nLeftSpeed) * 1023 / 200
        nLeftSpeed = Math.clamp(0, 1023, nLeftSpeed);
        nRightSpeed = (100 + nRightSpeed) * 1023 / 200
        nRightSpeed = Math.clamp(0, 1023, nRightSpeed);

        pins.analogWritePin(AnalogPin.P8, nLeftSpeed)
        pins.analogWritePin(AnalogPin.P16, nRightSpeed)
        pins.analogSetPeriod(AnalogPin.P8, 50)
        pins.analogSetPeriod(AnalogPin.P16, 50)
        pins.digitalWritePin(DigitalPin.P12, 1)
    }

    /**
     * Brake.
     */
    //% subcategory=Motors
    //% blockId=rero-micro-brake block="brake"
    //% blockGap=10
    //% weight=94
    export function Brake(): void {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.analogWritePin(AnalogPin.P8, 0)
        pins.analogWritePin(AnalogPin.P16, 0)
    }




    //=== Ultrasonic ============================================

    /**
     * Read distance (cm) using ultrasonic sensor.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-read-ultrasonic block="ultrasonic distance(cm)"
    //% blockGap=10
    //% weight=90
    export function ReadUltrasonic(): number {

        let raw = pins.analogReadPin(AnalogPin.P2)

        return Math.abs(raw / 11)
    }




    //=== Line Sensor ============================================

    /**
     * Returns true if line position matches the selected location.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-line-is-at-position 
    //% block="line is at the|%pos|"
    //% blockGap=10
    //% pos.fieldEditor="gridpicker" pos.fieldOptions.columns=5 
    //% pos.fieldOptions.width="200"
    //% weight=81
    export function LineIsAtPosition(pos: LinePositions = LinePositions.Center): boolean {

        let raw = ReadLineValue()

        let nCompareL = nLineCenterValue + nSegment * 3
        let nCompareCL = nLineCenterValue + nSegment
        let nCompareCR = nLineCenterValue - nSegment
        let nCompareR = nLineCenterValue - nSegment * 3

        if (pos == LinePositions.Center) {
            if (raw > nCompareCR && raw < nCompareCL) {
                return true
            }
        }
        else if (pos == LinePositions.CL) {
            if (raw >= nCompareCL && raw < nCompareL) {
                return true
            }
        }
        else if (pos == LinePositions.CR) {
            if (raw > nCompareR && raw <= nCompareCR) {
                return true
            }
        }
        else if (pos == LinePositions.Left) {
            if (raw > nCompareL) {
                return true
            }
        }
        else if (pos == LinePositions.Right) {
            if (raw < nCompareR) {
                return true
            }
        }
        return false;
    }


    /**
     * This function reads a single micro:Racer's Line Sensor.
     * It returns true if line is detected, else false.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-read-single-line 
    //% block="read line sensor|%sensor|"
    //% blockGap=10
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=3
    //% sensor.fieldOptions.width="200"
    //% weight=82
    export function ReadSingleLine(sensor: LineSensors): boolean {

        nTimers[sensor] = 1000
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
        while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimers[sensor]) {
            bPinState = pins.digitalReadPin(pinSensor)
            if (bPinState == 0) {
                nTimers[sensor] = input.runningTimeMicros() - nStartTime
                bFlag = false
            }
        }

        serial.writeNumber(sensor)
        serial.writeString(" ")
        serial.writeNumber(nTimers[sensor])
        serial.writeString("   ")

        if (nTimers[sensor] > nLineThreshold) {
            return true
        }
        return false
    }


    /**
     * This function reads micro:Racer's Line Sensors.
     * It returns line position from 0 to 2000, with ~1000 
     * corresponding to the line over the middle sensor.
     */
    //% subcategory=Sensors
    //% blockId=rero-micro-read-line-value 
    //% block="read line value"
    //% blockGap=10
    //% weight=80
    export function ReadLineValue(): number {

        nTimers = [1000, 1000, 1000]

        // Read right sensor
        bFlag = true
        nStartTime = input.runningTimeMicros()
        pins.digitalWritePin(rightLineSensor, 1)
        control.waitMicros(10)
        pins.setPull(rightLineSensor, PinPullMode.PullNone)
        while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimers[0]) {
            bPinState = pins.digitalReadPin(rightLineSensor)
            if (bPinState == 0) {
                nTimers[0] = input.runningTimeMicros() - nStartTime
                bFlag = false
            }
        }

        // Read center sensor
        bFlag = true
        nStartTime = input.runningTimeMicros()
        pins.digitalWritePin(centerLineSensor, 1)
        control.waitMicros(10)
        pins.setPull(centerLineSensor, PinPullMode.PullNone)
        while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimers[1]) {
            bPinState = pins.digitalReadPin(centerLineSensor)
            if (bPinState == 0) {
                nTimers[1] = input.runningTimeMicros() - nStartTime
                bFlag = false
            }
        }

        // Read left sensor
        bFlag = true
        nStartTime = input.runningTimeMicros()
        pins.digitalWritePin(leftLineSensor, 1)
        control.waitMicros(10)
        pins.setPull(leftLineSensor, PinPullMode.PullNone)
        while (bFlag == true && (input.runningTimeMicros() - nStartTime) < nMaxTimers[2]) {
            bPinState = pins.digitalReadPin(leftLineSensor)
            if (bPinState == 0) {
                nTimers[2] = input.runningTimeMicros() - nStartTime
                bFlag = false
            }
        }
        /*
                serial.writeString("R:")
                serial.writeNumber(nTimers[0])
                serial.writeString("     C:")
                serial.writeNumber(nTimers[1])
                serial.writeString("     L:")
                serial.writeNumber(nTimers[2])
                serial.writeString("     ")
        */

        // Rationalize the data
        let nTotalTime = nTimers[0] + nTimers[1] + nTimers[2]
        let nDiffTimers = [0, 0, 0]

        nDiffTimers[0] = nTimers[0] - nMinTimers[0]
        nDiffTimers[1] = nTimers[1] - nMinTimers[1]
        nDiffTimers[2] = nTimers[2] - nMinTimers[2]
        nLinePosition = (0 * nDiffTimers[0] + 1000 * nDiffTimers[1] + 2000 * nDiffTimers[2]) / (nTotalTime - nMinTotalTimers)

        // Eliminates out of range values
        nLinePosition = (nLinePosition < 0) ? 0 : nLinePosition
        nLinePosition = (nLinePosition > 2000) ? 2000 : nLinePosition

        /*        serial.writeNumber(nLinePosition)
                serial.writeLine("")
        */

        // All 3 sensors are on the line
        if (nTotalTime >= nMaxTotalTimers) {
            nLinePosition = -1
        }
        // Most probably all sensors are NOT on the line
        else if (nTotalTime < nMinTotalTimers) {
            nLinePosition = nPrevLinePos
        }

        // Store previous position
        nPrevLinePos = nLinePosition

        return nLinePosition
    }

}
