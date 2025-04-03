/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        headerBG: "rgba(5, 5, 5, 0.28)",
        topHeader:"#DF8114",
        darkBG: "rgba(5, 5, 5, 0.92)",
        subHeaderBG:"rgba(255, 255, 255, 0.27)",
        subTitle:"rgba(148, 148, 148, 1)",
        flightIterinary: "rgba(255, 253, 253, 0.5)",
        textInputBG:"rgba(255, 253, 253, 0.13)"
         // Add your custom color
      },
      fontSize: {
        paragraph: '16px', // Paragraph text
        heading: '20px', // Heading text
        headingBig: '24px',
        headerText: "18px" // Heading text
      },
      lineHeight: {
        paragraph: '1.5', // Line height for paragraphs
        heading: '1.6', // Line height for headings
      },
      fontFamily: {
        shalimar: ["Shalimar", 'cursive'],
        aldrich: ["Aldrich", "sans-serif"],
        akaya:["Akaya Kanadaka", "system-ui"],
        kaushan:["Kaushan Script", "cursive"],
        aboreto:["Aboreto", "system-ui"],
        inria: ["Inria Sans", 'sans-serif'],// Add fallback font-family
        
      },
      animation: {
        marquee: 'marquee 20s linear infinite', // Name and duration
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}

