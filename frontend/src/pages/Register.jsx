import AuthForm from "../components/AuthForm";
import SplineScene from "../components/SplineScene";

export default function Register() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Fullscreen Spline background */}
      <SplineScene />

      {/* Centered floating auth card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
        <AuthForm type="register" />
      </div>
    </div>
  );
}
