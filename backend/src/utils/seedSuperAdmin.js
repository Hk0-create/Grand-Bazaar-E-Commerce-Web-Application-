import User from '../models/User.model.js';

export const seedSuperAdmin = async () => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com';
    const existing = await User.findOne({ email: superAdminEmail });
    if (!existing) {
      await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: process.env.SUPER_ADMIN_PASSWORD || 'superadmin123',
        role: 'superadmin',
        isVerified: true,
        isApproved: true,
      });
      console.log('✅ Super Admin seeded successfully');
    }
  } catch (err) {
    console.error('❌ Error seeding super admin:', err.message);
  }
};
