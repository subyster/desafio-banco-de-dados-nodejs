import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const totalIncome = transactions.reduce(
      (total, transaction) =>
        transaction.type === 'income'
          ? Number(total) + Number(transaction.value)
          : Number(total),
      0,
    );

    const totalOutcome = transactions.reduce(
      (total, transaction) =>
        transaction.type === 'outcome'
          ? Number(total) + Number(transaction.value)
          : Number(total),
      0,
    );

    const totalBalance = totalIncome - totalOutcome;
    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalBalance,
    };

    return balance;
  }
}

export default TransactionsRepository;
