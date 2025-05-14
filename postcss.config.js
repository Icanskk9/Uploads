module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-secondary text-gray-800 font-sans;
}

