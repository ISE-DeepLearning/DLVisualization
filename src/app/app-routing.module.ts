import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeuronComponent } from './neuron/neuron.component';

const routes: Routes = [
  { path: '', component: NeuronComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
