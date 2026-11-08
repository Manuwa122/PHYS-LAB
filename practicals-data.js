// Experiment labels follow NIE Physics Practical Handbook (2017 syllabus).
export const practicals = [
  {
    "id": "01",
    "title": "Vernier callipers",
    "category": "Measurements",
    "formula": "MSR + (VSR × LC)",
    "model": "vernier"
  },
  {
    "id": "02",
    "title": "Micrometer screw gauge",
    "category": "Measurements",
    "formula": "PSR + (CSR × LC) − zero error",
    "model": "micrometer"
  },
  {
    "id": "03",
    "title": "Spherometer",
    "category": "Measurements",
    "formula": "R = l²/(6h) + h/2",
    "model": "spherometer"
  },
  {
    "id": "04",
    "title": "Travelling microscope",
    "category": "Measurements",
    "formula": "Reading = MSR + (VSR × LC)",
    "model": "vernier"
  },
  {
    "id": "05",
    "title": "Parallelogram of forces",
    "category": "Mechanics",
    "formula": "R² = P² + Q² + 2PQ cos θ",
    "model": "forces"
  },
  {
    "id": "06",
    "title": "Principle of moments",
    "category": "Mechanics",
    "formula": "F₁d₁ = F₂d₂",
    "model": "moments"
  },
  {
    "id": "07",
    "title": "Relative density by U-tube",
    "category": "Properties of Matter",
    "formula": "ρ₁h₁ = ρ₂h₂",
    "model": "utube"
  },
  {
    "id": "08",
    "title": "Relative density by Hare’s apparatus",
    "category": "Properties of Matter",
    "formula": "ρ₁h₁ = ρ₂h₂",
    "model": "utube"
  },
  {
    "id": "09",
    "title": "Density using a weighted test tube",
    "category": "Properties of Matter",
    "formula": "ρ = m / V",
    "model": "density"
  },
  {
    "id": "10",
    "title": "Acceleration due to gravity using a simple pendulum",
    "category": "Oscillations & Waves",
    "formula": "g = 4π²L/T²",
    "model": "pendulum"
  },
  {
    "id": "11",
    "title": "Mass and period of a helical spring",
    "category": "Oscillations & Waves",
    "formula": "T = 2π√(m/k)",
    "model": "spring"
  },
  {
    "id": "12",
    "title": "Tuning fork frequency using sonometer",
    "category": "Oscillations & Waves",
    "formula": "f = (1/2L)√(F/μ)",
    "model": "sonometer"
  },
  {
    "id": "13",
    "title": "Frequency and vibrating length using sonometer",
    "category": "Oscillations & Waves",
    "formula": "f ∝ 1/L (fixed F and μ)",
    "model": "sonometer"
  },
  {
    "id": "14",
    "title": "Sound velocity & end correction, closed resonance tube (one fork)",
    "category": "Oscillations & Waves",
    "formula": "v = 2f(L₂−L₁)",
    "model": "resonance"
  },
  {
    "id": "15",
    "title": "Sound velocity & end correction, closed resonance tube (multiple forks)",
    "category": "Oscillations & Waves",
    "formula": "v = 2f(L₂−L₁)",
    "model": "resonance"
  },
  {
    "id": "16",
    "title": "Refractive index of glass using travelling microscope",
    "category": "Optics",
    "formula": "n = real depth / apparent depth",
    "model": "refractive"
  },
  {
    "id": "17",
    "title": "Minimum deviation by ray tracing through a prism",
    "category": "Optics",
    "formula": "n = sin[(A+Dₘ)/2] / sin(A/2)",
    "model": "prism"
  },
  {
    "id": "18",
    "title": "Prism refractive index by critical angle",
    "category": "Optics",
    "formula": "n = 1/sin C",
    "model": "critical"
  },
  {
    "id": "19",
    "title": "Spectrometer adjustment & prism angle",
    "category": "Optics",
    "formula": "A = ½ × angle between reflected rays",
    "model": "angles"
  },
  {
    "id": "20",
    "title": "Minimum deviation and prism index by spectrometer",
    "category": "Optics",
    "formula": "n = sin[(A+Dₘ)/2] / sin(A/2)",
    "model": "prism"
  },
  {
    "id": "21.1",
    "title": "Convex lens focal length by no-parallax method",
    "category": "Optics",
    "formula": "1/f = 1/u + 1/v (real distances)",
    "model": "lens"
  },
  {
    "id": "21.2",
    "title": "Concave lens focal length by no-parallax method",
    "category": "Optics",
    "formula": "1/f = 1/u + 1/v (signed distances)",
    "model": "notebook"
  },
  {
    "id": "22",
    "title": "Atmospheric pressure using a quill tube",
    "category": "Thermal Physics",
    "formula": "P₁V₁ = P₂V₂ (isothermal)",
    "model": "gas"
  },
  {
    "id": "23",
    "title": "Gas volume versus absolute temperature (constant pressure)",
    "category": "Thermal Physics",
    "formula": "V/T = constant",
    "model": "charles"
  },
  {
    "id": "24",
    "title": "Gas pressure versus absolute temperature (constant volume)",
    "category": "Thermal Physics",
    "formula": "P/T = constant",
    "model": "pressure"
  },
  {
    "id": "25",
    "title": "Specific heat capacity of solid by mixtures",
    "category": "Thermal Physics",
    "formula": "Heat lost = heat gained",
    "model": "calorimetry"
  },
  {
    "id": "26",
    "title": "Specific heat capacity of liquid by cooling",
    "category": "Thermal Physics",
    "formula": "Compare cooling rates with heat capacities",
    "model": "notebook"
  },
  {
    "id": "27",
    "title": "Latent heat of fusion of ice by mixtures",
    "category": "Thermal Physics",
    "formula": "Heat lost = mL + sensible heating",
    "model": "notebook"
  },
  {
    "id": "28",
    "title": "Latent heat of vaporization of water by mixtures",
    "category": "Thermal Physics",
    "formula": "Heat gained = mL + sensible cooling",
    "model": "notebook"
  },
  {
    "id": "29",
    "title": "Relative humidity using a polished calorimeter",
    "category": "Thermal Physics",
    "formula": "RH = pᵥ / pₛ × 100%",
    "model": "notebook"
  },
  {
    "id": "30",
    "title": "Thermal conductivity by Searle’s method",
    "category": "Thermal Physics",
    "formula": "k = (mcΔT L)/(A Δθ Δt)",
    "model": "conductivity"
  },
  {
    "id": "31",
    "title": "EMF and internal resistance of a dry cell",
    "category": "Electricity",
    "formula": "V = E − Ir",
    "model": "cell"
  },
  {
    "id": "32",
    "title": "Temperature coefficient of copper resistance using metre bridge",
    "category": "Electricity",
    "formula": "Rₜ = R₀[1 + α(T−T₀)]",
    "model": "temperature"
  },
  {
    "id": "33",
    "title": "Comparison of EMFs using potentiometer",
    "category": "Electricity",
    "formula": "E₁/E₂ = l₁/l₂",
    "model": "potentiometer"
  },
  {
    "id": "34",
    "title": "Internal resistance of cell using potentiometer",
    "category": "Electricity",
    "formula": "r = R(l₁−l₂)/l₂",
    "model": "internal"
  },
  {
    "id": "35",
    "title": "Forward-biased semiconductor diode I–V characteristic",
    "category": "Electronics",
    "formula": "I ≈ Iₛ(e^(V/nVₜ) − 1)",
    "model": "diode"
  },
  {
    "id": "36",
    "title": "Transistor common-emitter Iᴮ–Iᶜ transfer curve",
    "category": "Electronics",
    "formula": "I꜀ ≈ βIʙ (active region)",
    "model": "transistor"
  },
  {
    "id": "37",
    "title": "Truth tables of fundamental logic gates",
    "category": "Electronics",
    "formula": "AND / OR / NOT / NAND / NOR / XOR",
    "model": "gates"
  },
  {
    "id": "38",
    "title": "Young’s modulus of a steel wire",
    "category": "Properties of Matter",
    "formula": "Y = FL/(AΔL)",
    "model": "young"
  },
  {
    "id": "39",
    "title": "Viscosity by capillary flow (Poiseuille’s law)",
    "category": "Properties of Matter",
    "formula": "η = πr⁴ΔPt/(8LV)",
    "model": "viscosity"
  },
  {
    "id": "40",
    "title": "Surface tension using microscope slide",
    "category": "Properties of Matter",
    "formula": "F = γ × wetted contact length",
    "model": "notebook"
  },
  {
    "id": "41",
    "title": "Surface tension by capillary rise",
    "category": "Properties of Matter",
    "formula": "γ = hρgr/(2 cos θ)",
    "model": "tension"
  },
  {
    "id": "42",
    "title": "Surface tension by Jaeger’s method",
    "category": "Properties of Matter",
    "formula": "Pressure balance at bubbling threshold",
    "model": "notebook"
  }
];
export const NIE_HANDBOOK="https://nie.lk/pdffiles/other/eALOM%20PysicsPracBook.pdf";
