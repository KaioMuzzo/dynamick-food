/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: {
          dark: "#020712", // Figma: fundo
          card: "#111827", // Figma: card background
        },
        accent: {
          blue: "#0063ff", // Figma: azul-detalhes
          "blue-soft": "#9cc3ff", // Figma: azul-secundario
          "blue-dark": "#003589", // Figma: azul-botoes
          yellow: "#ffbf00", // Figma: amarelo-detalhes
          "yellow-soft": "#ffdb6f", // Figma: amarelo-claro-detalhes
        },
        card: {
          border: "#2a2f3a",
        },
        text: {
          light: "#f5f5f5",
          muted: "#b0b3bd", // Figma: muted labels
          placeholder: "#7d8493", // Figma: input placeholder
        },
      },
      fontFamily: {
        // Each Poppins weight is its own native font family (loaded in app/_layout.tsx).
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
        "poppins-extrabold": ["Poppins_800ExtraBold"],
        "poppins-extrabold-italic": ["Poppins_800ExtraBold_Italic"],
      },
    },
  },
  plugins: [],
};

