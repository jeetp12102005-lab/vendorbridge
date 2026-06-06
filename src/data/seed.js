// VendorBridge ERP — Seed Data
import { genId, today } from '../utils/helpers';

export const SEED = {
  users: [
    { id: 'u1', name: 'Arjun Mehta',     email: 'admin@vb.com',     password: 'admin123',   role: 'admin' },
    { id: 'u2', name: 'Priya Shah',      email: 'officer@vb.com',   password: 'officer123', role: 'officer' },
    { id: 'u3', name: 'Rahul Verma',     email: 'manager@vb.com',   password: 'manager123', role: 'manager' },
    { id: 'u4', name: 'TechSupply Co',   email: 'vendor@vb.com',    password: 'vendor123',  role: 'vendor', vendorId: 'v1' },
    { id: 'u5', name: 'OfficeWorld Ltd', email: 'vendor2@vb.com',   password: 'vendor456',  role: 'vendor', vendorId: 'v2' },
    { id: 'u6', name: 'Sneha Pillai',    email: 'officer2@vb.com',  password: 'officer456', role: 'officer' },
    { id: 'u7', name: 'Devraj Nair',     email: 'manager2@vb.com',  password: 'manager456', role: 'manager' },
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
    {
      id: 'v6', name: 'SafeGuard Security', category: 'Security',
      gst: '09AABCS4321Q1ZV', email: 'info@safeguardsec.com', phone: '9845671230',
      address: 'Hyderabad, TS', status: 'active', rating: 4.3,
      createdAt: '2024-05-12', website: 'safeguardsec.com', contactPerson: 'Kiran Reddy',
    },
    {
      id: 'v7', name: 'SwiftLogistics', category: 'Logistics',
      gst: '06AABCL8765Q1ZV', email: 'ops@swiftlogistics.in', phone: '9900112233',
      address: 'Pune, MH', status: 'active', rating: 4.0,
      createdAt: '2024-06-03', website: 'swiftlogistics.in', contactPerson: 'Amir Khan',
    },
    {
      id: 'v8', name: 'MediCare Supplies', category: 'Healthcare',
      gst: '21AABCM2345Q1ZV', email: 'supply@medicare.in', phone: '9812340001',
      address: 'Kolkata, WB', status: 'active', rating: 4.6,
      createdAt: '2024-07-18', website: 'medicareind.com', contactPerson: 'Soma Bose',
    },
    {
      id: 'v9', name: 'GreenPower Energy', category: 'Utilities',
      gst: '19AABCG6543Q1ZV', email: 'hello@greenpower.in', phone: '9934567890',
      address: 'Jaipur, RJ', status: 'active', rating: 3.9,
      createdAt: '2024-08-25', website: 'greenpowerenergy.in', contactPerson: 'Lalit Gupta',
    },
    {
      id: 'v10', name: 'PrintPerfect Studio', category: 'Printing',
      gst: '22AABCP1122Q1ZV', email: 'orders@printperfect.in', phone: '9867001122',
      address: 'Surat, GJ', status: 'inactive', rating: 3.2,
      createdAt: '2024-09-10', website: 'printperfect.in', contactPerson: 'Neha Joshi',
    },
    {
      id: 'v11', name: 'NetConnect ISP', category: 'Telecom',
      gst: '27AABCN9988Q1ZV', email: 'enterprise@netconnect.in', phone: '9755001234',
      address: 'Mumbai, MH', status: 'active', rating: 4.1,
      createdAt: '2024-10-01', website: 'netconnect.in', contactPerson: 'Suresh Menon',
    },
    {
      id: 'v12', name: 'AutoFleet Services', category: 'Transport',
      gst: '08AABCA3344Q1ZV', email: 'fleet@autofleet.in', phone: '9990087654',
      address: 'Gurgaon, HR', status: 'active', rating: 4.4,
      createdAt: '2024-11-15', website: 'autofleetservices.in', contactPerson: 'Ranjit Singh',
    },
  ],

  rfqs: [
    {
      id: 'rfq001', title: 'Office Laptops Procurement',
      description: 'Need 20 laptops for new employees joining next quarter. Should be Core i7, 16GB RAM.',
      items: [{ name: 'Laptop 15inch Core i7 16GB', qty: 20, unit: 'pcs' }],
      deadline: '2025-07-15', assignedVendors: ['v1', 'v2'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-01', attachments: [],
    },
    {
      id: 'rfq002', title: 'Office Furniture Setup',
      description: 'Chairs and desks for new office floor expansion (3rd floor).',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unit: 'pcs' },
        { name: 'Standing Desk', qty: 15, unit: 'pcs' },
      ],
      deadline: '2025-07-20', assignedVendors: ['v2', 'v3'], status: 'quoted',
      createdBy: 'u2', createdAt: '2025-06-02', attachments: [],
    },
    {
      id: 'rfq003', title: 'IT Infrastructure Cloud Services',
      description: 'Annual cloud hosting and maintenance contract for our production environment.',
      items: [{ name: 'Cloud Server Subscription (AWS-tier)', qty: 1, unit: 'yr' }],
      deadline: '2025-08-01', assignedVendors: ['v5'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-04', attachments: [],
    },
    {
      id: 'rfq004', title: 'Pantry & Cafeteria Restocking',
      description: 'Monthly consumables for office pantry — beverages, snacks, disposables.',
      items: [
        { name: 'Premium Coffee Sachets', qty: 500, unit: 'pcs' },
        { name: 'Mineral Water Bottles 1L', qty: 300, unit: 'pcs' },
        { name: 'Disposable Cups & Plates', qty: 1000, unit: 'pcs' },
      ],
      deadline: '2025-07-05', assignedVendors: ['v4'], status: 'quoted',
      createdBy: 'u6', createdAt: '2025-06-06', attachments: [],
    },
    {
      id: 'rfq005', title: 'CCTV & Access Control Installation',
      description: 'Install CCTV cameras (24 units) and biometric access at all 3 office entrances.',
      items: [
        { name: 'IP CCTV Camera 4MP', qty: 24, unit: 'pcs' },
        { name: 'Biometric Door Lock', qty: 3, unit: 'pcs' },
        { name: 'NVR 16-Channel Recorder', qty: 2, unit: 'pcs' },
      ],
      deadline: '2025-07-25', assignedVendors: ['v6'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-08', attachments: [],
    },
    {
      id: 'rfq006', title: 'Annual Stationery & Printing Supplies',
      description: 'Annual supply contract for all office stationery and marketing print materials.',
      items: [
        { name: 'A4 Paper Ream 500 sheets', qty: 200, unit: 'pcs' },
        { name: 'Ball Pens Blue/Black', qty: 500, unit: 'pcs' },
        { name: 'Printed Letterheads', qty: 5000, unit: 'pcs' },
        { name: 'Business Cards', qty: 2000, unit: 'pcs' },
      ],
      deadline: '2025-07-10', assignedVendors: ['v10', 'v2'], status: 'quoted',
      createdBy: 'u6', createdAt: '2025-06-10', attachments: [],
    },
    {
      id: 'rfq007', title: 'Internet Bandwidth Upgrade',
      description: 'Upgrade leased line from 100Mbps to 1Gbps for all office floors.',
      items: [{ name: '1 Gbps Dedicated Leased Line (Annual)', qty: 1, unit: 'yr' }],
      deadline: '2025-08-15', assignedVendors: ['v11'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-12', attachments: [],
    },
    {
      id: 'rfq008', title: 'Employee Medical Supplies Kit',
      description: 'First-aid kits and basic medicines for all floors and reception areas.',
      items: [
        { name: 'First Aid Kit Standard', qty: 10, unit: 'pcs' },
        { name: 'Sanitizer 500ml', qty: 50, unit: 'pcs' },
        { name: 'Masks (N95)', qty: 200, unit: 'pcs' },
      ],
      deadline: '2025-07-01', assignedVendors: ['v8'], status: 'closed',
      createdBy: 'u6', createdAt: '2025-05-20', attachments: [],
    },
    {
      id: 'rfq009', title: 'Fleet Vehicle Rental – Q3 2025',
      description: 'Monthly vehicle rental for management team and client visit logistics.',
      items: [
        { name: 'Sedan Car Rental (monthly)', qty: 3, unit: 'month' },
        { name: 'SUV Rental (monthly)', qty: 1, unit: 'month' },
      ],
      deadline: '2025-07-30', assignedVendors: ['v12', 'v7'], status: 'quoted',
      createdBy: 'u2', createdAt: '2025-06-14', attachments: [],
    },
    {
      id: 'rfq010', title: 'Solar Panel Installation – Rooftop',
      description: 'Install rooftop solar panels to reduce electricity costs. 10KW capacity.',
      items: [
        { name: 'Solar Panel 400W Monocrystalline', qty: 25, unit: 'pcs' },
        { name: 'Solar Inverter 10KW', qty: 1, unit: 'pcs' },
        { name: 'Installation & Wiring', qty: 1, unit: 'service' },
      ],
      deadline: '2025-09-01', assignedVendors: ['v9', 'v3'], status: 'open',
      createdBy: 'u2', createdAt: '2025-06-15', attachments: [],
    },
  ],

  quotations: [
    // rfq001 – Laptops
    {
      id: 'q001', rfqId: 'rfq001', vendorId: 'v1',
      items: [{ name: 'Laptop 15inch Core i7 16GB', qty: 20, unitPrice: 55000, total: 1100000 }],
      totalAmount: 1100000, gst: 18, grandTotal: 1298000, deliveryDays: 14,
      notes: 'Includes 3-year on-site warranty and Dell ProSupport.', status: 'submitted', submittedAt: '2025-06-03',
    },
    {
      id: 'q002', rfqId: 'rfq001', vendorId: 'v2',
      items: [{ name: 'Laptop 15inch Core i7 16GB', qty: 20, unitPrice: 52000, total: 1040000 }],
      totalAmount: 1040000, gst: 18, grandTotal: 1227200, deliveryDays: 21,
      notes: 'Standard delivery. 1-year manufacturer warranty only.', status: 'submitted', submittedAt: '2025-06-04',
    },
    // rfq002 – Furniture
    {
      id: 'q003', rfqId: 'rfq002', vendorId: 'v2',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unitPrice: 8000, total: 240000 },
        { name: 'Standing Desk', qty: 15, unitPrice: 15000, total: 225000 },
      ],
      totalAmount: 465000, gst: 18, grandTotal: 548700, deliveryDays: 7,
      notes: 'Same-week delivery guaranteed. Free installation.', status: 'submitted', submittedAt: '2025-06-03',
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
    // rfq004 – Pantry
    {
      id: 'q005', rfqId: 'rfq004', vendorId: 'v4',
      items: [
        { name: 'Premium Coffee Sachets', qty: 500, unitPrice: 12, total: 6000 },
        { name: 'Mineral Water Bottles 1L', qty: 300, unitPrice: 20, total: 6000 },
        { name: 'Disposable Cups & Plates', qty: 1000, unitPrice: 3, total: 3000 },
      ],
      totalAmount: 15000, gst: 5, grandTotal: 15750, deliveryDays: 3,
      notes: 'Monthly recurring supply. 15-day credit term available.', status: 'submitted', submittedAt: '2025-06-07',
    },
    // rfq006 – Stationery
    {
      id: 'q006', rfqId: 'rfq006', vendorId: 'v10',
      items: [
        { name: 'A4 Paper Ream 500 sheets', qty: 200, unitPrice: 250, total: 50000 },
        { name: 'Ball Pens Blue/Black', qty: 500, unitPrice: 15, total: 7500 },
        { name: 'Printed Letterheads', qty: 5000, unitPrice: 3, total: 15000 },
        { name: 'Business Cards', qty: 2000, unitPrice: 4, total: 8000 },
      ],
      totalAmount: 80500, gst: 18, grandTotal: 94990, deliveryDays: 5,
      notes: 'Bulk pricing applied. Free delivery on orders above ₹50,000.', status: 'submitted', submittedAt: '2025-06-11',
    },
    {
      id: 'q007', rfqId: 'rfq006', vendorId: 'v2',
      items: [
        { name: 'A4 Paper Ream 500 sheets', qty: 200, unitPrice: 270, total: 54000 },
        { name: 'Ball Pens Blue/Black', qty: 500, unitPrice: 18, total: 9000 },
        { name: 'Printed Letterheads', qty: 5000, unitPrice: 4, total: 20000 },
        { name: 'Business Cards', qty: 2000, unitPrice: 5, total: 10000 },
      ],
      totalAmount: 93000, gst: 18, grandTotal: 109740, deliveryDays: 7,
      notes: 'Premium paper quality (80GSM). 30-day return policy.', status: 'submitted', submittedAt: '2025-06-12',
    },
    // rfq008 – Medical supplies
    {
      id: 'q008', rfqId: 'rfq008', vendorId: 'v8',
      items: [
        { name: 'First Aid Kit Standard', qty: 10, unitPrice: 1500, total: 15000 },
        { name: 'Sanitizer 500ml', qty: 50, unitPrice: 120, total: 6000 },
        { name: 'Masks (N95)', qty: 200, unitPrice: 45, total: 9000 },
      ],
      totalAmount: 30000, gst: 12, grandTotal: 33600, deliveryDays: 2,
      notes: 'All items ISO-certified. Compliant with WHO guidelines.', status: 'submitted', submittedAt: '2025-05-22',
    },
    // rfq009 – Fleet
    {
      id: 'q009', rfqId: 'rfq009', vendorId: 'v12',
      items: [
        { name: 'Sedan Car Rental (monthly)', qty: 3, unitPrice: 25000, total: 75000 },
        { name: 'SUV Rental (monthly)', qty: 1, unitPrice: 45000, total: 45000 },
      ],
      totalAmount: 120000, gst: 5, grandTotal: 126000, deliveryDays: 1,
      notes: 'GPS-enabled vehicles. 24/7 roadside assistance included.', status: 'submitted', submittedAt: '2025-06-15',
    },
    {
      id: 'q010', rfqId: 'rfq009', vendorId: 'v7',
      items: [
        { name: 'Sedan Car Rental (monthly)', qty: 3, unitPrice: 22000, total: 66000 },
        { name: 'SUV Rental (monthly)', qty: 1, unitPrice: 40000, total: 40000 },
      ],
      totalAmount: 106000, gst: 5, grandTotal: 111300, deliveryDays: 1,
      notes: 'Professional drivers available at extra ₹8,000/month per vehicle.', status: 'submitted', submittedAt: '2025-06-16',
    },
    // rfq005 – CCTV
    {
      id: 'q011', rfqId: 'rfq005', vendorId: 'v6',
      items: [
        { name: 'IP CCTV Camera 4MP', qty: 24, unitPrice: 4500, total: 108000 },
        { name: 'Biometric Door Lock', qty: 3, unitPrice: 8000, total: 24000 },
        { name: 'NVR 16-Channel Recorder', qty: 2, unitPrice: 22000, total: 44000 },
      ],
      totalAmount: 176000, gst: 18, grandTotal: 207680, deliveryDays: 7,
      notes: 'Installation included. 2-year AMC offered at ₹18,000/yr.', status: 'submitted', submittedAt: '2025-06-18',
    },
    // rfq007 – Internet
    {
      id: 'q012', rfqId: 'rfq007', vendorId: 'v11',
      items: [{ name: '1 Gbps Dedicated Leased Line (Annual)', qty: 1, unitPrice: 180000, total: 180000 }],
      totalAmount: 180000, gst: 18, grandTotal: 212400, deliveryDays: 30,
      notes: '99.9% SLA uptime guarantee. 24/7 NOC support.', status: 'submitted', submittedAt: '2025-06-13',
    },
    // rfq010 – Solar
    {
      id: 'q013', rfqId: 'rfq010', vendorId: 'v9',
      items: [
        { name: 'Solar Panel 400W Monocrystalline', qty: 25, unitPrice: 12000, total: 300000 },
        { name: 'Solar Inverter 10KW', qty: 1, unitPrice: 75000, total: 75000 },
        { name: 'Installation & Wiring', qty: 1, unitPrice: 35000, total: 35000 },
      ],
      totalAmount: 410000, gst: 5, grandTotal: 430500, deliveryDays: 20,
      notes: '25-year panel warranty. MNRE-approved components.', status: 'submitted', submittedAt: '2025-06-17',
    },
    {
      id: 'q014', rfqId: 'rfq010', vendorId: 'v3',
      items: [
        { name: 'Solar Panel 400W Monocrystalline', qty: 25, unitPrice: 13500, total: 337500 },
        { name: 'Solar Inverter 10KW', qty: 1, unitPrice: 72000, total: 72000 },
        { name: 'Installation & Wiring', qty: 1, unitPrice: 28000, total: 28000 },
      ],
      totalAmount: 437500, gst: 5, grandTotal: 459375, deliveryDays: 25,
      notes: 'Subsidy application assistance provided. BIS-certified materials.', status: 'submitted', submittedAt: '2025-06-18',
    },
    // rfq003 – Cloud
    {
      id: 'q015', rfqId: 'rfq003', vendorId: 'v5',
      items: [{ name: 'Cloud Server Subscription (AWS-tier)', qty: 1, unitPrice: 240000, total: 240000 }],
      totalAmount: 240000, gst: 18, grandTotal: 283200, deliveryDays: 7,
      notes: 'Managed services included. Dedicated account manager assigned.', status: 'submitted', submittedAt: '2025-06-09',
    },
    // Extra historical quotations for depth
    {
      id: 'q016', rfqId: 'rfq001', vendorId: 'v5',
      items: [{ name: 'Laptop 15inch Core i7 16GB', qty: 20, unitPrice: 57000, total: 1140000 }],
      totalAmount: 1140000, gst: 18, grandTotal: 1345200, deliveryDays: 10,
      notes: 'Refurbished-grade A option available for 20% savings.', status: 'submitted', submittedAt: '2025-06-05',
    },
    {
      id: 'q017', rfqId: 'rfq002', vendorId: 'v7',
      items: [
        { name: 'Ergonomic Chair', qty: 30, unitPrice: 7500, total: 225000 },
        { name: 'Standing Desk', qty: 15, unitPrice: 13500, total: 202500 },
      ],
      totalAmount: 427500, gst: 18, grandTotal: 504450, deliveryDays: 12,
      notes: 'Ships from Pune warehouse. Can schedule phased delivery.', status: 'submitted', submittedAt: '2025-06-05',
    },
    {
      id: 'q018', rfqId: 'rfq008', vendorId: 'v2',
      items: [
        { name: 'First Aid Kit Standard', qty: 10, unitPrice: 1800, total: 18000 },
        { name: 'Sanitizer 500ml', qty: 50, unitPrice: 140, total: 7000 },
        { name: 'Masks (N95)', qty: 200, unitPrice: 50, total: 10000 },
      ],
      totalAmount: 35000, gst: 12, grandTotal: 39200, deliveryDays: 4,
      notes: 'Standard delivery. No installation required.', status: 'submitted', submittedAt: '2025-05-23',
    },
  ],

  approvals: [
    {
      id: 'ap001', quotationId: 'q003', rfqId: 'rfq002', vendorId: 'v2',
      amount: 548700, status: 'approved', approvedBy: 'u3',
      remarks: 'Best price with guaranteed quick delivery. Approved.', createdAt: '2025-06-05', updatedAt: '2025-06-05',
    },
    {
      id: 'ap002', quotationId: 'q008', rfqId: 'rfq008', vendorId: 'v8',
      amount: 33600, status: 'approved', approvedBy: 'u7',
      remarks: 'ISO certified and WHO compliant. Fastest delivery. Approved.', createdAt: '2025-05-24', updatedAt: '2025-05-24',
    },
    {
      id: 'ap003', quotationId: 'q005', rfqId: 'rfq004', vendorId: 'v4',
      amount: 15750, status: 'approved', approvedBy: 'u3',
      remarks: 'Only vendor for pantry category. Credit terms acceptable.', createdAt: '2025-06-08', updatedAt: '2025-06-08',
    },
    {
      id: 'ap004', quotationId: 'q006', rfqId: 'rfq006', vendorId: 'v10',
      amount: 94990, status: 'approved', approvedBy: 'u3',
      remarks: 'Lowest price. Free delivery included. Approved.', createdAt: '2025-06-13', updatedAt: '2025-06-13',
    },
    {
      id: 'ap005', quotationId: 'q015', rfqId: 'rfq003', vendorId: 'v5',
      amount: 283200, status: 'pending', approvedBy: null,
      remarks: '', createdAt: '2025-06-10', updatedAt: '2025-06-10',
    },
    {
      id: 'ap006', quotationId: 'q011', rfqId: 'rfq005', vendorId: 'v6',
      amount: 207680, status: 'pending', approvedBy: null,
      remarks: '', createdAt: '2025-06-19', updatedAt: '2025-06-19',
    },
    {
      id: 'ap007', quotationId: 'q010', rfqId: 'rfq009', vendorId: 'v7',
      amount: 111300, status: 'approved', approvedBy: 'u7',
      remarks: 'Best overall value. Professional drivers option noted.', createdAt: '2025-06-17', updatedAt: '2025-06-17',
    },
    {
      id: 'ap008', quotationId: 'q013', rfqId: 'rfq010', vendorId: 'v9',
      amount: 430500, status: 'rejected', approvedBy: 'u3',
      remarks: 'Project deferred to Q4. Budget constraints. Reopen next quarter.', createdAt: '2025-06-18', updatedAt: '2025-06-18',
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
      status: 'delivered', createdAt: '2025-06-05', deliveryDate: '2025-06-12',
    },
    {
      id: 'po002', poNumber: 'PO-2025-002', approvalId: 'ap002',
      quotationId: 'q008', rfqId: 'rfq008', vendorId: 'v8',
      items: [
        { name: 'First Aid Kit Standard', qty: 10, unitPrice: 1500, total: 15000 },
        { name: 'Sanitizer 500ml', qty: 50, unitPrice: 120, total: 6000 },
        { name: 'Masks (N95)', qty: 200, unitPrice: 45, total: 9000 },
      ],
      subtotal: 30000, gst: 12, gstAmount: 3600, grandTotal: 33600,
      status: 'delivered', createdAt: '2025-05-25', deliveryDate: '2025-05-27',
    },
    {
      id: 'po003', poNumber: 'PO-2025-003', approvalId: 'ap003',
      quotationId: 'q005', rfqId: 'rfq004', vendorId: 'v4',
      items: [
        { name: 'Premium Coffee Sachets', qty: 500, unitPrice: 12, total: 6000 },
        { name: 'Mineral Water Bottles 1L', qty: 300, unitPrice: 20, total: 6000 },
        { name: 'Disposable Cups & Plates', qty: 1000, unitPrice: 3, total: 3000 },
      ],
      subtotal: 15000, gst: 5, gstAmount: 750, grandTotal: 15750,
      status: 'active', createdAt: '2025-06-09', deliveryDate: '2025-06-12',
    },
    {
      id: 'po004', poNumber: 'PO-2025-004', approvalId: 'ap004',
      quotationId: 'q006', rfqId: 'rfq006', vendorId: 'v10',
      items: [
        { name: 'A4 Paper Ream 500 sheets', qty: 200, unitPrice: 250, total: 50000 },
        { name: 'Ball Pens Blue/Black', qty: 500, unitPrice: 15, total: 7500 },
        { name: 'Printed Letterheads', qty: 5000, unitPrice: 3, total: 15000 },
        { name: 'Business Cards', qty: 2000, unitPrice: 4, total: 8000 },
      ],
      subtotal: 80500, gst: 18, gstAmount: 14490, grandTotal: 94990,
      status: 'active', createdAt: '2025-06-14', deliveryDate: '2025-06-19',
    },
    {
      id: 'po005', poNumber: 'PO-2025-005', approvalId: 'ap007',
      quotationId: 'q010', rfqId: 'rfq009', vendorId: 'v7',
      items: [
        { name: 'Sedan Car Rental (monthly)', qty: 3, unitPrice: 22000, total: 66000 },
        { name: 'SUV Rental (monthly)', qty: 1, unitPrice: 40000, total: 40000 },
      ],
      subtotal: 106000, gst: 5, gstAmount: 5300, grandTotal: 111300,
      status: 'active', createdAt: '2025-06-18', deliveryDate: '2025-07-01',
    },
    {
      id: 'po006', poNumber: 'PO-2025-006', approvalId: 'ap002',
      quotationId: 'q008', rfqId: 'rfq008', vendorId: 'v8',
      items: [
        { name: 'First Aid Kit Standard', qty: 5, unitPrice: 1500, total: 7500 },
        { name: 'Sanitizer 500ml', qty: 30, unitPrice: 120, total: 3600 },
      ],
      subtotal: 11100, gst: 12, gstAmount: 1332, grandTotal: 12432,
      status: 'cancelled', createdAt: '2025-05-28', deliveryDate: '2025-05-31',
    },
    {
      id: 'po007', poNumber: 'PO-2024-047', approvalId: null,
      quotationId: null, rfqId: null, vendorId: 'v1',
      items: [
        { name: 'Server UPS 2KVA', qty: 4, unitPrice: 18000, total: 72000 },
        { name: 'Network Switch 48-Port', qty: 2, unitPrice: 35000, total: 70000 },
      ],
      subtotal: 142000, gst: 18, gstAmount: 25560, grandTotal: 167560,
      status: 'delivered', createdAt: '2024-12-10', deliveryDate: '2024-12-22',
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
      status: 'paid', createdAt: '2025-06-12', dueDate: '2025-07-12',
    },
    {
      id: 'inv002', invoiceNumber: 'INV-2025-002', poId: 'po002', vendorId: 'v8',
      items: [
        { name: 'First Aid Kit Standard', qty: 10, unitPrice: 1500, total: 15000 },
        { name: 'Sanitizer 500ml', qty: 50, unitPrice: 120, total: 6000 },
        { name: 'Masks (N95)', qty: 200, unitPrice: 45, total: 9000 },
      ],
      subtotal: 30000, gst: 12, gstAmount: 3600, grandTotal: 33600,
      status: 'paid', createdAt: '2025-05-27', dueDate: '2025-06-27',
    },
    {
      id: 'inv003', invoiceNumber: 'INV-2025-003', poId: 'po003', vendorId: 'v4',
      items: [
        { name: 'Premium Coffee Sachets', qty: 500, unitPrice: 12, total: 6000 },
        { name: 'Mineral Water Bottles 1L', qty: 300, unitPrice: 20, total: 6000 },
        { name: 'Disposable Cups & Plates', qty: 1000, unitPrice: 3, total: 3000 },
      ],
      subtotal: 15000, gst: 5, gstAmount: 750, grandTotal: 15750,
      status: 'pending', createdAt: '2025-06-12', dueDate: '2025-07-12',
    },
    {
      id: 'inv004', invoiceNumber: 'INV-2025-004', poId: 'po004', vendorId: 'v10',
      items: [
        { name: 'A4 Paper Ream 500 sheets', qty: 200, unitPrice: 250, total: 50000 },
        { name: 'Ball Pens Blue/Black', qty: 500, unitPrice: 15, total: 7500 },
        { name: 'Printed Letterheads', qty: 5000, unitPrice: 3, total: 15000 },
        { name: 'Business Cards', qty: 2000, unitPrice: 4, total: 8000 },
      ],
      subtotal: 80500, gst: 18, gstAmount: 14490, grandTotal: 94990,
      status: 'pending', createdAt: '2025-06-19', dueDate: '2025-07-19',
    },
    {
      id: 'inv005', invoiceNumber: 'INV-2025-005', poId: 'po005', vendorId: 'v7',
      items: [
        { name: 'Sedan Car Rental (monthly)', qty: 3, unitPrice: 22000, total: 66000 },
        { name: 'SUV Rental (monthly)', qty: 1, unitPrice: 40000, total: 40000 },
      ],
      subtotal: 106000, gst: 5, gstAmount: 5300, grandTotal: 111300,
      status: 'pending', createdAt: '2025-07-01', dueDate: '2025-07-31',
    },
    {
      id: 'inv006', invoiceNumber: 'INV-2024-047', poId: 'po007', vendorId: 'v1',
      items: [
        { name: 'Server UPS 2KVA', qty: 4, unitPrice: 18000, total: 72000 },
        { name: 'Network Switch 48-Port', qty: 2, unitPrice: 35000, total: 70000 },
      ],
      subtotal: 142000, gst: 18, gstAmount: 25560, grandTotal: 167560,
      status: 'paid', createdAt: '2024-12-22', dueDate: '2025-01-22',
    },
    {
      id: 'inv007', invoiceNumber: 'INV-2025-006', poId: 'po001', vendorId: 'v2',
      items: [{ name: 'Ergonomic Chair (Additional)', qty: 5, unitPrice: 8000, total: 40000 }],
      subtotal: 40000, gst: 18, gstAmount: 7200, grandTotal: 47200,
      status: 'overdue', createdAt: '2025-05-01', dueDate: '2025-05-31',
    },
    {
      id: 'inv008', invoiceNumber: 'INV-2025-007', poId: 'po002', vendorId: 'v8',
      items: [{ name: 'Sanitizer 500ml (Reorder)', qty: 100, unitPrice: 120, total: 12000 }],
      subtotal: 12000, gst: 12, gstAmount: 1440, grandTotal: 13440,
      status: 'overdue', createdAt: '2025-04-15', dueDate: '2025-05-15',
    },
    {
      id: 'inv009', invoiceNumber: 'INV-2025-008', poId: 'po003', vendorId: 'v5',
      items: [{ name: 'Cloud Server Subscription – Monthly', qty: 1, unitPrice: 20000, total: 20000 }],
      subtotal: 20000, gst: 18, gstAmount: 3600, grandTotal: 23600,
      status: 'paid', createdAt: '2025-04-01', dueDate: '2025-04-30',
    },
  ],

  logs: [
    { id: 'log01', action: 'RFQ Created',          detail: 'Office Laptops RFQ (rfq001) created by Priya Shah',           timestamp: '2025-06-01T09:00:00', userId: 'u2', type: 'rfq' },
    { id: 'log02', action: 'Vendor Added',          detail: 'CloudSystems Ltd (v5) registered by Arjun Mehta (admin)',      timestamp: '2025-06-01T10:30:00', userId: 'u1', type: 'vendor' },
    { id: 'log03', action: 'RFQ Created',          detail: 'Office Furniture RFQ (rfq002) created by Priya Shah',          timestamp: '2025-06-02T08:45:00', userId: 'u2', type: 'rfq' },
    { id: 'log04', action: 'Quotation Submitted',   detail: 'TechSupply Co submitted quote (q001) for Office Laptops',      timestamp: '2025-06-03T11:00:00', userId: 'u4', type: 'quotation' },
    { id: 'log05', action: 'Quotation Submitted',   detail: 'OfficeWorld Ltd submitted quote (q003) for Office Furniture',  timestamp: '2025-06-03T14:00:00', userId: 'u5', type: 'quotation' },
    { id: 'log06', action: 'Quotation Submitted',   detail: 'BuildRight Inc submitted quote (q004) for Office Furniture',   timestamp: '2025-06-04T09:30:00', userId: 'u1', type: 'quotation' },
    { id: 'log07', action: 'Quotation Submitted',   detail: 'OfficeWorld Ltd submitted quote (q002) for Office Laptops',    timestamp: '2025-06-04T12:00:00', userId: 'u5', type: 'quotation' },
    { id: 'log08', action: 'Approval Granted',      detail: 'Rahul Verma approved q003 – OfficeWorld Furniture (₹5.49L)',   timestamp: '2025-06-05T14:00:00', userId: 'u3', type: 'approval' },
    { id: 'log09', action: 'Purchase Order Created', detail: 'PO-2025-001 generated for OfficeWorld Ltd (Furniture)',        timestamp: '2025-06-05T14:01:00', userId: 'u3', type: 'po' },
    { id: 'log10', action: 'Invoice Generated',     detail: 'INV-2025-001 raised by OfficeWorld Ltd for PO-2025-001',       timestamp: '2025-06-05T14:02:00', userId: 'u3', type: 'invoice' },
    { id: 'log11', action: 'RFQ Created',           detail: 'Pantry Restocking RFQ (rfq004) created by Sneha Pillai',       timestamp: '2025-06-06T09:00:00', userId: 'u6', type: 'rfq' },
    { id: 'log12', action: 'Vendor Added',          detail: 'SafeGuard Security (v6) registered by Arjun Mehta',            timestamp: '2025-06-07T10:00:00', userId: 'u1', type: 'vendor' },
    { id: 'log13', action: 'Quotation Submitted',   detail: 'FreshGreens Pvt submitted quote (q005) for Pantry rfq004',     timestamp: '2025-06-07T11:30:00', userId: 'u1', type: 'quotation' },
    { id: 'log14', action: 'Approval Granted',      detail: 'Rahul Verma approved q005 – Pantry supply (₹15,750)',          timestamp: '2025-06-08T13:00:00', userId: 'u3', type: 'approval' },
    { id: 'log15', action: 'Purchase Order Created', detail: 'PO-2025-003 generated for FreshGreens Pantry supply',          timestamp: '2025-06-09T09:30:00', userId: 'u3', type: 'po' },
    { id: 'log16', action: 'RFQ Created',           detail: 'Stationery Annual Supply RFQ (rfq006) created by Sneha Pillai', timestamp: '2025-06-10T10:00:00', userId: 'u6', type: 'rfq' },
    { id: 'log17', action: 'RFQ Created',           detail: 'IT Cloud Infrastructure RFQ (rfq003) created by Priya Shah',   timestamp: '2025-06-10T11:00:00', userId: 'u2', type: 'rfq' },
    { id: 'log18', action: 'Quotation Submitted',   detail: 'PrintPerfect Studio submitted quote (q006) for Stationery',    timestamp: '2025-06-11T09:00:00', userId: 'u1', type: 'quotation' },
    { id: 'log19', action: 'Quotation Submitted',   detail: 'CloudSystems Ltd submitted quote (q015) for IT Cloud rfq003',  timestamp: '2025-06-11T10:00:00', userId: 'u1', type: 'quotation' },
    { id: 'log20', action: 'Quotation Submitted',   detail: 'OfficeWorld submitted quote (q007) for Stationery rfq006',     timestamp: '2025-06-12T10:30:00', userId: 'u5', type: 'quotation' },
    { id: 'log21', action: 'Approval Granted',      detail: 'Rahul Verma approved q006 – PrintPerfect Stationery (₹94,990)',timestamp: '2025-06-13T14:00:00', userId: 'u3', type: 'approval' },
    { id: 'log22', action: 'Purchase Order Created', detail: 'PO-2025-004 generated for PrintPerfect Stationery order',      timestamp: '2025-06-14T09:00:00', userId: 'u3', type: 'po' },
    { id: 'log23', action: 'RFQ Created',           detail: 'Fleet Vehicle Rental RFQ (rfq009) created by Priya Shah',      timestamp: '2025-06-14T10:00:00', userId: 'u2', type: 'rfq' },
    { id: 'log24', action: 'Approval Granted',      detail: 'Devraj Nair approved q010 – SwiftLogistics Fleet (₹1.11L)',    timestamp: '2025-06-17T11:00:00', userId: 'u7', type: 'approval' },
    { id: 'log25', action: 'Purchase Order Created', detail: 'PO-2025-005 generated for SwiftLogistics Fleet rental',         timestamp: '2025-06-18T09:00:00', userId: 'u7', type: 'po' },
    { id: 'log26', action: 'Approval Rejected',     detail: 'Rahul Verma rejected Solar Panel quote – budget deferred Q4',  timestamp: '2025-06-18T13:30:00', userId: 'u3', type: 'approval' },
    { id: 'log27', action: 'Invoice Generated',     detail: 'INV-2025-004 raised for PrintPerfect Stationery PO-2025-004',  timestamp: '2025-06-19T09:00:00', userId: 'u3', type: 'invoice' },
    { id: 'log28', action: 'Vendor Updated',        detail: 'FreshGreens Pvt status changed to inactive by admin',           timestamp: '2025-06-19T10:30:00', userId: 'u1', type: 'vendor' },
    { id: 'log29', action: 'Invoice Paid',          detail: 'INV-2025-001 marked as paid (₹5.49L) — OfficeWorld Furniture', timestamp: '2025-06-20T14:00:00', userId: 'u3', type: 'invoice' },
    { id: 'log30', action: 'Invoice Overdue',       detail: 'INV-2025-006 (₹47,200) is past due date — escalated to admin', timestamp: '2025-06-21T09:00:00', userId: 'u1', type: 'invoice' },
  ],

  // 12-Month spend data (Jan–Dec 2024)
  monthlySpend: [
    { month: 'Jan', amount: 320000 },
    { month: 'Feb', amount: 480000 },
    { month: 'Mar', amount: 710000 },
    { month: 'Apr', amount: 238000 },
    { month: 'May', amount: 625000 },
    { month: 'Jun', amount: 415000 },
    { month: 'Jul', amount: 890000 },
    { month: 'Aug', amount: 540000 },
    { month: 'Sep', amount: 360000 },
    { month: 'Oct', amount: 1120000 },
    { month: 'Nov', amount: 780000 },
    { month: 'Dec', amount: 967560 },
  ],

  // Category-wise spend breakdown
  categorySpend: [
    { category: 'Electronics', amount: 1465760 },
    { category: 'Office Supplies', amount: 548700 },
    { category: 'IT Services', amount: 306800 },
    { category: 'Healthcare', amount: 47040 },
    { category: 'Printing', amount: 94990 },
    { category: 'Transport', amount: 111300 },
    { category: 'Food & Beverage', amount: 15750 },
    { category: 'Security', amount: 207680 },
    { category: 'Utilities', amount: 430500 },
    { category: 'Telecom', amount: 212400 },
  ],

  // Top vendors by spend
  topVendors: [
    { vendorId: 'v1', vendorName: 'TechSupply Co', totalSpend: 1465760, orders: 7 },
    { vendorId: 'v2', vendorName: 'OfficeWorld Ltd', totalSpend: 595900, orders: 5 },
    { vendorId: 'v5', vendorName: 'CloudSystems Ltd', totalSpend: 306800, orders: 3 },
    { vendorId: 'v9', vendorName: 'GreenPower Energy', totalSpend: 430500, orders: 1 },
    { vendorId: 'v6', vendorName: 'SafeGuard Security', totalSpend: 207680, orders: 1 },
    { vendorId: 'v11', vendorName: 'NetConnect ISP', totalSpend: 212400, orders: 1 },
  ],
};
