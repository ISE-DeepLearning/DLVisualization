import { Layer, LayerParameters } from './layer';
import { assertEqual, assertGreaterThan } from '@angular/core/src/render3/assert';
import { Neuron } from './neuron';
import { Color, Scene } from 'three';

export class InputLayer extends Layer {

  constructor(parameters?: LayerParameters) {
    super(parameters);
  }

  render(data: any[][]): void {
    // assertEqual(data.length, this.shape[0], 'Invalid data length!');
    // assertEqual(data[0].length, this.shape[1], 'Invalid data length!');

    const sizeX: number = data[0].length;
    const sizeY: number = data.length;

    const width: number = sizeX * this.cubeSize + (sizeX - 1) * this.cubeGap;
    const height: number = sizeY * this.cubeSize + (sizeY - 1) * this.cubeGap;

    const startX: number = this.centerX - width / 2;
    const startY: number = this.centerY + height / 2;

    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < this.shape[1]; j++) {
        const n: Neuron = this.neurons[i][j];
        const d: any = data[i][j];
        n.value = d;

        if (d instanceof Array) {
          // assertGreaterThan(d.length, 2, 'Invalid color length!');
          this.renderCube(startX + j * (this.cubeSize + this.cubeGap),
            startY - i * (this.cubeSize + this.cubeGap),
            this.centerZ,
            new Color(<number> d[0], <number> d[1], <number> d[2]), n);
        } else {
          this.renderCube(startX + j * (this.cubeSize + this.cubeGap),
            startY - i * (this.cubeSize + this.cubeGap),
            this.centerZ,
            new Color(<number> d, <number> d, <number> d), n);
        }
      }
    }
  }

}
