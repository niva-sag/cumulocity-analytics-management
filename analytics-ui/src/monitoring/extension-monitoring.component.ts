import { Component, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { AlarmService, AlarmStatus, IAlarm, IEvent, IResultList } from "@c8y/client";
import { shareReplay, switchMap, tap } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AnalyticsService } from "../shared/analytics.service";

@Component({
  selector: "extensionmonitoring",
  templateUrl: "./extension-monitoring.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ExtensionMonitoringComponent implements OnInit {
  cepId: string;
  @Output() closeSubject: Subject<void> = new Subject();
  alarms$: Observable<IResultList<IAlarm>>;
  events$: Observable<IResultList<IEvent>>;
  nextPageAlarm$: BehaviorSubject<any> = new BehaviorSubject({ direction: 0 });
  nextPageEvent$: BehaviorSubject<any> = new BehaviorSubject({ direction: 0 });
  currentPageAlarm: number = 1;
  currentPageEvent: number = 1;
  searchString: string;
  status: AlarmStatus;
  AlarmStatus = AlarmStatus;
  isAlarmExpanded: boolean = true;
  isEventExpanded: boolean = false;

  constructor(
    private alarmService: AlarmService,
    private eventService: AlarmService,
    private analyticsService: AnalyticsService,
    public bsModalRef: BsModalRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.init();
    this.cepId = await this.analyticsService.getCEP_Id();
    let filterAlarm: object = {
      pageSize: 5,
      source: this.cepId,
      currentPage: 1,
      withTotalPages: true,
    };
    let filterEvent: object = {
      pageSize: 5,
      source: this.cepId,
      currentPage: 1,
      withTotalPages: true,
    };
    this.alarms$ = this.nextPageAlarm$.pipe(
      tap((options) => {
        if (options.direction) {
          this.currentPageAlarm = this.currentPageAlarm + options.direction;
          if (this.currentPageAlarm < 1) this.currentPageAlarm = 1;
          filterAlarm["currentPage"] = this.currentPageAlarm;
        }
        if (options.status) {
          filterAlarm["status"] = options.status;
        }
      }),
      switchMap(() => this.alarmService.list(filterAlarm)),
      shareReplay()
    );
    this.events$ = this.nextPageEvent$.pipe(
      tap((options) => {
        if (options.direction) {
          this.currentPageEvent = this.currentPageEvent + options.direction;
          if (this.currentPageEvent < 1) this.currentPageEvent = 1;
          filterAlarm["currentPage"] = this.currentPageEvent;
        }
      }),
      switchMap(() => this.eventService.list(filterEvent)),
      shareReplay()
    );
    this.nextPageAlarm$.next({ direction: 0 });
  }

  private async init() {
    this.cepId = await this.analyticsService.getCEP_Id();
  }

  nextPageAlarm(direction: number) {
    this.nextPageAlarm$.next({ direction });
  }

  nextPageEvent(direction: number) {
    this.nextPageEvent$.next({ direction });
  }

  search() {
    this.nextPageAlarm$.next({ status:this.status });
  }
}