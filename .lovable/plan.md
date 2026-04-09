## Phase 1: Database Schema
Create tables for:
- **user_balances** — balance, bonus, deposits_total, withdrawals_total per user
- **transactions** — type (deposit/withdraw/invest), amount, status, crypto type, wallet address
- **investment_plans** — name, min/max amount, ROI %, duration
- **user_investments** — user's active investments linked to plans
- **trading_bots** — bot definitions (name, description, ROI range)
- **user_bots** — user's bot instances with active/inactive toggle, profit tracking

All with proper RLS policies (users see only their own data).

## Phase 2: Functional Pages (7 new pages)
1. **Deposit** — form with amount + crypto selector, creates pending transaction
2. **Withdraw** — form with amount + wallet address, validates against balance
3. **Investment Plans** — browse plans, invest button deducts balance
4. **Earnings/ROI** — profit analytics with charts
5. **Transaction History** — filterable list of all transactions
6. **My Investments** — active investments with ROI tracking
7. **Portfolio Performance** — charts + stats overview

## Phase 3: Live Features
- **Crypto prices** — CoinGecko free API (client-side fetch, polling every 30s)
- **Top bar** — show BTC/ETH prices + user balance
- **Bot trading widget** — toggle on/off, simulate profit
- **Recent transactions** — auto-update after actions
- **Balance cards** — pull from user_balances table, update after transactions

## Phase 4: Polish
- Sidebar routes all functional with active highlighting
- Smooth animations and loading states
- Mobile responsive with bottom nav
