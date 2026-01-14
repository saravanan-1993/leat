const bcrypt = require("bcrypt");
const { prisma } = require("../../config/database");

/**
 * Auto-initialize admin user on first database connection
 * This runs automatically when the server starts
 */
async function initializeAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("⚠️  ADMIN_EMAIL and ADMIN_PASSWORD not set - skipping admin initialization");
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    console.log("🌱 Initializing default admin user...");

    // Hash the admin password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const adminUser = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin User",
        isVerified: true,
        isActive: true,
        provider: "local",
      },
    });

    // Create default working hours (24/7 operation)
    const defaultWorkingHours = [
      { day: "Monday", enabled: true, startTime: "00:00", endTime: "23:59" },
      { day: "Tuesday", enabled: true, startTime: "00:00", endTime: "23:59" },
      { day: "Wednesday", enabled: true, startTime: "00:00", endTime: "23:59" },
      { day: "Thursday", enabled: true, startTime: "00:00", endTime: "23:59" },
      { day: "Friday", enabled: true, startTime: "00:00", endTime: "23:59" },
      { day: "Saturday", enabled: true, startTime: "00:00", endTime: "23:59" },
      { day: "Sunday", enabled: true, startTime: "00:00", endTime: "23:59" },
    ];

    const workingHoursData = defaultWorkingHours.map((wh) => ({
      adminId: adminUser.id,
      day: wh.day,
      enabled: wh.enabled,
      startTime: wh.startTime,
      endTime: wh.endTime,
    }));

    await prisma.workingHour.createMany({
      data: workingHoursData,
    });

    console.log("✅ Default admin user created successfully!");
    console.log("✅ Default working hours (24/7) configured!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log("⚠️  Please complete onboarding wizard on first login");
  } catch (error) {
    console.error("❌ Error initializing admin user:", error);
  }
}

module.exports = { initializeAdmin };
