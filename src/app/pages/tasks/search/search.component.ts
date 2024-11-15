import { Component } from '@angular/core';
import { EIcon } from "../../../shared/enums/icon.enum";
import { Router } from "@angular/router";
import { TasksService } from "../tasks.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  protected readonly iconName = EIcon;

  constructor(
    private _tasksService: TasksService,
    private _router: Router
  ) {
  }

  search(event: any): void {
    const searchValue = event.target.value;
    if (searchValue) {
      this._router.navigate(['search']).then();
      this._tasksService.searchValue.next(searchValue);
    }
  }
}
