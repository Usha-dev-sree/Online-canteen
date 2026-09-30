const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config();

const sampleMenuItems = [
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepes filled with spiced potato masala, served with coconut chutney & sambar',
    price: 60,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12,
  },
  {
    name: 'Paneer Butter Masala Combo',
    description: 'Rich paneer butter masala served with 2 butter naans and jeera rice',
    price: 140,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18,
  },
  {
    name: 'Veg Cheese Burger',
    description: 'Crispy patty with melted cheddar, fresh lettuce, tomato & special canteen sauce',
    price: 85,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10,
  },
  {
    name: 'Cold Coffee with Ice Cream',
    description: 'Thick blended espresso coffee topped with vanilla ice cream and chocolate drizzle',
    price: 70,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },
  {
    name: 'Chocolate Brownie Sundae',
    description: 'Warm fudge brownie with vanilla ice cream, hot chocolate sauce & crushed nuts',
    price: 95,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },
  {
    name: 'Samosa Chat (2 Pcs)',
    description: 'Crushed samosas topped with chickpea curry, sweet & tangy chutneys, and sev',
    price: 50,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Seed Menu Items if empty
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      await MenuItem.insertMany(sampleMenuItems);
      console.log('🎉 Added 6 sample menu items!');
    } else {
      console.log(`ℹ️ Menu already contains ${count} items. Skipping menu seed.`);
    }

    // Seed Admin User if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Canteen Admin',
        email: 'admin@canteen.com',
        password: 'adminpassword123',
        role: 'admin',
        phone: '9998887770',
      });
      console.log('👤 Created default Admin User: admin@canteen.com / adminpassword123');
    } else {
      console.log('👤 Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDB();
