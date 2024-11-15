import { Component, Input, OnInit } from '@angular/core';
import { ITask } from "../../../shared/interfaces/task.interface";
import { EIcon } from "../../../shared/enums/icon.enum";
import { IResponseData, TasksService } from "../tasks.service";
import { ITag } from "../../../shared/interfaces/tag.interface";
import { IFilter } from "../../../shared/interfaces/filter.interface";

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrl: './common.component.scss'
})
export class CommonComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() mine: boolean = false;
  @Input() important: boolean = false;
  @Input() completed: boolean = false;
  @Input() deleted: boolean = false;
  @Input() search: boolean = false;
  tasks: ITask[] = [];
  total: number = 0;
  limit: number = 10;
  protected readonly iconName = EIcon;
  operateModal: boolean = false;
  confirmModal: boolean = false;
  operatedItem: ITask | undefined = undefined;
  private filter: IFilter = {};

  constructor(private _tasksService: TasksService) {
  }

  ngOnInit(): void {
    const { mine, important, completed, deleted, search } = this;
    this.filter = { mine, important, completed, deleted, search };
    this._tasksService.searchValue.subscribe((value: string): void => {
      if (value) {
        this.filter.searchValue = value;
        this.getTasks();
      }
    });
    this._tasksService.selectedTags.subscribe((ids: number[]): void => {
      this.filter.tagIds = ids;
      this.getTasks();
    });
    this._tasksService.newTask.subscribe((value: boolean): void => {
      if (value) {
        this.operateModal = value;
        this._tasksService.newTask.next(false);
      }
    });
    this.getTasks();
  }

  getTasks(): void {
    this._tasksService.getTasks(this.filter, this.limit).subscribe({
      next: (response: IResponseData): void => {
        this.tasks = response.data;
        this.total = response.total;
      }
    });
  }

  clickItem(event: any, item: ITask): void {
    event.preventDefault();
    this.operatedItem = item;
    this.operateModal = true;
  }

  toggleCompleted(item: ITask): void {
    this.operatedItem = item;
    this.operate('complete');
  }

  selectTag(event: any, tag: ITag): void {
    event.preventDefault();
    const selected: number[] = this._tasksService.selectedTags.getValue();
    if (!selected.includes(tag.id)) {
      selected.push(tag.id);
      this._tasksService.selectedTags.next(selected);
    }
  }

  toggleDeleted(item: ITask): void {
    this.operatedItem = item;
    this.confirmModal = true;
  }

  operate(type: 'delete' | 'complete' = 'delete'): void {
    if (this.operatedItem) {
      if (type === 'delete') {
        this.operatedItem.deleted = !this.operatedItem.deleted;
      } else {
        this.operatedItem.completed = !this.operatedItem.completed;
      }
      this._tasksService.operateTask(this.operatedItem).subscribe({
        next: (): void => {
          this.operatedItem = undefined;
          this.confirmModal = false;
          this.getTasks();
        }
      });
    }
  }

  loadMore(event: any): void {
    event.preventDefault();
    this.limit += 5;
    this.getTasks();
  }

  closeModal(): void {
    this.operatedItem = undefined;
    this.operateModal = false;
  }

  saved(): void {
    this.closeModal();
    this.getTasks();
  }

  stopped(target: HTMLDivElement, index: number): void {
    const { top, bottom } = target.getBoundingClientRect();
    let moveToIndex: number | undefined = undefined;
    // let center: number | undefined = undefined;
    let up: boolean = false;
    let down: boolean = true;
    Array.from(target.parentNode!.children).forEach((item: any, i: number): void => {
      if (i !== index) {
        const rect: DOMRect = item.getBoundingClientRect();
        const { top: rectTop, bottom: rectBottom } = rect;
        up = bottom <= rectBottom && bottom >= rectTop;
        down = top >= rectTop && top <= rectBottom;
        if (up || down) {
          moveToIndex = i;
          // center = ((rectBottom - rectTop) / 2) + rectTop;
        }
      }
    });
    if (moveToIndex !== undefined) {
      if (moveToIndex !== index) {
        this.move(index, moveToIndex, down);
      }
    }
  }

  move(fromIndex: number, toIndex: number, down: boolean): void {
    const element: ITask = this.tasks.splice(fromIndex, 1)[0];
    if (!down && toIndex === 0) {
      this.tasks.unshift(element);
    } else {
      this.tasks.splice(toIndex - (down ? 0 : 1), 0, element);
    }
  }
}
