const MOCK_LISTINGS = [
  {
    name: "DeWalt 20V MAX Cordless Drill/Driver",
    description:
      "Reliable cordless drill with two-speed settings, perfect for home improvement projects. Includes LED work light for visibility in tight spaces. Compact and lightweight design reduces user fatigue.",
    category: "TOOLS",
    condition: "GOOD",
    replacementValue: 180,
    depositAmount: 180,
    maxLoanDays: 7,
    careInstructions:
      "Charge battery fully before first use. Store in dry location. Clean dust from vents after each use. Do not leave battery on charger for more than 24 hours.",
  },
  {
    name: "KitchenAid Artisan Stand Mixer — 5 Quart",
    description:
      "Professional-grade stand mixer ideal for baking, dough kneading, and general food preparation. Includes flat beater, dough hook, and wire whisk attachments. 10 speed settings for precise control.",
    category: "KITCHEN",
    condition: "EXCELLENT",
    replacementValue: 450,
    depositAmount: 300,
    maxLoanDays: 5,
    careInstructions:
      "Hand wash all attachments — do not put in dishwasher. Wipe base with damp cloth. Do not immerse the base in water. Store with head in locked upright position.",
  },
  {
    name: "JBL PartyBox 310 Bluetooth Speaker",
    description:
      "Powerful portable Bluetooth speaker with deep bass, built-in light show, and splash-proof design. Up to 18 hours of battery life. Perfect for parties, outdoor events, and gatherings.",
    category: "ELECTRONICS",
    condition: "GOOD",
    replacementValue: 350,
    depositAmount: 250,
    maxLoanDays: 3,
    careInstructions:
      "Keep away from water despite splash-proof rating. Store at room temperature. Charge fully before storage if not used for extended periods. Handle the tweeter grille gently.",
  },
  {
    name: "MSR Habitude 4-Person Camping Tent",
    description:
      "Spacious 4-person tent with excellent ventilation and weather protection. Easy setup with color-coded poles. Perfect for family camping trips and weekend getaways.",
    category: "OUTDOOR",
    condition: "GOOD",
    replacementValue: 450,
    depositAmount: 300,
    maxLoanDays: 14,
    careInstructions:
      "Dry thoroughly before packing away. Shake out dirt and debris. Never machine wash. Store loosely in a cool, dry place. Check seams after each trip.",
  },
];

let counter = 0;

export function generateMockListing() {
  const listing = MOCK_LISTINGS[counter % MOCK_LISTINGS.length];
  counter++;
  return listing;
}
