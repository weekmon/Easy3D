import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { easing } from 'maath'
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls, folder, Leva, LevaPanel, useCreateStore, button, render, LevaInputs } from 'leva'
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { PivotControls } from './pivotControls/index'
import config from './config.json'
import { Matrix4 } from 'three'

const modeldata = []

const modelmatrix = {
  matrix: Matrix4
}
export const ModelMatrix = function (id, matrix, material) {
  this.id = id
  this.Matrix = matrix
  this.Material = material

  this.Print = function () {
    console.log()
  }
}
export default function Models() {
  const gltf_name = 'glass-transformed.glb'
  const { nodes, materials } = useGLTF('/' + gltf_name)
  var indents = []
  let gl_name = []
  let conf_data = []
  const modelref = []

  const material_physical = useMemo(() => {
    return {
      reflectivity: 0,
      transmission: 1.0,
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      color: { value: '#000000' },
      ior: 1.2,
      thickness: 1.0,
      show: { value: true, label: 'Show color' },
      Material: { value: 'Physical', options: ['raw', 'Standard'] },
      fillColor: {
        value: '#cfcfcf',
        label: 'fill',
        render: (get) => get('transmission') >= 0
      },
      fillImage: {
        image: undefined,
        label: 'fill',
        render: (get) => get('Material') === 'Physical'
      }
      //side: THREE.FrontSide,
      //blending: THREE.AdditiveBlending,
      //polygonOffset: true,
      //polygonOffsetFactor: 1,
      //envMapIntensity: 2
    }
  }, [])

  const mat_opt = useControls('This Material', material_physical)
  const Material01 = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: mat_opt.opacity,
    color: 'black',
    roughness: 0,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    envMapIntensity: 2
  })

  const Material2 = new THREE.MeshPhysicalMaterial({
    reflectivity: mat_opt.reflectivity,
    transmission: mat_opt.transmission,
    roughness: mat_opt.roughness,
    metalness: mat_opt.metalness,
    clearcoat: mat_opt.clearcoat,
    clearcoatRoughness: mat_opt.clearcoatRoughness,
    color: mat_opt.color,
    ior: mat_opt.ior,
    thickness: mat_opt.thickness
  })

  console.log(conf_data)
  conf_data.push({
    id: 2,
    parentId: null,
    value: '',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  })
  console.log(conf_data)
  // const mmmm = mat_opt.Material
  //console.log(conf)
  for (var i = 0; i < 9; i++) {
    if (nodes.Scene.children[i].geometry) {
      modelref[i] = useRef()
      modeldata[i] = modelref[i]
      gl_name[i] = 'gl' + i
      console.log(gl_name[i])
      //console.log(conf)
      indents.push(
        <PivotControls ref={modelref[i]} rotation={[0, -Math.PI / 2, 0]} anchor={[1, -1, -1]} scale={75} depthTest={false} fixed lineWidth={2}>
          <mesh receiveShadow castShadow key={gl_name} geometry={nodes.Scene.children[i].geometry} material={Material2} />
        </PivotControls>
      )
    }
  }

  console.log(modeldata)
  return indents
}

export function ModelData() {
  return modeldata
}
