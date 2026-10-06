import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import type { RootState } from '../store/store';
import KanbanBoard from '../components/KanbanBoard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #e0e0e0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', textTransform: 'uppercase', letterSpacing: '2px' }}>Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '20px', fontWeight: 'bold' }}>Hello, {currentUser?.username}</span>
          <button className="outline" onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </header>
      
      <main>
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Dashboard;
