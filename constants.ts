import { Category, City, Job, User, UserRole } from './types';

export const APP_NAME = "Freelance Hub KZ";
export const CURRENCY_SYMBOL = "₸";

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Reels & TikTok Content Creator',
    description: 'Looking for a creative mobileographer to shoot 15 Reels/month for a coffee shop chain in Almaty. Must have iPhone 13 Pro or higher.',
    clientName: 'Coffeedose KZ',
    budget: 150000,
    currency: 'KZT',
    category: Category.MOBILE,
    city: City.ALMATY,
    postedAt: '2023-10-25',
    requiredSkills: ['CapCut', 'Trends', 'Mobileography']
  },
  {
    id: '2',
    title: 'SMM Strategy for Fashion Brand',
    description: 'Need a comprehensive SMM strategy for a local clothing brand. Target audience: women 18-35.',
    clientName: 'Qazaq Style',
    budget: 300000,
    currency: 'KZT',
    category: Category.SMM,
    city: City.ASTANA,
    postedAt: '2023-10-26',
    requiredSkills: ['Marketing', 'Copywriting', 'Targeting']
  },
  {
    id: '3',
    title: 'Corporate Website Redesign',
    description: 'Redesigning our construction company website. Need clean, modern UX/UI.',
    clientName: 'BuildStroy',
    budget: 500000,
    currency: 'KZT',
    category: Category.DESIGN,
    city: City.REMOTE,
    postedAt: '2023-10-27',
    requiredSkills: ['Figma', 'UX/UI', 'Web Design']
  },
  {
    id: '4',
    title: 'Event Videographer',
    description: 'Full day shooting for a tech conference in Shymkent.',
    clientName: 'TechHub',
    budget: 100000,
    currency: 'KZT',
    category: Category.VIDEO,
    city: City.SHYMKENT,
    postedAt: '2023-10-28',
    requiredSkills: ['Sony A7III', 'Editing', 'Color Grading']
  }
];

export const MOCK_FREELANCERS: User[] = [
  {
    id: 'f1',
    name: 'Aisulu Yerlanova',
    username: 'aisulu.design',
    email: 'aisulu@example.com',
    role: UserRole.FREELANCER,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    title: 'Senior Graphic Designer',
    bio: 'Minimalist branding & UI/UX for bold startups. \n📍 Almaty based \n✨ 5+ years experience \n🎨 Figma Master',
    city: City.ALMATY,
    rating: 4.9,
    reviewCount: 42,
    completedProjects: 158,
    skills: ['Figma', 'Illustrator', 'Branding'],
    hourlyRate: 15000,
    clients: [
        { id: 'c1', name: 'Chocofood', logo: 'https://ui-avatars.com/api/?name=Choco&background=0D8ABC&color=fff' },
        { id: 'c2', name: 'Kolesa', logo: 'https://ui-avatars.com/api/?name=Kolesa&background=eb4034&color=fff' },
        { id: 'c3', name: 'AirAstana', logo: 'https://ui-avatars.com/api/?name=Air&background=1a2b4c&color=fff' }
    ],
    portfolio: [
        { id: 'p1', type: 'image', url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 124 },
        { id: 'p2', type: 'image', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 89 },
        { id: 'p3', type: 'image', url: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 256 },
        { id: 'p4', type: 'image', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 45 },
        { id: 'p5', type: 'image', url: 'https://images.unsplash.com/photo-1626785774573-4b7993125486?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 67 },
        { id: 'p6', type: 'image', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 112 }
    ],
    reviews: [
        { id: 'r1', reviewerName: 'Murat K.', reviewerAvatar: 'https://ui-avatars.com/api/?name=MK', rating: 5, text: 'Incredible attention to detail. The branding kit she made was perfect.', date: '2 days ago' },
        { id: 'r2', reviewerName: 'Svetlana D.', reviewerAvatar: 'https://ui-avatars.com/api/?name=SD', rating: 5, text: 'Fast delivery and great communication.', date: '1 week ago' }
    ]
  },
  {
    id: 'f2',
    name: 'Timur Aliev',
    username: 'timur_cuts',
    email: 'timur@example.com',
    role: UserRole.FREELANCER,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    title: 'Mobileographer & Editor',
    bio: '🎥 Creating viral Reels/TikToks \n📱 iPhone 14 Pro Max \n🚀 Helping brands grow \n📍 Astana',
    city: City.ASTANA,
    rating: 4.7,
    reviewCount: 28,
    completedProjects: 89,
    skills: ['CapCut', 'Mobile Video', 'Transitions'],
    hourlyRate: 10000,
    clients: [
        { id: 'c4', name: 'Salam', logo: 'https://ui-avatars.com/api/?name=Salam&background=f59e0b&color=fff' },
        { id: 'c5', name: 'Burger', logo: 'https://ui-avatars.com/api/?name=Burger&background=ef4444&color=fff' }
    ],
    portfolio: [
        { id: 'p7', type: 'image', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 532 },
        { id: 'p8', type: 'image', url: 'https://images.unsplash.com/photo-1611605698389-377cbc5a64c6?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 221 },
        { id: 'p9', type: 'image', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 189 }
    ],
    reviews: [
        { id: 'r3', reviewerName: 'Arman B.', reviewerAvatar: 'https://ui-avatars.com/api/?name=AB', rating: 5, text: 'The transitions are insane! Our views went up 200%.', date: '3 days ago' }
    ]
  },
  {
    id: 'f3',
    name: 'Elena Kim',
    username: 'elena.smm.kz',
    email: 'elena@example.com',
    role: UserRole.FREELANCER,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    title: 'SMM Strategist',
    bio: '📈 Growing ROI for KZ businesses \n🎯 Target Expert \n💡 Content Strategy',
    city: City.ALMATY,
    rating: 5.0,
    reviewCount: 65,
    completedProjects: 210,
    skills: ['Facebook Ads', 'Instagram', 'Analytics'],
    hourlyRate: 20000,
    clients: [
        { id: 'c6', name: 'Beauty', logo: 'https://ui-avatars.com/api/?name=Beauty&background=ec4899&color=fff' },
        { id: 'c7', name: 'Edu', logo: 'https://ui-avatars.com/api/?name=Edu&background=3b82f6&color=fff' },
        { id: 'c8', name: 'Shop', logo: 'https://ui-avatars.com/api/?name=Shop&background=10b981&color=fff' },
        { id: 'c9', name: 'Fit', logo: 'https://ui-avatars.com/api/?name=Fit&background=6366f1&color=fff' }
    ],
    portfolio: [
        { id: 'p10', type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 340 },
        { id: 'p11', type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 110 },
        { id: 'p12', type: 'image', url: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80', thumbnail: '', likes: 205 }
    ],
    reviews: [
        { id: 'r4', reviewerName: 'Gulnara S.', reviewerAvatar: 'https://ui-avatars.com/api/?name=GS', rating: 5, text: 'Elena saved our launch. Her targeting strategy is gold.', date: '1 month ago' }
    ]
  }
];