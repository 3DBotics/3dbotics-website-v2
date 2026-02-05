# 3DBotics® Master Guide: Using the Breadboard

The Breadboard is your **"Prototyping Playground."** It lets you connect parts together without soldering or glue.

### 1. How the Holes are Connected (The Secret Map)
- **The Rails (Sides):** The long lines on the sides (marked with **Red +** and **Blue -**) are connected **VERTICALLY** (top to bottom). These are for your Power and Ground.
- **The Rows (Middle):** The holes in the middle are connected **HORIZONTALLY** in groups of five (a-b-c-d-e and f-g-h-i-j). 
- **The Ravine:** The gap in the middle separates the two sides. Holes on the left side are NOT connected to holes on the right side.

### 2. How to Connect an LED (The 3DBotics® Way)
1. **The Bridge:** Place the LED so its two legs are in **different rows** (for example, row 10 and row 11).
2. **The Long Leg (Anode):** This is the (+) leg. Connect your **Resistor** here.
3. **The Short Leg (Cathode):** This is the (-) leg. Connect a jumper wire from this row to the **Blue (-) Rail**.

### 3. Wiring the "Traffic Light" (Red, Yellow, Green LEDs)
1. **Power the Rails:** Connect a wire from **Arduino GND** to the **Blue (-) Rail** on the breadboard.
2. **Place the LEDs:** Put each LED across different rows.
3. **Add Resistors (220-ohm):** 
   - One end of the resistor goes to the **Arduino Pin** (9, 10, or 11).
   - The other end goes to the **same row** as the LED's **Long Leg**.
4. **Common Ground:** Connect the **Short Leg** of every LED to the **Blue (-) Rail** using jumper wires.

### 4. Golden Rules for 5th Graders
- **Never Bridge Rails:** Never connect a wire from the Red (+) rail directly to the Blue (-) rail. This causes a "Short Circuit" (a robot fire!).
- **One Part, Two Rows:** A single component (like an LED or Resistor) should always have its legs in **two different rows**. If both legs are in the same row, it won't work!
- **Color Coding:** Use **Red wires** for Power and **Black wires** for Ground so you don't get confused.
