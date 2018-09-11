import { Color, Geometry, Mesh, MeshMaterial, Scene } from 'three';
import { Neuron } from './neuron';
import * as THREE from 'three';

export interface LayerParameters {
  scene: Scene;
  centerX: number;
  centerY: number;
  centerZ: number;
  shape: number[];
}

export class Layer {

  protected scene: Scene;
  protected centerX: number;
  protected centerY: number;
  protected centerZ: number;
  protected shape: number[];

  protected neurons: any[];
  protected cubeSize = 2;
  protected cubeGap = 1;

  protected constructor(parameters?: LayerParameters) {
    this.centerX = parameters.centerX;
    this.centerY = parameters.centerY;
    this.centerZ = parameters.centerZ;
    this.shape = parameters.shape;
    this.scene = parameters.scene;

    this.neurons = null;

    if (!this.neurons) {
      this.neurons = [];
      for (let i = 0; i < this.shape[0]; i++) {
        const l: Neuron[] = [];
        for (let j = 0; j < this.shape[1]; j++) {
          const n: Neuron = new Neuron();
          n.position = [i, j];
          l.push(n);
        }
        this.neurons.push(l);
      }
    }
  }

  render(data: any[]): void {}

  protected setCubeSize(size: number): void {
    this.cubeSize = size;
  }

  protected setCubeGap(gap: number): void {
    this.cubeGap = gap;
  }

  protected renderCube(x: number, y: number, z: number, color: Color, neuron: Neuron): void {
    if (neuron.cube) {
      neuron.cube.geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
      neuron.cube.material = new THREE.MeshLambertMaterial({
        color: color
      });
      neuron.cube.position.set(x, y, z);
    } else {
      const geometry: Geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
      const material: MeshMaterial = new THREE.MeshLambertMaterial({
        color: color
      });
      const cube: Mesh = new THREE.Mesh(geometry, material);
      cube.position.set(x, y, z);
      neuron.cube = cube;
      this.scene.add(cube);
    }
  }

}
