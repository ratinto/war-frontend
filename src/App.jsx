import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LaunchPage from './pages/LaunchPage';
import HomePage from './pages/HomePage';
import StudentLogin from './pages/student/StudentLogin';
import StudentSignup1 from './pages/student/StudentSignup1';
import StudentSignup2 from './pages/student/StudentSignup2';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Completed from './pages/student/Completed';
import Incomplete from './pages/student/Incomplete';
import Orders from './pages/student/Orders';
import WashermanLogin from './pages/washerman/WashermanLogin';
import WashermanDashboard from './pages/washerman/WashermanDashboard';
import Stats from './pages/washerman/Stats';
import StudentLookup from './pages/washerman/StudentLookup';

function App() {
    return (
        <Router>
            <Routes>
                {/* General Pages */}
                <Route path="/" element={<LaunchPage />} />
                <Route path="/home" element={<HomePage />} />

                {/* Student Auth */}
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/signup1" element={<StudentSignup1 />} />
                <Route path="/student/signup2" element={<StudentSignup2 />} />

                {/* Student Pages */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/completed" element={<Completed />} />
                <Route path="/student/incomplete" element={<Incomplete />} />
                <Route path="/student/orders" element={<Orders />} />

                {/* Washerman Pages */}
                <Route path="/washerman/login" element={<WashermanLogin />} />
                <Route path="/washerman/dashboard" element={<WashermanDashboard />} />
                <Route path="/washerman/stats" element={<Stats />} />
                <Route path="/washerman/student-lookup" element={<StudentLookup />} />
            </Routes>
        </Router>
    );
}

export default App;