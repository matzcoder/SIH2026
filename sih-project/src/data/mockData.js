export const mockProducts = [
  {
    id: 1,
    name: "Smart Security Camera",
    category: "Electronic Device",
    description:
      "AI-enabled indoor security camera with cloud storage.",
    manufacturer: "SecureTech",
    status: "compliant",
    score: 94,
    lastChecked: "27 Aug 2026",
  },
  {
    id: 2,
    name: "Smart Door Lock",
    category: "Smart Home",
    description:
      "Connected door lock with biometric authentication.",
    manufacturer: "HomeGuard",
    status: "review",
    score: 72,
    lastChecked: "26 Aug 2026",
  },
  {
    id: 3,
    name: "Wireless Baby Monitor",
    category: "Consumer Electronics",
    description:
      "Wireless baby monitoring device with video streaming.",
    manufacturer: "SafeNest",
    status: "violation",
    score: 41,
    lastChecked: "25 Aug 2026",
  },
  {
    id: 4,
    name: "Fitness Smartwatch",
    category: "Wearable",
    description:
      "Wearable device that collects health and activity data.",
    manufacturer: "FitPulse",
    status: "compliant",
    score: 91,
    lastChecked: "24 Aug 2026",
  },
  {
    id: 5,
    name: "Smart Air Purifier",
    category: "Home Appliance",
    description:
      "Connected air purifier with mobile application support.",
    manufacturer: "AirPure",
    status: "review",
    score: 68,
    lastChecked: "23 Aug 2026",
  },
  {
    id: 6,
    name: "GPS Tracking Device",
    category: "Tracking Device",
    description:
      "Portable GPS tracker with real-time location monitoring.",
    manufacturer: "TrackPro",
    status: "violation",
    score: 38,
    lastChecked: "22 Aug 2026",
  },
];

export const mockComplianceChecks = [
  {
    id: 1,
    title: "Privacy Policy",
    description:
      "Required privacy policy documentation is available.",
    status: "passed",
    required: true,
  },
  {
    id: 2,
    title: "Data Protection",
    description:
      "Product data handling follows required protection standards.",
    status: "passed",
    required: true,
  },
  {
    id: 3,
    title: "User Consent",
    description:
      "User consent mechanism needs to be verified.",
    status: "review",
    required: true,
  },
  {
    id: 4,
    title: "Security Documentation",
    description:
      "Security and vulnerability documentation is available.",
    status: "passed",
    required: true,
  },
  {
    id: 5,
    title: "Product Certification",
    description:
      "Required certification document has not been uploaded.",
    status: "failed",
    required: true,
  },
];

export const mockViolations = [
  {
    id: 1,
    title: "Missing Privacy Policy",
    product: "Wireless Baby Monitor",
    category: "Data Privacy",
    description:
      "Required privacy policy documentation was not found during the compliance scan.",
    severity: "high",
    date: "27 Aug 2026",
    status: "Open",
  },
  {
    id: 2,
    title: "Incomplete Certification",
    product: "GPS Tracking Device",
    category: "Certification",
    description:
      "The uploaded product certification is incomplete or expired.",
    severity: "critical",
    date: "26 Aug 2026",
    status: "Open",
  },
  {
    id: 3,
    title: "Consent Mechanism Missing",
    product: "Smart Door Lock",
    category: "User Consent",
    description:
      "The product does not provide sufficient evidence of user consent.",
    severity: "medium",
    date: "25 Aug 2026",
    status: "Open",
  },
  {
    id: 4,
    title: "Security Evidence Required",
    product: "Smart Air Purifier",
    category: "Security",
    description:
      "Additional security testing evidence is required for verification.",
    severity: "low",
    date: "24 Aug 2026",
    status: "Open",
  },
];

export const mockEvidence = [
  {
    id: 1,
    productId: 1,
    name: "Privacy Policy.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Admin",
    uploadedAt: "27 Aug 2026",
    status: "verified",
  },
  {
    id: 2,
    productId: 1,
    name: "Security Certificate.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedBy: "Admin",
    uploadedAt: "27 Aug 2026",
    status: "verified",
  },
  {
    id: 3,
    productId: 2,
    name: "Product Certification.pdf",
    type: "PDF",
    size: "3.1 MB",
    uploadedBy: "Inspector",
    uploadedAt: "26 Aug 2026",
    status: "pending",
  },
  {
    id: 4,
    productId: 3,
    name: "Compliance Document.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedBy: "Inspector",
    uploadedAt: "25 Aug 2026",
    status: "rejected",
  },
];

export const mockStats = {
  totalProducts: 248,
  compliant: 186,
  violations: 24,
  needsReview: 38,

  complianceRate: 75,

  trends: {
    totalProducts: "+12%",
    compliant: "+8%",
    violations: "-5%",
    needsReview: "+3%",
  },
};

export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "authority",
    status: "active",
  },
  {
    id: 2,
    name: "Inspector User",
    email: "inspector@example.com",
    role: "inspector",
    status: "active",
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "error",
    title: "Violation Detected",
    message:
      "A compliance violation was detected for Wireless Baby Monitor.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Compliance Check Complete",
    message:
      "Smart Security Camera passed all compliance checks.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Evidence Required",
    message:
      "Additional evidence is required for Smart Door Lock.",
    time: "2 hours ago",
    read: true,
  },
];

export const mockActivity = [
  {
    id: 1,
    action: "Compliance scan completed",
    product: "Smart Security Camera",
    user: "Admin User",
    time: "10 minutes ago",
    type: "success",
  },
  {
    id: 2,
    action: "Violation detected",
    product: "Wireless Baby Monitor",
    user: "Inspector User",
    time: "35 minutes ago",
    type: "error",
  },
  {
    id: 3,
    action: "Evidence uploaded",
    product: "Smart Door Lock",
    user: "Inspector User",
    time: "1 hour ago",
    type: "info",
  },
  {
    id: 4,
    action: "Compliance review started",
    product: "Smart Air Purifier",
    user: "Admin User",
    time: "2 hours ago",
    type: "warning",
  },
];