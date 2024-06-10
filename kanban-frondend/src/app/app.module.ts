import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './services/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { BoardComponent } from './components/board/board.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import {MatSidenavModule} from '@angular/material/sidenav';

import {MatCardModule} from '@angular/material/card';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ThemesComponent } from './services/themes/themes.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarsComponent } from './components/snackbars/snackbars.component';

import { FormsModule } from '@angular/forms';
import { SnackMsgComponent } from './components/snack-msg/snack-msg.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    BoardComponent,
    ThemesComponent,
    SnackbarsComponent,
    SnackMsgComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    DragDropModule,
    CdkDropList,
    CdkDrag,
    MatSnackBarModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideAnimationsAsync(),
    ThemesComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
