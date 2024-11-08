export interface DashboardData {
    companyName: string;
    statusMessage: string;
    isLive: boolean;
    requests: {
      ongoing: number;
      completed: number;
      pending: number;
    };
    payments: {
      received: number;
      pendingInvoices: number;
    };
  }