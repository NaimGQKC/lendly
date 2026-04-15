/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { PrismaClient } = require("../lib/generated/prisma/client.js");

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter }) as any;

async function main() {
  // Clean existing data
  await prisma.loan.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const sophie = await prisma.user.create({
    data: {
      name: "Sophie Martin",
      email: "sophie@lendly.demo",
      role: "ADMIN",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      createdAt: new Date("2024-01-15"),
    },
  });

  const james = await prisma.user.create({
    data: {
      name: "James Chen",
      email: "james@lendly.demo",
      role: "MEMBER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      createdAt: new Date("2024-02-20"),
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@lendly.demo",
      role: "MEMBER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      createdAt: new Date("2024-03-10"),
    },
  });

  const marcus = await prisma.user.create({
    data: {
      name: "Marcus Johnson",
      email: "marcus@lendly.demo",
      role: "MEMBER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      createdAt: new Date("2024-04-05"),
    },
  });

  const ava = await prisma.user.create({
    data: {
      name: "Ava Tremblay",
      email: "ava@lendly.demo",
      role: "MEMBER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
      createdAt: new Date("2024-11-01"),
    },
  });

  // Create items
  const drill = await prisma.item.create({
    data: {
      name: "DeWalt 20V Cordless Drill",
      description: "Powerful cordless drill with two-speed transmission for a range of fastening and drilling applications. Compact, lightweight design fits into tight areas. Includes LED light with 20-second trigger release delay.",
      category: "TOOLS",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600",
      replacementValue: 180,
      depositAmount: 180,
      maxLoanDays: 7,
      status: "AVAILABLE",
      careInstructions: "Charge battery fully before first use. Store in dry location. Clean dust from vents after each use.",
      ownerId: james.id,
    },
  });

  const circularSaw = await prisma.item.create({
    data: {
      name: 'Circular Saw (Makita 7¼")',
      description: "Lightweight yet powerful circular saw with 15-amp motor for demanding applications. Built-in dust blower keeps cut line clean. Includes carbide-tipped blade.",
      category: "TOOLS",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600",
      replacementValue: 220,
      depositAmount: 220,
      maxLoanDays: 3,
      status: "CHECKED_OUT",
      careInstructions: "Always unplug before changing blade. Keep blade guard in working order. Store in dry, secure location.",
      ownerId: james.id,
    },
  });

  const socketWrench = await prisma.item.create({
    data: {
      name: "Socket Wrench Set (152-piece)",
      description: "Complete socket set with both metric and SAE sizes. Chrome vanadium steel construction for durability. Includes carrying case with organized layout.",
      category: "TOOLS",
      condition: "EXCELLENT",
      imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600",
      replacementValue: 90,
      depositAmount: 90,
      maxLoanDays: 7,
      status: "AVAILABLE",
      careInstructions: "Wipe clean after use. Return all pieces to correct slots in case. Do not use as hammer.",
      ownerId: sophie.id,
    },
  });

  const sander = await prisma.item.create({
    data: {
      name: "Orbital Sander (Bosch)",
      description: "Random orbit sander with variable speed control and efficient dust collection. Produces a swirl-free finish. Includes assorted grit sandpaper discs.",
      category: "TOOLS",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600",
      replacementValue: 120,
      depositAmount: 120,
      maxLoanDays: 5,
      status: "AVAILABLE",
      careInstructions: "Empty dust bag after each use. Store with pad facing up. Replace sandpaper disc if worn.",
      ownerId: sophie.id,
    },
  });

  const floorBuffer = await prisma.item.create({
    data: {
      name: "Floor Buffer / Polisher",
      description: "Heavy-duty floor buffer suitable for polishing hardwood, tile, and concrete floors. Adjustable handle height. Includes buffing and scrubbing pads.",
      category: "TOOLS",
      condition: "FAIR",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
      replacementValue: 350,
      depositAmount: 350,
      maxLoanDays: 3,
      status: "AVAILABLE",
      careInstructions: "Clean pad after each use. Wind cord loosely — do not wrap tightly around handle. Transport upright.",
      ownerId: james.id,
    },
  });

  const standMixer = await prisma.item.create({
    data: {
      name: "KitchenAid Stand Mixer",
      description: "Professional 5-quart stand mixer with 10-speed control. Includes flat beater, dough hook, and wire whisk. Perfect for baking, making pasta, and general food prep.",
      category: "KITCHEN",
      condition: "EXCELLENT",
      imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600",
      replacementValue: 450,
      depositAmount: 300,
      maxLoanDays: 5,
      status: "AVAILABLE",
      careInstructions: "Hand wash all attachments. Wipe base with damp cloth only. Do not immerse base in water. Lock tilt-head when not in use.",
      ownerId: priya.id,
    },
  });

  const instantPot = await prisma.item.create({
    data: {
      name: "Instant Pot Duo 8-Quart",
      description: "7-in-1 electric pressure cooker: pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer. Feeds 6-8 people easily.",
      category: "KITCHEN",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600",
      replacementValue: 130,
      depositAmount: 130,
      maxLoanDays: 7,
      status: "CHECKED_OUT",
      careInstructions: "Wash inner pot, lid, and sealing ring after each use. Never put the base in water. Check sealing ring for odors.",
      ownerId: priya.id,
    },
  });

  const vitamix = await prisma.item.create({
    data: {
      name: "Vitamix Professional Blender",
      description: "High-performance blender with variable speed control and pulse feature. Makes smoothies, hot soups, frozen desserts, and more. Self-cleaning with warm water and a drop of dish soap.",
      category: "KITCHEN",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600",
      replacementValue: 500,
      depositAmount: 350,
      maxLoanDays: 5,
      status: "AVAILABLE",
      careInstructions: "Clean immediately after use — blend warm water with a drop of soap. Do not put in dishwasher. Dry upside down.",
      ownerId: sophie.id,
    },
  });

  const waffleIron = await prisma.item.create({
    data: {
      name: "Waffle Iron (Belgian)",
      description: "Makes thick, fluffy Belgian-style waffles with deep pockets. Non-stick plates for easy cleanup. Indicator light shows when ready to cook.",
      category: "KITCHEN",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600",
      replacementValue: 60,
      depositAmount: 60,
      maxLoanDays: 7,
      status: "AVAILABLE",
      careInstructions: "Wipe plates with damp cloth after cooling. Never immerse in water. Store upright to save space.",
      ownerId: priya.id,
    },
  });

  const sousvide = await prisma.item.create({
    data: {
      name: "Sous Vide Precision Cooker",
      description: "WiFi-enabled precision cooker for perfect results every time. Heats and circulates water to a precise temperature. Clip-on design fits any pot.",
      category: "KITCHEN",
      condition: "EXCELLENT",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      replacementValue: 200,
      depositAmount: 200,
      maxLoanDays: 7,
      status: "AVAILABLE",
      careInstructions: "Wipe clean with damp cloth. Do not submerge electronics. Store in upright position. Descale monthly if used frequently.",
      ownerId: sophie.id,
    },
  });

  const tent = await prisma.item.create({
    data: {
      name: "4-Person Tent (MSR Habitude)",
      description: "Spacious 4-person camping tent with excellent ventilation and weather protection. Easy setup with color-coded poles. Two doors and two vestibules for gear storage.",
      category: "OUTDOOR",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
      replacementValue: 450,
      depositAmount: 300,
      maxLoanDays: 14,
      status: "AVAILABLE",
      careInstructions: "Dry thoroughly before packing. Shake out dirt. Never machine wash. Store loosely, not compressed. Check for tears after each trip.",
      ownerId: marcus.id,
    },
  });

  const campingStove = await prisma.item.create({
    data: {
      name: "Camping Stove (Coleman 2-Burner)",
      description: "Classic 2-burner propane stove with adjustable burners and wind-block panels. Supports large pots and pans. Folds flat for easy transport.",
      category: "OUTDOOR",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600",
      replacementValue: 80,
      depositAmount: 80,
      maxLoanDays: 14,
      status: "AVAILABLE",
      careInstructions: "Clean grates after each use. Check propane connections for leaks. Store with burners off and propane disconnected.",
      ownerId: marcus.id,
    },
  });

  const projector = await prisma.item.create({
    data: {
      name: "Portable Projector + Screen",
      description: "Compact HD projector with built-in speakers and 100-inch collapsible screen. HDMI, USB, and wireless connectivity. Perfect for outdoor movie nights or presentations.",
      category: "ELECTRONICS",
      condition: "EXCELLENT",
      imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600",
      replacementValue: 350,
      depositAmount: 250,
      maxLoanDays: 3,
      status: "CHECKED_OUT",
      careInstructions: "Handle lens carefully — do not touch with fingers. Allow to cool before packing. Fold screen gently along original creases.",
      ownerId: james.id,
    },
  });

  const speaker = await prisma.item.create({
    data: {
      name: "Bluetooth PA Speaker (JBL PartyBox)",
      description: "Powerful portable Bluetooth speaker with deep bass and built-in light show. Splash-proof design with up to 18 hours of battery. Guitar and mic inputs for live performances.",
      category: "ELECTRONICS",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600",
      replacementValue: 350,
      depositAmount: 250,
      maxLoanDays: 3,
      status: "AVAILABLE",
      careInstructions: "Keep away from water despite splash-proof rating. Don't leave in direct sun. Charge fully before storage. Handle tweeter grille gently.",
      ownerId: james.id,
    },
  });

  const camera = await prisma.item.create({
    data: {
      name: "DSLR Camera (Canon EOS Rebel T8i + 18-55mm)",
      description: "Versatile DSLR camera with 24.1MP sensor and 4K video capability. Includes 18-55mm kit lens, battery, charger, and strap. Great for beginners and hobbyists.",
      category: "ELECTRONICS",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
      replacementValue: 900,
      depositAmount: 500,
      maxLoanDays: 5,
      status: "AVAILABLE",
      careInstructions: "Keep lens cap on when not in use. Avoid extreme temperatures. Do not touch sensor. Store in padded camera bag.",
      ownerId: james.id,
    },
  });

  const pressureWasher = await prisma.item.create({
    data: {
      name: "Pressure Washer (Sun Joe 2030 PSI)",
      description: "Electric pressure washer with 2030 PSI for driveways, decks, siding, and more. Includes multiple nozzle tips and detergent tank. No gas, no fumes.",
      category: "GARDEN",
      condition: "FAIR",
      imageUrl: "https://images.unsplash.com/photo-1622480916113-2a0aab249ec6?w=600",
      replacementValue: 200,
      depositAmount: 200,
      maxLoanDays: 3,
      status: "NEEDS_REPAIR",
      careInstructions: "Drain all water after use. Store indoors to prevent freezing. Clean nozzle tips regularly. Check hose connections before use.",
      ownerId: sophie.id,
    },
  });

  const hedgeTrimmer = await prisma.item.create({
    data: {
      name: "Hedge Trimmer (Electric)",
      description: "Corded electric hedge trimmer with 22-inch dual-action blade. Lightweight and easy to maneuver. Clean cuts on branches up to 3/4-inch thick.",
      category: "GARDEN",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
      replacementValue: 80,
      depositAmount: 80,
      maxLoanDays: 3,
      status: "AVAILABLE",
      careInstructions: "Clean blade after each use with cloth. Apply light oil to blade. Store with blade guard on. Never cut in wet conditions.",
      ownerId: sophie.id,
    },
  });

  const catan = await prisma.item.create({
    data: {
      name: "Catan Board Game (Complete + Expansions)",
      description: "The classic strategy board game with Seafarers and Cities & Knights expansions. Supports 3-6 players. All pieces organized in labeled bags — please keep it tidy!",
      category: "GAMES",
      condition: "GOOD",
      imageUrl: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=600",
      replacementValue: 85,
      depositAmount: 50,
      maxLoanDays: 14,
      status: "AVAILABLE",
      careInstructions: "Keep cards and pieces sorted in labeled bags. Don't eat over the board. Count all pieces before returning.",
      ownerId: ava.id,
    },
  });

  // Create loans
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  // Active loans (CHECKED_OUT items)
  await prisma.loan.create({
    data: {
      itemId: circularSaw.id,
      borrowerId: marcus.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(2),
      dueDate: daysFromNow(1),
      status: "ACTIVE",
      depositStatus: "COLLECTED",
      beforeImageUrl: circularSaw.imageUrl,
    },
  });

  await prisma.loan.create({
    data: {
      itemId: instantPot.id,
      borrowerId: james.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(5),
      dueDate: daysAgo(1),
      status: "OVERDUE",
      depositStatus: "COLLECTED",
      beforeImageUrl: instantPot.imageUrl,
    },
  });

  await prisma.loan.create({
    data: {
      itemId: projector.id,
      borrowerId: ava.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(1),
      dueDate: daysFromNow(2),
      status: "ACTIVE",
      depositStatus: "COLLECTED",
      beforeImageUrl: projector.imageUrl,
    },
  });

  // Returned loans
  await prisma.loan.create({
    data: {
      itemId: drill.id,
      borrowerId: marcus.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(30),
      dueDate: daysAgo(23),
      returnDate: daysAgo(24),
      status: "RETURNED",
      depositStatus: "RETURNED",
      returnCondition: "GOOD",
      beforeImageUrl: drill.imageUrl,
    },
  });

  await prisma.loan.create({
    data: {
      itemId: standMixer.id,
      borrowerId: james.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(45),
      dueDate: daysAgo(40),
      returnDate: daysAgo(41),
      status: "RETURNED",
      depositStatus: "RETURNED",
      returnCondition: "GOOD",
      beforeImageUrl: standMixer.imageUrl,
    },
  });

  await prisma.loan.create({
    data: {
      itemId: tent.id,
      borrowerId: ava.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(20),
      dueDate: daysAgo(6),
      returnDate: daysAgo(7),
      status: "RETURNED",
      depositStatus: "RETURNED",
      returnCondition: "GOOD",
      beforeImageUrl: tent.imageUrl,
    },
  });

  await prisma.loan.create({
    data: {
      itemId: camera.id,
      borrowerId: priya.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(15),
      dueDate: daysAgo(10),
      returnDate: daysAgo(10),
      status: "RETURNED",
      depositStatus: "RETURNED",
      returnCondition: "GOOD",
      beforeImageUrl: camera.imageUrl,
    },
  });

  await prisma.loan.create({
    data: {
      itemId: speaker.id,
      borrowerId: marcus.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(50),
      dueDate: daysAgo(47),
      returnDate: daysAgo(47),
      status: "RETURNED",
      depositStatus: "RETURNED",
      returnCondition: "GOOD",
      beforeImageUrl: speaker.imageUrl,
    },
  });

  // Disputed loan with condition report
  await prisma.loan.create({
    data: {
      itemId: sander.id,
      borrowerId: marcus.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(25),
      dueDate: daysAgo(20),
      returnDate: daysAgo(19),
      status: "DISPUTED",
      depositStatus: "CLAIMED",
      returnCondition: "DAMAGED",
      beforeImageUrl: sander.imageUrl,
      afterImageUrl: sander.imageUrl,
      notes: "Returned with deep scratch on housing and missing carrying case.",
      conditionReport: JSON.stringify({
        summary: "Item returned with visible damage inconsistent with normal wear",
        findings: [
          { area: "Motor housing", status: "damaged", detail: "Deep scratch on left side, approximately 4 inches, exposing bare metal" },
          { area: "Chuck", status: "good", detail: "Functions normally, no visible wear" },
          { area: "Battery", status: "good", detail: "Holds charge, consistent with expected wear" },
          { area: "Carrying case", status: "missing", detail: "Hard case not returned with item" },
          { area: "Drill bits", status: "good", detail: "All 12 bits present and in expected condition" },
        ],
        overallCondition: "damaged",
        recommendation: "PARTIAL_CLAIM",
        suggestedClaimAmount: 85,
        reasoning: "Scratch damage to housing is cosmetic but reduces item value. Missing case needs replacement (~$35). Suggest claiming $85 of $180 deposit and returning remainder.",
      }),
    },
  });

  // One more returned loan
  await prisma.loan.create({
    data: {
      itemId: waffleIron.id,
      borrowerId: ava.id,
      approvedById: sophie.id,
      checkoutDate: daysAgo(10),
      dueDate: daysAgo(3),
      returnDate: daysAgo(4),
      status: "RETURNED",
      depositStatus: "RETURNED",
      returnCondition: "GOOD",
      beforeImageUrl: waffleIron.imageUrl,
    },
  });

  console.log("✅ Seed data created successfully!");
  console.log(`   ${5} users, ${18} items, ${10} loans`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
