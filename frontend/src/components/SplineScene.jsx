// export default function SplineScene() {
//   return (
//     <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#050505]">
//       <iframe
//         src="https://my.spline.design/googlyeyes-SSbPVdKCMWzlrPH3q1US1MEV-9wA/"
//         title="Spline 3D Background"
//         frameBorder="0"
//         className="absolute border-0"
//         style={{
//           top: "50%",
//           left: "50%",
//           width: "250vw",
//           height: "250vh",
//           transform: "translate(-50%, -50%) scale(0.4)",
//           transformOrigin: "center center",
//           pointerEvents: "auto",
//         }}
//       />

//       <div
//         className="absolute inset-0 z-10 pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
//         }}
//       />
//     </div>
//   );
// }

export default function SplineScene() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#050505]">
      {/* Spline viewport */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          src="https://my.spline.design/googlyeyes-SSbPVdKCMWzlrPH3q1US1MEV-9wA/"
          title="Spline 3D Background"
          frameBorder="0"
          allow="autoplay; fullscreen"
          className="absolute border-0"
          style={{
            width: "250vw",
            height: "250vh",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(0.4)",
            transformOrigin: "center center",
            pointerEvents: "auto",
          }}
        />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}