import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import { Amplify } from 'aws-amplify';
import awsconfig from './amplifyconfiguration.json';
import { AccountType } from './common/constants/Enums';
import { useEffect, useState } from 'react';
import UserService from './services/UserService';
import Home from './pages/Home';
import NavBar from './common/components/NavBar';
import Footer from './common/components/Footer';
import ViewGroup from './pages/ViewGroup';

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

  return (
    <Router>
      <NavBar />
      <div className='min-h-[calc(100vh-4rem)] pt-4 pb-8'>
        <Routes>
          <Route path="/" element={accountType === AccountType.SignedOut ? <Login /> : <Home />} />
          <Route path="/view-group/:groupName/:groupId" element={<ViewGroup />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
