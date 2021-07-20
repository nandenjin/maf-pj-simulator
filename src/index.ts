import './style/index.scss'
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  GridHelper,
  Mesh,
  VideoTexture,
  BufferGeometry,
  BufferAttribute,
  Vector3,
  ShaderMaterial,
  TextureLoader,
} from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'
import { GUI } from 'dat.gui'
const sampleVideo = require('./sample.webm').default
const baseTextureImage = require('./texture.jpg').default

const gui = new GUI()

const scene = new Scene()
const renderer = new WebGLRenderer({ antialias: true })
const camera = new PerspectiveCamera(35)
camera.position.set(0.6, 0.1, 0.4)

const x = -1,
  y = 1 / 4,
  z = -1 / 2
const lookAt = new Vector3(0, y / 2, 0)

const gridHelper = new GridHelper(2, 20)
scene.add(gridHelper)

const video = document.createElement('video')
video.classList.add('video')
video.setAttribute('src', sampleVideo)
video.setAttribute('controls', 'controls')
video.setAttribute('loop', 'loop')
const contentTexture = new VideoTexture(video)

const baseTexture = new TextureLoader().load(baseTextureImage)

const boxGeometry = new BufferGeometry()
boxGeometry.setAttribute(
  'position',
  new BufferAttribute(
    // prettier-ignore
    new Float32Array([
      0, y, 0,
      x, y, 0,
      x, 0, 0,
      0, y, 0,
      x, 0, 0,
      0, 0, 0,
      0, y, 0,
      0, 0, 0,
      0, y, z,
      0, 0, 0,
      0, 0, z,
      0, y, z
    ]),
    3
  )
)

const u = 2 / 3
boxGeometry.setAttribute(
  'uv',
  new BufferAttribute(
    // prettier-ignore
    new Float32Array([
      u, 1,
      0, 1,
      0, 0,
      u, 1,
      0, 0,
      u, 0,
      u, 1,
      u, 0,
      1, 1,
      u, 0,
      1, 0,
      1, 1
    ]),
    2
  )
)

const boxMaterial = new ShaderMaterial({
  uniforms: {
    baseTexture: { value: baseTexture },
    contentTexture: { value: contentTexture },
    baseOpacity: { value: 0.1 },
  },
  vertexShader: require('./vertex.glsl').default,
  fragmentShader: require('./fragment.glsl').default,
})
const box = new Mesh(boxGeometry, boxMaterial)
scene.add(box)

gui
  .add(boxMaterial.uniforms.baseOpacity, 'value', 0, 0.5, 0.01)
  .name('baseOpacity')

renderer.domElement.classList.add('renderer')
document.body.appendChild(renderer.domElement)
document.body.appendChild(video)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.target.copy(lookAt)
camera.lookAt(lookAt)

function renderTick() {
  window.requestAnimationFrame(renderTick)
  contentTexture.needsUpdate = true
  renderer.render(scene, camera)
}

renderTick()

function updateRendererSize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

window.addEventListener('DOMContentLoaded', updateRendererSize)
window.addEventListener('resize', updateRendererSize)

const filePicker = document.createElement('input')
filePicker.classList.add('file-picker')
filePicker.setAttribute('type', 'file')
filePicker.setAttribute('accept', 'video/*')
filePicker.addEventListener('change', e => {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  const file = e.target.files?.[0]
  if (file) {
    video.setAttribute('src', URL.createObjectURL(file))
  }
})
document.body.appendChild(filePicker)
