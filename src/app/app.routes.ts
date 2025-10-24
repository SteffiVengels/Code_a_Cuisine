import { Routes } from '@angular/router';
import { MainContent } from './main-content/main-content';
import { LegalNotice } from './legal-notice/legal-notice';
import { LandingPage } from './landing-page/landing-page'; 
import { GenerateRecipe } from './generate-recipe/generate-recipe';
import { Cookbook } from './cookbook/cookbook';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'legal-notice', component: LegalNotice },
    { path: 'generate-recipe', component: GenerateRecipe },
    { path: 'cookbook', component: Cookbook }


];
