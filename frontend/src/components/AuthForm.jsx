import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";

export default function AuthForm({ type }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)" }
    );
  }, []);

  async function handleGoogleLogin() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to log in with Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Load Bangers font (funky) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div
        ref={formRef}
        className="relative z-20 flex flex-col items-center gap-5 p-8 rounded-3xl pointer-events-auto"
        style={{
          background: "rgba(10, 10, 20, 0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
          width: "clamp(280px, 90vw, 360px)",
        }}
      >
        {/* Funky title */}
        <div className="text-center">
          <h1
            className="text-5xl tracking-widest text-white leading-none"
            style={{ fontFamily: "'Bangers', cursive", letterSpacing: "0.08em" }}
          >
            HABITIFY
          </h1>
          <p
            className="text-gray-400 text-xs mt-1 tracking-widest uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
           Complete Quests. Build Streaks. Become Better.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-grow h-px bg-white/10" />
          <span className="text-white/20 text-xs">⚔</span>
          <div className="flex-grow h-px bg-white/10" />
        </div>

        {error && (
          <div className="w-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-white font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {loading ? "Entering the realm..." : "Continue with Google"}
        </button>

        <p
          className="text-white/20 text-xs text-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          By continuing, you agree to embark on an epic journey.
        </p>
      </div>
    </>
  );
}
