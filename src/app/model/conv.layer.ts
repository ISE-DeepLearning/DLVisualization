import { Layer, LayerParameters } from './layer';
import { Neuron } from './neuron';
import { Color } from 'three';

export class ConvLayer extends Layer {

  constructor(parameters?: LayerParameters) {
    super(parameters);
  }

  render(data: any[]): void {
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

        this.renderCube(startX + j * (this.cubeSize + this.cubeGap),
          startY - i * (this.cubeSize + this.cubeGap),
          this.centerZ,
          new Color(<number> d * 255, <number> d * 255, <number> d * 255), n);

      }
    }
  }

}
