import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudyRooms from './pages/StudyRooms';
import CollaborativeRoom from './pages/CollaborativeRoom';
import QuizArena from './pages/QuizArena';
import Resources from './pages/Resources';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'study-rooms', Component: StudyRooms },
      { path: 'study-rooms/:id', Component: CollaborativeRoom },
      { path: 'quiz-arena', Component: QuizArena },
      { path: 'resources', Component: Resources },
      { path: 'leaderboard', Component: Leaderboard },
      { path: 'analytics', Component: Analytics },
      { path: 'profile', Component: Profile },
    ],
  },
]);
