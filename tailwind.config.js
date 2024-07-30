/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				NotoSansThai: ['"Noto Sans Thai"', "sans-serif"],
			},
			screens: {
				"booking-time-pb": "575px",
			},
		},
	},
	plugins: [],
};
