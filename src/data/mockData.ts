export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type Recommendation = "APPROVE" | "VERIFY" | "HOLD" | "BLOCK";

export interface RiskFactor {
  label: string;
  description: string;
  impact: number; // 0-30
}

export interface AIInvestigation {
  steps: string[];
  summary: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  timestamp: string;
  merchant: string;
  merchantCategory: string;
  location: string;
  deviceId: string;
  isNewDevice: boolean;
  isNewLocation: boolean;
  paymentMethod: string;
  riskScore: number;
  riskLevel: RiskLevel;
  fraudProbability: number;
  riskFactors: RiskFactor[];
  aiInvestigation: AIInvestigation;
  relevantPolicy: string;
  recommendation: Recommendation;
  failedAttempts: number;
  transactionsLast24h: number;
  avgCustomerAmount: number;
  status: "PENDING" | "APPROVED" | "BLOCKED" | "HELD" | "VERIFIED";
}

export interface Customer {
  id: string;
  name: string;
  age: number;
  accountType: string;
  usualLocation: string;
  avgTransactionAmount: number;
  totalTransactions: number;
  riskProfile: RiskLevel;
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  fullText: string;
  lastUpdated: string;
  tags: string[];
}

export const customers: Customer[] = [
  { id: "C1021", name: "Arjun Mehta", age: 34, accountType: "Savings", usualLocation: "Delhi", avgTransactionAmount: 8500, totalTransactions: 284, riskProfile: "LOW" },
  { id: "C1042", name: "Priya Sharma", age: 28, accountType: "Current", usualLocation: "Mumbai", avgTransactionAmount: 24000, totalTransactions: 512, riskProfile: "LOW" },
  { id: "C1073", name: "Rahul Gupta", age: 45, accountType: "Savings", usualLocation: "Bangalore", avgTransactionAmount: 15000, totalTransactions: 189, riskProfile: "MEDIUM" },
  { id: "C1099", name: "Neha Patel", age: 31, accountType: "Current", usualLocation: "Hyderabad", avgTransactionAmount: 35000, totalTransactions: 421, riskProfile: "LOW" },
  { id: "C1104", name: "Vikram Singh", age: 52, accountType: "Business", usualLocation: "Chennai", avgTransactionAmount: 52000, totalTransactions: 97, riskProfile: "MEDIUM" },
];

export const transactions: Transaction[] = [
  {
    id: "TXN10482",
    customerId: "C1021",
    customerName: "Arjun Mehta",
    amount: 85000,
    timestamp: "2024-01-15T02:13:00Z",
    merchant: "TechZone Electronics",
    merchantCategory: "Electronics",
    location: "Mumbai",
    deviceId: "DEV-NEW-8821",
    isNewDevice: true,
    isNewLocation: true,
    paymentMethod: "UPI",
    riskScore: 92,
    riskLevel: "HIGH",
    fraudProbability: 0.91,
    failedAttempts: 4,
    transactionsLast24h: 12,
    avgCustomerAmount: 8500,
    riskFactors: [
      { label: "Abnormal Amount", description: "Transaction is 9.8× higher than customer average (₹8,500)", impact: 28 },
      { label: "New Device", description: "Transaction originated from a previously unregistered device", impact: 21 },
      { label: "Unusual Location", description: "Location (Mumbai) differs 1,200 km from usual location (Delhi)", impact: 18 },
      { label: "Unusual Time", description: "Transaction occurred at 2:13 AM, outside normal hours", impact: 11 },
      { label: "Multiple Failed Attempts", description: "4 failed authentication attempts in the last hour", impact: 8 },
    ],
    aiInvestigation: {
      steps: [
        "Retrieving customer C1021 transaction history (last 90 days)...",
        "Customer normally transacts between ₹2,000–₹12,000 from Delhi-based devices.",
        "Checking device registry for DEV-NEW-8821...",
        "Device not found in customer device history. First seen: today.",
        "Analyzing geolocation: Mumbai vs usual location Delhi (1,200 km deviation).",
        "Checking transaction velocity: 12 transactions in last 24h (normal: 2–3).",
        "Retrieving relevant policies via RAG system...",
        "Policy match: High-Value New-Device Verification Policy (confidence: 97%).",
      ],
      summary: "Customer C1021 (Arjun Mehta) shows significant behavioral deviation. This ₹85,000 transaction is 9.8× their historical average. Combined with a new unregistered device, an unusual geographic location 1,200 km from their home city, a 2 AM timestamp, and 4 failed authentication attempts, the risk indicators strongly suggest unauthorized account access. Immediate verification is required before processing.",
    },
    relevantPolicy: "High-value transactions above ₹50,000 originating from a previously unregistered device require mandatory secondary authentication. Transactions from locations deviating more than 500 km from the customer's registered address must be placed on hold pending verification.",
    recommendation: "HOLD",
    status: "HELD",
  },
  {
    id: "TXN10391",
    customerId: "C1042",
    customerName: "Priya Sharma",
    amount: 61500,
    timestamp: "2024-01-15T03:47:00Z",
    merchant: "Luxury Boutique",
    merchantCategory: "Retail",
    location: "Delhi",
    deviceId: "DEV-NEW-4492",
    isNewDevice: true,
    isNewLocation: true,
    paymentMethod: "Card",
    riskScore: 88,
    riskLevel: "HIGH",
    fraudProbability: 0.86,
    failedAttempts: 2,
    transactionsLast24h: 8,
    avgCustomerAmount: 24000,
    riskFactors: [
      { label: "Abnormal Amount", description: "Transaction is 2.6× higher than customer average (₹24,000)", impact: 20 },
      { label: "New Device", description: "Transaction from unregistered device in Mumbai registry", impact: 21 },
      { label: "Unusual Location", description: "Delhi location differs from usual Mumbai base", impact: 17 },
      { label: "Unusual Time", description: "Transaction at 3:47 AM — high-risk time window", impact: 12 },
      { label: "High Velocity", description: "8 transactions in 24h, 3× above normal rate", impact: 8 },
    ],
    aiInvestigation: {
      steps: [
        "Retrieving customer C1042 transaction history...",
        "Customer normally transacts in Mumbai, avg ₹24,000.",
        "Checking device DEV-NEW-4492: not in customer device registry.",
        "Location analysis: Delhi, 1,400 km from Mumbai base.",
        "Velocity check: 8 transactions in 24h (normal: 2–3/day).",
        "Policy retrieval: High-Value Cross-City Transaction Policy matched.",
      ],
      summary: "Priya Sharma's transaction shows multiple high-risk signals: new device, cross-city location, elevated transaction velocity, and an above-average amount at an unusual hour. The combination of signals warrants a temporary hold and identity verification.",
    },
    relevantPolicy: "Cross-city high-value transactions from unregistered devices require OTP verification. Accounts with 3× normal daily transaction velocity should trigger a soft block pending review.",
    recommendation: "VERIFY",
    status: "PENDING",
  },
  {
    id: "TXN10277",
    customerId: "C1073",
    customerName: "Rahul Gupta",
    amount: 47200,
    timestamp: "2024-01-14T23:31:00Z",
    merchant: "International Travel Co.",
    merchantCategory: "Travel",
    location: "Goa",
    deviceId: "DEV-3341",
    isNewDevice: false,
    isNewLocation: true,
    paymentMethod: "NetBanking",
    riskScore: 71,
    riskLevel: "MEDIUM",
    fraudProbability: 0.62,
    failedAttempts: 1,
    transactionsLast24h: 4,
    avgCustomerAmount: 15000,
    riskFactors: [
      { label: "Elevated Amount", description: "Transaction is 3.1× above customer average (₹15,000)", impact: 22 },
      { label: "Unusual Location", description: "Goa differs from usual Bangalore base (700 km)", impact: 14 },
      { label: "Late Hour", description: "Transaction at 11:31 PM — elevated risk period", impact: 9 },
      { label: "Failed Attempt", description: "1 failed authentication attempt before success", impact: 5 },
    ],
    aiInvestigation: {
      steps: [
        "Retrieving customer C1073 history...",
        "Customer has used this device (DEV-3341) previously — low device risk.",
        "Goa is a new transaction location but travel context is plausible (Travel merchant).",
        "Amount deviation: 3.1× average. Elevated but within reasonable travel spend.",
        "No prior fraud history for this customer.",
        "Policy retrieval: Elevated Amount Travel Merchant Policy matched.",
      ],
      summary: "Rahul Gupta's transaction shows moderate risk. The amount is elevated but consistent with travel spending at a travel merchant. The device is known but the location is new. With no fraud history and a plausible merchant context, risk is medium. Additional verification is recommended before processing.",
    },
    relevantPolicy: "Transactions at travel merchants from known devices in new locations may proceed with soft notification to the customer. Amounts exceeding 3× the customer average require a one-time password confirmation.",
    recommendation: "VERIFY",
    status: "PENDING",
  },
  {
    id: "TXN10198",
    customerId: "C1099",
    customerName: "Neha Patel",
    amount: 12800,
    timestamp: "2024-01-14T14:22:00Z",
    merchant: "Grocery Hub",
    merchantCategory: "Grocery",
    location: "Hyderabad",
    deviceId: "DEV-7712",
    isNewDevice: false,
    isNewLocation: false,
    paymentMethod: "UPI",
    riskScore: 12,
    riskLevel: "LOW",
    fraudProbability: 0.04,
    failedAttempts: 0,
    transactionsLast24h: 1,
    avgCustomerAmount: 35000,
    riskFactors: [
      { label: "Below Average Amount", description: "Transaction is well within customer norms", impact: 3 },
    ],
    aiInvestigation: {
      steps: [
        "Retrieving customer C1099 history...",
        "Known device, known location. No anomalies detected.",
        "Amount within normal range. No velocity issues.",
        "No policy flags triggered.",
      ],
      summary: "Transaction is consistent with customer C1099 behavioral profile. Known device, known location, normal amount, business hours. No fraud indicators present.",
    },
    relevantPolicy: "Low-risk transactions from verified devices at registered locations may be auto-approved without additional verification.",
    recommendation: "APPROVE",
    status: "APPROVED",
  },
  {
    id: "TXN10155",
    customerId: "C1104",
    customerName: "Vikram Singh",
    amount: 142000,
    timestamp: "2024-01-14T01:05:00Z",
    merchant: "CryptoXchange",
    merchantCategory: "Cryptocurrency",
    location: "Pune",
    deviceId: "DEV-NEW-9901",
    isNewDevice: true,
    isNewLocation: true,
    paymentMethod: "NEFT",
    riskScore: 97,
    riskLevel: "HIGH",
    fraudProbability: 0.97,
    failedAttempts: 6,
    transactionsLast24h: 18,
    avgCustomerAmount: 52000,
    riskFactors: [
      { label: "Critical Amount", description: "Transaction is 2.7× above customer average (₹52,000)", impact: 22 },
      { label: "High-Risk Merchant", description: "Cryptocurrency exchange — elevated fraud risk category", impact: 28 },
      { label: "New Device", description: "Unregistered device used for first time", impact: 21 },
      { label: "New Location", description: "Pune differs from usual Chennai base (1,100 km)", impact: 18 },
      { label: "Critical Time", description: "1:05 AM — peak fraud window", impact: 12 },
      { label: "Multiple Failed Attempts", description: "6 failed authentication attempts in 2 hours", impact: 11 },
    ],
    aiInvestigation: {
      steps: [
        "Retrieving customer C1104 history...",
        "Customer has no prior cryptocurrency transaction history.",
        "Device DEV-NEW-9901 not in registry. First seen: today.",
        "Location Pune: 1,100 km from usual Chennai base.",
        "Velocity: 18 transactions in 24h. Extremely abnormal.",
        "6 failed authentication attempts: possible brute-force or social engineering.",
        "Merchant category: Cryptocurrency — high-risk irreversible transfer.",
        "Policy retrieval: Cryptocurrency High-Value Policy + Account Takeover Policy matched.",
      ],
      summary: "This transaction presents the highest possible risk profile. A ₹1,42,000 transfer to a cryptocurrency exchange — an irreversible transaction type — from a new device, new location, at 1 AM, with 6 failed attempts and 18 transactions in 24 hours, strongly indicates an account takeover attempt. The transaction should be immediately blocked and the customer's account should be temporarily frozen pending identity verification.",
    },
    relevantPolicy: "Cryptocurrency transactions above ₹25,000 from unregistered devices are automatically blocked. Accounts with 6+ failed authentication attempts in a 2-hour window must be soft-locked pending identity reverification. Irreversible transfer categories require enhanced due diligence.",
    recommendation: "BLOCK",
    status: "BLOCKED",
  },
  {
    id: "TXN10089",
    customerId: "C1021",
    customerName: "Arjun Mehta",
    amount: 7200,
    timestamp: "2024-01-13T11:45:00Z",
    merchant: "Zomato",
    merchantCategory: "Food & Dining",
    location: "Delhi",
    deviceId: "DEV-1102",
    isNewDevice: false,
    isNewLocation: false,
    paymentMethod: "UPI",
    riskScore: 8,
    riskLevel: "LOW",
    fraudProbability: 0.02,
    failedAttempts: 0,
    transactionsLast24h: 2,
    avgCustomerAmount: 8500,
    riskFactors: [
      { label: "Normal Transaction", description: "Amount and location consistent with customer history", impact: 2 },
    ],
    aiInvestigation: {
      steps: [
        "Known device, known location, amount within range.",
        "No anomalies detected. Auto-approved.",
      ],
      summary: "Low-risk transaction. All signals normal for customer C1021.",
    },
    relevantPolicy: "Standard UPI transactions below ₹10,000 from verified devices may be auto-approved.",
    recommendation: "APPROVE",
    status: "APPROVED",
  },
  {
    id: "TXN10341",
    customerId: "C1042",
    customerName: "Priya Sharma",
    amount: 28500,
    timestamp: "2024-01-14T16:10:00Z",
    merchant: "IndiGo Airlines",
    merchantCategory: "Travel",
    location: "Mumbai",
    deviceId: "DEV-2284",
    isNewDevice: false,
    isNewLocation: false,
    paymentMethod: "Card",
    riskScore: 24,
    riskLevel: "LOW",
    fraudProbability: 0.09,
    failedAttempts: 0,
    transactionsLast24h: 2,
    avgCustomerAmount: 24000,
    riskFactors: [
      { label: "Slightly Elevated Amount", description: "Amount is 1.2× above average but within acceptable range", impact: 8 },
    ],
    aiInvestigation: {
      steps: [
        "Known device and location. Amount close to average.",
        "Travel merchant — consistent with past spending behavior.",
        "No anomalies detected.",
      ],
      summary: "Routine travel transaction for Priya Sharma. No risk signals.",
    },
    relevantPolicy: "Transactions within 1.5× average customer spend from verified devices are auto-approved.",
    recommendation: "APPROVE",
    status: "APPROVED",
  },
  {
    id: "TXN10412",
    customerId: "C1073",
    customerName: "Rahul Gupta",
    amount: 38900,
    timestamp: "2024-01-15T04:22:00Z",
    merchant: "JewelMart",
    merchantCategory: "Jewelry",
    location: "Surat",
    deviceId: "DEV-NEW-5512",
    isNewDevice: true,
    isNewLocation: true,
    paymentMethod: "NetBanking",
    riskScore: 79,
    riskLevel: "HIGH",
    fraudProbability: 0.74,
    failedAttempts: 3,
    transactionsLast24h: 7,
    avgCustomerAmount: 15000,
    riskFactors: [
      { label: "Elevated Amount", description: "Transaction is 2.6× above customer average", impact: 19 },
      { label: "New Device", description: "Device not in customer registry", impact: 21 },
      { label: "New Location", description: "Surat differs from usual Bangalore base (1,300 km)", impact: 18 },
      { label: "Critical Time", description: "4:22 AM — high-risk time window", impact: 12 },
      { label: "Failed Attempts", description: "3 failed authentication attempts", impact: 7 },
    ],
    aiInvestigation: {
      steps: [
        "Retrieving customer C1073 history...",
        "New device and new location flagged.",
        "Jewelry merchant with elevated amount at 4 AM.",
        "3 failed attempts before success.",
        "Policy: High-Value Jewelry + New Device Policy matched.",
      ],
      summary: "Transaction presents high-risk profile: new device, 1,300 km location deviation, 4 AM timestamp, and a jewelry merchant — a category commonly used for money laundering. Recommend hold pending verification.",
    },
    relevantPolicy: "High-value transactions at jewelry merchants from new devices require mandatory verification. Transactions occurring between 1 AM and 5 AM with authentication failures trigger an automatic hold.",
    recommendation: "HOLD",
    status: "HELD",
  },
];

export const policies: Policy[] = [
  {
    id: "POL-001",
    title: "High-Value New-Device Verification Policy",
    category: "Device Security",
    excerpt: "Transactions above ₹50,000 from previously unregistered devices require mandatory secondary authentication before processing.",
    fullText: "All transactions exceeding ₹50,000 INR originating from a device not previously registered to the customer account must be placed on hold until secondary authentication is completed. The customer must verify their identity via OTP to their registered mobile number or email. If verification is not completed within 30 minutes, the transaction is automatically declined. This policy applies regardless of location or transaction history.",
    lastUpdated: "2024-01-01",
    tags: ["device", "high-value", "verification", "UPI"],
  },
  {
    id: "POL-002",
    title: "Geographic Anomaly Transaction Policy",
    category: "Location Risk",
    excerpt: "Transactions from locations deviating more than 500 km from the customer's registered address must be placed on hold pending verification.",
    fullText: "When the transaction origin location deviates more than 500 km from the customer's primary registered location and no travel notice has been filed, the transaction shall be placed on a soft hold. A soft hold notification is sent to the customer via SMS and app notification. The customer has 15 minutes to confirm the transaction before it is declined. For deviations exceeding 1,000 km, the hold is hard and requires phone-based verification.",
    lastUpdated: "2024-01-05",
    tags: ["location", "geographic", "hold", "verification"],
  },
  {
    id: "POL-003",
    title: "Cryptocurrency Transaction Policy",
    category: "High-Risk Merchants",
    excerpt: "Cryptocurrency exchange transactions above ₹25,000 from unregistered devices are automatically blocked.",
    fullText: "All transactions directed to registered cryptocurrency exchanges exceeding ₹25,000 INR must comply with enhanced due diligence requirements. Transactions from unregistered devices are automatically blocked regardless of amount. Transactions from registered devices require OTP verification for amounts above ₹25,000. Transactions above ₹1,00,000 to cryptocurrency platforms require a 24-hour cooling period and manager review. Cryptocurrency transactions are treated as irreversible and therefore carry the highest risk weight.",
    lastUpdated: "2023-12-15",
    tags: ["cryptocurrency", "block", "irreversible", "high-risk"],
  },
  {
    id: "POL-004",
    title: "Account Takeover Prevention Policy",
    category: "Authentication",
    excerpt: "Accounts with 5 or more failed authentication attempts within 2 hours must be soft-locked pending identity reverification.",
    fullText: "When an account experiences 5 or more consecutive or cumulative failed authentication attempts within any rolling 2-hour window, the account must be placed in a soft-lock state. During soft-lock: all transactions above ₹1,000 are blocked, the customer is notified via all registered contact methods, and a manual review is initiated. The soft-lock is lifted only after successful identity reverification through our KYC portal or a branch visit. Hard-lock (full account freeze) is triggered at 10 failed attempts within 4 hours.",
    lastUpdated: "2024-01-10",
    tags: ["authentication", "brute-force", "account-takeover", "lock"],
  },
  {
    id: "POL-005",
    title: "Transaction Velocity Control Policy",
    category: "Behavioral Analysis",
    excerpt: "Accounts exceeding 3× their average daily transaction count within 24 hours trigger an automatic soft review.",
    fullText: "Each customer account has a calculated baseline daily transaction velocity derived from the trailing 30-day average. When an account's transaction count within any 24-hour period exceeds 3× this baseline, all subsequent transactions are flagged for soft review. Transactions flagged for soft review are processed with a 5-minute delay to allow for risk assessment. If the velocity exceeds 5× the baseline, subsequent transactions above ₹5,000 are held pending analyst review.",
    lastUpdated: "2023-11-20",
    tags: ["velocity", "behavioral", "soft-review", "pattern"],
  },
  {
    id: "POL-006",
    title: "Night-Time High-Value Transaction Policy",
    category: "Temporal Risk",
    excerpt: "High-value transactions occurring between 1 AM and 5 AM with any authentication failures trigger an automatic hold.",
    fullText: "Transactions above ₹20,000 occurring between 01:00 and 05:00 local time are subject to elevated scrutiny. If any authentication failure precedes a successful transaction in this time window and the amount exceeds ₹20,000, the transaction is automatically held. All night-time transactions above ₹1,00,000 require pre-authorization via the mobile app regardless of device registration status.",
    lastUpdated: "2024-01-08",
    tags: ["temporal", "night", "high-value", "hold"],
  },
  {
    id: "POL-007",
    title: "Jewelry and Luxury Goods Transaction Policy",
    category: "Merchant Category",
    excerpt: "High-value transactions at jewelry and luxury goods merchants are subject to enhanced due diligence due to elevated money-laundering risk.",
    fullText: "Merchants classified under jewelry (MCC 5094, 5944) and luxury goods (MCC 5999) categories are treated as elevated risk. All transactions above ₹30,000 at these merchants require OTP verification. Transactions above ₹1,00,000 require a 4-hour cooling period and compliance team review. These policies exist because jewelry and luxury goods categories are disproportionately used in money-laundering schemes due to the ease of reselling physical goods.",
    lastUpdated: "2023-10-30",
    tags: ["jewelry", "luxury", "money-laundering", "MCC", "compliance"],
  },
];

export const dashboardStats = {
  totalTransactions: 12482,
  highRisk: 126,
  mediumRisk: 482,
  lowRisk: 11874,
  fraudDetectionRate: 94.2,
  avgRiskScore: 18.4,
  transactionsToday: 347,
  alertsActive: 14,
};

export const analyticsData = {
  riskDistribution: [
    { name: "LOW", value: 11874, fill: "#00E676" },
    { name: "MEDIUM", value: 482, fill: "#FFD600" },
    { name: "HIGH", value: 126, fill: "#FF3B5C" },
  ],
  riskScoreHistogram: [
    { range: "0–10", count: 7240 },
    { range: "11–20", count: 3180 },
    { range: "21–30", count: 1102 },
    { range: "31–40", count: 482 },
    { range: "41–50", count: 214 },
    { range: "51–60", count: 112 },
    { range: "61–70", count: 74 },
    { range: "71–80", count: 42 },
    { range: "81–90", count: 24 },
    { range: "91–100", count: 12 },
  ],
  volumeOverTime: [
    { date: "Jan 9", transactions: 284, highRisk: 8 },
    { date: "Jan 10", transactions: 312, highRisk: 11 },
    { date: "Jan 11", transactions: 298, highRisk: 7 },
    { date: "Jan 12", transactions: 341, highRisk: 14 },
    { date: "Jan 13", transactions: 307, highRisk: 10 },
    { date: "Jan 14", transactions: 389, highRisk: 22 },
    { date: "Jan 15", transactions: 347, highRisk: 18 },
  ],
  merchantRisk: [
    { category: "Cryptocurrency", avgRisk: 82 },
    { category: "Jewelry", avgRisk: 68 },
    { category: "Electronics", avgRisk: 54 },
    { category: "Travel", avgRisk: 38 },
    { category: "Retail", avgRisk: 32 },
    { category: "Food & Dining", avgRisk: 12 },
    { category: "Grocery", avgRisk: 8 },
  ],
};
