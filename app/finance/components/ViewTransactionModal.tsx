'use client';

import React from 'react';
import { Transaction } from '@/types/TransactionType';
 import BaseModal from '@/app/components/commons/BaseModal';
import { formatAmount } from '@/utils/formatCurrency';
  
interface ViewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
 } 

export default function ViewTransactionModal({
    isOpen,
    onClose,
    transaction,
 }: ViewTransactionModalProps) {
 
    const account = transaction.settlement_account;
    const vendor = transaction.transaction_data.vendor;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Transaction Details">
            <div className="bg-gradient-to-tr from-gray-700 to-gray-900 text-white rounded-xl p-5 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Vendor Name</span>
                    <span className="font-medium">{vendor?.name || "Bought" } {vendor?.last_name || '' }</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Account Name</span>
                    <span className="font-medium">{account?.account_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Account Number</span>
                    <span className="font-medium">{account?.account_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Transit Number</span>
                    <span>{account?.transit_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Institution Number</span>
                    <span>{account?.institution_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Bank</span>
                    <span>{account?.name}</span>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                <div className="text-right text-sm text-gray-700">
                    <span className="font-semibold">Amount:</span>{' '}
                    <span className="text-amber-600 font-bold">
                        {formatAmount(transaction.amount)}
                    </span>
                </div>
 
 
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </BaseModal>
    );
}
