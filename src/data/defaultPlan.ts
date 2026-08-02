import type { StudyPlan } from "../types";

// This is a condensed version of your Drone Engineer Roadmap, used as the
// default checklist so the app is useful immediately. Replace/regenerate
// this via Settings > Import Plan whenever you want to load a new one —
// see src/lib/parseStudyPlan.ts for the expected markdown format.

let uid = 0;
const id = (prefix: string) => `${prefix}-${uid++}`;

function week(label: string, taskTitles: string[]) {
  return {
    id: id("week"),
    label,
    tasks: taskTitles.map((t) => ({ id: id("task"), title: t, done: false })),
  };
}

export const defaultPlan: StudyPlan = [
  {
    id: id("phase"),
    label: "Phase 1 — Electronics & Embedded Foundations",
    weeks: [
      week("Week 1 — Electronics core + first circuits", [
        "Learn Ohm's Law, components, reading schematics",
        "Multimeter lab: resistance, continuity, voltage",
        "Project: LED blink + multiple LEDs",
        "Project: push button, RGB LED, traffic-light state machine",
      ]),
      week("Week 2 — MOSFETs, PWM, motors", [
        "Learn MOSFETs as switches, PWM generation, ESC theory",
        "Project: PWM LED dimmer",
        "Project: MOSFET-driven motor ON/OFF then PWM speed control",
        "Project: servo motor control + measure current draw",
      ]),
      week("Week 3 — STM32 bootstrap", [
        "Learn STM32CubeIDE/HAL, GPIO, timers, interrupts, UART",
        "Project: STM32 blink (registers, then HAL)",
        "Project: UART terminal echo",
        "Project: button interrupt + timer-driven servo PWM",
      ]),
    ],
  },
  {
    id: id("phase"),
    label: "Phase 2 — Embedded Systems, Sensors & FreeRTOS",
    weeks: [
      week("Week 4 — Peripherals + first sensors", [
        "Learn ADC, DMA, SPI, I2C",
        "Project: read potentiometer via ADC",
        "Project: OLED display over I2C/SPI",
        "Project: read a temperature sensor",
      ]),
      week("Week 5 — IMU + sensor fusion", [
        "Learn MPU6050, complementary filter, basic Kalman filter",
        "Project: read + log raw IMU data",
        "Project: complementary filter for pitch/roll",
        "Project: Kalman filter vs. complementary filter comparison",
      ]),
      week("Week 6 — FreeRTOS", [
        "Learn tasks, queues, mutexes, semaphores, timers",
        "Project: sensor task + motor task + comms task running concurrently",
        "Project: queue passing IMU data between tasks",
        "Project: mutex-protected shared resource (break it once on purpose)",
      ]),
    ],
  },
  {
    id: id("phase"),
    label: "Phase 3 — Control Systems",
    weeks: [
      week("Week 7 — Orientation math + PID", [
        "Learn Euler angles, rotation matrices, quaternions",
        "Learn PID theory: overshoot, oscillation, response time",
        "Project: Python PID simulator (ball on a beam)",
        "Project: visualize P/I/D term effects",
      ]),
      week("Week 8 — Motor mixing", [
        "Learn quad vs. bicopter mixing and control allocation",
        "Project: Python quad motor-mixer simulator",
        "Project: Python bicopter motor-mixer simulator",
        "Project: combine PID sim + bicopter mixer into one closed loop",
      ]),
    ],
  },
  {
    id: id("phase"),
    label: "Phase 4 — Bicopter Build",
    weeks: [
      week("Week 9 — Design", [
        "Frame layout, weight budget, CG placement",
        "CAD the bicopter frame (Fusion 360 or similar)",
      ]),
      week("Week 10 — Hardware assembly", [
        "Wire STM32, MPU6050, ESCs, motors, tilt servos, battery, PDB",
        "Multimeter short-check before first power-on",
      ]),
      week("Week 11 — Firmware integration", [
        "FreeRTOS sensor task feeding filter output",
        "Control task running PID loop on real IMU data",
        "Output task driving motors + servos via motor-mixer logic",
      ]),
      week("Week 12 — Bench testing & tuning", [
        "Props-off motor/servo direction + response check",
        "Tune PID gains starting with P",
      ]),
      week("Week 13 — First hover attempts", [
        "Supervised hover tests",
        "Iterate PID gains from real oscillation data",
      ]),
    ],
  },
  {
    id: id("phase"),
    label: "Phase 5 — FPV Quadcopter",
    weeks: [
      week("Weeks 14–17 — Assemble, configure, fly, tune", [
        "Learn Betaflight, ELRS, ESC calibration, OSD, Blackbox",
        "Assemble a 5\" FPV frame",
        "Configure Betaflight + bind ELRS",
        "Fly, log Blackbox data, tune PID",
        "Crash-and-repair once (rebuild speed matters)",
      ]),
    ],
  },
  {
    id: id("phase"),
    label: "Phase 6 — Autonomous Mission-Capable Quadcopter",
    weeks: [
      week("Weeks 18–25 — PX4/ArduPilot + onboard vision", [
        "Learn PX4/ArduPilot, GPS, compass, barometer, MAVLink",
        "Project: autonomous takeoff/land + waypoint mission + RTH",
        "Project: YOLOv8 on companion computer for vision landing/obstacle task",
        "Stretch: small RL-based gain scheduling or avoidance policy",
      ]),
    ],
  },
];
