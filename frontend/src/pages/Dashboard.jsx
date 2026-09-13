import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMe } from "../lib/api";
import IntegrationsPanel from "../components/IntegrationsPanel";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [backendUser, setBackendUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBackendUser() {
      if (!currentUser) return;
      try {
        setBackendUser(await getMe(currentUser));
      } catch (err) {
        console.error(err);
        setError("Error connecting to backend");
      }
    }

    fetchBackendUser();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Life RPG</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/study-girl")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors font-semibold text-sm"
            >
              Enter Lo-Fi Room
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 rounded-lg transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="glass-panel rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Authentication Successful</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-medium text-gray-300 mb-4 border-b border-white/10 pb-2">Firebase Client State</h3>
              <div className="space-y-3">
                <p><span className="text-gray-400">Name:</span> {currentUser?.displayName || "N/A"}</p>
                <p><span className="text-gray-400">Email:</span> {currentUser?.email}</p>
                <p className="break-all"><span className="text-gray-400">UID:</span> {currentUser?.uid}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-medium text-gray-300 mb-4 border-b border-white/10 pb-2">Backend Verification</h3>
              {error ? (
                <p className="text-red-400">{error}</p>
              ) : backendUser ? (
                <div className="space-y-3">
                  <p><span className="text-gray-400">Name:</span> {backendUser.name || "N/A"}</p>
                  <p><span className="text-gray-400">Email:</span> {backendUser.email}</p>
                  <p className="break-all"><span className="text-gray-400">UID:</span> {backendUser.uid}</p>
                  
                  {backendUser.stats && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">RPG Stats</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-black/30 p-2 rounded flex flex-col items-center">
                          <span className="text-yellow-500 font-bold">Lvl {backendUser.stats.level}</span>
                        </div>
                        <div className="bg-black/30 p-2 rounded flex flex-col items-center">
                          <span className="text-blue-400 font-bold">{backendUser.stats.xp} XP</span>
                        </div>
                        <div className="bg-black/30 p-2 rounded flex flex-col items-center">
                          <span className="text-amber-400 font-bold">{backendUser.stats.gold} Gold</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Verifying with backend...
                </div>
              )}
            </div>
          </div>
        </div>

        <IntegrationsPanel />

        <div className="text-center text-gray-500 text-sm">
          <p>Task tracking and gamification to be implemented.</p>
        </div>
      </div>
    </div>
  );
}
