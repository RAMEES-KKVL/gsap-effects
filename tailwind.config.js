/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      backgroundImage : {
        "img_1" : "url('assets/images/bg-img.jpeg')",
        'img_2': "url('assets/images/honey-main.jpeg')",
        'img_3': "url('assets/images/pic-1.png')",
        'img_4': "url('assets/images/nature.jpeg')",
        'img_5': "url('assets/images/pic-2.png')"
      }
    },
  },
  plugins: [],
}

