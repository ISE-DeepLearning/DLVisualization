import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Geometry,
  Light,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshMaterial,
  Renderer,
  Scene,
  WebGLRenderer
} from 'three';
import { Camera } from 'three/three-core';
import { NeuronService } from '../service/neuron.service';
import { Neuron } from '../model/neuron';
import { Layer } from '../model/layer';
import { InputLayer } from '../model/input.layer';
import { ConvLayer } from '../model/conv.layer';
import { FlattenLayer } from '../model/flatten.layer';

@Component({
  selector: 'app-neuron',
  templateUrl: './neuron.component.html',
  styleUrls: ['./neuron.component.css']
})
export class NeuronComponent implements OnInit {

  @ViewChild('canvasRoot') root: ElementRef;

  scene: Scene;
  camera: Camera;
  cube: Mesh;
  renderer: WebGLRenderer;

  cubes: Mesh[];
  neurons: Neuron[];

  cubeSize = 2;
  cubeGap = 1;

  constructor(
    private neuronService: NeuronService
  ) {
    this.cubes = [];
    this.neurons = [];
  }

  ngOnInit() {
    // this.show();
    this.start();
  }

  initThree(): void {
    const rootElement: HTMLElement = this.root.nativeElement;
    const width: number = rootElement.clientWidth;
    const height: number = rootElement.clientHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor('rgb(50, 50, 50)', 1.0);
    rootElement.appendChild(this.renderer.domElement);
  }

  initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 100;
    this.camera.up.x = 0;
    this.camera.up.y = 1;
    this.camera.up.z = 0;
    this.camera.lookAt(0, 0, 0);
  }

  initScene(): void {
    this.scene = new THREE.Scene();
  }

  initLight(): void {
    const environmentColor = 'white';
    const environmentLight: AmbientLight = new THREE.AmbientLight(environmentColor);
    this.scene.add(environmentLight);

    const lightColor = 'white';
    const directionalLight: DirectionalLight = new THREE.DirectionalLight(lightColor);
    directionalLight.position.set(-1000, -1000, 1000);
    directionalLight.castShadow = true;
    directionalLight.intensity = 1;
    this.scene.add(directionalLight);
  }

  initObject(): void {
    const geometry: Geometry = new THREE.BoxGeometry(100, 100, 100);

    for ( let i = 0; i < geometry.faces.length; i += 2 ) {
      const hex = Math.random() * 0xffffff;
      geometry.faces[ i ].color.setHex( hex );
      geometry.faces[ i + 1 ].color.setHex( hex );

    }

    const material: MeshMaterial = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors} );

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(100, 100, 0);
    this.scene.add(this.cube);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  initLayer1(x, y, z, data: number[]): void {
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const n: Neuron = new Neuron();
      n.position = [i];
      this.initCube(x + i * (this.cubeSize + this.cubeGap),
        y, z, new Color(d, d, d), n);
    }
  }

  initLayer2(x, y, z, data: number[][]): void {
    // for (let i = 0; i < data.length; i++) {
    //   for (let j = 0; j < data[0].length; j++) {
    //     const d = data[i][j];
    //     const n: Neuron = new Neuron();
    //     n.position = [i, j];
    //     this.initCube(x + j * (this.cubeSize + this.cubeGap),
    //       y - i * (this.cubeSize + this.cubeGap), z, new Color(d, d, d), n);
    //   }
    // }
    const layer: InputLayer = new InputLayer({
      centerX: x,
      centerY: y,
      centerZ: z,
      shape: [data.length, data[0].length, 1],
      scene: this.scene
    });
    layer.render(data);
  }

  initLayer3(x, y, z, zIndex, data: number[][][]): void {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        const d = data[i][j][zIndex];
        const n: Neuron = new Neuron();
        n.position = [i, j, zIndex];
        this.initCube(x + j * (this.cubeSize + this.cubeGap),
          y - i * (this.cubeSize + this.cubeGap), z, new Color(d, d, d), n);
      }
    }
  }

  initCube(x: number, y: number, z: number, color: Color, neuron: Neuron): void {
    // 方块大小
    const geometry: Geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
    const material: MeshMaterial = new THREE.MeshLambertMaterial( {
      color: color
    } );
    const cube: Mesh = new THREE.Mesh(geometry, material);

    cube.position.set(x, y, z);
    neuron.cube = cube;
    // this.cubes.push(cube);
    this.neurons.push(neuron);
    this.scene.add(cube);
  }

  start(): void {
    this.initThree();
    this.initScene();
    this.initCamera();
    this.initLight();
    // this.initObject();
    // this.render();

    this.neuronService.getNeuronData()
      .subscribe(res => {
        const input = res['data']['input'];
        const conv = res['data']['conv'];
        const pool = res['data']['pool'];
        const fc = res['data']['fc'];
        const output = res['data']['output'];
        // this.initLayer2(- (this.cubeSize + this.cubeGap) * 7, (this.cubeSize + this.cubeGap) * 7, 0, input);

        // this.initLayer2(0, 0, 0, input);

        let Y = 0;

        const input_layer: InputLayer = new InputLayer({
          centerX: 0,
          centerY: Y,
          centerZ: 0,
          shape: [input.length, input[0].length, 1],
          scene: this.scene
        });
        input_layer.render(input);

        Y += input[0].length * (this.cubeSize + this.cubeGap) / 2;

        const conv_layers = [];

        for (let i = 0; i < conv.length; i++) {
          const feature = conv[i];
          const length = feature.length * (this.cubeSize + this.cubeGap);
          const conv_layer: ConvLayer = new ConvLayer({
            centerX: -(length * conv.length + 10 * (conv.length - 1)) / 2 + (length + 10) * i + length / 2,
            centerY: Y + feature[0].length * (this.cubeGap + this.cubeSize) / 2 + 20,
            centerZ: 0,
            shape: [feature.length, feature[0].length, 1],
            scene: this.scene
          });
          conv_layer.render(feature);
          conv_layers.push(conv_layer);
        }

        Y += conv[0][0].length * (this.cubeGap + this.cubeSize) + 20;

        const pool_layers = [];
        for (let i = 0; i < pool.length; i++) {
          const feature = pool[i];
          const length = feature.length * (this.cubeSize + this.cubeGap);
          const pool_layer: ConvLayer = new ConvLayer({
            centerX: -(length * pool.length + 10 * (pool.length - 1)) / 2 + (length + 10) * i + length / 2,
            centerY: Y + feature[0].length * (this.cubeGap + this.cubeSize) / 2 + 20 ,
            centerZ: 0,
            shape: [feature.length, feature[0].length, 1],
            scene: this.scene
          });
          pool_layer.render(feature);
          pool_layers.push(pool_layer);
        }

        Y +=  pool[0][0].length * (this.cubeGap + this.cubeSize) / 2 + 20;

        const fc_latter: FlattenLayer = new FlattenLayer({
          centerX: 0,
          centerY: Y + (this.cubeSize + this.cubeGap) + 40,
          centerZ: 0,
          shape: [fc.length, 1],
          scene: this.scene
        });
        fc_latter.render(fc);

        Y += (this.cubeSize + this.cubeGap) + 40;

        const output_layer: FlattenLayer = new FlattenLayer({
          centerX: 0,
          centerY: Y + (this.cubeSize + this.cubeGap) + 20,
          centerZ: 0,
          shape: [output.length, 1],
          scene: this.scene
        });
        output_layer.render(output);

        this.render();
      });

    this.windowAddMouseWheel();
    this.addTouchListener();
  }

  windowAddMouseWheel(): void {
    const that: NeuronComponent = this;
    const scrollFunc = function(e: MouseEvent) {
      e = e || <MouseEvent> window.event;
      if (e['wheelDelta']) {
        that.camera.position.z = that.camera.position.z + e['wheelDelta'] * 0.1;
      } else if (e.detail) {
        // Firefox滑轮事件
        that.camera.position.z = that.camera.position.z + e.detail * 0.1;
      }
      if (that.camera.position.z < 10) {
        that.camera.position.z = 10;
      }
      that.render();
    };

    if (document.addEventListener) {
      document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    window.onmousewheel = document.onmousewheel = scrollFunc;
  }

  addTouchListener(): void {
    const that: NeuronComponent = this;
    let startX: number, endX: number, startY: number, endY: number;
    document.body.onmousedown = function (event) {
      startX = event.clientX;
      startY = event.clientY;
    };
    document.body.onmousemove = function (event) {
      console.log(event);
      if (event.buttons === 1 ) {
        endX = event.clientX;
        endY = event.clientY;
        const x: number = endX - startX;
        const y: number = endY - startY;
        if (Math.abs(x) > Math.abs(y)) {
          that.camera.position.x = that.camera.position.x - x * 0.1;
        } else {
          that.camera.position.y = that.camera.position.y + y * 0.1;
        }
        startX = endX;
        startY = endY;

        that.render();
      }
    };
  }

}
