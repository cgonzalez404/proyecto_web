import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Holding {
  company: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
}

interface QuoteResponse {
  success: boolean;
  message?: string;
  symbol?: string;
  priceCurrent?: number;
}

interface PortfolioRow {
  company: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  rendimento: number;
}

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss'
})
export class PortafolioComponent implements OnInit {
  readonly holdings: Holding[] = [
    { company: 'Apple Inc.', symbol: 'AAPL', quantity: 12, purchasePrice: 195.5 },
    { company: 'Microsoft', symbol: 'MSFT', quantity: 8, purchasePrice: 412.1 },
    { company: 'NVIDIA', symbol: 'NVDA', quantity: 6, purchasePrice: 118.8 },
    { company: 'Tesla', symbol: 'TSLA', quantity: 15, purchasePrice: 178.3 }
  ];

  rows: PortfolioRow[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    void this.loadPortfolio();
  }

  async loadPortfolio(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const rows = await Promise.all(
        this.holdings.map(async (holding) => {
          const quote = await this.fetchQuote(holding.symbol);

          const currentPrice = quote?.priceCurrent ?? 0;
          const totalValue = holding.quantity * currentPrice;
          const totalCost = holding.quantity * holding.purchasePrice;
          const gainLoss = totalValue - totalCost;
          const rendimento = totalCost === 0 ? 0 : (gainLoss / totalCost) * 100;

          return {
            company: holding.company,
            symbol: holding.symbol,
            quantity: holding.quantity,
            purchasePrice: holding.purchasePrice,
            currentPrice,
            totalValue,
            gainLoss,
            rendimento
          };
        })
      );

      this.rows = rows;
    } catch {
      this.errorMessage = 'No fue posible obtener las cotizaciones actuales del portafolio.';
    } finally {
      this.loading = false;
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  }

  formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  getPortfolioTotal(): number {
    return this.rows.reduce((accumulator, row) => accumulator + row.totalValue, 0);
  }

  getPortfolioGainLoss(): number {
    return this.rows.reduce((accumulator, row) => accumulator + row.gainLoss, 0);
  }
}
