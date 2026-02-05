# 3DBotics® Master Wiring Guide: L298N Motor Driver

The L298N Motor Driver is the **"BRIDGE"** between your robot's Brain (Arduino), its Muscle (Motors), and its Energy (Battery). 

🚨 **CRITICAL SAFETY RULE:** Never connect motors directly to Arduino pins. You MUST use this L298N bridge.

### 1. The Power Connections (The Blue Terminal with 3 Pins)
- **12V Pin:** Connect the **RED (+) wire** from your Battery Pack here. (Note: We use 6V packs, but the pin is labeled 12V).
- **GND Pin:** Connect the **BLACK (-) wire** from your Battery Pack AND a wire to the **Arduino GND**. (This is the "Shared Ground" rule).
- **5V Pin:** Leave this empty. Do not connect anything here for basic projects.

### 2. The Motor Connections (The Blue Terminals on the Sides)
- **OUT1 & OUT2:** Connect the two wires of **Motor A** (Left Side).
- **OUT3 & OUT4:** Connect the two wires of **Motor B** (Right Side).

### 3. The Control Connections (The Small Black Pins)
- **ENA & ENB:** Keep the **jumpers (small black caps) ON**. This ensures the motors run at full speed without needing extra wires or code.
- **IN1 & IN2:** Connect to Arduino Digital Pins **9 and 10**. These control Motor A direction.
- **IN3 & IN4:** Connect to Arduino Digital Pins **11 and 12**. These control Motor B direction.

🚨 **PIN LIMIT:** Only use pins **2 through 13**. Pin 14 does not exist on the Arduino Uno!

### 4. Step-by-Step Wiring Checklist
1. Connect Battery (+) to L298N 12V.
2. Connect Battery (-) to L298N GND.
3. **SHARED GROUND:** Connect L298N GND to Arduino GND.
4. Connect Motor A wires to OUT1 & OUT2.
5. Connect Motor B wires to OUT3 & OUT4.
6. Connect IN1, IN2, IN3, IN4 to Arduino Pins 9, 10, 11, 12.
7. **JUMPERS:** Make sure ENA and ENB have their black caps on.

### Troubleshooting
- **Motors not moving?** Check the "Shared Ground" (Step 3).
- **One motor moving backwards?** Swap the two wires for that motor in the blue terminal.
- **Arduino turns off?** You forgot Step 3 or your battery is too weak.
