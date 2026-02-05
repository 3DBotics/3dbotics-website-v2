# 3D Printing Slicer Master Guide

## What is a Slicer?

A **3D printing slicer** is software that converts your 3D model (STL, OBJ, etc.) into instructions (G-code) that your 3D printer can understand. The slicer "slices" your model into thin horizontal layers and calculates the exact movements the printer needs to make.

**Popular Slicers:**
- **Cura** (free, user-friendly)
- **PrusaSlicer** (free, professional-grade)
- **Simplify3D** (paid, advanced features)

---

## Key Slicer Settings Explained

### 1. **Perimeters (Walls/Shells)**

**What it is:** The number of outer walls your print will have.

**How it works:**
- **1 perimeter** = thin, fast, but fragile
- **2-3 perimeters** = balanced strength and speed (recommended for most prints)
- **4+ perimeters** = very strong, but slower and uses more filament

**When to adjust:**
- **Increase perimeters** if your print is breaking easily or has weak walls
- **Decrease perimeters** if you want faster prints and don't need maximum strength
- **For robot parts:** Use 3-4 perimeters to ensure durability during battles

**Example:**
```
A 100mm cube with:
- 1 perimeter: ~5 minutes, uses 2g filament
- 3 perimeters: ~8 minutes, uses 4g filament
```

---

### 2. **Infill**

**What it is:** The density of material inside your print (the inside is NOT solid).

**Infill Percentage:**
- **0% infill** = hollow (very light, but weak)
- **10-15% infill** = light and fast (good for decorative items)
- **20-30% infill** = balanced (recommended for most prints)
- **50%+ infill** = very strong (for structural parts, robot chassis)
- **100% infill** = completely solid (rarely needed, wastes filament)

**Infill Patterns:**
- **Grid** = strong, fast, uses less filament
- **Honeycomb** = very strong, slightly slower
- **Gyroid** = flexible, good for impact resistance
- **Linear** = fastest, but weakest

**For TechDojo Robots:**
- Robot body: 20-30% infill with honeycomb pattern
- Wheels: 50% infill for durability
- Decorative parts: 10% infill to save filament

**Example:**
```
A 50g robot chassis with:
- 10% infill: 5g filament, 30 minutes print time
- 30% infill: 15g filament, 60 minutes print time
- 50% infill: 25g filament, 90 minutes print time
```

---

### 3. **Bottom Layer (First Layer)**

**What it is:** The first layer that touches the print bed. It's critical for print success!

**Settings:**
- **Line Width:** Slightly thicker than normal (0.5-0.6mm) for better adhesion
- **Temperature:** Often 5-10°C hotter than normal layers for better bed adhesion
- **Speed:** Slower than normal layers (20-30mm/s) for precision
- **Infill Percentage:** Often 100% for the first layer to ensure strength

**Why it matters:**
- A good first layer = successful print
- A bad first layer = warping, poor adhesion, failed print

**Tips for better first layers:**
1. **Level your bed** before every print
2. **Use bed adhesion aids** (glue stick, painter's tape, or build surface spray)
3. **Print slowly** on the first layer
4. **Use a slightly higher temperature** on the first layer

---

### 4. **Top Layer**

**What it is:** The final layers that form the top surface of your print.

**Settings:**
- **Number of top layers:** Usually 4-6 layers (0.8-1.2mm)
- **Infill:** Often 100% for the top layers to create a solid surface
- **Speed:** Can be normal speed (not as critical as first layer)

**Why it matters:**
- Determines the smoothness and appearance of the top surface
- Prevents infill from showing through

**Tips:**
- Increase top layers if you see infill pattern on the surface
- Use more top layers for parts that need to be waterproof

---

### 5. **Layer Height**

**What it is:** The thickness of each individual layer (usually 0.1-0.3mm).

**Common settings:**
- **0.1mm** = very smooth, detailed, but slow (2-3x longer)
- **0.2mm** = balanced (recommended, standard default)
- **0.3mm** = fast, but less detail
- **0.4mm** = very fast, but rough surface

**When to adjust:**
- **Use 0.1mm** for detailed parts (robot faces, small components)
- **Use 0.2mm** for general parts (chassis, wheels)
- **Use 0.3-0.4mm** for large, non-critical parts (supports, test prints)

**Example:**
```
A 50mm tall robot head:
- 0.1mm layers: 500 layers, 2 hours
- 0.2mm layers: 250 layers, 1 hour
- 0.3mm layers: 167 layers, 40 minutes
```

---

### 6. **Nozzle Temperature**

**What it is:** How hot the printing nozzle gets (usually 190-220°C for PLA).

**Common temperatures:**
- **PLA:** 190-210°C (most common filament in TechDojo)
- **PETG:** 220-240°C
- **ABS:** 230-250°C

**When to adjust:**
- **Too cold** = filament doesn't flow smoothly, weak prints
- **Too hot** = filament oozes, strings appear, details blur
- **Just right** = smooth flow, clean prints

**For TechDojo:**
- Standard PLA: 200-205°C
- If you see stringing: lower temperature by 5°C
- If filament doesn't flow: raise temperature by 5°C

---

### 7. **Bed Temperature**

**What it is:** How hot the print bed gets (usually 50-70°C for PLA).

**Common temperatures:**
- **PLA:** 50-60°C (TechDojo standard)
- **PETG:** 70-80°C
- **ABS:** 80-100°C

**Why it matters:**
- Helps filament stick to the bed
- Prevents warping and lifting

**For TechDojo:**
- PLA: 55°C (standard)
- If first layer doesn't stick: raise to 60°C
- If bed is too hot: lower to 50°C

---

### 8. **Print Speed**

**What it is:** How fast the nozzle moves while printing (usually 40-60mm/s).

**Common speeds:**
- **20-30mm/s** = slow, very detailed, best quality
- **40-50mm/s** = balanced (recommended)
- **60-80mm/s** = fast, but may lose detail
- **100mm/s+** = very fast, but quality suffers

**When to adjust:**
- **Slow down** for detailed parts or if you see quality issues
- **Speed up** for large, non-critical parts to save time
- **First layer:** Always slow (20-30mm/s)

**Example:**
```
A 100g robot chassis:
- 30mm/s: 2.5 hours, excellent quality
- 50mm/s: 1.5 hours, good quality
- 80mm/s: 1 hour, acceptable quality
```

---

### 9. **Support Structures**

**What it is:** Temporary structures printed to support overhanging parts.

**When to use supports:**
- When your model has overhangs (angles > 45° from vertical)
- When parts extend horizontally without support below

**Support types:**
- **Tree supports** = minimal, uses less filament
- **Linear supports** = simple, easy to remove
- **Grid supports** = strong, but harder to remove

**For TechDojo robots:**
- Use tree supports for robot arms and legs
- Minimize support contact area to reduce marks
- Remove supports carefully with pliers

**Tips:**
- Increase support density if they break during printing
- Decrease density if they're too hard to remove

---

### 10. **Retraction**

**What it is:** When the printer pulls filament back slightly when moving without printing (to prevent stringing).

**Retraction settings:**
- **Retraction distance:** 4-6mm (how far to pull back)
- **Retraction speed:** 40-50mm/s (how fast to pull back)
- **Z-hop:** 0.2mm (lift nozzle slightly to avoid dragging)

**When to adjust:**
- **Increase retraction** if you see strings between parts
- **Decrease retraction** if you see blobs or weak spots

**For TechDojo:**
- Standard: 5mm retraction at 45mm/s
- If stringing appears: increase to 6mm
- If blobs appear: decrease to 4mm

---

## Real-World Example: Printing a Lightweight Robot Chassis

**Goal:** Print a 12-inch tall robot chassis that weighs only 100 grams.

**Slicer Settings:**
```
Layer Height: 0.2mm (balanced detail and speed)
Perimeters: 3 (strong walls for durability)
Infill: 20% with honeycomb pattern (light but strong)
Bottom Layers: 100% infill, 6 layers
Top Layers: 100% infill, 4 layers
Nozzle Temp: 205°C (PLA)
Bed Temp: 55°C
Print Speed: 50mm/s
Support: Tree supports (minimal)
```

**Result:**
- Print time: ~2 hours
- Filament used: ~25g
- Weight: ~20g (light for fast movement)
- Strength: Good for robot battles

---

## Troubleshooting Common Slicer Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| First layer doesn't stick | Bed not level / too cold | Level bed, raise bed temp to 60°C |
| Stringing between parts | Nozzle too hot / retraction weak | Lower temp by 5°C, increase retraction |
| Infill shows through top | Not enough top layers | Increase top layers to 6-8 |
| Print breaks easily | Weak walls / low infill | Increase perimeters to 4, infill to 30% |
| Supports too hard to remove | Support density too high | Decrease support density in slicer |
| Print warps at corners | Bed too hot / poor adhesion | Lower bed temp, use adhesion aid |
| Nozzle clogs | Filament too hot | Lower nozzle temp by 10°C |

---

## Quick Reference: Recommended Settings for TechDojo Prints

### For Robot Chassis & Structural Parts:
```
Layer Height: 0.2mm
Perimeters: 4
Infill: 30% (honeycomb)
Nozzle: 205°C
Bed: 55°C
Speed: 50mm/s
```

### For Wheels & Moving Parts:
```
Layer Height: 0.2mm
Perimeters: 4
Infill: 50% (honeycomb)
Nozzle: 205°C
Bed: 55°C
Speed: 40mm/s
```

### For Decorative Parts:
```
Layer Height: 0.2mm
Perimeters: 2
Infill: 10% (grid)
Nozzle: 205°C
Bed: 55°C
Speed: 60mm/s
```

### For Lightweight Parts (Minimal Weight):
```
Layer Height: 0.3mm
Perimeters: 2
Infill: 10% (grid)
Nozzle: 205°C
Bed: 55°C
Speed: 60mm/s
```

---

## Advanced Tips

1. **Calibrate your printer:** Print a calibration cube to dial in your settings
2. **Use a test print:** Always test settings on a small part first
3. **Keep notes:** Document what settings worked for different prints
4. **Experiment gradually:** Change one setting at a time to see the effect
5. **Join the community:** Share your prints and learn from other makers

---

**Last Updated:** February 6, 2026
**Verified For:** TechDojo Curriculum, 3DBotics
