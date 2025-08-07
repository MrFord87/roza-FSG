import { useEffect } from 'react';
import Dashboard from './dashboard';

export default function Home() {
  useEffect(() => {
    // Manually enable dark mode by adding 'dark' to the html element
    document.documentElement.classList.add('dark');
  }, []);

  return <Login />;
}
