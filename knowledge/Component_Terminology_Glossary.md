# 3DBotics® Component Terminology Glossary

> **PURPOSE:** This glossary ensures the AI Teacher recognizes all abbreviations, nicknames, and variations of component names that students might use.

---

## MOTORS

### TT Motor (Yellow Gear Motor)
**Official Name:** TT Gear Motor  
**Student Names:** TT motor, ttmotor, tt-motor, yellow motor, gear motor, DC motor  
**Voltage:** 3V to 6V (NEVER 12V)  
**Normal Current:** 200mA  
**Stall Current:** 500mA  

### Servo Motor SG90
**Official Name:** SG90 Micro Servo  
**Student Names:** SG90, servo, micro servo, small servo, blue servo  
**Voltage:** 4.8V to 6V  
**Normal Current:** 100mA  
**Stall Current:** 650mA  

### Servo Motor MG90S
**Official Name:** MG90S Metal Gear Servo  
**Student Names:** MG90S, metal servo, MG90, strong servo  
**Voltage:** 4.8V to 6V  
**Normal Current:** 150mA  
**Stall Current:** 800mA  

---

## SENSORS

### Ultrasonic Sensor
**Official Name:** HC-SR04 Ultrasonic Distance Sensor  
**Student Names:** USS, ultrasonic, HC-SR04, distance sensor, sonar, ping sensor  
**Voltage:** 5V  
**Current:** 15mA  

### Line Sensor
**Official Name:** TCRT5000 Line Tracking Sensor  
**Student Names:** line sensor, IR sensor, track sensor, TCRT5000  
**Voltage:** 5V  
**Current:** 20mA  

---

## MOTOR DRIVERS

### L298N Motor Driver
**Official Name:** L298N Dual H-Bridge Motor Driver  
**Student Names:** L298N, motor driver, H-bridge, driver board, motor shield  
**Logic Voltage:** 5V  
**Motor Voltage:** 5V to 12V (but use 6V for TT motors)  
**Logic Current:** 36mA  
**Max Motor Current per Channel:** 2A  

---

## MICROCONTROLLERS

### Arduino Uno
**Official Name:** Arduino Uno R3  
**Student Names:** Arduino, Uno, Arduino board, brain, controller  
**Operating Voltage:** 5V  
**Input Voltage (recommended):** 7V to 9V  
**Current Draw:** 50mA (normal), 200mA (max)  

---

## POWER SOURCES

### 9V Battery
**Official Name:** 9V Alkaline Battery  
**Student Names:** 9V, square battery, 9 volt  
**Voltage:** 9V  
**Max Current:** 500mA  
**WARNING:** Only use for Arduino alone. BAD for motors.  

### AA Battery Pack (4 cells)
**Official Name:** 4x AA Battery Holder  
**Student Names:** AA pack, AA batteries, 6V pack, battery holder  
**Voltage:** 6V (4 x 1.5V)  
**Max Current:** 2000mA (2A)  
**BEST FOR:** 3DBotics 4WD robot cars with TT motors  

### 18650 Li-Ion Battery
**Official Name:** 18650 Lithium-Ion Cell  
**Student Names:** 18650, lithium battery, rechargeable battery  
**Voltage:** 3.7V (single cell)  
**Max Current:** 5A+  
**WARNING:** Teacher supervision required. High power.  

---

## COMMON ABBREVIATIONS

- **V** = Volts (voltage)
- **A** = Amperes or Amps (current)
- **mA** = Milliamperes (1000mA = 1A)
- **PWM** = Pulse Width Modulation (speed control)
- **GND** = Ground (negative/black wire)
- **VCC** = Power (positive/red wire)
- **GPIO** = General Purpose Input/Output (Arduino pins)
- **LED** = Light Emitting Diode
- **PCB** = Printed Circuit Board

---

## CRITICAL SAFETY REMINDERS

When a student asks about **TT motors** or **ttmotors**:
- Maximum safe voltage: **6V**
- NEVER suggest 12V
- Best battery: **4x AA pack (6V, 2A)**

When a student asks about **USS** or **ultrasonic**:
- This means **HC-SR04 Ultrasonic Sensor**
- Voltage: **5V only**
- Can be powered from Arduino 5V pin
