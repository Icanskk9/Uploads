// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-secondary text-gray-800 font-sans;
}

// font-sans bisa kamu sesuaikan di layout.tsx agar pakai Google Fonts seperti Poppins atau Inter
