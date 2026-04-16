import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Aventure } from './pages/aventure/aventure';
import { Classique } from './pages/classique/classique';
import { Rand } from './pages/rand/rand';
import { Admin } from './pages/admin/admin';
import { UploadImage } from './testes/upload-image/upload-image';
import { Login } from './components/admin/login/login';

export const routes: Routes = [
    {
        path:'',
        // redirectTo:'we-explore-mada/part/one/admin/login',
        redirectTo:'',
        pathMatch:'full'
    },
    {
        path:'',
        component:Home
    },
    {
        path:'aventure',
        component:Aventure,
    },
    {
        path:'classique',
        component:Classique,
    },
    {
        path:'randonnees',
        component:Rand,
    },
    {
        path:'we-explore-mada/part/one/admin',
        component:Admin,
    },
    {
        path:'we-explore-mada/part/one/admin/login',
        component:Login,
    },
    {
        path:'test-upload',
        component:UploadImage
    }
];
