import { Layer, LayerParameters } from './layer';
import { Neuron } from './neuron';
import { Color } from 'three';

export class FlattenLayer extends Layer {

  constructor(parameters?: LayerParameters) {
    super(parameters);
  }

  render(data: any[]): void {
    const sizeX: number = data.length;

    const width: number = sizeX * this.cubeSize + (sizeX - 1) * this.cubeGap;

    const startX: number = this.centerX - width / 2;
    const startY: number = this.centerY;

    for (let i = 0; i < this.shape[0]; i++) {
      const n: Neuron = this.neurons[i];
      const d: any = data[i];

      n.value = d;

      this.renderCube(startX + i * (this.cubeSize + this.cubeGap),
        startY,
        this.centerZ,
        new Color(<number> d * 255, <number> d * 255, <number> d * 255), n);
    }
  }

}
