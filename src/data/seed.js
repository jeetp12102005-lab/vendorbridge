// VendorBridge ERP — Seed Data
import { genId, today } from '../utils/helpers';

export const SEED = {
  users: [
    { id: 'u1', name: 'Arjun Mehta',   email: 'admin@vb.com',    password: 'admin123',   role: 'admin' },
    { id: 'u2', name: 'Priya Shah',    email: 'officer@vb.com',  password: 'officer123', role: 'officer' },
    { id: 'u3', name: 'Rahul Verma',   email: 'manager@vb.com',  password: 'manager123', role: 'manager' },
    { id: 'u4', name: 'TechSupply Co', email: 'vendor@vb.com',   password: 'vendor123',  role: 'vendor', vendorId: 'v1' },
    { id: 'u5', name: 'OfficeWorld Ltd',email: 'vendor2@vb.com', password: 'vendor456',  role: 'vendor', vendorId: 'v2' },
  ],
  vendors: [
    {
      id: 'v1', name: 'TechSupply Co', category: 'Electronics',
      gst: '27AABCT3518Q1ZV', email: 'vendor@vb.com', phone: '9876543210',
      address: 'Mumbai, MH', status: 'active', rating: 4.5,
      createdAt: '2024-01-15', website: 'techsupply.co.in', contactPerson: 'Rajiv Kumar',
    },
    {
      id: 'v2', name: 'OfficeWorld Ltd', category: 'Office Supplies',
      gst: '29AABCO1234Q1ZV', email: 'info@officeworld.com', phone: '9123456789',
      address: 'Bangalore, KA', status: 'active', rating: 4.2,
      createdAt: '2024-02-10', website: 'officeworld.in', contactPerson: 'Deepa Rao',
    },
    {
      id: 'v3', name: 'BuildRight Inc', category: 'Construction',
      gst: '24AABCB5678Q1ZV', email: 'sales@buildright.com', phone: '9988776655',
      address: 'Ahmedabad, GJ', status: 'active', rating: 3.8,
      createdAt: '2024-03-05', website: 'buildright.in', contactPerson: 'Mahesh Patel',
    },
    {
      id: 'v4', name: 'FreshGreens Pvt', category: 'Food & Beverage',
      gst: '33AABCF9012Q1ZV', email: 'contact@freshgreens.com', phone: '9765432101',
      address: 'Chennai, TN', status: 'inactive', rating: 3.5,
      createdAt: '2024-03-20', website: '', contactPerson: 'Anita Suresh',
    },
    {
      id: 'v5', name: 'CloudSystems Ltd', category: 'IT Services',
      gst: '07AABCC5678Q1ZV', email: 'bd@cloudsystems.in', phone: '9871234560',
      address: 'Delhi, DL', status: 'active', rating: 4.7,
      createdAt: '2024-04-01', website: 'cloudsystems.in', contactPerson: 'Vikram Sharma',
    },
  ],
  rfqs: [
    {
      id: 'rfq001', title: 'Office Laptops Procurement', description: 'Need 20 laptops for new employees joining next quarter.',
      items: [{ name: 'Laptop 15inch Core i7', qty: 20, unit: 'pcs' }],
      deadline: '2025-07-15', assignedVendors: ['v1', 'v2'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-01', attachments: [],
    },
    {
      id: 'rfq002', title: 'Office Furniture Setup', description: 'Chairs and desks for new office floor expansion.',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unit: 'pcs' },
        { name: 'Standing Desk', qty: 15, unit: 'pcs' },
      ],
      deadline: '2025-07-20', assignedVendors: ['v2', 'v3'], status: 'quoted',
      createdBy: 'u2', createdAt: '2025-06-02', attachments: [],
    },
    {
      id: 'rfq003', title: 'IT Infrastructure Cloud Services', description: 'Annual cloud hosting and maintenance contract.',
      items: [{ name: 'Cloud Server Subscription', qty: 1, unit: 'yr' }],
      deadline: '2025-08-01', assignedVendors: ['v5'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-04', attachments: [],
    },
  ],
  quotations: [
    {
      id: 'q001', rfqId: 'rfq001', vendorId: 'v1',
      items: [{ name: 'Laptop 15inch Core i7', qty: 20, unitPrice: 55000, total: 1100000 }],
      totalAmount: 1100000, gst: 18, grandTotal: 1298000, deliveryDays: 14,
      notes: 'Includes 3-year warranty and onsite support.', status: 'submitted', submittedAt: '2025-06-03',
    },
    {
      id: 'q002', rfqId: 'rfq001', vendorId: 'v2',
      items: [{ name: 'Laptop 15inch Core i7', qty: 20, unitPrice: 52000, total: 1040000 }],
      totalAmount: 1040000, gst: 18, grandTotal: 1227200, deliveryDays: 21,
      notes: 'Standard delivery, no warranty included.', status: 'submitted', submittedAt: '2025-06-04',
    },
    {
      id: 'q003', rfqId: 'rfq002', vendorId: 'v2',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unitPrice: 8000, total: 240000 },
        { name: 'Standing Desk', qty: 15, unitPrice: 15000, total: 225000 },
      ],
      totalAmount: 465000, gst: 18, grandTotal: 548700, deliveryDays: 7,
      notes: 'Same week delivery guaranteed.', status: 'submitted', submittedAt: '2025-06-03',
    },
    {
      id: 'q004', rfqId: 'rfq002', vendorId: 'v3',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unitPrice: 9000, total: 270000 },
        { name: 'Standing Desk', qty: 15, unitPrice: 14000, total: 210000 },
      ],
      totalAmount: 480000, gst: 18, grandTotal: 566400, deliveryDays: 10,
      notes: 'Premium quality materials, ISI certified.', status: 'submitted', submittedAt: '2025-06-04',
    },
  ],
  approvals: [
    {
      id: 'ap001', quotationId: 'q003', rfqId: 'rfq002', vendorId: 'v2',
      amount: 548700, status: 'approved', approvedBy: 'u3',
      remarks: 'Best price with quick delivery. Approved.', createdAt: '2025-06-05', updatedAt: '2025-06-05',
    },
  ],
  purchaseOrders: [
    {
      id: 'po001', poNumber: 'PO-2025-001', approvalId: 'ap001',
      quotationId: 'q003', rfqId: 'rfq002', vendorId: 'v2',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unitPrice: 8000, total: 240000 },
        { name: 'Standing Desk', qty: 15, unitPrice: 15000, total: 225000 },
      ],
      subtotal: 465000, gst: 18, gstAmount: 83700, grandTotal: 548700,
      status: 'active', createdAt: '2025-06-05', deliveryDate: '2025-06-12',
    },
  ],
  invoices: [
    {
      id: 'inv001', invoiceNumber: 'INV-2025-001', poId: 'po001', vendorId: 'v2',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unitPrice: 8000, total: 240000 },
        { name: 'Standing Desk', qty: 15, unitPrice: 15000, total: 225000 },
      ],
      subtotal: 465000, gst: 18, gstAmount: 83700, grandTotal: 548700,
      status: 'pending', createdAt: '2025-06-05', dueDate: '2025-07-05',
    },
  ],
  logs: [
    { id: 'log1', action: 'RFQ Created',          detail: 'Office Laptops RFQ created by Priya Shah',         timestamp: '2025-06-01T09:00:00', userId: 'u2', type: 'rfq' },
    { id: 'log2', action: 'Vendor Added',          detail: 'CloudSystems Ltd registered by admin',             timestamp: '2025-06-02T10:30:00', userId: 'u1', type: 'vendor' },
    { id: 'log3', action: 'Quotation Submitted',   detail: 'TechSupply Co submitted quote for rfq001',        timestamp: '2025-06-03T11:00:00', userId: 'u4', type: 'quotation' },
    { id: 'log4', action: 'Quotation Submitted',   detail: 'OfficeWorld Ltd submitted quote for rfq002',      timestamp: '2025-06-03T14:00:00', userId: 'u5', type: 'quotation' },
    { id: 'log5', action: 'Approval Granted',      detail: 'Manager Rahul Verma approved PO for rfq002',      timestamp: '2025-06-05T14:00:00', userId: 'u3', type: 'approval' },
    { id: 'log6', action: 'Purchase Order Created', detail: 'PO-2025-001 generated for OfficeWorld Ltd',       timestamp: '2025-06-05T14:01:00', userId: 'u3', type: 'po' },
    { id: 'log7', action: 'Invoice Generated',     detail: 'INV-2025-001 created for OfficeWorld Ltd',        timestamp: '2025-06-05T14:02:00', userId: 'u3', type: 'invoice' },
  ],
  // Monthly spend data for reports
  monthlySpend: [
    { month: 'Jan', amount: 420000 },
    { month: 'Feb', amount: 680000 },
    { month: 'Mar', amount: 310000 },
    { month: 'Apr', amount: 890000 },
    { month: 'May', amount: 540000 },
    { month: 'Jun', amount: 548700 },
  ],
};
