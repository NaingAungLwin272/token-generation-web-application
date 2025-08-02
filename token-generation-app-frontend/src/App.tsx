import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserSurvey from './pages/UserSurvey/UserSurvey';
import TokenPage from './pages/TokenPage/TokenPage';

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <Routes>
          <Route path="/" element={<UserSurvey />} />
          <Route path="/token/:id" element={<TokenPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
