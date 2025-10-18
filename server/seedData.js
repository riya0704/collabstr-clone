const mongoose = require('mongoose');
const User = require('./models/User');
const Collaboration = require('./models/Collaboration');
require('dotenv').config();

const sampleCreators = [
  {
    email: 'sarah.fashion@example.com',
    password: 'password123',
    userType: 'creator',
    profile: {
      name: 'Sarah Johnson',
      bio: 'Fashion & lifestyle content creator passionate about sustainable fashion and beauty trends. Sharing daily outfits and style tips.',
      location: 'Los Angeles, CA',
      website: 'https://sarahjohnson.com'
    },
    creatorProfile: {
      categories: ['Fashion & Style', 'Beauty & Makeup', 'Lifestyle'],
      followers: {
        instagram: 125000,
        tiktok: 89000,
        youtube: 45000
      },
      rates: {
        post: 800,
        story: 300,
        reel: 1200
      }
    },
    isVerified: true
  },
  {
    email: 'mike.fitness@example.com',
    password: 'password123',
    userType: 'creator',
    profile: {
      name: 'Mike Rodriguez',
      bio: 'Certified personal trainer and nutrition coach. Helping people transform their lives through fitness and healthy living.',
      location: 'Miami, FL',
      website: 'https://mikefit.com'
    },
    creatorProfile: {
      categories: ['Fitness & Health', 'Lifestyle'],
      followers: {
        instagram: 89000,
        youtube: 156000,
        twitter: 23000
      },
      rates: {
        post: 600,
        story: 250,
        reel: 900
      }
    },
    isVerified: true
  },
  {
    email: 'emma.food@example.com',
    password: 'password123',
    userType: 'creator',
    profile: {
      name: 'Emma Chen',
      bio: 'Food blogger and recipe developer. Sharing easy, delicious recipes and restaurant reviews from around the world.',
      location: 'New York, NY',
      website: 'https://emmaeats.com'
    },
    creatorProfile: {
      categories: ['Food & Cooking', 'Travel & Adventure'],
      followers: {
        instagram: 234000,
        youtube: 78000,
        tiktok: 145000
      },
      rates: {
        post: 1200,
        story: 400,
        reel: 1500
      }
    },
    isVerified: true
  },
  {
    email: 'alex.tech@example.com',
    password: 'password123',
    userType: 'creator',
    profile: {
      name: 'Alex Thompson',
      bio: 'Tech reviewer and software engineer. Breaking down the latest gadgets and tech trends in simple terms.',
      location: 'San Francisco, CA',
      website: 'https://alextech.com'
    },
    creatorProfile: {
      categories: ['Technology', 'Gaming'],
      followers: {
        youtube: 345000,
        twitter: 67000,
        instagram: 45000
      },
      rates: {
        post: 1000,
        story: 350,
        reel: 1300
      }
    },
    isVerified: true
  }
];

const sampleBrands = [
  {
    email: 'partnerships@fashionnova.com',
    password: 'password123',
    userType: 'brand',
    profile: {
      name: 'Fashion Nova',
      bio: 'Leading fast fashion brand looking for style influencers to showcase our latest collections.',
      location: 'Los Angeles, CA',
      website: 'https://fashionnova.com'
    },
    brandProfile: {
      companyName: 'Fashion Nova',
      industry: 'Fashion & Retail',
      targetAudience: 'Women 18-35 interested in trendy, affordable fashion'
    },
    isVerified: true
  },
  {
    email: 'marketing@fitbit.com',
    password: 'password123',
    userType: 'brand',
    profile: {
      name: 'Fitbit',
      bio: 'Fitness technology company empowering people to live healthier, more active lives.',
      location: 'San Francisco, CA',
      website: 'https://fitbit.com'
    },
    brandProfile: {
      companyName: 'Fitbit Inc.',
      industry: 'Health & Technology',
      targetAudience: 'Health-conscious individuals aged 25-50'
    },
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collabstr');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Collaboration.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    
    for (const userData of [...sampleCreators, ...sampleBrands]) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.profile.name}`);
    }

    // Create sample collaborations
    const brandUsers = createdUsers.filter(user => user.userType === 'brand');
    
    const sampleCollaborations = [
      {
        brand: brandUsers[0]._id, // Fashion Nova
        title: 'Summer Collection Campaign',
        description: 'Looking for fashion influencers to showcase our new summer collection. Must have strong engagement with female audience aged 18-30. Content should include outfit styling videos and photos.',
        category: 'Fashion & Style',
        budget: { min: 500, max: 2000 },
        requirements: {
          followers: { min: 50000, platform: 'Instagram' },
          location: 'United States',
          age: { min: 18, max: 35 }
        },
        deliverables: ['2 Instagram posts', '3 Instagram stories', '1 Reel'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        brand: brandUsers[1]._id, // Fitbit
        title: 'Fitness Challenge Partnership',
        description: 'Partner with us for a 30-day fitness challenge featuring our latest smartwatch. Looking for fitness enthusiasts who can create motivational content and track their progress.',
        category: 'Fitness & Health',
        budget: { min: 1000, max: 3000 },
        requirements: {
          followers: { min: 75000, platform: 'YouTube' },
          location: 'North America'
        },
        deliverables: ['Weekly YouTube videos', 'Daily Instagram stories', 'Final results post'],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
      },
      {
        brand: brandUsers[0]._id, // Fashion Nova
        title: 'Holiday Lookbook Creation',
        description: 'Create a holiday lookbook featuring our party and formal wear collection. Perfect for creators who love styling and have a keen eye for fashion photography.',
        category: 'Fashion & Style',
        budget: { min: 800, max: 1500 },
        requirements: {
          followers: { min: 30000, platform: 'Instagram' },
          location: 'Any'
        },
        deliverables: ['5 Instagram posts', '10 Instagram stories', '2 Reels'],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 days from now
      }
    ];

    for (const collabData of sampleCollaborations) {
      const collaboration = new Collaboration(collabData);
      await collaboration.save();
      console.log(`Created collaboration: ${collaboration.title}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();