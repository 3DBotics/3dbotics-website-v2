# 3DBotics® Master Wiring Guide: L298N Motor Driver

The L298N Motor Driver is the **"BRIDGE"** between your robot's Brain (Arduino), its Muscle (Motors), and its Energy (Battery). 

🚨 **CRITICAL SAFETY RULE:** Never connect motors directly to Arduino pins. You MUST use this L298N bridge.

### 1. The Power Connections (The Blue Terminal with 3 Pins)
- **12V Pin:** Connect the **RED (+) wire** from your Battery Pack here. (Note: We use 6V packs, but the pin is labeled 12V).
- **GND Pin:** Connect the **BLACK (-) wire** from your Battery Pack AND a wire to the **Arduino GND**. (This is the "Shared Ground" rule).
- **5V Pin:** Leave this empty if you are powering the Arduino separately, or connect to Arduino 5V ONLY if you know what you are doing.

### 2. The Motor Connections (The Blue Terminals on the Sides)
- **OUT1 & OUT2:** Connect the two wires of **Motor A** (Left Side).
- **OUT3 & OUT4:** Connect the two wires of **Motor B** (Right Side).

### 3. The Control Connections (The Small Black Pins)
- **ENA & ENB:** These control the SPEED. Keep the jumpers on for full speed.
- **IN1 & IN2:** Connect to Arduino Digital Pins (e.g., Pin 9 and Pin 10). These control Motor A direction.
- **IN3 & IN4:** Connect to Arduino Digital Pins (e.g., Pin 11 and Pin 12). These control Motor B direction.

### 4. Step-by-Step Wiring Checklist
1. Connect Battery (+) to L298N 12V.
2. Connect Battery (-) to L298N GND.
3. **IMPORTANT:** Connect L298N GND to Arduino GND.
4. Connect Motor wires to OUT terminals.
5. Connect IN1, IN2, IN3, IN4 to Arduino Digital Pins.

### Troubleshooting
- **Motors not moving?** Check if the Battery (-) and Arduino GND are connected together (Shared Ground).
- **Motors humming but not turning?** Your battery is too weak. Use a fresh 4-AA battery pack.
- **Arduino turns off when motors start?** You are drawing too much power. Do not power motors from the Arduino 5V pin.
