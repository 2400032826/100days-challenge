import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, Plus, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function FinancePage() {
  const { data, activeDayNumber, currentDayData, addFinance } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    note: '',
  });

  // Calculate real balances from actual recorded transactions across all days
  const { totalIncome, totalExpense, totalSavings } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let savings = 0;
    Object.values(data.days || {}).forEach(d => {
      (d.finance || []).forEach(tx => {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') income += amt;
        else if (tx.type === 'expense') expense += amt;
        else if (tx.type === 'savings' || tx.type === 'investment') savings += amt;
      });
    });
    return { totalIncome: income, totalExpense: expense, totalSavings: savings };
  }, [data.days]);

  const currentBalance = totalIncome - totalExpense;
  const dayTransactions = currentDayData?.finance || [];

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.amount) return;
    addFinance(activeDayNumber, form);
    setForm({ type: 'expense', amount: '', category: 'Food', note: '' });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="arc-card p-6 sm:p-8 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
            FINANCIAL DISCIPLINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            FINANCE TRACKER
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            No invented balances. Track real income, expenses, and savings deposits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="arc-btn-primary"
        >
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Current Net Balance</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            ₹{currentBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            Real cash balance
          </span>
        </div>

        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Total Savings / Investments</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
            ₹{totalSavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            Capital accumulated
          </span>
        </div>

        <div className="arc-card p-5">
          <span className="text-xs font-semibold text-[#64748B] block">Total Expenses</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
            ₹{totalExpense.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">
            Total spending recorded
          </span>
        </div>
      </div>

      {/* Day Transactions List */}
      <div className="arc-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Day {activeDayNumber} Transactions</h3>
        </div>

        {dayTransactions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="₹0 logged for this day"
            description="Add your expenses, income, or savings allocations as they occur."
            actionLabel="Add Transaction"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {dayTransactions.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'expense' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {tx.type === 'expense' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">{tx.category}</span>
                    {tx.note && <span className="text-[11px] text-[#64748B] block mt-0.5">{tx.note}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-mono ${tx.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.type === 'expense' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Transaction" subtitle={`Day ${activeDayNumber}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full arc-input"
              >
                <option value="expense">Expense</option>
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="500"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full arc-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full arc-input"
            >
              <option value="Food">Food / Groceries</option>
              <option value="Travel">Travel / Transit</option>
              <option value="Education">Education & Books</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Savings">Savings Vault</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Protein powder supply"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              className="w-full arc-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="arc-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="arc-btn-primary text-xs">
              Save Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
