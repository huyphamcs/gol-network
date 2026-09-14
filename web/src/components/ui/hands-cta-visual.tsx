'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree, type ThreeElements } from '@react-three/fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

const ASCII_RAMP = ' .:co0O8#@';
const ASCII_BACKGROUND = '#ffffff';
const SCENE_BACKGROUND = '#000000';
const ASCII_FOREGROUND = '#123b9a';
const MODEL_MATERIAL_COLOR = '#ffffff';
const ASCII_HOVER = '#06133d';
const RIPPLE_DURATION = 1_150;

const hashCell = (x: number, y: number, seed: number) => {
  const value = Math.sin(x * 41.3 + y * 289.1 + seed * 19.7) * 43_758.5453;
  return value - Math.floor(value);
};

const smoothStep = (minimum: number, maximum: number, value: number) => {
  const normalized = THREE.MathUtils.clamp((value - minimum) / (maximum - minimum), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

const fingerShader = /* glsl */ `
  uniform vec3 uSplit;
  uniform float uTime;
  uniform vec4 uFinger;
  uniform float uPhase;

  float handFingerAngle(vec3 p) {
    float x = abs(p.x);
    float weight = 1.0 - smoothstep(0.0, uFinger.x, x);
    weight *= weight;
    float phase = p.z * uPhase;
    float angle = sin(uTime * uFinger.w + phase) * 0.7
      + sin(uTime * uFinger.w * 0.43 + phase * 1.7) * 0.3;
    return angle * uFinger.z * weight;
  }
`;

interface HandUniforms {
  uSplit: { value: THREE.Vector3 };
  uTime: { value: number };
  uFinger: { value: THREE.Vector4 };
  uPhase: { value: number };
}

function injectHandDeform(material: THREE.MeshStandardMaterial, uniforms: HandUniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${fingerShader}`)
      .replace(
        '#include <beginnormal_vertex>',
        /* glsl */ `
          #include <beginnormal_vertex>
          {
            float side = sign(position.x);
            float angle = handFingerAngle(position);
            float cosine = cos(angle), sine = sin(angle);
            vec2 normalPosition = vec2(objectNormal.x * side, objectNormal.y);
            objectNormal.x = side * (normalPosition.x * cosine - normalPosition.y * sine);
            objectNormal.y = normalPosition.x * sine + normalPosition.y * cosine;
          }
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `
          #include <begin_vertex>
          {
            float side = sign(position.x);
            float angle = handFingerAngle(position);
            float cosine = cos(angle), sine = sin(angle);
            float handX = abs(position.x) - uFinger.x;
            float handY = position.y - uFinger.y;
            transformed.x = side * (handX * cosine - handY * sine + uFinger.x);
            transformed.y = handX * sine + handY * cosine + uFinger.y;
          }
          transformed += sign(position.x) * uSplit;
        `,
      );
  };
  material.customProgramCacheKey = () => 'gol-hands-deform';
  material.needsUpdate = true;
}

interface HandsModelProps extends Omit<ThreeElements['group'], 'ref'> {
  gap?: number;
  tilt?: number;
  drift?: number;
  fingers?: number;
}

function HandsModel({
  gap = 0.26,
  tilt = 0.36,
  drift = 0.05,
  fingers = 0.05,
  ...props
}: HandsModelProps) {
  const group = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/models/hands.glb', (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    loader.setDRACOLoader(draco);
  });
  const modelCenter = useMemo(() => {
    const center = new THREE.Vector3();
    new THREE.Box3().setFromObject(gltf.scene).getCenter(center);
    return center.multiplyScalar(-1);
  }, [gltf.scene]);
  const uniforms = useMemo<HandUniforms>(
    () => ({
      uSplit: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uFinger: { value: new THREE.Vector4(0.24, 0.13, fingers, 0.85) },
      uPhase: { value: 40 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uFinger.value.z = fingers;
  }, [fingers, uniforms]);

  useEffect(() => {
    const restoredMaterials: Array<{
      material: THREE.Material;
      mesh: THREE.Mesh;
      replacement: THREE.MeshStandardMaterial;
    }> = [];

    gltf.scene.traverse((object) => {
      if (
        !(object instanceof THREE.Mesh) ||
        !(object.material instanceof THREE.MeshStandardMaterial)
      ) {
        return;
      }

      const original = object.material;
      const material = original.clone();
      material.flatShading = false;
      material.map = null;
      material.metalness = 0;
      material.roughness = 0.72;
      material.color = new THREE.Color(MODEL_MATERIAL_COLOR);
      material.side = THREE.DoubleSide;
      injectHandDeform(material, uniforms);
      object.material = material;
      restoredMaterials.push({ material: original, mesh: object, replacement: material });
    });

    return () => {
      restoredMaterials.forEach(({ material, mesh, replacement }) => {
        mesh.material = material;
        replacement.dispose();
      });
    };
  }, [gltf.scene, uniforms]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = clock.getElapsedTime();
    uniforms.uTime.value = time;
    const rotationY = tilt + Math.sin(time * 0.22) * drift;
    group.current.rotation.y = rotationY;
    group.current.rotation.x = Math.sin(time * 0.31) * drift * 0.6;
    const direction = Math.sign(Math.cos(rotationY)) || 1;
    uniforms.uSplit.value.set(
      direction * Math.cos(rotationY) * gap,
      0,
      direction * Math.sin(rotationY) * gap,
    );
  });

  return (
    <group ref={group} {...props}>
      <group position={modelCenter}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

interface RippleState {
  x: number;
  y: number;
  startedAt: number;
  active: boolean;
}

function HandsAsciiScene({
  outputRef,
  pointerRef,
  rippleRef,
}: {
  outputRef: RefObject<HTMLCanvasElement | null>;
  pointerRef: RefObject<PointerState>;
  rippleRef: RefObject<RippleState>;
}) {
  const parallax = useRef<THREE.Group>(null);
  const target = useRef<THREE.WebGLRenderTarget | null>(null);
  const pixels = useRef<Uint8Array | null>(null);
  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    const cols = Math.max(96, Math.min(360, Math.floor(size.width / 6)));
    const rows = Math.max(32, Math.min(100, Math.floor(size.height / 10)));
    target.current?.dispose();
    target.current = new THREE.WebGLRenderTarget(cols, rows, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
    });
    pixels.current = new Uint8Array(cols * rows * 4);
    return () => {
      target.current?.dispose();
      target.current = null;
    };
  }, [size]);

  useFrame((_, delta) => {
    if (!target.current || !pixels.current || !outputRef.current) return;

    if (parallax.current) {
      const pointer = pointerRef.current;
      const horizontalTarget = pointer.active ? (pointer.x - 0.5) * 0.12 : 0;
      const verticalTarget = pointer.active ? -(pointer.y - 0.5) * 0.07 : 0;
      const damping = 1 - Math.exp(-3.5 * delta);
      parallax.current.rotation.y = THREE.MathUtils.lerp(
        parallax.current.rotation.y,
        horizontalTarget,
        damping,
      );
      parallax.current.rotation.x = THREE.MathUtils.lerp(
        parallax.current.rotation.x,
        verticalTarget,
        damping,
      );
    }

    const previousTarget = gl.getRenderTarget();
    gl.setRenderTarget(target.current);
    gl.render(scene, camera);
    gl.readRenderTargetPixels(
      target.current,
      0,
      0,
      target.current.width,
      target.current.height,
      pixels.current,
    );
    gl.setRenderTarget(previousTarget);

    const canvas = outputRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * 2 || canvas.height !== height * 2) {
      canvas.width = width * 2;
      canvas.height = height * 2;
    }
    context.setTransform(2, 0, 0, 2, 0, 0);
    context.clearRect(0, 0, width, height);
    const cellWidth = width / target.current.width;
    const cellHeight = height / target.current.height;
    context.font = `${Math.floor(cellHeight * 0.82)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const ripple = rippleRef.current;
    const rippleProgress = ripple.active
      ? Math.min(1, (performance.now() - ripple.startedAt) / RIPPLE_DURATION)
      : 1;
    if (rippleProgress >= 1) ripple.active = false;
    const aspect = width / height;
    const rippleRadius = rippleProgress * 0.8;
    const rippleTick = Math.floor(performance.now() / 110);

    for (let row = 0; row < target.current.height; row += 1) {
      for (let col = 0; col < target.current.width; col += 1) {
        const index = (row * target.current.width + col) * 4;
        const luminance =
          (pixels.current[index]! * 0.2126 +
            pixels.current[index + 1]! * 0.7152 +
            pixels.current[index + 2]! * 0.0722) /
          255;
        const level = THREE.MathUtils.clamp((luminance - 0.17) / (0.98 - 0.17), 0, 1);
        if (level <= 0) continue;
        const shapedLevel = Math.pow(level, 1.7);
        let glyphIndex = Math.max(
          1,
          Math.min(ASCII_RAMP.length - 1, Math.floor(shapedLevel * ASCII_RAMP.length)),
        );
        const pointer = pointerRef.current;
        const pixelX = col / target.current.width;
        const pixelY = 1 - row / target.current.height;
        const pointerDistance = Math.hypot((pixelX - pointer.x) * aspect, pixelY - pointer.y);
        const ringWobble = 0.89 + hashCell(col * 5.31, row * 5.31, 0) * 0.22;
        const rippleDistance =
          Math.hypot((pixelX - ripple.x) * aspect, pixelY - ripple.y) * ringWobble;
        const ringDistance = Math.abs(rippleDistance - rippleRadius);
        const rippleStrength = ripple.active
          ? (1 - smoothStep(0, 0.075, ringDistance)) * (1 - rippleProgress)
          : 0;
        const ripplePixel =
          rippleStrength > 0.02 &&
          hashCell(col * 2.71, row * 2.71, rippleTick * 31.3) < rippleStrength * 0.55;
        const hovering = pointer.active && pointerDistance < 0.075;
        context.globalAlpha = Math.min(1, 0.42 + shapedLevel * 0.58 + rippleStrength * 0.3);
        if (ripplePixel) {
          glyphIndex = 1 + Math.floor(hashCell(col, row, rippleTick) * 4);
          context.fillStyle = ASCII_HOVER;
          context.fillRect(col * cellWidth, height - (row + 1) * cellHeight, cellWidth, cellHeight);
          context.fillStyle = ASCII_BACKGROUND;
        } else {
          context.fillStyle = hovering ? ASCII_HOVER : ASCII_FOREGROUND;
        }
        context.fillText(
          ASCII_RAMP[glyphIndex] ?? '@',
          col * cellWidth + cellWidth / 2,
          height - (row * cellHeight + cellHeight / 2),
        );
      }
    }
    context.globalAlpha = 1;
  }, 1);

  return (
    <group ref={parallax}>
      <HandsModel scale={6} />
    </group>
  );
}

export function HandsCtaVisual({ className }: { className?: string }) {
  const outputRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<PointerState>({ x: 0.5, y: 0.5, active: false });
  const rippleRef = useRef<RippleState>({ x: 0.5, y: 0.5, startedAt: 0, active: false });

  const getPointerPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
  };

  return (
    <div
      className={cn(
        'relative h-0 w-full max-h-125 cursor-crosshair overflow-hidden bg-ascii-canvas min-[1100px]:h-[58vh]',
        className,
      )}
      aria-label="Two ASCII-rendered hands reaching toward each other"
      role="img"
      onPointerMove={(event) => {
        pointerRef.current = { ...getPointerPosition(event), active: true };
      }}
      onPointerDown={(event) => {
        const position = getPointerPosition(event);
        pointerRef.current = { ...position, active: true };
        rippleRef.current = {
          ...position,
          startedAt: performance.now(),
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
    >
      <canvas ref={outputRef} className="absolute inset-0 size-full" aria-hidden="true" />
      <Canvas
        className="pointer-events-none absolute inset-0 opacity-0"
        dpr={1}
        camera={{ position: [0, 2.6, 3.3], fov: 38, near: 0.1, far: 100 }}
        gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ scene: canvasScene }) => {
          canvasScene.background = new THREE.Color(SCENE_BACKGROUND);
        }}
      >
        <fog attach="fog" args={[SCENE_BACKGROUND, 5.7, 15.7]} />
        <ambientLight intensity={0.12} />
        <directionalLight position={[3, 3.4, 2.4]} intensity={3.2} />
        <directionalLight position={[-3.2, 2.4, 2.6]} intensity={3} color="#cfe6ff" />
        <HandsAsciiScene outputRef={outputRef} pointerRef={pointerRef} rippleRef={rippleRef} />
      </Canvas>
    </div>
  );
}
