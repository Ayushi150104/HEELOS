import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        'custom-tight': '[0px_12px_0px_3px_rgb(20_16_16_/_29%)]',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config;
