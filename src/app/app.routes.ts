import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'chat/:chatId', component: ChatPageComponent },
];
