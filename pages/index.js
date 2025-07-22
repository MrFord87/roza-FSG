import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#111' }}>
      <Sidebar />
      <div style={{ flex: 1, color: 'white' }}>
        <Header />
        <div style={{ padding: '2rem' }}>
          <h1>Welcome to Roza, your Contract Intelligence Dashboard</h1>
          <LoginForm/>
        </div>
      </div>
    </div>
  );
}
