import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import OrderTab from "../components/OrderDetails/OrderTab";
import InvoiceTab from "../components/OrderDetails/InvoiceTab";
import CustomerTab from "../components/OrderDetails/CustomerTab";
import VendorTab from "../components/OrderDetails/VendorTab";
import TotalPriceProfitTab from "../components/OrderDetails/TotalPriceProfitTab";

const STATIC_ORDER = {
  orderId: "1001",
  chargedDate: "2024-10-01",
  chargedVendor: "Vendor A",
  leadSource: "Web",
  procuredBy: "Sarah Wilson",
  orderDate: "2024-10-01",
  refundDate: "",
  salesAgent: "John",
  invoiceNo: "INV-001",
  orderSource: "Online",
  paymentStatus: "Paid",
  brand: "Acme Gear",
  category: "Electronics",
  partNumber: "PN-001",
  condition: "New",
  shippingAccount: "ACC-1",
  billTo: "123 Main St",
  shipTo: "123 Main St",
  city: "New York",
  state: "NY",
  country: "USA",
  carrier: "FedEx",
  tracking: "TRK123",
  status: "Delivered",
  reason: "",
  customerName: "John Doe",
  customerCompany: "Acme Inc",
  customerEmail: "john@example.com",
  customerPhone: "+1 234 567 8900",
  paidVia: "Card",
  ccPaypal: "4%",
  qty: 12,
  price: 12500,
  shipping: 100,
  tax: 500,
  cost: 10000,
  vendorShipping: 50,
  vendorTax: 200,
  totalPriceValue: 13100,
  vendor: "Vendor A",
  vendorOrder: "VO-001",
  vendorPart: "VP-001",
  entryReason: "",
  comment: "",
  attachedOrder: "",
  totalPrice: 13100,
  totalPricePrice: 12500,
  totalPriceTax: 600,
  totalCost: 10450,
  totalCostValue: 10000,
  totalCostVendorTax: 450,
  totalCostWith4Percent: 10868,
  totalCost4Percent: 10450,
  ccPaypal4Percent: 418,
  grossProfit: 2650,
  grossProfitTotalPrice: 13100,
  grossProfitTotalCost: 10450,
  grossProfitMinus4: 2232,
  grossProfitMinus4TotalPrice: 13100,
  grossProfitMinus4TotalCost: 10868,
  profit: 2232,
  profitTotalPrice: 13100,
  profitTotalCostMinus4: 10868,
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("order");

  const tabs = [
    { label: "Order", path: "order" },
    { label: "Invoice", path: "invoice" },
    { label: "Customer", path: "customer" },
    { label: "Vendor", path: "vendor" },
    { label: "Total price & Profit", path: "total-price-profit" },
  ];

  const handleTabClick = (tabPath) => {
    const tabKey = tabPath === "total-price-profit" ? "total price & profit" : tabPath;
    setActiveTab(tabKey);
  };

  const handleUpdateField = () => {}; // no-op for static

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/users")} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-700">Order #{id || STATIC_ORDER.orderId}</h1>
        </div>
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl text-gray-400" />
          <div>
            <p className="text-sm font-semibold text-gray-700">{STATIC_ORDER.procuredBy}</p>
            <p className="text-xs text-gray-500">Sales Agent</p>
          </div>
        </div>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          {tabs.map((tab) => {
            const tabKey = tab.path === "total-price-profit" ? "total price & profit" : tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`px-5 py-2 rounded-full text-sm font-medium ${
                  activeTab === tabKey ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-md">
            • {STATIC_ORDER.status}
          </span>
        </div>

        {activeTab === "order" && <OrderTab orderData={STATIC_ORDER} handleUpdateField={handleUpdateField} />}
        {activeTab === "invoice" && <InvoiceTab orderData={STATIC_ORDER} handleUpdateField={handleUpdateField} />}
        {activeTab === "customer" && <CustomerTab orderData={STATIC_ORDER} />}
        {activeTab === "vendor" && <VendorTab orderData={STATIC_ORDER} />}
        {activeTab === "total price & profit" && <TotalPriceProfitTab orderData={STATIC_ORDER} handleUpdateField={handleUpdateField} />}
      </div>
    </>
  );
};

export default OrderDetails;
