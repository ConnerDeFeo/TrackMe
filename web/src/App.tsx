import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import { Amplify } from 'aws-amplify';
import awsconfig from './amplifyconfiguration.json';
import { AccountType } from './common/constants/Enums';
import { useEffect, useState } from 'react';
import UserService from './services/UserService';
import Home from './pages/Home';
import NavBar from './common/components/NavBar';
import ViewGroup from './pages/groups/ViewGroup';
import Groups from './pages/groups/Groups';
import GroupSchedule from './pages/groups/GroupSchedule';
import AssignWorkout from './pages/groups/AssignWorkout';
import RelationInvites from './pages/relations/RelationInvites';
import Relations from './pages/relations/Relations';
import Friends from './pages/relations/Friends';
import Profile from './pages/Profile';
import { AuthContext } from './common/context/AuthContext';
import History from './pages/history/History';
import ViewHistory from './pages/history/ViewHistory';
import Templates from './pages/Templates';
import GroupSettings from './pages/GroupSettings';

Amplify.configure(awsconfig);
export default function App() {
  const [awaitingAuthentication, setAwaitingAuthentication] = useState<boolean>(true);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.SignedOut);


  useEffect(() => {
    async function checkAuth() {
      const accountType = await UserService.getAccountType();
      if (accountType !== AccountType.SignedOut) {
        setAccountType(accountType);
      }
      setAwaitingAuthentication(false);
    }
    checkAuth();
  }, []);

  if (awaitingAuthentication) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (accountType === AccountType.SignedOut) {
    const location = window.location;
    if (location.pathname !== '/' && location.pathname !== '/login') {
      window.history.replaceState({}, '', '/login');
    }
    return (
      <AuthContext.Provider value={[accountType, setAccountType]}>
        <Login />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={[accountType, setAccountType]}>
      <Router>
        <NavBar />
        <div className='min-h-[calc(100vh-4rem)] bg-gray-50'>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/view-group/:groupName/:groupId" element={<ViewGroup />} />
            <Route path="/groups/view-group/:groupName/:groupId/settings" element={<GroupSettings />} />
            <Route path="/groups/view-group/:groupName/:groupId/schedule" element={<GroupSchedule />} />
            <Route path="/groups/view-group/:groupName/:groupId/schedule/assign-workout/:date" element={<AssignWorkout />} />

            <Route path="/relations" element={<Relations />} />
            <Route path="/relations/relation-invites" element={<RelationInvites />} />
            <Route path="/relations/friends" element={<Friends />} />

            <Route path="/history" element={<History />} />
            <Route path="/history/view/:date" element={<ViewHistory />} />

            <Route path="/templates" element={<Templates />} />

            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
