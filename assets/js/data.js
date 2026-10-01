window.PROJECTS = [
  {
    id: "pitm",
    title: "Programmer in the Middle",
    shortTitle: "PITM",
    overview: [
      "Demonstrated **firmware implantation through compromised flash programmers**. Modified USBasp to inject AVR code while returning clean host readback checks.",
      "**Reverse engineered ST-Link V2** and tested custom programmer firmware on **three target boards**. The work examines a trust gap between reviewed binaries and programmed hardware."
    ],
    year: "2026 to present",
    category: "Research",
    status: "Manuscript in preparation",
    featured: true,
    tags: ["Firmware security", "AVR", "ST Link", "Ghidra"],
    summary: "A firmware supply chain attack that treats flash programming equipment as an untrusted stage after compilation and code review.",
    problem: "Firmware checks often stop before the programmer touches the target. A compromised programmer can change the binary at the last trusted step and can also interfere with readback verification.",
    work: [
      "Modified USBasp firmware to hijack the AVR reset vector and inject a firmware stub during programming.",
      "Implemented readback spoofing so the host receives the expected bytes during verification.",
      "Reverse engineered ST Link V2 firmware and tested custom programmer firmware on three target boards.",
      "Planned further experiments across STM32 and MSP430 programming architectures."
    ],
    outcomes: [
      "Demonstrated a complete path from trusted input firmware to altered target execution.",
      "Showed that programmer side manipulation can survive routine host readback checks.",
      "Produced a cross architecture experimental plan for evaluating the same trust gap."
    ],
    links: [
      { label: "Pre-Release", url: "assets/writeups/Programmer_in_the_Middle.pdf" }
    ],
    document: "assets/writeups/Programmer_in_the_Middle.pdf",
    documents: [
      { label: "Programmer in the Middle pre-release", url: "assets/writeups/Programmer_in_the_Middle.pdf" }
    ],
    sources: [
      { label: "NIST IoT device cybersecurity guidance", url: "https://csrc.nist.gov/pubs/ir/8259/a/final" },
      { label: "ETSI consumer IoT security standard", url: "https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf" },
      { label: "ENISA supply chain threat landscape", url: "https://www.enisa.europa.eu/publications/threat-landscape-for-supply-chain-attacks" }
    ]
  },
  {
    id: "on-chip-monitoring",
    title: "On Chip Behavioral Monitoring",
    shortTitle: "On Chip Monitoring",
    overview: [
      "Built a **transaction-trace collection pipeline** and **1D CNN classifier** for runtime hardware Trojan monitoring. The approach targets malicious execution that can escape pre-deployment tests.",
      "Specified an **FPGA monitor architecture**. Evaluation across workloads, processor configurations and caches remains ongoing."
    ],
    year: "2026 to present",
    category: "Research",
    status: "Manuscript in preparation",
    featured: true,
    tags: ["Hardware security", "1D CNN", "FPGA", "RISC V"],
    summary: "Runtime hardware Trojan detection from transaction level traces of expected program behavior.",
    problem: "Rare trigger hardware Trojans can remain dormant during bounded predeployment testing. Runtime monitoring offers another chance to identify behavior that departs from an expected execution profile.",
    work: [
      "Constructed expected and Trojan affected execution trace datasets across computational and application workloads.",
      "Developed a 1D CNN pipeline for classifying program behavior from transaction windows.",
      "Planned generalization studies across workload, processor, and cache configurations.",
      "Specified an FPGA monitor architecture for future latency and resource evaluation."
    ],
    outcomes: [
      "Created a repeatable trace collection and labeling pipeline.",
      "Developed a 1D CNN classifier for transaction level behavior.",
      "Specified the monitoring architecture. FPGA deployment and generalization evaluation remain planned work."
    ],
    links: [
      { label: "Pre-Release", url: "assets/writeups/On_Chip_Behavioral_Monitoring.pdf" }
    ],
    document: "assets/writeups/On_Chip_Behavioral_Monitoring.pdf",
    documents: [
      { label: "On Chip Behavioral Monitoring pre-release", url: "assets/writeups/On_Chip_Behavioral_Monitoring.pdf" }
    ],
    sources: []
  },
  {
    id: "pixelpacker",
    title: "PixelPacker",
    shortTitle: "PixelPacker",
    overview: [
      "Developed **FPGA-accelerated image compression** for wildlife cameras on limited-bandwidth links. Background-aware latent differencing avoids retransmitting unchanged scenery.",
      "Reduced the encoder from **28.4 MB to 800 kB** through distillation and INT8 quantization. Implemented an **Artix-7 accelerator** and ESP32 compression path."
    ],
    year: "2025 to 2026",
    category: "Embedded AI",
    status: "Research project",
    featured: true,
    tags: ["Artix 7", "Neural compression", "ESP32", "INT8"],
    summary: "Edge and cloud neural image compression for bandwidth constrained wildlife camera traps.",
    problem: "Remote camera traps need useful imagery over links where raw images and conventional codecs are too expensive to transmit. Large neural codecs are also difficult to run at the edge.",
    work: [
      "Distilled and quantized a depthwise separable encoder to a 36 fold smaller memory footprint than its teacher.",
      "Developed an Artix 7 FPGA accelerator with pipelined DSPs, FIFO buffering, and DDR memory access.",
      "Implemented background aware latent differencing on ESP32 to exploit fixed camera viewpoints.",
      "Paired the edge encoder with a higher capacity cloud decoder for reconstruction."
    ],
    outcomes: [
      "Reached up to 200 fold compression over raw images in the reported evaluation.",
      "Reduced bitrate by more than ten fold against maximum JPEG compression while retaining comparable perceptual quality.",
      "Reported energy efficiency above 66 GOPS per joule for the hardware path."
    ],
    links: [
      { label: "Open project writeup", url: "assets/writeups/PixelPacker.pdf" }
    ],
    document: "assets/writeups/PixelPacker.pdf",
    documents: [
      { label: "PixelPacker writeup", url: "assets/writeups/PixelPacker.pdf" }
    ],
    sources: []
  },
  {
    id: "rizz8",
    title: "RIZZ 8",
    shortTitle: "RIZZ 8",
    overview: [
      "Independently designed and built an **8-bit Harvard processor** using discrete logic across **eight custom PCBs**.",
      "Defined the **instruction set** and wrote a **Python assembler**. Executed custom programs on physical hardware, completing the path from architecture to working system."
    ],
    year: "2025",
    category: "Hardware",
    status: "Completed",
    featured: true,
    tags: ["CPU design", "74 series logic", "PCB", "Assembler"],
    summary: "A custom eight bit Harvard architecture processor built from discrete logic across eight custom circuit boards.",
    problem: "The project tests computer architecture concepts as physical hardware rather than only as a simulation.",
    work: [
      "Designed a custom instruction set with signed and unsigned arithmetic, bitwise operations, and a 16 bit address space.",
      "Built the datapath and control system from 74 series logic on eight custom PCBs.",
      "Wrote a Python assembler for the custom instruction set.",
      "Loaded machine code into EEPROM and executed custom assembly programs on the processor."
    ],
    outcomes: [
      "Completed a working processor from ISA design through physical execution.",
      "Created the software tool needed to translate source programs into machine code."
    ],
    links: [],
    sources: []
  },
  {
    id: "watchtower",
    title: "WatchTower",
    shortTitle: "WatchTower",
    overview: [
      "Developed **open-set intrusion detection** for edge devices, addressing traffic from attacks absent from training data.",
      "Combined a transformer and 28 packet-level features with INT8 deployment on **Raspberry Pi 5**. Reported **3.82 ms inference** and **93.66 percent classification accuracy**."
    ],
    year: "2025",
    category: "Embedded AI",
    status: "Preprint",
    featured: true,
    tags: ["Network security", "Transformer", "Open set", "Raspberry Pi"],
    summary: "A packet window anomaly detector for known and unseen attacks on edge devices.",
    problem: "Closed set intrusion classifiers can force unfamiliar traffic into a known label. Edge deployment also requires predictable memory and latency.",
    work: [
      "Built a transformer detector around 28 packet level features.",
      "Integrated PROSER open set recognition, FedProx, and gated memory tokens.",
      "Applied INT8 quantization and TVM optimization for Raspberry Pi 5 deployment."
    ],
    outcomes: [
      "Reached 93.66 percent classification accuracy in the reported evaluation.",
      "Measured 3.82 millisecond inference latency on Raspberry Pi 5.",
      "Combined open set detection with a deployable edge inference path."
    ],
    links: [],
    document: "assets/writeups/WatchTower.pdf",
    documents: [
      { label: "WatchTower project report", url: "assets/writeups/WatchTower.pdf" }
    ],
    sources: []
  },
  {
    id: "cardy",
    title: "CARDY",
    shortTitle: "CARDY",
    overview: [
      "Designed **custom hardware and ESP8266 firmware** for a physical computing competition. Integrated local challenges, physical controls and live telemetry.",
      "Coordinated assembly and testing of **50 devices** used by **50 teams**. Delivered a complete platform from PCB design through event deployment."
    ],
    year: "2023",
    category: "Hardware",
    status: "Deployed",
    featured: true,
    tags: ["ESP8266", "PCB", "Telemetry", "LittleFS"],
    summary: "A physical interactive challenge platform deployed across 50 devices for 50 competing teams.",
    problem: "The event needed a repeatable hardware challenge that could serve content locally, capture physical input, and report live progress.",
    work: [
      "Developed ESP8266 firmware with an HTTP server, LittleFS storage, and hardware control interfaces.",
      "Designed the custom PCB and coordinated assembly and testing of 50 units.",
      "Built the telemetry path used to monitor teams during the event."
    ],
    outcomes: [
      "Deployed 50 physical units for 50 teams.",
      "Supported live operation and telemetry throughout the challenge."
    ],
    links: [
      { label: "View firmware on GitHub", url: "https://github.com/Foxunderground0/PSIFI-15-TechWars" }
    ],
    sources: []
  },
  {
    id: "keysiphon",
    title: "KeySiphon",
    shortTitle: "KeySiphon",
    overview: [
      "Built a **power-trace acquisition setup** to study RSA leakage on an instrumented ATmega328P.",
      "Trained a **1D CNN** to classify exponent-bit operations with **93.10 percent validation accuracy**. Connected physical measurement to automated side-channel analysis."
    ],
    year: "2025",
    category: "Research",
    status: "Completed",
    featured: false,
    tags: ["Side channel", "RSA", "ATmega328P", "1D CNN"],
    summary: "RSA exponent-bit classification from power traces on an instrumented ATmega328P prototype.",
    problem: "Cryptographic software can remain mathematically sound while its physical implementation leaks secret dependent activity through shared power infrastructure.",
    work: [
      "Lifted the target supply pin and tuned a 47 ohm shunt network to capture operation level power traces without brownout.",
      "Collected traces from square and multiply operations on an ATmega328P RSA implementation.",
      "Trained a 1D CNN to distinguish the cryptographic operations in noisy traces."
    ],
    outcomes: [
      "Reached 93.10 percent validation accuracy for operation classification.",
      "Connected physical trace acquisition to automated exponent-bit classification.",
      "Evaluated shared-supply leakage using an instrumented proof of concept. The reported accuracy measures bit classification, not full-key recovery."
    ],
    links: [
      { label: "Open project writeup", url: "assets/writeups/KeySiphon.pdf" }
    ],
    document: "assets/writeups/KeySiphon.pdf",
    documents: [
      { label: "KeySiphon writeup", url: "assets/writeups/KeySiphon.pdf" }
    ],
    sources: []
  },
  {
    id: "motion-coupled",
    title: "Motion-Coupled Sensing: When the State Change Powers Its Own Sensing",
    shortTitle: "Motion Coupled Sensing",
    overview: [
      "Co-developed **batteryless sensing hardware and LoRa firmware**. Routine hinge motion supplies the energy for sensing and reporting, removing battery maintenance and idle polling.",
      "Built a **10,000-actuation stress-test rig** and reduced boot-to-transmission time from **1,530 to under 125 ms**. The team measured **99.3 percent transmission reliability** over 5,945 bin-lid actuations."
    ],
    year: "2026",
    category: "Research",
    status: "Accepted at IEEE MASS",
    featured: false,
    tags: ["Transient computing", "Energy harvesting", "IoT", "Stress testing"],
    summary: "A sensing system where the physical state change supplies the energy needed to sense and report that event.",
    problem: "Battery powered event sensors add maintenance and waste to systems that may remain idle for long periods. The mechanical event itself can provide the energy needed to record it.",
    work: [
      "Built a stepper driven stress test rig for accelerated and repeatable actuation.",
      "Converted floating point firmware to fixed point arithmetic on an MCU without an FPU.",
      "Byte encoded and quantized the radio payload and tuned the RA-02 LoRa settings for range within the available energy budget.",
      "Removed the factory bootloader and designed the PCB around separation between high EMF and communication sections."
    ],
    outcomes: [
      "Reduced the main program loop from 520 to 7 CPU cycles.",
      "Reduced payload transmission time from 50 to 28 milliseconds and boot to transmission time from 1,530 to under 125 milliseconds.",
      "The harvester transmitted after each of 10,000 accelerated actuations.",
      "Field reliability reached 99.3 percent across 5,945 lid actuations at five campus sites.",
      "Demonstrated batteryless smart bin fill monitoring with long range cloud transmission.",
      "The work was accepted at IEEE MASS 2026."
    ],
    links: [
      { label: "Read on arXiv", url: "https://arxiv.org/abs/2605.19793" },
      { label: "Hardware and firmware", url: "https://github.com/SYSNET-LUMS/Batteryless-event-driven-sensing-platform" },
      { label: "Open local paper", url: "assets/papers/Motion_Coupled_Sensing.pdf" }
    ],
    document: "assets/papers/Motion_Coupled_Sensing.pdf",
    documents: [
      { label: "Motion Coupled Sensing paper", url: "assets/papers/Motion_Coupled_Sensing.pdf" },
      { label: "Earlier Cleanify draft", url: "assets/papers/archive/Motion_Coupled_Sensing_Early_Draft.pdf" }
    ],
    sources: []
  },
  {
    id: "kissan-dost",
    title: "Kissan-Dost: Bridging the Last Mile in Smallholder Precision Agriculture with Conversational IoT",
    shortTitle: "Kissan Dost",
    overview: [
      "Built the **multi-hop ESP-NOW monitoring mesh** and ESP32 gateway behind **Urdu WhatsApp text and voice guidance**. The system makes farm measurements usable without technical dashboards.",
      "Deployed sensing hardware at **two sites for 45 days each**. A five-participant pilot found near-daily chatbot use and guidance that informed irrigation decisions."
    ],
    year: "2026",
    category: "Research",
    status: "Accepted at IEEE DCOSS IoT",
    featured: false,
    tags: ["Precision agriculture", "ESP NOW", "Mesh network", "Conversational IoT"],
    summary: "Urdu WhatsApp text and voice advice grounded in live soil and climate measurements for smallholder farmers.",
    problem: "Technical dashboards and language barriers make farm sensor data difficult to use. Smallholder farmers need guidance in familiar languages and interfaces.",
    work: [
      "Built the multi hop ESP NOW monitoring mesh that relayed soil and climate measurements to a gateway.",
      "Supported sensing, firmware, and field deployment at two sites.",
      "Connected measured field conditions to a multilingual WhatsApp interface supporting text and voice queries."
    ],
    outcomes: [
      "The five-participant pilot ran at two field sites for 45 days each.",
      "The mesh extended coverage beyond direct gateway range.",
      "Farmers maintained near daily use and used the guidance to inform irrigation after dashboard engagement faded.",
      "Model judges scored correctness above 90 percent on 99 sensor-grounded crop queries.",
      "The work was accepted at IEEE DCOSS IoT 2026."
    ],
    links: [
      { label: "Read on arXiv", url: "https://arxiv.org/abs/2602.08593" },
      { label: "Open local paper", url: "assets/papers/Kissan_Dost.pdf" }
    ],
    document: "assets/papers/Kissan_Dost.pdf",
    documents: [
      { label: "Kissan Dost paper", url: "assets/papers/Kissan_Dost.pdf" },
      { label: "Kissan Dost submission manuscript", url: "assets/papers/archive/Kissan_Dost_Submission.pdf" }
    ],
    sources: []
  },
  {
    id: "wearables",
    title: "LLM Enhanced Wearables",
    shortTitle: "LLM Enhanced Wearables",
    overview: [
      "Designed a **$12.72 screenless wearable** and BLE firmware for plain-language WhatsApp health feedback. The system addresses affordability and difficulty interpreting sensor data.",
      "Supported a **20-participant study** over 96 hours. Mean self-rated health-data comprehension increased from **3.05 to 3.60 out of 5**."
    ],
    year: "2026",
    category: "Research",
    status: "Preprint",
    featured: false,
    tags: ["Digital health", "Wearables", "LLM", "LMIC"],
    summary: "Plain language WhatsApp health feedback from a low cost wearable for users with limited health literacy.",
    problem: "Raw wearable measurements are difficult to interpret without clinical context. Access to in person guidance is also uneven in many low resource settings.",
    work: [
      "Designed a $12.72 screenless ATmega328P band and BLE firmware.",
      "Combined PPG with temperature and motion sensing.",
      "Co-developed plain language WhatsApp health feedback and supported a 20 participant study over 96 hours."
    ],
    outcomes: [
      "Produced a public preprint and supporting system implementation.",
      "Mean self rated health data comprehension rose from 3.05 to 3.60 out of 5."
    ],
    links: [
      { label: "Read on arXiv", url: "https://arxiv.org/abs/2602.08701" },
      { label: "Open local paper", url: "assets/papers/LLM_Enhanced_Wearables.pdf" },
      { label: "Guardian Angel code", url: "https://github.com/the-nullhypothesis/Guardian-Angel" }
    ],
    document: "assets/papers/LLM_Enhanced_Wearables.pdf",
    documents: [
      { label: "LLM Enhanced Wearables preprint", url: "assets/papers/LLM_Enhanced_Wearables.pdf" }
    ],
    sources: []
  },
  {
    id: "parda",
    title: "PARDA",
    shortTitle: "PARDA",
    overview: [
      "Designed **on-device audio privacy** for smart glasses. Combined cross-turn context, retrieval and a distilled **2B model** to redact inferred private attributes and replace speaker voices.",
      "On **143 held-out conversations**, reduced model-judged leakage from **0.502 to 0.378** while utility rose from 0.875 to 0.900. Evaluated quantized deployment on **Raspberry Pi 5**."
    ],
    year: "2026",
    category: "Research",
    status: "Submitted manuscript",
    featured: false,
    tags: ["Audio privacy", "Smart glasses", "On device AI", "Small language models"],
    summary: "Context aware audio redaction and voice replacement for smart glasses using a compact on device language model.",
    problem: "Smart glasses can reveal bystander identity and private attributes inferred across conversation turns. Local processing must protect that information while retaining useful conversation content.",
    work: [
      "Designed context aware redaction and voice replacement for bystander audio.",
      "Built a silver-labeling pipeline for 717 CANDOR conversations. Combined speaker profiles and retrieval with a distilled 2B model trained through preference optimization.",
      "Deployed Q4 inference and ONNX audio processing on Raspberry Pi 5."
    ],
    outcomes: [
      "Produced a first author manuscript submitted to IEEE PerCom 2027.",
      "Reduced model-judged privacy leakage from 0.502 to 0.378 on 143 held-out conversations. Utility increased from 0.875 to 0.900.",
      "The deployed Q4 model scored 0.400 leakage and 0.902 utility. Full-precision results are reported separately.",
      "The audio front end achieved a 0.77 weighted real time factor. This measurement does not describe the complete pipeline."
    ],
    links: [
      { label: "Open submitted manuscript", url: "assets/writeups/PARDA.pdf" }
    ],
    document: "assets/writeups/PARDA.pdf",
    documents: [
      { label: "PARDA submitted manuscript", url: "assets/writeups/PARDA.pdf" }
    ],
    sources: []
  },
  {
    id: "imd-security",
    title: "Pacemaker Security Study",
    shortTitle: "Pacemaker Security",
    overview: [
      "Instrumented a laboratory **pacemaker** and built BLE experiments using **HackRF, nRF52840 and ESP32** to study battery-depletion risk.",
      "Crafted connection attempts extended observed wake time from roughly **2 to 10.8 seconds**. Measured energy per connection to quantify the cost of unauthorized wireless activity."
    ],
    year: "2026",
    category: "Research",
    status: "Completed study",
    featured: false,
    tags: ["BLE", "HackRF", "Power measurement", "Medical devices"],
    summary: "Black box BLE and energy characterization of a commercial implantable cardiac device.",
    problem: "Wireless access can move an implantable device from deep sleep into a more expensive communication state even when no privileged manufacturer tools are available.",
    work: [
      "Powered and instrumented a laboratory Medtronic device for repeatable measurement.",
      "Used HackRF, nRF52840, ESP32, and custom scripts to study advertising and connection behavior.",
      "Crafted BLE attempts across security modes to extend the observed connection window from roughly two seconds to 10.81 seconds.",
      "Measured energy across deep sleep, beacon, and connectivity states."
    ],
    outcomes: [
      "Measured 1.56 to 1.93 millijoules per 10.6 second connection.",
      "A single connection used energy comparable to roughly 40 to 71 minutes of deep sleep.",
      "Characterized a fixed 10.81 second authentication window."
    ],
    links: [],
    sources: []
  },
  {
    id: "wristband",
    title: "Long Life Maternal Health Wristband",
    shortTitle: "Maternal Health Wristband",
    overview: [
      "**Designed and hand-assembled a four-layer nRF52 wristband** for temperature monitoring in maternal-health research in rural Sindh.",
      "Built the schematic, PCB and firmware as an **end-to-end sensing platform**. Targeted four months per charge for field studies with limited charging access."
    ],
    year: "2025 to 2026",
    category: "Hardware",
    status: "Research prototype",
    featured: false,
    tags: ["nRF52832", "Four layer PCB", "Wearables", "Low power"],
    summary: "A low power wristband for studying temperature variation and pregnancy outcomes in rural Sindh.",
    problem: "Longitudinal temperature sensing requires a wearable that can operate through field studies with little maintenance and limited charging access.",
    work: [
      "Designed the complete schematic and four layer PCB around an nRF52 series microcontroller.",
      "Prepared the board for JLCPCB manufacturing and hand assembled the surface mount components.",
      "Developed the hardware and firmware as an end to end in house platform."
    ],
    outcomes: [
      "Produced a wearable prototype targeted at four months of operation per charge.",
      "Created a reusable sensing platform for maternal health field research."
    ],
    links: [],
    sources: []
  },
  {
    id: "voltage-trace-bench",
    title: "Arbitrary Voltage Trace Replay Bench",
    shortTitle: "Voltage Trace Replay Bench",
    overview: [
      "Built an **arbitrary voltage-trace replay bench** using laptop-controlled function generators and amplifiers.",
      "Made power conditions **repeatable across experiments** on transiently powered devices. Supported SYSNET research including CheckMate."
    ],
    year: "2024",
    category: "Research",
    status: "SYSNET laboratory infrastructure",
    featured: false,
    tags: ["Transient computing", "Instrumentation", "Function generators", "Power measurement"],
    summary: "A digitally controlled bench for replaying recorded voltage traces to test transiently powered electronics.",
    problem: "Intermittent computing systems need repeatable power conditions to compare behavior under the same energy supply.",
    work: [
      "Built a laptop controlled setup to replay arbitrary recorded voltage traces.",
      "Combined function generators and amplifiers to supply transiently powered electronics.",
      "Used the setup to measure device behavior under repeatable voltage profiles during SYSNET research."
    ],
    outcomes: [
      "Created experimental infrastructure for evaluating transiently powered systems.",
      "Supported laboratory experiments including the CheckMate project."
    ],
    links: [{ label: "SYSNET Lab", url: "https://sysnet.lums.edu.pk/" }],
    sources: []
  },
  {
    id: "wit-long-range",
    title: "WIT Summer Internship",
    shortTitle: "WIT Summer Internship",
    year: "2025",
    category: "Research",
    status: "Completed internship",
    featured: false,
    tags: ["ESP32", "ESP NOW", "Soil monitoring", "Low power"],
    summary: "ESP32 radio and power characterization for long term soil monitoring at WIT LUMS.",
    problem: "Distributed soil sensors need affordable wireless links and low energy use to operate across field sites with limited maintenance.",
    work: [
      "Evaluated ESP NOW as a communication option for soil monitoring nodes during a summer internship.",
      "Characterized boot and transmission current using laboratory instruments.",
      "Modified development board hardware and optimized firmware clock domains and sleep behavior.",
      "Tested long range communication in a semiurban environment."
    ],
    outcomes: [
      "Demonstrated communication over at least 500 metres with mild obstructions.",
      "Measured approximately 8.8 microamps in the optimized sleep configuration.",
      "Documented the feasibility study and experimental measurements in an internship presentation."
    ],
    presentation: {
      label: "WIT ESP NOW soil monitoring presentation",
      path: "assets/presentations/WIT_Summer_Internship.pptx"
    },
    links: [{ label: "Centre for Water Informatics and Technology at LUMS", url: "https://wit.lums.edu.pk/" }],
    sources: []
  },
  {
    id: "robot-path-tracking",
    title: "Robot Path Tracking and Planning",
    shortTitle: "Robot Path Tracking",
    year: "2024",
    category: "Hardware",
    status: "PSIFI competition setup",
    featured: false,
    tags: ["Robotics", "Path planning", "Line tracking", "PSIFI"],
    summary: "A physical grid course and dynamic path planning demonstration for the PSIFI line following robot competition.",
    problem: "A robot competition needs a repeatable course for testing how robots follow lines and navigate routes.",
    work: [
      "Prepared a physical grid based course for the line following robot competition.",
      "Developed a dynamic path finding demonstration and visualized routes across the course."
    ],
    outcomes: [
      "Produced a competition course and a software route demonstration.",
      "Connected physical path tracking with visual route planning for the PSIFI event."
    ],
    links: [],
    sources: []
  },
  {
    id: "summer-school-iot",
    title: "Summer School IoT Demonstration",
    shortTitle: "Summer School IoT",
    year: "2024",
    category: "Teaching",
    status: "LUMS Summer School",
    featured: false,
    tags: ["IoT", "Smart switch", "Teaching", "Embedded systems"],
    summary: "A smart switch demonstration used to teach IoT to children at LUMS Summer School.",
    problem: "A live demonstration makes the link between software and physical devices easier to explain to students learning IoT.",
    work: [
      "Built and demonstrated a smart switch during the summer between my freshman and sophomore years.",
      "Used a working lamp control setup to explain connected devices and IoT to children."
    ],
    outcomes: ["Provided a physical demonstration for the summer school teaching sessions."],
    links: [{ label: "LUMS Summer School", url: "https://summer.lums.edu.pk/" }],
    sources: []
  },
  {
    id: "chassis-modeling",
    title: "Vehicle Chassis Modeling",
    shortTitle: "Chassis Modeling",
    year: "",
    category: "Hardware",
    status: "Freelance project",
    featured: false,
    tags: ["3D CAD", "Mechanical design", "Chassis", "Modeling"],
    summary: "Freelance 3D modeling of a vehicle chassis and its mechanical parts.",
    problem: "A chassis design needs a clear model of its frame and component geometry before the design can be reviewed.",
    work: [
      "Modeled the chassis frame and individual mechanical parts in 3D CAD.",
      "Prepared renders and an animation to show the design."
    ],
    outcomes: ["Produced a set of chassis design models and visualizations for freelance work."],
    links: [],
    sources: []
  },
  {
    id: "thermal-codec",
    title: "Lossless Thermal Video Codec",
    shortTitle: "Thermal Codec",
    overview: [
      "Co-developed **lossless compression for 16-bit thermal video** using temporal prediction and sensor-noise structure.",
      "Produced files **15 percent smaller than FFV1 on average** at comparable processing cost. No larger outputs in the tested sets, with a best case of one-third the size."
    ],
    year: "2025 to 2026",
    category: "Systems",
    status: "Research prototype",
    featured: false,
    tags: ["Lossless compression", "Thermal imaging", "16 bit video", "Temporal prediction"],
    summary: "A codec for noisy 16 bit thermal camera streams using temporal predictors and sensor noise structure.",
    problem: "General lossless codecs do not fully exploit the temporal behavior and noise patterns of raw thermal camera data.",
    work: [
      "Designed temporal predictors around thermal scene continuity.",
      "Modeled camera noise patterns to avoid spending bits on predictable sensor behavior.",
      "Benchmarked encode and decode cost against FFV1 across recorded datasets."
    ],
    outcomes: [
      "Produced files 15 percent smaller than FFV1 on average at similar encode and decode cost.",
      "Recorded no regression against FFV1 across the tested sets.",
      "The smallest output was one-third the size of FFV1 on the same input."
    ],
    links: [],
    sources: []
  },
  {
    id: "kernel-driver",
    title: "Raspberry Pi Kernel Driver",
    shortTitle: "Kernel Driver",
    overview: [
      "Developed a **Linux I2C kernel driver** and userspace device interface for an MPU6050 sensor.",
      "Optimized register transactions to reach **1,700 samples per second**. Added kernel buffer handling and validation for userspace transfers."
    ],
    year: "2023",
    category: "Systems",
    status: "Completed",
    featured: false,
    tags: ["Linux kernel", "I2C", "MPU6050", "C"],
    summary: "A Linux I2C kernel module with a userspace device interface for high rate sensor sampling.",
    problem: "The project moved sensor communication into the kernel to study the boundary between hardware, drivers, and userspace.",
    work: [
      "Developed the driver through the Linux I2C subsystem.",
      "Exposed a device interface for userspace communication.",
      "Implemented kernel buffer handling and validation for userspace transfers."
    ],
    outcomes: [
      "Reached 1,700 samples per second through optimized register transactions.",
      "Produced a public implementation for Raspberry Pi."
    ],
    links: [
      { label: "View code on GitHub", url: "https://github.com/Foxunderground0/MPU-6050-Kernel-Driver" }
    ],
    sources: []
  },
  {
    id: "knock-detector",
    title: "ESP32 Knock Detector",
    shortTitle: "Knock Detector",
    year: "2023",
    category: "Embedded AI",
    status: "Completed",
    featured: false,
    tags: ["ESP32", "TensorFlow Lite", "MPU6050", "Quantization"],
    summary: "An on device vibration classifier that recognizes knocks and triggers a local action.",
    problem: "The detector needed to classify short vibration windows without a network connection or a large inference runtime.",
    work: [
      "Built the collection and visualization pipeline for 1,000 sample accelerometer windows.",
      "Trained a convolutional model and applied pruning and quantization for ESP32 deployment.",
      "Integrated the model with an MPU6050 and local actuation path."
    ],
    outcomes: [
      "Reduced the model from 431 KB to 39 KB after pruning and quantization.",
      "Reported 99.29 percent validation accuracy in the project evaluation."
    ],
    links: [
      { label: "View code on GitHub", url: "https://github.com/Foxunderground0/ESP32-TFLite-Knock-Detector" }
    ],
    sources: []
  },
  {
    id: "digital-level",
    title: "Digital Level Meter",
    shortTitle: "Digital Level",
    year: "2023",
    category: "Hardware",
    status: "Completed",
    featured: false,
    tags: ["ATtiny85", "MPU6050", "PCB", "Low power"],
    summary: "A compact tilt meter with LED feedback and sleep modes for low power operation.",
    problem: "The project replaces a visual bubble level with a small electronic tool that provides direct directional feedback.",
    work: [
      "Read tilt from an MPU6050 with an ATtiny85.",
      "Designed the circuit and PCB around compact assembly constraints.",
      "Added sleep behavior to reduce idle power."
    ],
    outcomes: [
      "Produced a manufacturable PCB and working firmware.",
      "Created real time positive and negative tilt indication."
    ],
    links: [
      { label: "View code and PCB on GitHub", url: "https://github.com/Foxunderground0/Digital-Level-Meter" }
    ],
    sources: []
  },
  {
    id: "buggy-v",
    title: "Buggy V Verification",
    shortTitle: "Buggy V",
    overview: [
      "Debugged **RISC-V RTL** and built an architectural compliance workflow using **Sail and Verilator**.",
      "Our team won **first place** at the Pakistan Semiconductor Summit Hackathon 2026. Set up linker scripts, build targets and test execution during the seven-hour challenge."
    ],
    year: "2026",
    category: "Hardware",
    status: "Hackathon winner",
    featured: false,
    tags: ["RISC V", "SystemVerilog", "Sail", "Verilator"],
    summary: "RISC V RTL verification and debugging completed for the Pakistan Semiconductor Summit Hackathon.",
    problem: "The challenge required finding and validating faults in an application class RISC V system on chip.",
    work: [
      "Used Sail as an architectural reference and Verilator for RTL simulation.",
      "Identified and fixed RTL bugs and traced mismatches through the processor and memory system.",
      "Built the verification flow for the target with handwritten linker scripts, Make targets, and verification ELFs executed through Verilator."
    ],
    outcomes: [
      "Won first place at the Pakistan Semiconductor Summit Hackathon 2026 after a seven hour verification challenge."
    ],
    links: [
      { label: "View repository on GitHub", url: "https://github.com/Foxunderground0/Buggy-V" },
      { label: "Pakistan Semiconductor Summit", url: "https://paksemisummit.com/" }
    ],
    sources: []
  },
  {
    id: "techwars-2024",
    title: "TechWars Hardware Platform 2024",
    shortTitle: "TechWars 2024",
    year: "2024",
    category: "Hardware",
    status: "Completed",
    featured: false,
    tags: ["Embedded C", "Event hardware", "Firmware"],
    summary: "Firmware and hardware for the 2024 TechWars challenge platform.",
    problem: "A live event needs hardware that can be reproduced, reset, and supported under time pressure.",
    work: [
      "Developed the embedded challenge firmware.",
      "Prepared the system for repeatable use during the event."
    ],
    outcomes: [
      "Released the implementation as a public repository."
    ],
    links: [
      { label: "View repository on GitHub", url: "https://github.com/Foxunderground0/PSIFI-16-TECHWARS" }
    ],
    sources: []
  },
  {
    id: "makers-dashboard",
    title: "Makers Lab Dashboard",
    shortTitle: "Makers Lab Dashboard",
    year: "2024",
    category: "Software",
    status: "Completed",
    featured: false,
    tags: ["JavaScript", "Dashboard", "Lab operations"],
    summary: "A web dashboard for equipment and activity tracking in a makers lab.",
    problem: "Shared fabrication spaces need a simple view of lab activity and resources.",
    work: [
      "Built the browser interface and data views.",
      "Organized the dashboard around day to day lab use."
    ],
    outcomes: [
      "Produced a deployable dashboard and public source repository."
    ],
    links: [
      { label: "View code on GitHub", url: "https://github.com/Foxunderground0/Makers-Lab-Dashboard" }
    ],
    sources: []
  },
  {
    id: "voice-agent",
    title: "Streaming Voice Agent",
    shortTitle: "Voice Agent",
    year: "2024 to 2025",
    category: "Software",
    status: "Professional project",
    featured: false,
    tags: ["WebSockets", "WebRTC VAD", "Whisper", "GPT 4"],
    summary: "A streaming speech interface with online transcription, response generation, and audio pipeline control.",
    problem: "A useful spoken agent needs to respond quickly despite capture, endpointing, transcription, generation, and playback delays.",
    work: [
      "Built the streaming service in Node.js with WebSockets.",
      "Integrated WebRTC voice activity detection with Whisper and GPT 4.",
      "Optimized buffering and stage overlap across the audio pipeline."
    ],
    outcomes: [
      "Reduced end to end response latency to under four seconds."
    ],
    links: [],
    sources: []
  },
  {
    id: "go-chat",
    title: "ChatterFox",
    shortTitle: "ChatterFox",
    year: "2023",
    category: "Software",
    status: "Completed",
    featured: false,
    tags: ["Go", "Chat", "Networking"],
    summary: "A networked chat application written in Go.",
    problem: "The project explores concurrent connections and message delivery in a small network service.",
    work: [
      "Implemented the chat service and client flow in Go.",
      "Handled multiple networked participants and message exchange."
    ],
    outcomes: ["Released the implementation as a public repository."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/GO-ChatterFox-ChatApp" }],
    sources: []
  },
  {
    id: "jpeg-codec",
    title: "JPEG Encoder and Decoder",
    shortTitle: "JPEG Codec",
    year: "2023",
    category: "Systems",
    status: "Completed",
    featured: false,
    tags: ["C++", "Image coding", "Compression"],
    summary: "A C++ implementation of the core stages used to encode and decode JPEG images.",
    problem: "The project studies image compression by implementing the transform and coding path directly.",
    work: [
      "Implemented the encoder and decoder in C++.",
      "Worked through block transforms, quantization, and coded image reconstruction."
    ],
    outcomes: ["Produced a working codec implementation and public source repository."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/CPP-JPEG-Encoder-Decoder" }],
    sources: []
  },
  {
    id: "redis-cache",
    title: "Postgres and Redis Cache Experiment",
    shortTitle: "Redis Cache Experiment",
    year: "2023",
    category: "Software",
    status: "Completed",
    featured: false,
    tags: ["Node.js", "Postgres", "Redis", "Authentication"],
    summary: "A small backend for comparing direct database access with a Redis caching layer.",
    problem: "The experiment studies how a cache changes repeated access patterns in an authenticated service.",
    work: [
      "Built the service in TypeScript with user authentication.",
      "Connected Postgres storage and Redis caching paths."
    ],
    outcomes: ["Released the experiment as a public repository."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/NodeJS-UserAuth-Postgress-Redis-Cache" }],
    sources: []
  },
  {
    id: "poki-api",
    title: "Image Emotion API",
    shortTitle: "Image Emotion API",
    year: "2023",
    category: "Software",
    status: "Completed",
    featured: false,
    tags: ["Python", "Computer vision", "Node.js", "API"],
    summary: "A pipeline that collects images, removes duplicates, classifies facial emotion, and serves results through an API.",
    problem: "The project links data collection, cleanup, model inference, and delivery into one usable pipeline.",
    work: [
      "Collected images and removed duplicates with SHA 256 hashes.",
      "Detected faces and classified emotion with a convolutional model.",
      "Served processed images through a Node.js API."
    ],
    outcomes: ["Produced an end to end data and inference service."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/POKI-API" }],
    sources: []
  },
  {
    id: "voice-classification",
    title: "Voice Gender Classification",
    shortTitle: "Voice Classification",
    year: "2023",
    category: "Embedded AI",
    status: "Completed",
    featured: false,
    tags: ["TensorFlow", "Audio", "Classification"],
    summary: "A TensorFlow audio classification project for voice characteristics.",
    problem: "The project studies compact feature extraction and classification for short speech recordings.",
    work: ["Prepared audio inputs and trained a TensorFlow classifier.", "Built an inference path around the trained model."],
    outcomes: ["Released the implementation as a public repository."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/TensorFlow-Voice-Gender-Classification" }],
    sources: []
  },
  {
    id: "smart-gloves",
    title: "Smart Braille Gloves",
    shortTitle: "Smart Gloves",
    year: "2021",
    category: "Hardware",
    status: "Completed",
    featured: false,
    tags: ["Bluetooth", "Accessibility", "Touch sensing", "Python"],
    summary: "A wearable Braille keyboard that sends touch input to a computer over Bluetooth.",
    problem: "The project creates a compact text input path for users who communicate through Braille.",
    work: [
      "Mapped touch sensor combinations to Braille characters.",
      "Sent decoded input over Bluetooth.",
      "Built a Python receiver that entered the characters as keyboard input."
    ],
    outcomes: ["Produced a working wearable input prototype for Teknofest."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/Smart-Gloves-Tecknofest-2021" }],
    sources: []
  },
  {
    id: "softec-ai",
    title: "SOFTEC AI Challenge",
    shortTitle: "SOFTEC AI",
    year: "2024",
    category: "Embedded AI",
    status: "Completed",
    featured: false,
    tags: ["Machine learning", "Jupyter", "Competition"],
    summary: "A machine learning system developed for the SOFTEC 2024 AI competition.",
    problem: "The project addressed a timed applied machine learning challenge from data inspection through model evaluation.",
    work: ["Prepared the data and experimental notebooks.", "Trained and evaluated candidate models under competition constraints."],
    outcomes: ["Released the competition work as a public repository."],
    links: [{ label: "View work on GitHub", url: "https://github.com/Foxunderground0/SOFTEC-24-AIC" }],
    sources: []
  },
  {
    id: "raspberry-pi-scripts",
    title: "Raspberry Pi Scripts",
    shortTitle: "Raspberry Pi Scripts",
    year: "2020",
    category: "Archive",
    status: "Public archive",
    featured: false,
    tags: ["Raspberry Pi", "Python", "Utilities"],
    summary: "A small collection of Python utilities for Raspberry Pi systems.",
    problem: "The repository collects repeatable scripts for common Raspberry Pi tasks.",
    work: ["Built and documented utilities for Raspberry Pi use."],
    outcomes: ["Maintained the scripts as a public reference."],
    links: [{ label: "View scripts on GitHub", url: "https://github.com/Foxunderground0/Raspberry-Pi-Scripts" }],
    sources: []
  },
  {
    id: "weather-app",
    title: "Weather App",
    shortTitle: "Weather App",
    year: "2021",
    category: "Archive",
    status: "Public archive",
    featured: false,
    tags: ["Node.js", "EJS", "Web"],
    summary: "A Node.js weather application with server rendered views.",
    problem: "The project explores API backed web pages and server side rendering.",
    work: ["Built the service in Node.js with EJS templates."],
    outcomes: ["Released the application as a public repository."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/Weather-App" }],
    sources: []
  },
  {
    id: "signal-themes",
    title: "Signal Themes",
    shortTitle: "Signal Themes",
    year: "2021",
    category: "Archive",
    status: "Public archive",
    featured: false,
    tags: ["CSS", "Themes", "Interface"],
    summary: "A collection of custom visual themes for Signal.",
    problem: "The collection explores small interface changes through reusable CSS themes.",
    work: ["Designed and organized a set of Signal themes."],
    outcomes: ["Published the collection for reuse."],
    links: [{ label: "View themes on GitHub", url: "https://github.com/Foxunderground0/Signal-Themes" }],
    sources: []
  },
  {
    id: "ping-plot",
    title: "Ping Plot",
    shortTitle: "Ping Plot",
    year: "2020",
    category: "Archive",
    status: "Public archive",
    featured: false,
    tags: ["Python", "Networking", "Matplotlib"],
    summary: "A Python utility that records and plots network latency to a server.",
    problem: "A time series view makes intermittent latency and connectivity changes easier to inspect.",
    work: ["Collected repeated ping measurements and plotted the results with Matplotlib."],
    outcomes: ["Released the utility as a public repository."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/Ping-Plot" }],
    sources: []
  },
  {
    id: "atari-breakout",
    title: "Atari Breakout",
    shortTitle: "Atari Breakout",
    year: "2020",
    category: "Archive",
    status: "Public archive",
    featured: false,
    tags: ["Unity", "C sharp", "Game"],
    summary: "A small Breakout style game built in Unity.",
    problem: "The project studies real time input, collision behavior, and simple game state.",
    work: ["Built the gameplay loop and visual effects in Unity."],
    outcomes: ["Released the project as a public repository."],
    links: [{ label: "View project on GitHub", url: "https://github.com/Foxunderground0/Atari-Breakout" }],
    sources: []
  },
  {
    id: "landing-page",
    title: "Landing Page Study",
    shortTitle: "Landing Page Study",
    year: "2021",
    category: "Archive",
    status: "Public archive",
    featured: false,
    tags: ["HTML", "CSS", "Web"],
    summary: "An early static landing page and CSS layout study.",
    problem: "The project explores responsive layout and visual hierarchy with plain web technologies.",
    work: ["Built the page with HTML and CSS."],
    outcomes: ["Kept the work as a public archive."],
    links: [{ label: "View code on GitHub", url: "https://github.com/Foxunderground0/Fake-Landing-Page" }],
    sources: []
  }
];

window.SITE_LINKS = {
  github: "https://github.com/Foxunderground0",
  linkedin: "https://www.linkedin.com/in/umer-irfan--",
  sysnet: "https://sysnet.lums.edu.pk/",
  chase: "https://chase.lums.edu.pk/index.html",
  naveed: "https://naveedanwarbhatti.github.io/",
  siddiqi: "https://lums.edu.pk/lums_employee/9462"
};
