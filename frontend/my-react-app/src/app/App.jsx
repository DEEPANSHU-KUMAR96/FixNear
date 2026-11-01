import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { useDispatch } from 'react-redux';
import { getUserSuccess, getUserFail } from '../features/auth/state/authSlice';
import { getUser } from '../features/auth/services/auth.service';
import router from './router';

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const rehydrateAuth = async () => {
      // Check if a token exists in localStorage
      const raw = localStorage.getItem('token');
      if (!raw) {
        // No token — skip the API call, just mark auth as checked
        setAuthChecked(true);
        return;
      }

      try {
        const data = await getUser();
        // data.user comes from GET /api/auth/me
        dispatch(getUserSuccess(data));
      } catch {
        // Token is invalid/expired — clean up and treat as logged out
        localStorage.removeItem('token');
        dispatch(getUserFail('Session expired. Please log in again.'));
      } finally {
        setAuthChecked(true);
      }
    };

    rehydrateAuth();
  }, [dispatch]);

  // Show a minimal full-screen loader until we know auth state
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading FixNear...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;

