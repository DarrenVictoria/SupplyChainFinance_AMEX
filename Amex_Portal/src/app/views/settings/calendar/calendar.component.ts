import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// FullCalendar Imports
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

// Define interfaces for type safety and clarity
interface Duration {
  days: number;
  hours: number;
  minutes: number;
}

interface KPI {
  id: number;
  serviceName: string;
  taskName: string;
  duration: Duration;
  startDate: Date;
  endDate: Date;
  color?: string;
}


@Component({
  selector: 'calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',

})


export class CalendarComponent implements OnInit {
  // Color palette mapping for different service names
  serviceColorMap: { [key: string]: string } = {
    'Customer Support': '#FF6384',
    'Sales': '#36A2EB',
    'Marketing': '#FFCE56',
    'Product Development': '#4BC0C0',
    'Human Resources': '#9966FF',
    'Finance': '#FF9F40',
    'IT Services': '#FF6384'
  };



  // List to store KPIs with sample data
  kpis: KPI[] = [
    {
      id: 1,
      serviceName: 'Sales',
      taskName: 'Q4 Sales Strategy Review',
      duration: { days: 5, hours: 2, minutes: 30 },
      startDate: new Date('2023-11-15T09:00:00'),
      endDate: new Date('2023-11-20T16:30:00')
    },
    {
      id: 2,
      serviceName: 'Marketing',
      taskName: 'Holiday Campaign Planning',
      duration: { days: 7, hours: 1, minutes: 0 },
      startDate: new Date('2023-12-01T10:00:00'),
      endDate: new Date('2023-12-08T11:00:00')
    },
    {
      id: 3,
      serviceName: 'Product Development',
      taskName: 'Winter Feature Release',
      duration: { days: 10, hours: 4, minutes: 15 },
      startDate: new Date('2024-01-10T08:30:00'),
      endDate: new Date('2024-01-20T12:45:00')
    },
    {
      id: 4,
      serviceName: 'Customer Support',
      taskName: 'Holiday Support Surge Analysis',
      duration: { days: 3, hours: 1, minutes: 45 },
      startDate: new Date('2023-12-15T13:00:00'),
      endDate: new Date('2023-12-18T14:45:00')
    }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'title', // Removed 'today'
      center: 'dayGridMonth,dayGridWeek,dayGridDay',
      right: 'prev,next'
    },
    editable: true,
    eventClick: this.handleEventClick.bind(this),
    height: 'auto',
    contentHeight: 'auto',
    aspectRatio: 1.35,
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: 'short' }
      }
    }
  };

  // Initial new KPI object
  newKPI: KPI = {
    id: 0,
    serviceName: '',
    taskName: '',
    duration: { days: 0, hours: 0, minutes: 0 },
    startDate: new Date(),
    endDate: new Date()
  };

  // Predefined service names
  serviceNames: string[] = [
    'Customer Support',
    'Sales',
    'Marketing',
    'Product Development',
    'Human Resources',
    'Finance',
    'IT Services'
  ];

  constructor() { }

  ngOnInit(): void {
    this.updateCalendarEvents();
  }

  // Transform KPI to calendar event for display
  private transformKPIToEvent(kpi: KPI): EventInput {
    return {
      id: kpi.id.toString(),
      title: `${kpi.serviceName}: ${kpi.taskName}`,
      start: kpi.startDate,
      end: kpi.endDate,
      backgroundColor: this.serviceColorMap[kpi.serviceName] || '#007bff'
    };
  }

  // Update calendar events when KPIs change
  private updateCalendarEvents(): void {
    this.calendarOptions.events = this.kpis.map(kpi =>
      this.transformKPIToEvent(kpi)
    );
  }

  // Handle click event on calendar events
  handleEventClick(clickInfo: any): void {
    const kpiId = parseInt(clickInfo.event.id, 10);
    const selectedKPI = this.kpis.find(kpi => kpi.id === kpiId);

    if (selectedKPI) {
      // Populate form for editing
      this.newKPI = { ...selectedKPI };
    }
  }

  // Add a new KPI
  addKPI(): void {
    // Basic validation
    if (!this.newKPI.serviceName || !this.newKPI.taskName) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate end date based on start date and duration
    const endDate = new Date(this.newKPI.startDate);
    endDate.setDate(endDate.getDate() + this.newKPI.duration.days);
    endDate.setHours(
      endDate.getHours() + this.newKPI.duration.hours,
      endDate.getMinutes() + this.newKPI.duration.minutes
    );
    this.newKPI.endDate = endDate;

    // Generate unique ID
    this.newKPI.id = Date.now();

    // Add to KPIs list
    this.kpis.push({ ...this.newKPI });

    // Update calendar events
    this.updateCalendarEvents();

    // Reset form
    this.resetForm();
  }

  // Reset the form to initial state
  resetForm(): void {
    this.newKPI = {
      id: 0,
      serviceName: '',
      taskName: '',
      duration: { days: 0, hours: 0, minutes: 0 },
      startDate: new Date(),
      endDate: new Date()
    };
  }

  // Remove a KPI
  removeKPI(id: number): void {
    this.kpis = this.kpis.filter(kpi => kpi.id !== id);
    this.updateCalendarEvents();
  }


}