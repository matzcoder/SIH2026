import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ role = 'inspector' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('API_BASE_URL') || '');
  const [showConfig, setShowConfig] = useState(false);

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    if (apiUrl.trim()) {
      localStorage.setItem('API_BASE_URL', apiUrl.trim());
    } else {
      localStorage.removeItem('API_BASE_URL');
    }
    setShowConfig(false);
    window.location.reload();
  };

  return (
    <header className="bg-[#F5E6D8] border-b border-[#E4CBB4] text-[#3B2A22] sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-black text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              LM
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                LM-VISION
                <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-[#C1502D] border border-cyan-800 font-semibold">
                  PCR 2011
                </span>
              </div>
              <p className="text-[10px] text-[#7A5C48] -mt-0.5">Legal Metrology AI Compliance</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/inspector/portal"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname.includes('/inspector')
                  ? 'bg-[#FFF9F2] text-[#C1502D] font-semibold'
                  : 'text-[#7A5C48] hover:text-[#3B2A22]'
              }`}
            >
              Field Inspector
            </Link>
            <Link
              to="/authority/portal"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname.includes('/authority')
                  ? 'bg-[#FFF9F2] text-[#C1502D] font-semibold'
                  : 'text-[#7A5C48] hover:text-[#3B2A22]'
              }`}
            >
              Regulatory Authority
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FFF9F2]/80 hover:bg-[#FFF9F2] border border-[#E4CBB4] text-[#7A5C48] transition-colors flex items-center gap-1.5"
            title="Configure Backend API URL"
          >
            <span className="w-2 h-2 rounded-full bg-[#7A8450] animate-pulse"></span>
            <span>API Host</span>
          </button>

          <div className="h-4 w-px bg-[#FFF9F2]"></div>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('authToken');
              navigate('/login');
            }}
            className="text-xs px-3 py-1.5 rounded-lg text-[#7A5C48] hover:text-[#A63A32] hover:bg-rose-950/30 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="border-t border-[#E4CBB4] bg-[#FBF3EC] p-4">
          <form onSubmit={handleSaveApiUrl} className="max-w-xl mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. https://your-ngrok-url.ngrok-free.app/api or http://localhost:5000/api"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#F5E6D8] border border-[#E4CBB4] rounded-lg text-xs text-[#3B2A22] focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#C1502D] hover:bg-[#A63F22] text-white rounded-lg text-xs font-semibold"
            >
              Set API URL
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('API_BASE_URL');
                setApiUrl('');
                window.location.reload();
              }}
              className="px-3 py-1.5 bg-[#FFF9F2] hover:bg-[#F5E6D8] text-[#7A5C48] rounded-lg text-xs"
            >
              Reset
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
