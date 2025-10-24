const mongoose = require('mongoose');
const User = require('./models/User');
const Collaboration = require('./models/Collaboration');
const Service = require('./models/Service');
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

// Admin user
const adminUser = {
  email: 'admin@collabstr.com',
  password: 'admin123',
  userType: 'brand',
  profile: {
    name: 'Admin User',
    bio: 'Platform administrator with full access to manage users and collaborations.',
    location: 'San Francisco, CA'
  },
  brandProfile: {
    companyName: 'Collabstr Admin',
    industry: 'Technology',
    targetAudience: 'Platform management'
  },
  isVerified: true,
  isAdmin: true
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collabstr');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Collaboration.deleteMany({});
    await Service.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    
    for (const userData of [...sampleCreators, ...sampleBrands, adminUser]) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.profile.name}${user.isAdmin ? ' (ADMIN)' : ''}`);
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

    // Create sample services
    const creatorUsers = createdUsers.filter(user => user.userType === 'creator');
    
    const sampleServices = [
      {
        creator: creatorUsers[0]._id, // Sarah Johnson
        title: 'Professional Instagram Content Creation',
        description: 'I will create high-quality Instagram posts and stories for your fashion or lifestyle brand. With over 125k engaged followers, I specialize in creating authentic content that drives engagement and sales.',
        category: 'Social Media Marketing',
        pricing: {
          basic: {
            price: 300,
            description: '1 Instagram post with professional photography',
            deliveryTime: 3,
            revisions: 2,
            features: ['High-quality photo', 'Engaging caption', 'Hashtag research', '24-hour story highlight']
          },
          standard: {
            price: 600,
            description: '1 Instagram post + 3 stories + 1 reel',
            deliveryTime: 5,
            revisions: 3,
            features: ['Everything in Basic', '3 Instagram stories', '1 Instagram Reel', 'Usage rights for 6 months']
          },
          premium: {
            price: 1200,
            description: 'Complete content package with multiple posts',
            deliveryTime: 7,
            revisions: 5,
            features: ['Everything in Standard', '2 additional posts', 'Story highlights', 'Usage rights for 1 year', 'Performance analytics']
          }
        },
        gallery: [
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
        ],
        tags: ['instagram', 'fashion', 'lifestyle', 'content creation'],
        requirements: 'Please provide brand guidelines, product information, and any specific requirements for the content.',
        stats: {
          views: 1250,
          orders: 45,
          rating: 4.9,
          reviews: 38
        },
        seo: {
          slug: 'professional-instagram-content-creation',
          metaTitle: 'Professional Instagram Content Creation - Fashion & Lifestyle',
          metaDescription: 'Get high-quality Instagram content from verified fashion influencer with 125k followers'
        }
      },
      {
        creator: creatorUsers[1]._id, // Mike Rodriguez
        title: 'Fitness YouTube Video Production',
        description: 'I will create engaging fitness content for your YouTube channel or brand. As a certified trainer with 156k YouTube subscribers, I deliver professional workout videos and fitness advice.',
        category: 'Video Production',
        pricing: {
          basic: {
            price: 500,
            description: '5-minute workout video with basic editing',
            deliveryTime: 7,
            revisions: 2,
            features: ['Professional filming', 'Basic editing', 'Custom thumbnail', 'Video description']
          },
          standard: {
            price: 1000,
            description: '10-minute comprehensive workout video',
            deliveryTime: 10,
            revisions: 3,
            features: ['Everything in Basic', 'Advanced editing', 'Multiple camera angles', 'Branded intro/outro', 'Social media clips']
          },
          premium: {
            price: 2000,
            description: 'Complete fitness series with multiple videos',
            deliveryTime: 14,
            revisions: 5,
            features: ['Everything in Standard', '3 workout videos', 'Nutrition guide', 'Custom graphics', 'Full commercial rights']
          }
        },
        gallery: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
        ],
        tags: ['youtube', 'fitness', 'workout', 'video production'],
        requirements: 'Please specify workout type, target audience, and any equipment preferences.',
        stats: {
          views: 890,
          orders: 23,
          rating: 4.8,
          reviews: 19
        },
        seo: {
          slug: 'fitness-youtube-video-production',
          metaTitle: 'Professional Fitness YouTube Video Production',
          metaDescription: 'Get professional fitness videos from certified trainer with 156k YouTube subscribers'
        }
      },
      {
        creator: creatorUsers[2]._id, // Emma Chen
        title: 'Tech Product Review & Unboxing',
        description: 'I will create detailed tech product reviews and unboxing videos for your brand. With expertise in consumer electronics and 95k engaged followers, I provide honest, informative content.',
        category: 'Content Creation',
        pricing: {
          basic: {
            price: 400,
            description: 'Unboxing video with first impressions',
            deliveryTime: 5,
            revisions: 2,
            features: ['Professional unboxing', 'First impressions', 'Key features highlight', 'Social media post']
          },
          standard: {
            price: 800,
            description: 'Complete product review with testing',
            deliveryTime: 10,
            revisions: 3,
            features: ['Everything in Basic', 'In-depth testing', 'Pros and cons analysis', 'Comparison with competitors', 'Written review']
          },
          premium: {
            price: 1500,
            description: 'Comprehensive review series across platforms',
            deliveryTime: 14,
            revisions: 4,
            features: ['Everything in Standard', 'Multi-platform content', 'Long-term usage review', 'Tutorial videos', 'Q&A session']
          }
        },
        gallery: [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
          'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'
        ],
        tags: ['tech', 'review', 'unboxing', 'gadgets'],
        requirements: 'Please provide product specifications, key selling points, and target audience information.',
        stats: {
          views: 650,
          orders: 18,
          rating: 4.7,
          reviews: 15
        },
        seo: {
          slug: 'tech-product-review-unboxing',
          metaTitle: 'Professional Tech Product Review & Unboxing Services',
          metaDescription: 'Get honest tech reviews and unboxing videos from experienced tech content creator'
        }
      }
    ];

    for (const serviceData of sampleServices) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`Created service: ${service.title}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();