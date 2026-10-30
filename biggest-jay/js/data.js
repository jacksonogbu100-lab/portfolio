window.BJData = (function () {
  const packages = [
    { id: "smart", name: "Smart Earner", blurb: "Retail prices for everyday sales." },
    { id: "affiliate", name: "Affiliate", blurb: "A smaller price for people who resell often." },
    { id: "top", name: "Top user", blurb: "Lower prices after steady volume." },
    { id: "api", name: "API user", blurb: "The lowest listed price for integrations." },
  ];

  const networks = [
    {
      id: "MTN",
      prefixes: ["0803", "0806", "0703", "0704", "0706", "0810", "0813", "0814", "0816", "0903", "0906", "0913", "0916"],
    },
    {
      id: "Airtel",
      prefixes: ["0802", "0808", "0701", "0708", "0812", "0901", "0902", "0904", "0907", "0912"],
    },
    {
      id: "Glo",
      prefixes: ["0805", "0807", "0705", "0811", "0815", "0905", "0915"],
    },
    {
      id: "9mobile",
      prefixes: ["0809", "0817", "0818", "0908", "0909"],
    },
  ];

  const types = [
    { id: "SME", label: "SME" },
    { id: "Gifting", label: "Gifting" },
    { id: "Corporate", label: "Corporate Gifting" },
  ];

  function plan(network, type, size, validity, smart) {
    const step = smart >= 1000 ? 40 : 10;
    return {
      id: [network, type, size, validity].join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      network,
      type,
      size,
      validity,
      prices: {
        smart,
        affiliate: smart - step,
        top: smart - step * 2,
        api: Math.max(50, smart - step * 3),
      },
    };
  }

  const plans = [
    plan("MTN", "SME", "500MB", "1 day", 150),
    plan("MTN", "SME", "1.0GB", "2 days", 380),
    plan("MTN", "SME", "2.0GB", "7 days", 700),
    plan("MTN", "SME", "3.0GB", "7 days", 1000),
    plan("MTN", "SME", "5.0GB", "30 days", 1500),
    plan("MTN", "SME", "10.0GB", "30 days", 2800),
    plan("MTN", "Gifting", "110MB", "1 day", 110),
    plan("MTN", "Gifting", "200MB", "1 day", 120),
    plan("MTN", "Gifting", "500MB", "1 day", 190),
    plan("MTN", "Gifting", "1.0GB", "1 day", 320),
    plan("MTN", "Gifting", "2.0GB", "2 days", 600),
    plan("MTN", "Gifting", "5.0GB", "30 days", 1650),
    plan("MTN", "Corporate", "10.0GB", "30 days", 2500),
    plan("MTN", "Corporate", "15.0GB", "30 days", 3600),
    plan("MTN", "Corporate", "40.0GB", "30 days", 8000),

    plan("Airtel", "SME", "500MB", "1 day", 160),
    plan("Airtel", "SME", "1.0GB", "2 days", 350),
    plan("Airtel", "SME", "2.0GB", "7 days", 680),
    plan("Airtel", "SME", "5.0GB", "30 days", 1450),
    plan("Airtel", "SME", "10.0GB", "30 days", 2700),
    plan("Airtel", "Gifting", "150MB", "1 day", 100),
    plan("Airtel", "Gifting", "300MB", "2 days", 200),
    plan("Airtel", "Gifting", "1.0GB", "1 day", 300),
    plan("Airtel", "Gifting", "2.0GB", "2 days", 580),
    plan("Airtel", "Gifting", "5.0GB", "7 days", 1500),
    plan("Airtel", "Corporate", "10.0GB", "30 days", 2400),
    plan("Airtel", "Corporate", "20.0GB", "30 days", 4500),

    plan("Glo", "SME", "200MB", "30 days", 95),
    plan("Glo", "SME", "500MB", "30 days", 210),
    plan("Glo", "SME", "1.0GB", "1 day", 220),
    plan("Glo", "SME", "2.5GB", "2 days", 500),
    plan("Glo", "SME", "5.0GB", "30 days", 1400),
    plan("Glo", "SME", "10.0GB", "30 days", 2600),
    plan("Glo", "Gifting", "105MB", "1 day", 110),
    plan("Glo", "Gifting", "125MB", "1 day", 120),
    plan("Glo", "Gifting", "275MB", "2 days", 220),
    plan("Glo", "Gifting", "1.0GB", "2 days", 350),
    plan("Glo", "Gifting", "2.0GB", "7 days", 650),
    plan("Glo", "Corporate", "10.0GB", "30 days", 2300),
    plan("Glo", "Corporate", "15.0GB", "30 days", 3400),

    plan("9mobile", "SME", "500MB", "1 day", 140),
    plan("9mobile", "SME", "1.0GB", "1 day", 300),
    plan("9mobile", "SME", "1.5GB", "7 days", 500),
    plan("9mobile", "SME", "3.0GB", "30 days", 1000),
    plan("9mobile", "SME", "5.0GB", "30 days", 1500),
    plan("9mobile", "Gifting", "250MB", "1 day", 120),
    plan("9mobile", "Gifting", "500MB", "1 day", 200),
    plan("9mobile", "Gifting", "1.0GB", "1 day", 320),
    plan("9mobile", "Gifting", "2.0GB", "7 days", 600),
    plan("9mobile", "Corporate", "5.0GB", "30 days", 1400),
    plan("9mobile", "Corporate", "11.0GB", "30 days", 2800),
  ];

  const discos = [
    { id: "AEDC", name: "Abuja (AEDC)" },
    { id: "IKEDC", name: "Ikeja (IKEDC)" },
    { id: "EKEDC", name: "Eko (EKEDC)" },
    { id: "IBEDC", name: "Ibadan (IBEDC)" },
    { id: "PHED", name: "Port Harcourt (PHED)" },
    { id: "KAEDCO", name: "Kaduna (KAEDCO)" },
    { id: "EEDC", name: "Enugu (EEDC)" },
    { id: "JED", name: "Jos (JED)" },
    { id: "KEDCO", name: "Kano (KEDCO)" },
    { id: "BEDC", name: "Benin (BEDC)" },
  ];

  const cables = [
    { id: "dstv-padi", provider: "DSTV", name: "Padi", price: 4400 },
    { id: "dstv-yanga", provider: "DSTV", name: "Yanga", price: 6000 },
    { id: "dstv-confam", provider: "DSTV", name: "Confam", price: 11000 },
    { id: "dstv-compact", provider: "DSTV", name: "Compact", price: 19000 },
    { id: "dstv-compact-plus", provider: "DSTV", name: "Compact Plus", price: 30000 },
    { id: "dstv-premium", provider: "DSTV", name: "Premium", price: 44500 },
    { id: "gotv-smallie", provider: "GOTV", name: "Smallie", price: 1900 },
    { id: "gotv-jinja", provider: "GOTV", name: "Jinja", price: 3900 },
    { id: "gotv-jolli", provider: "GOTV", name: "Jolli", price: 5800 },
    { id: "gotv-max", provider: "GOTV", name: "Max", price: 8500 },
    { id: "startimes-nova", provider: "Startimes", name: "Nova", price: 1700 },
    { id: "startimes-basic", provider: "Startimes", name: "Basic", price: 3000 },
    { id: "startimes-smart", provider: "Startimes", name: "Smart", price: 4500 },
    { id: "startimes-classic", provider: "Startimes", name: "Classic", price: 6000 },
  ];

  const exams = [
    { id: "waec", name: "WAEC", price: 3700 },
    { id: "neco", name: "NECO", price: 1200 },
    { id: "nabteb", name: "NABTEB", price: 1000 },
    { id: "nbais", name: "NBAIS", price: 1200 },
  ];

  const codes = {
    MTN: [
      ["SME balance", "*461*4#"],
      ["Gifting balance", "*131*4#"],
      ["Data balance", "*323#"],
    ],
    Airtel: [
      ["Data balance", "*140#"],
      ["Airtime balance", "*310#"],
    ],
    Glo: [
      ["Data balance", "*127*0#"],
      ["Airtime balance", "*310#"],
    ],
    "9mobile": [
      ["Data balance", "*228#"],
      ["Airtime balance", "*310#"],
    ],
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "airtime", label: "Airtime Payment" },
    { id: "data", label: "Data Plan" },
    { id: "transfer", label: "Transfer" },
    { id: "cable", label: "Cable subscription" },
    { id: "bank", label: "Bank payment" },
    { id: "card", label: "Card payment" },
    { id: "bill", label: "Bill payment" },
    { id: "pin", label: "Recharge Pin" },
    { id: "exam", label: "Result checker" },
    { id: "cash", label: "Airtime to cash" },
    { id: "sms", label: "Bulk SMS" },
    { id: "withdraw", label: "Withdraw" },
  ];

  const services = [
    { href: "cards", label: "Data card Printing", tone: "slate", icon: "print" },
    { href: "airtime", label: "Airtime TopUp", tone: "amber", icon: "phone" },
    { href: "data", label: "Buy Data", tone: "green", icon: "wifi" },
    { href: "cash", label: "Airtime to cash", tone: "ink", icon: "cash" },
    { href: "electricity", label: "Electricity Bills", tone: "orange", icon: "bulb" },
    { href: "cable", label: "Cable Subscription", tone: "blue", icon: "tv" },
    { href: "bonus", label: "Bonus to wallet", tone: "teal", icon: "card" },
    { href: "sms", label: "Bulk SMS", tone: "gold", icon: "mail" },
    { href: "referrals", label: "My Referrals", tone: "rose", icon: "people" },
  ];

  function plansFor(network, type) {
    return plans.filter((item) => item.network === network && item.type === type);
  }

  function planById(id) {
    return plans.find((item) => item.id === id) || null;
  }

  function packageById(id) {
    return packages.find((item) => item.id === id) || packages[0];
  }

  return {
    packages,
    networks,
    types,
    plans,
    plansFor,
    planById,
    packageById,
    discos,
    cables,
    exams,
    codes,
    filters,
    services,
    fundCharge: 50,
    minFund: 100,
    billFee: 100,
    smsRate: 4,
    cashRate: 0.8,
  };
})();
