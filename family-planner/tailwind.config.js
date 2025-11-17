/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // かわいいパステルカラーテーマ
        primary: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfca',
          300: '#fdafa5',
          400: '#fa7f70',
          500: '#f15f45',
          600: '#de4427',
          700: '#bb351d',
          800: '#9b301b',
          900: '#802d1d',
        },
        hospital: '#E8F5E9',    // 薄緑 - 病院
        school: '#E3F2FD',      // 薄青 - 学校
        hobby: '#F3E5F5',       // 薄紫 - 趣味
        lesson: '#FFF3E0',      // 薄オレンジ - 習い事
        event: '#FCE4EC',       // 薄ピンク - イベント
        friend: '#E0F2F1',      // 薄青緑 - 友人
        exam: '#FFF9C4',        // 薄黄 - 試験
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
