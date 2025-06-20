import Home from '@/components/pages/Home';
import Practice from '@/components/pages/Practice';
import Progress from '@/components/pages/Progress';
import Settings from '@/components/pages/Settings';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  practice: {
    id: 'practice',
    label: 'Practice',
    path: '/practice',
    icon: 'Mic',
    component: Practice
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;