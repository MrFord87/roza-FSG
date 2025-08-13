// pages/_app.js
import '@fullcalendar/core/main.css';     // FullCalendar core styles
import '@fullcalendar/daygrid/main.css'; // DayGrid view styles
import '../styles/globals.css';           // Keep this if you actually have it; remove if not

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
