import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface Position {
  company: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
}

interface QuoteResponse {
  success: boolean;
  priceCurrent?: number;
  message?: string;
}

interface HistoryPoint {
  month: string;
  compras: number;
  ventas: number;
}

type ChartWindow = Window & {
  Chart?: new (
    canvas: HTMLCanvasElement,
    config: Record<string, unknown>
  ) => unknown;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('portfolioChart')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  readonly positions: Position[] = [
    { company: 'Apple Inc.', symbol: 'AAPL', quantity: 12, purchasePrice: 195.5 },
    { company: 'Microsoft', symbol: 'MSFT', quantity: 8, purchasePrice: 412.1 },
    { company: 'NVIDIA', symbol: 'NVDA', quantity: 6, purchasePrice: 118.8 },
    { company: 'Tesla', symbol: 'TSLA', quantity: 15, purchasePrice: 178.3 }
  ];

  readonly history: HistoryPoint[] = [
    { month: 'Ene', compras: 2100, ventas: 500 },
    { month: 'Feb', compras: 3000, ventas: 650 },
    { month: 'Mar', compras: 2800, ventas: 420 },
    { month: 'Abr', compras: 3600, ventas: 900 },
    { month: 'May', compras: 2400, ventas: 1300 }
  ];

  currentValues: Array<{ symbol: string; currentPrice: number }> = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    void this.loadDashboard();
  }

  ngAfterViewInit(): void {
    const win = window as ChartWindow;
    if (typeof window !== 'undefined' && typeof win.Chart !== 'undefined') {
      this.renderHistoryChart();
    }
  }

  async loadDashboard(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const fetches = await Promise.all(
        this.positions.map(async (position) => {
          const quote = await this.fetchQuote(position.symbol);
          return {
            symbol: position.symbol,
            currentPrice: quote?.priceCurrent ?? 0
          };
        })
      );

      this.currentValues = fetches;
    } catch {
      this.errorMessage = 'No fue posible obtener el precio actual de las acciones.';
    } finally {
      this.loading = false;
      setTimeout(() => this.renderHistoryChart(), 0);
    }
  }

  private async fetchQuote(symbol: string): Promise<QuoteResponse | null> {
    const response = await fetch(`http://localhost:4000/api/market/quote?symbol=${symbol}`);
    const payload = (await response.json()) as QuoteResponse;

    if (!payload.success || payload.priceCurrent == null) {
      return null;
    }

    return payload;
  }

  getCapitalInvertido(): number {
    return this.positions.reduce((total, position) => total + position.purchasePrice * position.quantity, 0);
  }

  getCapitalActual(): number {
    return this.positions.reduce((total, position) => {
      const currentPrice = this.currentValues.find((item) => item.symbol === position.symbol)?.currentPrice ?? 0;
      return total + currentPrice * position.quantity;
    }, 0);
  }

  getGanancias(): number {
    const gains = this.positions.reduce((total, position) => {
      const currentPrice = this.currentValues.find((item) => item.symbol === position.symbol)?.currentPrice ?? 0;
      const priceDelta = currentPrice - position.purchasePrice;
      return total + (priceDelta > 0 ? priceDelta * position.quantity : 0);
    }, 0);

    return gains;
  }

  getPerdidas(): number {
    const losses = this.positions.reduce((total, position) => {
      const currentPrice = this.currentValues.find((item) => item.symbol === position.symbol)?.currentPrice ?? 0;
      const priceDelta = currentPrice - position.purchasePrice;
      return total + (priceDelta < 0 ? Math.abs(priceDelta) * position.quantity : 0);
    }, 0);

    return losses;
  }

  renderHistoryChart(): void {
    const win = window as ChartWindow;

    if (!this.chartCanvas || typeof window === 'undefined' || typeof win.Chart === 'undefined') {
      return;
    }

    const labels = this.history.map((item) => item.month);
    const compras = this.history.map((item) => item.compras);
    const ventas = this.history.map((item) => item.ventas);

    new win.Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Compras',
            data: compras,
            backgroundColor: '#2563eb',
            borderRadius: 8
          },
          {
            label: 'Ventas',
            data: ventas,
            backgroundColor: '#0f766e',
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: string | number) => `$${value}`
            }
          }
        }
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  }
}
