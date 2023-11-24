/*
 * Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @authors Christof Strack
 */
import {
  Component,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  ActionControl,
  AlertService,
  Column,
  ColumnDataType,
  Pagination,
} from "@c8y/ngx-components";
import { AnalyticsService } from "../../shared/analytics.service";
import { CEP_Block } from "../../shared/analytics.model";

@Component({
  selector: "c8y-sample-grid",
  templateUrl: "sample.component.html",
  styleUrls:['./sample.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SampleGridComponent implements OnInit {
  showConfigSample: boolean = false;
  refresh: EventEmitter<any> = new EventEmitter<any>();

  samples: Partial<CEP_Block>[] = [];
  actionControls: ActionControl[] = [];

  titleSample: string = "AnalyticsBuilder Community Samples";

  columnsSamples: Column[] = [
    {
      name: "name",
      header: "Name",
      path: "name",
      filterable: false,
      dataType: ColumnDataType.TextLong,
      visible: true,
    },
  ];

  pagination: Pagination = {
    pageSize: 3,
    currentPage: 1,
  };

  constructor(
    public analyticsService: AnalyticsService,
    public alertService: AlertService
  ) {}

  async ngOnInit() {
    await this.loadSamples();
    this.refresh.subscribe(() => {
      this.loadSamples();
    });
  }

  async loadSamples() {
    this.samples = await this.analyticsService.getBlock_Samples();
  }

  ngOnDestroy() {}
}
