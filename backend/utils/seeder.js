const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { cloudinary } = require('../config/cloudinary');

const INITIAL_GALLERY_ITEMS = [
  {
    src: '/honey_founder_on work.jpeg',
    title: 'Dr. Sitaram Seervi in the Field',
    tag: 'FOUNDER & ENTOMOLOGIST',
    description: 'Inspecting honey supers and ensuring colonies maintain optimal natural health.',
    order_num: 1,
  },
  {
    src: '/Aai-ji-Honey-BeeKeeping.jpg',
    title: 'Sustainable Desert Apiculture',
    tag: 'HIVE MANAGEMENT',
    description: 'Traditional Rajasthan desert apiaries situated amidst seasonal flora.',
    order_num: 2,
  },
  {
    src: '/Aai-ji-Honey-Beefarm.jpg',
    title: 'Pristine Apiary Landscape',
    tag: 'NATURAL ENVIRONMENT',
    description: 'Chemical-free rural environments far away from industrial pollution.',
    order_num: 3,
  },
  {
    src: '/honey_box_board.jpeg',
    title: 'Handcrafted Wooden Hive Boxes',
    tag: 'ETHICAL HOUSING',
    description: 'Eco-friendly, chemical-free wooden hives designed for bee welfare.',
    order_num: 4,
  },
  {
    src: '/honey_box.jpeg',
    title: 'Bee Hive Super Frames',
    tag: 'COLONY CARE',
    description: 'Carefully aligned comb frames where worker bees build natural wax hexagonal cells.',
    order_num: 5,
  },
  {
    src: '/honey_box2.jpeg',
    title: 'Golden Honeycomb Ripening',
    tag: 'NATURAL HARVEST',
    description: 'Bees fan their wings to reduce nectar moisture naturally below 18%.',
    order_num: 6,
  },
  {
    src: '/honey_box3.jpeg',
    title: 'Capped Raw Honeycombs',
    tag: 'READY HARVEST',
    description: '100% sealed honey cells ready for cold centrifugal gentle extraction.',
    order_num: 7,
  },
  {
    src: '/Aai-ji-Honey-BeeKeeping2.jpg',
    title: 'Traditional Hive Handling',
    tag: 'BEEKEEPING HERITAGE',
    description: 'Harm-free, calm smoke harvesting respecting the life of every single bee.',
    order_num: 8,
  },
  {
    src: '/Aai-ji-Honey-Beefarm-Founder.jpg',
    title: 'Farmer Training Program',
    tag: 'COMMUNITY EMPOWERMENT',
    description: 'Training local Rajasthani tribal farmers in modern apiculture and sustainability.',
    order_num: 9,
  },
  {
    src: '/Aai-ji-Honey-Gallery1.jpg',
    title: 'Raw Nectar Flow',
    tag: 'COLD EXTRACTION',
    description: 'Unheated, unfiltered golden honey flowing straight from centrifuge to glass jars.',
    order_num: 10,
  },
  {
    src: '/Aai-ji-Honey-Gallery2.jpg',
    title: 'Fresh Comb Inspection',
    tag: 'QUALITY ASSURANCE',
    description: 'Checking pollen density, color hue, and natural organic purity.',
    order_num: 11,
  },
  {
    src: '/Aai-ji-Honey-Gallery3.jpg',
    title: 'Rajasthan Flora Pollination',
    tag: 'BIODIVERSITY',
    description: 'Bees pollinating mustard, ber, and desert wildflowers across rural Rajasthan.',
    order_num: 12,
  },
  {
    src: '/Aai-ji-Honey-Gallery4.jpg',
    title: 'UV-Shielded Glass Jar Bottling',
    tag: 'HYGIENIC PACKAGING',
    description: 'Sealed raw without pasteurization to retain all living enzymes and antioxidants.',
    order_num: 13,
  },
  {
    src: '/Aai-ji-honey-Poster.JPG',
    title: 'Aai Ji Honey Brand Heritage',
    tag: 'PURITY PROMISE',
    description: 'Rooted in grandmother tradition and certified with rigorous laboratory testing.',
    order_num: 14,
  },
];

const INITIAL_TEAM_MEMBERS = [
  {
    name: 'Dr. Sitaram Seervi',
    role: 'Founder & Head of Apiculture',
    badge: 'ENTOMOLOGIST',
    image: '/Aai-ji-Honey-Founder.jpg',
    expertise: 'Ph.D. in Entomology, Apiculture & Pollination Ecology Expert',
    email: 'aaijihoney24@gmail.com',
    order_num: 1,
  },
  {
    name: 'Dr. Naveen Jangir',
    role: 'Chief Executive Officer (CEO)',
    badge: 'APICULTURE SPECIALIST',
    image: '/Aai-ji-Honey-CEO.jpg',
    expertise: 'Ph.D. in Entomology, Apiculture Specialist with 6+ Years Experience',
    email: 'jangir000naveen@gmail.com',
    order_num: 2,
  },
  {
    name: 'Dr. Neha Tomar',
    role: 'Director - Human Resources & Outreach',
    badge: 'AGRI-BUSINESS',
    image: '/Aai-ji-Honey-HR.jpg',
    expertise: 'Agriculture Business Management (ABM) & Tribal Community Training',
    email: 'nehatomar5557@gmail.com',
    order_num: 3,
  },
  {
    name: 'Mr. Bhanwar Lal Bhayal',
    role: 'General Manager (Operations)',
    badge: 'SUPPLY CHAIN',
    image: '/Aai-ji-Honey-General-manager.jpg',
    expertise: 'M.Com, Cold Supply Chain & Hive Quality Logistics',
    email: 'pipliahiran@gmail.com',
    order_num: 4,
  },
  {
    name: 'Mr. Sobha Lal',
    role: 'Head of Accounts & Finance',
    badge: 'FINANCE & AUDIT',
    image: '/Aai-ji-Honey-Account.jpg',
    expertise: 'Accounting & Tax Consultant, Financial Compliance & Sustainability',
    email: 'truebaladvisors@gmail.com',
    order_num: 5,
  },
];

/**
 * Uploads a local file to Cloudinary if available, returns the Cloudinary secure URL or the original fallback
 */
const uploadToCloudinaryIfPossible = async (relativeOrFileName) => {
  try {
    const cleanName = relativeOrFileName.replace(/^\/+/, '');
    const possiblePaths = [
      path.resolve(__dirname, '../../frontend/public', cleanName),
      path.resolve(__dirname, '../uploads', cleanName),
    ];

    let foundPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return relativeOrFileName;
    }

    if (cloudinary && cloudinary.config().cloud_name) {
      const uploadRes = await cloudinary.uploader.upload(foundPath, {
        folder: 'aai-ji-honey',
        resource_type: 'image',
      });
      if (uploadRes && uploadRes.secure_url) {
        return uploadRes.secure_url;
      }
    }
  } catch (err) {
    console.warn(`⚠️ Cloudinary upload skipped for ${relativeOrFileName}:`, err.message);
  }

  return relativeOrFileName;
};

const seedInitialData = async (client) => {
  try {
    const gCheck = await client.query('SELECT COUNT(*)::int AS count FROM gallery_items');
    const tCheck = await client.query('SELECT COUNT(*)::int AS count FROM team_members');

    // 1. Seed Gallery Items (if needed)
    if (gCheck.rows[0].count < 14) {
    for (const item of INITIAL_GALLERY_ITEMS) {
      const checkRes = await client.query('SELECT id FROM gallery_items WHERE title = $1 LIMIT 1', [item.title]);
      if (checkRes.rows.length === 0) {
        console.log(`🌱 Seeding gallery item: "${item.title}"`);
        const id = crypto.randomBytes(12).toString('hex');
        const resolvedUrl = await uploadToCloudinaryIfPossible(item.src);
        await client.query(
          `INSERT INTO gallery_items (id, src, title, tag, description, order_num)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, resolvedUrl, item.title, item.tag, item.description, item.order_num]
        );
      }
    }
  }

    // 2. Seed Team Members (check per member so none are missed)
    for (const member of INITIAL_TEAM_MEMBERS) {
      const checkRes = await client.query('SELECT id FROM team_members WHERE name = $1 LIMIT 1', [member.name]);
      if (checkRes.rows.length === 0) {
        console.log(`🌱 Seeding team member: "${member.name}"`);
        const id = crypto.randomBytes(12).toString('hex');
        const resolvedUrl = await uploadToCloudinaryIfPossible(member.image);
        await client.query(
          `INSERT INTO team_members (id, name, role, badge, image, expertise, email, order_num)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, member.name, member.role, member.badge, resolvedUrl, member.expertise, member.email, member.order_num]
        );
      }
    }

    // 3. Seed Default Coupons (if table is completely empty)
    const cCheck = await client.query('SELECT COUNT(*)::int AS count FROM coupons');
    if (cCheck.rows[0].count === 0) {
      const defaultCoupons = [
        {
          code: 'AAIJI10',
          discount_percentage: 10,
          min_order_amount: 500,
          max_discount: 200,
          description: '10% OFF on all natural raw honey orders above ₹500',
        },
        {
          code: 'FARMDIRECT',
          discount_percentage: 15,
          min_order_amount: 1200,
          max_discount: 300,
          description: '15% OFF on desert apiary harvest orders above ₹1200',
        },
        {
          code: 'PUREHONEY',
          discount_percentage: 20,
          min_order_amount: 1800,
          max_discount: 400,
          description: '20% Mega Wellness Discount on orders above ₹1800',
        },
      ];

      for (const coup of defaultCoupons) {
        const id = crypto.randomBytes(12).toString('hex');
        await client.query(
          `INSERT INTO coupons (id, code, discount_percentage, min_order_amount, max_discount, description, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
          [id, coup.code, coup.discount_percentage, coup.min_order_amount, coup.max_discount, coup.description]
        );
        console.log(`🌱 Seeded default coupon: ${coup.code} (${coup.discount_percentage}%)`);
      }
    }
  } catch (err) {
    console.error('❌ Error during initial data seeding:', err.message);
  }
};

module.exports = {
  seedInitialData,
  uploadToCloudinaryIfPossible,
};
