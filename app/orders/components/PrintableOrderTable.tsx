"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import Image from "next/image";

interface Props {
  product: {
    title: string;
    description: string;
    images?: string[];
  };
  quantity: number;
  price: number | string;
  subtotal: number | string;
  orderMeta: {
    shipping_status: string;
    shipping_fee: string | number;
    total: string | number;
    payment_status: string;
  };
}

const PrintableOrderTable = ({
  product,
  quantity,
  price,
  subtotal,
  orderMeta,
}: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Order Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-separate border-spacing-y-2">
          <thead className="text-sm text-gray-600">
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Qty</th>
              <th className="py-3 px-4 text-left">Unit Price</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Shipping Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            <tr className="bg-gray-50 hover:bg-gray-100 transition rounded-md">
              <td className="py-3 px-4 align-top">1</td>
              <td className="py-3 px-4 flex items-center gap-3">
                <Image
                  src={product.images?.[0] || "/no-image.png"}
                  width={50}
                  height={50}
                  alt={product.title}
                  className="rounded-md border object-cover w-12 h-12"
                />
                <div>
                  <p className="font-medium text-gray-800">{product.title}</p>
                  <div
                    className="text-xs text-gray-500 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  />
                </div>
              </td>
              <td className="py-3 px-4 align-top">{quantity}</td>
              <td className="py-3 px-4 align-top font-medium">
                {parseFloat(String(price)).toFixed(2)} CAD
              </td>
              <td className="py-3 px-4 align-top">20.00 CAD</td>
              <td className="py-3 px-4 align-top font-semibold">
                {parseFloat(String(subtotal)).toFixed(2)} CAD
              </td>
              <td className="py-3 px-4 align-top">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${
                    orderMeta.shipping_status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {orderMeta.shipping_status ?? "N/A"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="border border-gray-200 rounded-lg p-4 max-w-md ml-auto space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">
            {parseFloat(String(subtotal)).toFixed(2)} CAD
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium">
            {parseFloat(String(orderMeta.shipping_fee)).toFixed(2)} CAD
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span className="font-medium">0.00 CAD</span>
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-base font-semibold">
          <span>Grand Total</span>
          <span>
            {parseFloat(String(orderMeta.total)).toFixed(2)} CAD
          </span>
        </div>
      </div>

      {/* Payment Status */}
      <div className="flex justify-end">
        <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium text-sm">
          <CheckCircleIcon className="w-5 h-5" />
          {orderMeta.payment_status}
        </span>
      </div>
    </div>
  );
};

export default PrintableOrderTable;
