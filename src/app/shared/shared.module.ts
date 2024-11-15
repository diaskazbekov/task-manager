import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/elements/button/button.component';
import { IconComponent } from './components/elements/icon/icon.component';
import { CheckboxComponent } from './components/elements/checkbox/checkbox.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ModalComponent } from './components/modal/modal.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { InputComponent } from './components/form/input/input.component';
import { TextareaComponent } from './components/form/textarea/textarea.component';
import { DateTimeComponent } from './components/form/date-time/date-time.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ValidationErrorsComponent } from './components/form/validation-errors/validation-errors.component';

@NgModule({
  declarations: [
    ButtonComponent,
    IconComponent,
    CheckboxComponent,
    ConfirmComponent,
    ModalComponent,
    ClickOutsideDirective,
    InputComponent,
    TextareaComponent,
    DateTimeComponent,
    ValidationErrorsComponent
  ],
  exports: [
    ButtonComponent,
    IconComponent,
    CheckboxComponent,
    ConfirmComponent,
    ModalComponent,
    InputComponent,
    TextareaComponent,
    DateTimeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
