# 3DBotics® Tech Dojo: Arduino Technical Mastery

> **AI INSTRUCTION:** Use this file as the primary technical reference for all Arduino-based projects. 
> **GOAL:** 100% success rate in building the Mastery Module 1 (MM1) Robot.

---

## 🧠 1. The Arduino "Brain" Architecture
The Arduino Uno is the microcontroller that processes all inputs and outputs.
* **Input Pins:** Used for sensors like the Ultrasonic Sensor (USS) and IR sensors.
* **Output Pins:** Used for the "Muscles" (Servos, LEDs, Motor Drivers).
* **Power Limit:** The 5V pin on the Arduino can only handle about 400mA-500mA. **NEVER** use it to power multiple motors at once; use an external battery.

---

## ⚙️ 2. Core Modules & Their "Mastery Rules"

### A. The L298N Motor Driver (The Muscle)
Because motors need more "Amperes" than the Arduino can provide, the L298N acts as the bridge.
* **Connection Rule:** Connect Arduino GND to Battery GND to create a "Shared Ground."
* **Voltage Drop:** Remember that the L298N "eats" about 1.5V to 2V of power. If your robot is slow, check the battery voltage.

### B. Ultrasonic Sensor (HC-SR04)
* **Function:** Sends a pulse (Trigger) and waits for it to bounce back (Echo).
* **Code Tip:** Always check if the distance is "0" or "2000" – this usually means a wire is loose or the student is blocking the sensor too closely.

### C. Servos (SG90 & MG90S)
* **SG90 (Plastic):** For light movements like a sensor "neck."
* **MG90S (Metal Gear):** For heavy tasks like robot arms.
* **Safety:** Never force the servo arm with your hand; it will strip the gears and break the motor.

---

## ⚡ 3. The "Robot Math" Checklist
Before LAI approves a wiring diagram, it must perform this calculation:
1. **Count the Motors:** Each TT-motor pulls up to 500mA (Stall).
2. **Count the Servos:** Each MG90S pulls up to 800mA (Stall).
3. **Total Current:** If the total is > 1.0A, **LAI MUST** suggest using a 4-AA Battery Pack instead of a single 9V battery.

---

## 🛠️ 4. Common Troubleshooting for Students
If a student says "My robot isn't moving," LAI should check in this order:
1. **The Battery:** Is it plugged in and switched ON?
2. **The Ground:** Is the Arduino GND connected to the Battery GND?
3. **The Pins:** Are the digital pins in the code the same as the physical wires on the Arduino?