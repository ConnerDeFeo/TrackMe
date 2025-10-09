import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import { Amplify } from 'aws-amplify';
import awsconfig from './amplifyconfiguration.json';
import { AccountType } from './common/constants/Enums';
import { useEffect, useState } from 'react';
import UserService from './services/UserService';
import Home from './pages/Home';
import NavBar from './common/components/NavBar';
import ViewGroup from './pages/ViewGroup';
import WorkoutTemplates from './pages/WorkoutTemplates';
import Groups from './pages/Groups';
import GroupSchedule from './pages/GroupSchedule';
import AssignWorkout from './pages/AssignWorkout';
import RelationInvites from './pages/RelationInvites';
import Relations from './pages/Relations';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import { AuthContext } from './common/context/AuthContext';

Amplify.configure(awsconfig);
export default function App() {
  const [awaitingAuthentication, setAwaitingAuthentication] = useState<boolean>(true);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.SignedOut);


  useEffect(() => {
    async function checkAuth() {
      const accountType = await UserService.getAccountType();
      console.log("Account type:", accountType);
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

  return (
    <AuthContext.Provider value={[accountType, setAccountType]}>
      <Router>
        <NavBar />
        <div className='min-h-[calc(100vh-4rem)] bg-gray-50'>
          <Routes>
            <Route path="/" element={accountType === AccountType.SignedOut ? <Login /> : <Home />} />

            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/view-group/:groupName/:groupId" element={<ViewGroup />} />
            <Route path="/groups/view-group/:groupName/:groupId/schedule" element={<GroupSchedule />} />
            <Route path="/groups/view-group/:groupName/:groupId/schedule/assign-workout/:date" element={<AssignWorkout />} />

            <Route path="/relations" element={<Relations />} />
            <Route path="/relations/relation-invites" element={<RelationInvites />} />
            <Route path="/relations/friends" element={<Friends />} />

            <Route path="/workout-templates" element={<WorkoutTemplates />} />

            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
