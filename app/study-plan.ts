export type StudyWeek = {
  dates: string;
  from: string;
  to: string;
  hours: string;
  apartados: string;
};

// The ranges follow the same sequential order as allLessons in course-map.ts.
export const studyWeeks: StudyWeek[] = [
  { dates: "28 sep–4 oct", from: "01.01", to: "02.06", hours: "9–11 h", apartados: "1 completo · 2.1–2.6" },
  { dates: "5–11 oct", from: "02.07", to: "03.07", hours: "11–13 h", apartados: "2.7–2.12 · 3.1–3.7" },
  { dates: "12–18 oct", from: "03.08", to: "04.09", hours: "10–12 h", apartados: "3.8–3.12 · 4.1–4.9" },
  { dates: "19–25 oct", from: "04.10", to: "05.08", hours: "11–13 h", apartados: "4.10–4.12 · 5.1–5.8" },
  { dates: "26 oct–1 nov", from: "05.09", to: "07.04", hours: "12–14 h", apartados: "5.9–5.10 · 6 completo · 7.1–7.4" },
  { dates: "2–8 nov", from: "07.05", to: "08.08", hours: "10–12 h", apartados: "7.5–7.8 · 8 completo" },
  { dates: "9–15 nov", from: "09.01", to: "10.04", hours: "11–13 h", apartados: "9 completo · 10.1–10.4" },
  { dates: "16–22 nov", from: "10.05", to: "11.05", hours: "10–12 h", apartados: "10.5–10.8 · 11.1–11.5" },
  { dates: "23–29 nov", from: "11.06", to: "12.06", hours: "11–13 h", apartados: "11.6–11.8 · 12 completo" },
  { dates: "30 nov–6 dic", from: "13.01", to: "14.03", hours: "11–14 h", apartados: "13 completo · 14.1–14.3" },
  { dates: "7–13 dic", from: "14.04", to: "15.06", hours: "10–13 h", apartados: "14.4–14.6 · 15 completo" },
  { dates: "14–20 dic", from: "16.01", to: "17.03", hours: "10–13 h", apartados: "16 completo · 17.1–17.3" },
  { dates: "21–27 dic", from: "17.04", to: "18.06", hours: "11–14 h", apartados: "17.4–17.6 · 18 completo" },
];
