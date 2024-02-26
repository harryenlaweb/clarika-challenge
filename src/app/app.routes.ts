import { Routes } from '@angular/router';
import { TaskComponent } from './components/task/task.component';

export const routes: Routes = [
    { path: 'task', component: TaskComponent },
    { path: '**', redirectTo: 'task', pathMatch: 'full' },
    
];
