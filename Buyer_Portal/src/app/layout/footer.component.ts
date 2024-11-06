import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>© 2024 Green Tape Supply Chain Finance. All rights reserved.</p>
        <p>Finance Portal powered by Affno Virtual Market PTE LTD</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f8f9fa;
      border-top: 1px solid #e9ecef;
      padding: 0.30rem;
      font-size: 0.75rem;
      color: #6c757d;
    }

    .footer-content {
      text-align: center;
    }
  `]
})
export class FooterComponent {}