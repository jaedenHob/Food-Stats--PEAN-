import { Routes } from '@angular/router';

// components to use
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';


export const routes: Routes = [
    {
        path: 'login', 
        component: LoginComponent
    },

    { 
        path: 'register', 
        component: RegisterComponent 
    },

    { 
        path: 'dashboard', 
        component: DashboardComponent 
    },
    
    {
        path:'', redirectTo: 'dashboard', pathMatch: 'full'
    }
];
