import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from "@angular/forms";

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.scss'
})
export class DateTimeComponent {
  @Input() form!: UntypedFormGroup;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() controlName: string = '';
}
