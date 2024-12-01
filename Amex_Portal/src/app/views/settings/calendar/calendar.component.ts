import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Holiday {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  type: string;
}

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  holidays: Holiday[] = [];

  newHoliday: Holiday = {
    id: 0,
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    type: ''
  };

  holidayTypes: string[] = [
    'National',
    'Religious',
    'Cultural',
    'Public',
    'Other'
  ];

  constructor() { }

  ngOnInit(): void {
    this.generateCalendarDays();
  }

  generateCalendarDays(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const days: Date[] = [];
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  isHoliday(date: Date): Holiday | undefined {
    return this.holidays.find(holiday =>
      date >= holiday.startDate && date <= holiday.endDate
    );
  }

  addHoliday(): void {
    if (!this.newHoliday.name || !this.newHoliday.type) return;

    // Ensure date objects are properly handled
    this.newHoliday.startDate = new Date(this.newHoliday.startDate);
    this.newHoliday.endDate = new Date(this.newHoliday.endDate);

    // Ensure start date is before or equal to end date
    if (this.newHoliday.startDate > this.newHoliday.endDate) {
      [this.newHoliday.startDate, this.newHoliday.endDate] =
        [this.newHoliday.endDate, this.newHoliday.startDate];
    }

    // Generate a unique ID
    this.newHoliday.id = Date.now();

    // Add to holidays list
    this.holidays.push({ ...this.newHoliday });

    // Reset form
    this.newHoliday = {
      id: 0,
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      type: ''
    };
  }

  removeHoliday(id: number): void {
    this.holidays = this.holidays.filter(holiday => holiday.id !== id);
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
  }
}