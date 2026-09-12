import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useAnimations, useGLTF, useProgress } from "@react-three/drei";
import { Box3, DoubleSide, Vector3 } from "three";

const MODEL_URL = "/models/study-girl/15961a17a125467e9367ee452fd1950c_Textured.gltf";
// Source was authored Z-up in Blender; glTF arrives in Three.js as (x, z, -y).
const ROOM_FOCUS = new Vector3(8, 128, 92);
const ROOM_CAMERA_OFFSET = new Vector3(-155, 175, 540);

function StudyGirlModel({ onReady }) {
  const group = useRef(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);
  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh && !object.isSkinnedMesh) return;

      // This is a giant presentation card rather than useful room geometry. Its
      // projected texture and orientation only work from the author's camera.
      if (object.name.toUpperCase().includes("BACKDROP")) {
        object.visible = false;
        return;
      }

      // Skinned meshes are culled against their bind-pose bounds, so the girl and
      // her chair pop out of view at some angles. Cheap to just always draw them.
      if (object.isSkinnedMesh) object.frustumCulled = false;

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!material) return;
        material.side = DoubleSide;

        // The exporter tagged every material alphaMode:BLEND, so three renders all
        // 71 meshes in the transparent pass with depthWrite off. That pass sorts
        // per-object by centroid, which is why walls and props vanish or punch
        // through each other as you orbit. They are painted opaque surfaces - use
        // an alpha-test cutout so depth is written normally.
        if (material.transparent) {
          material.transparent = false;
          material.depthWrite = true;
          material.alphaTest = 0.5;
        }

        // Textures are hand-painted with their own lighting; tone mapping was
        // desaturating them away from the reference render.
        material.toneMapped = false;
        if (material.roughness !== undefined) material.roughness = 1;
        if (material.metalness !== undefined) material.metalness = 0;
        material.needsUpdate = true;
      });
    });
  }, [scene]);

  useEffect(() => {
    const action = names.length ? actions[names[0]] : null;
    if (!action) return undefined;
    action.reset().fadeIn(0.35).play();
    return () => action.fadeOut(0.25);
  }, [actions, names]);

  useLayoutEffect(() => {
    if (!group.current) return;
    const bounds = new Box3().setFromObject(group.current);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    onReady({ center, size });
  }, [onReady, scene]);

  return <group ref={group}><primitive object={scene} /></group>;
}

function OrbitCamera({ controls, bounds }) {
  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (!bounds || initialized.current) return;
    camera.position.copy(ROOM_FOCUS).add(ROOM_CAMERA_OFFSET);
    controls.current?.target.copy(ROOM_FOCUS);
    controls.current?.update();
    controls.current?.saveState();
    initialized.current = true;
  }, [bounds, camera]);
  return <OrbitControls ref={controls} enablePan enableDamping dampingFactor={0.08} minDistance={110} maxDistance={2600} minPolarAngle={0.45} maxPolarAngle={Math.PI - 0.45} screenSpacePanning />;
}

function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <Html center><div className="study-loader">Loading room {Math.round(progress)}%</div></Html>;
}

export default function StudyGirlPage() {
  const controls = useRef(null);
  const [bounds, setBounds] = useState(null);

  const onReady = useMemo(() => (nextBounds) => setBounds(nextBounds), []);
  const resetView = () => {
    if (!bounds) return;
    controls.current?.reset();
  };

  return (
    <main className="study-page">
      {/* near:0.01 with far:5000 on a model hundreds of units wide wrecked depth
          precision and made surfaces z-fight. The camera never gets closer than
          110 units, so a near plane of 1 is plenty. */}
      <Canvas camera={{ fov: 58, near: 1, far: 5000, position: [0, 2, 7] }} dpr={[1, 1.5]}>
        <color attach="background" args={["#d88973"]} />
        {/* Textures are hand-painted with their own light baked in, so this is
            deliberately flat and bright to match the Sketchfab reference -
            strong directionals only muddy them. */}
        <ambientLight intensity={1.45} color="#fff6ec" />
        <hemisphereLight intensity={0.6} skyColor="#fff4e4" groundColor="#c09a78" />
        <directionalLight position={[-220, 320, 260]} intensity={0.35} color="#fff0d8" />
        <directionalLight position={[180, 130, -180]} intensity={0.18} color="#cfe2ff" />
        <Suspense fallback={<Loader />}>
          <StudyGirlModel onReady={onReady} />
        </Suspense>
        <OrbitCamera controls={controls} bounds={bounds} />
      </Canvas>

      <header className="study-hud">
        <div><span className="study-kicker">Study Girl // 3D room viewer</span><h1>Lo-Fi room</h1><p>Drag to orbit · scroll to zoom</p></div>
        <div className="study-status"><strong>Ready</strong><span>Orbit view</span></div>
      </header>
      <aside className="study-controls">
        <strong>Explore the room</strong>
        <span><kbd>Left drag</kbd> orbit</span>
        <span><kbd>Right drag</kbd> pan</span>
        <span><kbd>Scroll</kbd> zoom in / out</span>
        <button type="button" onClick={resetView}>Reset view</button>
      </aside>
      <button className="study-back" type="button" onClick={() => window.history.back()}>← Back</button>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
