# 3DBotics® AI Teacher: Master Knowledge Base (Safety & Electronics)

> **PURPOSE:** This is the "Ground Truth" for the 3DBotics® AI Teacher. 
> **TARGET AUDIENCE:** Students ages 6 to 17.
> **CORE DIRECTIVE:** Prioritize physical safety and equipment longevity. Do not hallucinate power limits.

---

## 🛡️ SECTION 1: SAFETY & AGE-APPROPRIATE LIMITS

### 1. The "Golden Rules" (6+ Years Old)
* **The Touch Test:** If any component (Arduino, chip, or wire) feels hot, unplug the battery immediately.
* **The Metal-Free Zone:** No scissors, coins, or metal rulers near an active circuit.
* **The "One-Battery" Rule:** Use only teacher-approved battery packs. No wall outlets.

### 2. Voltage & Current Safety Limits
* **Safe Voltage:** 5V to 9V. 
* **Danger Zone:** Never suggest 12V or higher for student projects. 
* **The Brain Protection:** Never plug a motor directly into an Arduino Pin. Always use a "Muscle" (Motor Driver).

---

## 📊 SECTION 2: ELECTRICAL SPECIFICATIONS (The "Robot Math")

The AI must use these values to calculate if a battery can handle the student's design.

| Component | Operating Voltage | Normal Current (mA) | Stall Current (Max mA) |
| :--- | :--- | :--- | :--- |
| **Arduino Uno (Brain)** | 7V - 9V | 50mA | 200mA |
| **SG90 Micro Servo** | 4.8V - 6V | 100mA | 650mA |
| **MG90S Metal Servo** | 4.8V - 6V | 150mA | 800mA |
| **TT Gear Motor** | 3V - 6V | 200mA | 500mA |
| **Ultrasonic (HC-SR04)** | 5V | 15mA | 15mA |
| **L298N Driver (Logic)** | 5V | 36mA | 36mA |
| **LED + 220Ω Resistor** | 2V - 3V | 20mA | 30mA |

---

## 🔋 SECTION 3: BATTERY CAPABILITY (The "Fuel")

| Battery Type | Total Voltage | Max Safe Current (Amps) | Best Use Case |
| :--- | :--- | :--- | :--- |
| **9V Square (Alkaline)** | 9V | **0.5A (500mA)** | Arduino Brain only. **Bad for motors.** |
| **AA Alkaline (4-pack)** | 6V | **2.0A (2000mA)** | **Best for 3DBotics 4WD Cars.** |
| **18650 Li-Ion (Single)** | 3.7V | **5.0A+** | High-power robotics (Teacher Only). |

---

## 🧮 SECTION 4: HOW TO CALCULATE POWER (AI LOGIC)

When a student asks if their battery is enough, the AI must:
1.  **SUM THE STALL CURRENT:** Add the "Stall Current" of all motors/servos + 200mA for the Arduino.
2.  **CHECK THE BATTERY:** If the sum is higher than the "Max Safe Current" of the battery, the AI must say: **"Warning: Your robot might 'glitch' or reset because it needs more current than that battery can give."**

**Example Calculation for a 4WD Robot:**
* 4 x TT Motors (500mA each) = 2000mA
* 1 x Arduino = 200mA
* **Total Needed: 2200mA (2.2 Amps)**
* **AI Verdict:** A 9V battery will fail. Use a high-quality AA pack or two separate power sources.

---

## 🛠️ SECTION 5: COMPONENT WIRING GUIDE

* **Breadboards:** Never bridge the Red (+) and Blue (-) rails.
* **L298N Driver:** Always connect the Ground (GND) of the battery to the Ground (GND) of the Arduino. This is called a "Common Ground."
* **Servos:** If using more than 1 servo, do not use the Arduino's 5V pin. Use an external battery pack to avoid burning the Arduino's voltage regulator.