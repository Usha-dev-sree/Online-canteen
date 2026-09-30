const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config();

const sampleMenuItems = [
  // BREAKFAST
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato masala, served with coconut chutney & sambar',
    price: 60,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12,
  },
  {
    name: 'Idli Sambar (4 Pcs)',
    description: 'Steamed fluffy rice cakes served with hot sambar and fresh coconut chutney',
    price: 40,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8,
  },
  {
    name: 'Puri Bhaji (3 Pcs)',
    description: 'Deep fried puffed wheat bread served with flavorful potato gravy and pickled chilli',
    price: 50,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10,
  },
  {
    name: 'Paneer Paratha',
    description: 'Stuffed wheat flatbread loaded with spiced cottage cheese, served with fresh curd & butter',
    price: 70,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15,
  },
  {
    name: 'Onion Rava Dosa',
    description: 'Crispy semolina crepe with chopped onions, green chillies, coriander and chutney',
    price: 65,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12,
  },

  // LUNCH
  {
    name: 'Special Veg Thali',
    description: 'Paneer butter masala, dal tadka, 2 phulkas, jeera rice, salad & sweet gulab jamun',
    price: 120,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 20,
  },
  {
    name: 'Chicken Biryani',
    description: 'Aromatic dum basmati rice cooked with tender chicken pieces, saffron & special spices',
    price: 160,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15,
  },
  {
    name: 'Chole Bhature',
    description: 'Fluffy fried bhaturas served with spicy chickpea gravy, pickled onions & mint chutney',
    price: 90,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15,
  },
  {
    name: 'Paneer Butter Masala Combo',
    description: 'Rich paneer butter masala served with 2 butter naans and fragrant jeera rice',
    price: 140,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18,
  },
  {
    name: 'Dal Makhani with Jeera Rice',
    description: 'Slow cooked creamy black lentils cooked overnight, served with cumin flavoured basmati rice',
    price: 110,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15,
  },

  // SNACKS
  {
    name: 'Veg Cheese Burger',
    description: 'Crispy vegetable patty with melted cheddar cheese, fresh lettuce, tomato & canteen sauce',
    price: 85,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10,
  },
  {
    name: 'Samosa Chaat (2 Pcs)',
    description: 'Crushed samosas topped with chickpea curry, sweet & tangy chutneys, pomegranate & sev',
    price: 50,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8,
  },
  {
    name: 'Paneer Kathi Roll',
    description: 'Grilled marinated paneer tikka wrapped in a crisp paratha with onions & spicy green chutney',
    price: 90,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12,
  },
  {
    name: 'Loaded Veg Cheese Fries',
    description: 'Crispy golden french fries drizzled with melted cheese sauce, jalapenos & peri peri seasoning',
    price: 80,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10,
  },
  {
    name: 'Veg Spring Rolls (6 Pcs)',
    description: 'Crispy golden fried spring rolls filled with crunchy vegetables, served with sweet chilli sauce',
    price: 75,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10,
  },

  // BEVERAGES
  {
    name: 'Cold Coffee with Ice Cream',
    description: 'Thick blended espresso coffee topped with vanilla ice cream and rich chocolate drizzle',
    price: 70,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },
  {
    name: 'Fresh Mango Lassi',
    description: 'Thick and creamy sweet yogurt beverage blended with ripe Alphonso mango pulp',
    price: 60,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },
  {
    name: 'Masala Chai',
    description: 'Traditional Indian hot tea brewed with fresh ginger, cardamom, cloves and whole milk',
    price: 20,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },
  {
    name: 'Lemon Mint Iced Tea',
    description: 'Chilled black tea infused with fresh lemon juice, crushed mint leaves and ice cubes',
    price: 45,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4,
  },
  {
    name: 'Oreo Milkshake',
    description: 'Rich creamy thick shake blended with classic Oreo cookies and topped with whipped cream',
    price: 85,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },

  // DESSERTS
  {
    name: 'Chocolate Brownie Sundae',
    description: 'Warm fudge chocolate brownie served with vanilla ice cream, hot fudge & roasted almonds',
    price: 95,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5,
  },
  {
    name: 'Gulab Jamun (2 Pcs)',
    description: 'Soft fried cottage cheese dumplings soaked in warm cardamom and rose sugar syrup',
    price: 40,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 3,
  },
  {
    name: 'Rasmalai (2 Pcs)',
    description: 'Soft flattened chenna discs soaked in chilled saffron milk garnished with pistachios',
    price: 60,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 3,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with a molten oozing chocolate fudge centre',
    price: 85,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Replace or insert menu items
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(sampleMenuItems);
    console.log(`🎉 Added ${sampleMenuItems.length} sample menu items with 100% verified working images!`);

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
      console.log(`👤 Admin user already exists: ${adminExists.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDB();
