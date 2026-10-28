import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type SceneMode = 'hero' | 'geometry' | 'particles' | 'shader'

type Props = {
  mode?: SceneMode
  className?: string
  interactive?: boolean
}

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;
uniform vec2 uPointer;

float wave(vec3 p) {
  return sin(p.x * 2.4 + uTime * 0.65) * 0.09
       + cos(p.y * 2.8 - uTime * 0.48) * 0.075
       + sin(p.z * 3.2 + uTime * 0.35) * 0.055;
}

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec3 displaced = position + normal * wave(position);
  float pointerForce = 0.045 * sin((position.x + uPointer.x) * 3.0 + uTime);
  displaced += normal * pointerForce;
  vPosition = displaced;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`

const fragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;
uniform vec2 uPointer;

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.1);
  float bands = 0.5 + 0.5 * sin(vPosition.y * 5.0 + uTime * 0.55 + vPosition.x * 2.0);
  vec3 deep = vec3(0.035, 0.055, 0.095);
  vec3 blue = vec3(0.12, 0.34, 0.62);
  vec3 silver = vec3(0.73, 0.82, 0.94);
  vec3 color = mix(deep, blue, bands * 0.55);
  color = mix(color, silver, fresnel * 0.88);
  color += vec3(0.06, 0.16, 0.28) * pow(max(dot(reflect(-viewDir, n), normalize(vec3(-0.5, 0.8, 0.6))), 0.0), 5.0);
  gl_FragColor = vec4(color, 1.0);
}
`

function makeParticleField(count: number, radius: number) {
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1)
    const r = radius * (0.68 + Math.random() * 0.52)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi)
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    scales[i] = 0.45 + Math.random() * 1.4
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  return geometry
}

export default function ThreeExperience({ mode = 'hero', className = '', interactive = true }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      host.classList.add('webgl-unavailable')
      return
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080a0f, mode === 'hero' ? 0.026 : 0.035)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, mode === 'hero' ? 9.4 : 7)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 1.8))
    renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.domElement.className = 'three-canvas'
    renderer.domElement.setAttribute('aria-label', 'Interactive real-time Three.js 3D scene')
    host.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0x8ca5c7, 0.9)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight(0xe1edff, 3.2)
    keyLight.position.set(4, 5, 7)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0x247bff, 38, 20)
    rimLight.position.set(-5, -1, 3)
    scene.add(rimLight)
    const warmLight = new THREE.PointLight(0x9a6bff, 24, 18)
    warmLight.position.set(4, -3, -4)
    scene.add(warmLight)

    const root = new THREE.Group()
    scene.add(root)
    const disposables: Array<{ dispose: () => void }> = []
    const interactiveMeshes: THREE.Object3D[] = []

    if (mode === 'hero' || mode === 'shader') {
      const sphereGeometry = new THREE.IcosahedronGeometry(mode === 'hero' ? 1.85 : 1.55, 36)
      const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        },
      })
      const core = new THREE.Mesh(sphereGeometry, shaderMaterial)
      root.add(core)
      interactiveMeshes.push(core)
      disposables.push(sphereGeometry, shaderMaterial)

      const knotGeometry = new THREE.TorusKnotGeometry(mode === 'hero' ? 2.45 : 2.1, 0.018, 260, 10, 2, 5)
      const knotMaterial = new THREE.MeshStandardMaterial({
        color: 0xa9c5ee,
        metalness: 0.92,
        roughness: 0.19,
        emissive: 0x102c58,
        emissiveIntensity: 0.55,
      })
      const knot = new THREE.Mesh(knotGeometry, knotMaterial)
      knot.rotation.set(0.8, 0.2, -0.48)
      root.add(knot)
      interactiveMeshes.push(knot)
      disposables.push(knotGeometry, knotMaterial)

      for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(2.8 + i * 0.33, 0.006 + i * 0.001, 8, 220)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: i === 1 ? 0x5b9bff : 0xb9c9df,
          transparent: true,
          opacity: 0.4 - i * 0.07,
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.set(0.7 + i * 0.22, 0.3 + i * 0.48, i * 0.8)
        root.add(ring)
        disposables.push(ringGeometry, ringMaterial)
      }
    } else if (mode === 'geometry') {
      const geos = [
        new THREE.TorusKnotGeometry(1.38, 0.44, 220, 28, 2, 7),
        new THREE.IcosahedronGeometry(1.42, 2),
        new THREE.OctahedronGeometry(1.58, 2),
      ]
      const mats = [
        new THREE.MeshPhysicalMaterial({ color: 0x91b5e8, metalness: 0.82, roughness: 0.17, clearcoat: 1 }),
        new THREE.MeshPhysicalMaterial({ color: 0x5b79a8, metalness: 0.65, roughness: 0.28, wireframe: true }),
        new THREE.MeshPhysicalMaterial({ color: 0x9c83f4, metalness: 0.72, roughness: 0.22, flatShading: true }),
      ]
      geos.forEach((geo, i) => {
        const mesh = new THREE.Mesh(geo, mats[i])
        mesh.position.x = (i - 1) * 2.45
        mesh.scale.setScalar(i === 1 ? 0.78 : 0.65)
        root.add(mesh)
        interactiveMeshes.push(mesh)
        disposables.push(geo, mats[i])
      })
    } else {
      const particleGeometry = makeParticleField(window.innerWidth < 700 ? 900 : 1900, 3.4)
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x9fc5ff,
        size: 0.025,
        transparent: true,
        opacity: 0.88,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const particles = new THREE.Points(particleGeometry, particleMaterial)
      root.add(particles)
      disposables.push(particleGeometry, particleMaterial)

      const centerGeometry = new THREE.SphereGeometry(0.8, 48, 48)
      const centerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x182b4a,
        metalness: 0.75,
        roughness: 0.13,
        clearcoat: 1,
        emissive: 0x0b2750,
        emissiveIntensity: 0.6,
      })
      const center = new THREE.Mesh(centerGeometry, centerMaterial)
      root.add(center)
      interactiveMeshes.push(center)
      disposables.push(centerGeometry, centerMaterial)
    }

    // Fine orbiting points add depth without relying on external textures or model files.
    const starGeometry = makeParticleField(mode === 'hero' ? 1150 : 420, mode === 'hero' ? 7.2 : 5.2)
    const starMaterial = new THREE.PointsMaterial({
      color: 0x9db8dd,
      size: mode === 'hero' ? 0.013 : 0.018,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
    disposables.push(starGeometry, starMaterial)

    const pointer = new THREE.Vector2(0, 0)
    const targetPointer = new THREE.Vector2(0, 0)
    const raycaster = new THREE.Raycaster()
    let hovered: THREE.Object3D | null = null
    let scrollProgress = 0
    let frame = 0
    let running = true
    const clock = new THREE.Clock()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      targetPointer.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1
      targetPointer.y = -(((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 2 - 1)
      if (interactive && bounds.width && bounds.height) {
        pointer.set(targetPointer.x, targetPointer.y)
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(interactiveMeshes, true)
        const next = hits[0]?.object ?? null
        if (hovered !== next) {
          if (hovered && 'scale' in hovered) (hovered as THREE.Object3D).userData.hovered = false
          hovered = next
          if (hovered) hovered.userData.hovered = true
          renderer.domElement.style.cursor = hovered ? 'crosshair' : 'default'
        }
      }
    }

    const onScroll = () => {
      const bounds = host.getBoundingClientRect()
      scrollProgress = THREE.MathUtils.clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const resizeObserver = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 1.8))
      renderer.setSize(host.clientWidth, host.clientHeight)
    })
    resizeObserver.observe(host)

    const animate = () => {
      if (!running) return
      frame = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.04)
      const elapsed = clock.elapsedTime
      pointer.lerp(targetPointer, reduceMotion ? 0.03 : 0.065)

      if (root.children.length) {
        root.rotation.y += delta * (reduceMotion ? 0.035 : 0.095)
        root.rotation.x += (pointer.y * 0.12 - root.rotation.x) * 0.018
        root.rotation.z += (pointer.x * 0.08 - root.rotation.z) * 0.018
      }
      stars.rotation.y = elapsed * 0.008
      stars.rotation.x = Math.sin(elapsed * 0.07) * 0.035
      keyLight.position.x = 4 + pointer.x * 1.5
      rimLight.position.y = -1 + pointer.y * 1.2

      if (mode === 'hero') {
        camera.position.x += (pointer.x * 0.42 - camera.position.x) * 0.018
        camera.position.y += (pointer.y * 0.3 - camera.position.y) * 0.018
        camera.position.z += (9.4 - scrollProgress * 1.25 - camera.position.z) * 0.018
        camera.lookAt(0, 0, 0)
      } else {
        camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.018
        camera.position.y += (pointer.y * 0.2 - camera.position.y) * 0.018
        camera.lookAt(0, 0, 0)
      }

      if (mode === 'hero' || mode === 'shader') {
        const core = root.children.find((child) => child instanceof THREE.Mesh && (child.material as THREE.Material).type === 'ShaderMaterial') as THREE.Mesh | undefined
        if (core) {
          const material = core.material as THREE.ShaderMaterial
          material.uniforms.uTime.value = elapsed
          material.uniforms.uPointer.value.copy(pointer)
          const targetScale = core.userData.hovered ? 1.075 : 1
          core.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08)
        }
      }
      if (mode === 'geometry') {
        root.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.y += delta * (0.12 + index * 0.045)
            child.rotation.x += delta * (0.08 + index * 0.025)
            const target = child.userData.hovered ? 1.14 : 1
            child.scale.lerp(new THREE.Vector3(target, target, target), 0.08)
          }
        })
      }
      if (mode === 'particles') {
        root.rotation.y = elapsed * 0.035
        root.rotation.x = Math.sin(elapsed * 0.22) * 0.12
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
      } else if (running) {
        clock.start()
        animate()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', handleVisibility)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [mode, interactive])

  return <div ref={hostRef} className={`three-experience ${className}`} aria-hidden="true" />
}
