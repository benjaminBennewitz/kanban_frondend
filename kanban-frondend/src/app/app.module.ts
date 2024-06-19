import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

import { AuthComponent } from './services/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { BoardComponent } from './components/board/board.component';
import { ThemesComponent } from './services/themes/themes.component';
import { SnackbarsComponent } from './components/snackbars/snackbars.component';
import { SnackMsgComponent } from './components/snack-msg/snack-msg.component';
import { DialogRegisterComponent } from './components/dialog-register/dialog-register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { CountPipe } from './components/board/count.pipe';
import { TaskServiceComponent } from './services/task-service/task-service.component';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    BoardComponent,
    ThemesComponent,
    SnackbarsComponent,
    SnackMsgComponent,
    DialogRegisterComponent,
    CountPipe,
    AddTaskDialogComponent,
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
    MatMenuModule,
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
    MatDialogModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  providers: [
    provideAnimationsAsync(), 
    ThemesComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    SnackbarsComponent,
    TaskServiceComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
