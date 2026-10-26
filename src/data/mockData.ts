import { 
  User, 
  Post, 
  Story, 
  Clip, 
  Conversation, 
  NotificationItem, 
  Message,
  LiveStream,
  ReportTicket,
  SavedCollection,
  DraftPost
} from '../types';

export const CURRENT_USER: User = {
  id: 'user_me',
  name: 'Alex Vance',
  handle: 'alexvance',
  email: 'alex.vance@qevora.network',
  isEmailVerified: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Product designer & creative technologist crafting visual social experiences on Qevora. Building with blue & white precision. ☕️ Seattle & SF.',
  location: 'San Francisco, CA',
  website: 'https://alexvance.design',
  joinedDate: 'Joined March 2024',
  followersCount: 1420,
  followingCount: 388,
  postsCount: 24,
  verified: true,
  isPrivate: false,
  role: 'user',
  sensitiveContentFilter: 'standard',
  notificationSettings: {
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    live: true,
  },
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    handle: 'elenarostova',
    email: 'elena@rostova.photo',
    isEmailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Landscape & drone photographer capturing wild coastlines & light. Leica ambassador. Prints available worldwide.',
    location: 'Lisbon, Portugal',
    website: 'https://elenarostova.photo',
    joinedDate: 'Joined January 2024',
    followersCount: 14800,
    followingCount: 512,
    postsCount: 182,
    verified: true,
    isPrivate: false,
    role: 'user',
  },
  {
    id: 'user_marcus',
    name: 'Marcus Chen',
    handle: 'marcuschen',
    email: 'marcus@chen.arch',
    isEmailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Architectural designer & minimalist spaces curator. Tokyo & Copenhagen. Less, but better.',
    location: 'Tokyo, Japan',
    website: 'https://marcuschen.studio',
    joinedDate: 'Joined February 2024',
    followersCount: 8920,
    followingCount: 420,
    postsCount: 94,
    verified: true,
    isPrivate: false,
    role: 'user',
  },
  {
    id: 'user_sophia',
    name: 'Sophia Patel',
    handle: 'sophiapatel',
    email: 'sophia@patel.coffee',
    isEmailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialty coffee brewer & morning journal author. Slow living advocate in the Pacific Northwest.',
    location: 'Seattle, WA',
    website: 'https://sophiapatel.blog',
    joinedDate: 'Joined April 2024',
    followersCount: 5410,
    followingCount: 630,
    postsCount: 115,
    verified: false,
    isPrivate: false,
    role: 'user',
  },
  {
    id: 'user_leo',
    name: 'Leo Nakamura',
    handle: 'leonakamura',
    email: 'leo@neonshibuya.film',
    isEmailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Skate videographer & street photographer. Neon night hunter in Shibuya.',
    location: 'Tokyo, Japan',
    website: 'https://neonshibuya.film',
    joinedDate: 'Joined December 2023',
    followersCount: 22100,
    followingCount: 290,
    postsCount: 340,
    verified: true,
    isPrivate: false,
    role: 'user',
  },
  {
    id: 'user_maya',
    name: 'Maya Lin',
    handle: 'mayalin_tech',
    email: 'maya@lin.design',
    isEmailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'AI researcher & front-end architect. Exploring accessible design systems and generative layouts.',
    location: 'Austin, TX',
    joinedDate: 'Joined May 2024',
    followersCount: 3120,
    followingCount: 180,
    postsCount: 45,
    verified: false,
    isPrivate: false,
    role: 'user',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_elena',
    user: MOCK_USERS[1],
    content: 'Crisp morning over the Sardinian cliffs. The swell was unusually quiet at dawn, giving this crystal turquoise water its mirror texture. What is your favourite quiet coastal spot to reset?',
    mediaUrl: '/src/assets/images/post_aerial_coast_1792946122681.jpg',
    mediaUrls: [
      '/src/assets/images/post_aerial_coast_1792946122681.jpg',
      '/src/assets/images/post_minimal_interior_1792946123767.jpg',
    ],
    mediaType: 'image',
    location: 'Cala Goloritzé, Sardinia, Italy',
    createdAt: '22m ago',
    likesCount: 342,
    commentsCount: 18,
    sharesCount: 12,
    bookmarksCount: 45,
    isLiked: false,
    isBookmarked: false,
    isPinned: true,
    tags: ['photography', 'coastline', 'aerial', 'travel'],
    privacy: 'public',
    comments: [
      {
        id: 'c1',
        postId: 'post_1',
        userId: 'user_marcus',
        user: MOCK_USERS[2],
        content: 'The gradient of that water is surreal Elena! Incredible composition.',
        createdAt: '15m ago',
        likesCount: 12,
        isLiked: false,
        replies: [
          {
            id: 'r1',
            commentId: 'c1',
            userId: 'user_elena',
            user: MOCK_USERS[1],
            content: 'Thank you Marcus! The morning light lasted barely 20 minutes before high mist rolled in.',
            createdAt: '10m ago',
            likesCount: 4,
            isLiked: false,
          }
        ]
      },
      {
        id: 'c2',
        postId: 'post_1',
        userId: 'user_me',
        user: CURRENT_USER,
        content: 'Added to my travel dream board right away.',
        createdAt: '5m ago',
        likesCount: 3,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'user_marcus',
    user: MOCK_USERS[2],
    content: 'Sunday morning light study in our newly completed studio loft. Oakwood joinery paired with soft natural linen and a healthy monstera to anchor the corner. Simplicity brings true focus.',
    mediaUrl: '/src/assets/images/post_minimal_interior_1792946123767.jpg',
    mediaType: 'image',
    location: 'Minato City, Tokyo, Japan',
    createdAt: '2h ago',
    likesCount: 512,
    commentsCount: 24,
    sharesCount: 38,
    bookmarksCount: 120,
    isLiked: true,
    isBookmarked: true,
    tags: ['architecture', 'interior', 'minimalism', 'design'],
    privacy: 'public',
    comments: [
      {
        id: 'c3',
        postId: 'post_2',
        userId: 'user_sophia',
        user: MOCK_USERS[3],
        content: 'That morning sunbeam angle is absolute perfection.',
        createdAt: '1h ago',
        likesCount: 8,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'user_sophia',
    user: MOCK_USERS[3],
    content: 'Notes from today’s Ethiopian Yirgacheffe pour-over: notes of bergamot, honeysuckle, and wild peach. Taking time to slow down and write before diving into the work week.',
    mediaUrl: '/src/assets/images/post_coffee_latte_1792946124419.jpg',
    mediaType: 'image',
    location: 'Capitol Hill, Seattle, WA',
    createdAt: '4h ago',
    likesCount: 289,
    commentsCount: 9,
    sharesCount: 6,
    bookmarksCount: 33,
    isLiked: false,
    isBookmarked: false,
    tags: ['coffee', 'journaling', 'mindfulness', 'slowliving'],
    privacy: 'public',
    comments: [
      {
        id: 'c4',
        postId: 'post_3',
        userId: 'user_leo',
        user: MOCK_USERS[4],
        content: 'That latte foam swan is pure artwork!',
        createdAt: '3h ago',
        likesCount: 4,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 'post_4',
    userId: 'user_me',
    user: CURRENT_USER,
    content: 'Excited to showcase the newly refined Qevora social architecture! Built with high-contrast accessibility, zero-pill typography, and multi-device fluidity. Let me know what you think of the new layout.',
    mediaUrl: '/src/assets/images/post_minimal_interior_1792946123767.jpg',
    mediaType: 'image',
    location: 'Design Lab, San Francisco',
    createdAt: '5h ago',
    likesCount: 89,
    commentsCount: 7,
    sharesCount: 14,
    bookmarksCount: 28,
    isLiked: true,
    isBookmarked: false,
    isPinned: true,
    tags: ['designsystems', 'qevora', 'community', 'ux'],
    privacy: 'public',
    comments: [
      {
        id: 'c5',
        postId: 'post_4',
        userId: 'user_maya',
        user: MOCK_USERS[5],
        content: 'The blue and white contrast hierarchy is so sharp and readable!',
        createdAt: '4h ago',
        likesCount: 6,
        isLiked: false,
        replies: []
      }
    ]
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_elena',
    userId: 'user_elena',
    user: MOCK_USERS[1],
    mediaUrl: '/src/assets/images/post_aerial_coast_1792946122681.jpg',
    caption: 'Sunrise cliff expedition 🌊',
    createdAt: '30m ago',
    expiresIn: '23h left',
    isViewed: false,
    duration: 5,
    privacy: 'public',
    viewers: [CURRENT_USER, MOCK_USERS[2], MOCK_USERS[3]],
  },
  {
    id: 'story_marcus',
    userId: 'user_marcus',
    user: MOCK_USERS[2],
    mediaUrl: '/src/assets/images/post_minimal_interior_1792946123767.jpg',
    caption: 'Studio details in the sun ☀️',
    createdAt: '2h ago',
    expiresIn: '22h left',
    isViewed: false,
    duration: 5,
    privacy: 'public',
    viewers: [CURRENT_USER, MOCK_USERS[4]],
  },
  {
    id: 'story_sophia',
    userId: 'user_sophia',
    user: MOCK_USERS[3],
    mediaUrl: '/src/assets/images/post_coffee_latte_1792946124419.jpg',
    caption: 'First cup of Sunday ☕️',
    createdAt: '3h ago',
    expiresIn: '21h left',
    isViewed: true,
    duration: 5,
    privacy: 'close_friends',
    viewers: [CURRENT_USER, MOCK_USERS[1]],
  },
  {
    id: 'story_leo',
    userId: 'user_leo',
    user: MOCK_USERS[4],
    mediaUrl: '/src/assets/images/clip_city_lights_1792946124988.jpg',
    caption: 'Rainy Shibuya night patrol 🌧️',
    createdAt: '4h ago',
    expiresIn: '20h left',
    isViewed: true,
    duration: 5,
    privacy: 'public',
    viewers: [CURRENT_USER],
  }
];

export const INITIAL_CLIPS: Clip[] = [
  {
    id: 'clip_1',
    userId: 'user_leo',
    user: MOCK_USERS[4],
    videoUrl: '/src/assets/images/clip_city_lights_1792946124988.jpg',
    caption: 'Dusk reflections across Shibuya crossing under a gentle autumn drizzle. The city pulses differently after hours.',
    soundTitle: 'City Lights (Lofi Remix) - Tokyo Beats',
    likesCount: 14200,
    commentsCount: 382,
    sharesCount: 1205,
    isLiked: true,
    isBookmarked: false,
    tags: ['tokyo', 'cyberpunk', 'cinematic', 'rain'],
  },
  {
    id: 'clip_2',
    userId: 'user_leo',
    user: MOCK_USERS[4],
    videoUrl: '/src/assets/images/clip_skate_action_1792946125058.jpg',
    caption: 'Dialing in high kickflips at Venice Beach bowl right as the golden hour hit. Keep pushing!',
    soundTitle: 'Sunset Shredder - Skate Culture Vol. 3',
    likesCount: 9840,
    commentsCount: 194,
    sharesCount: 420,
    isLiked: false,
    isBookmarked: true,
    tags: ['skateboarding', 'goldenhour', 'action', 'venice'],
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_elena',
    participant: MOCK_USERS[1],
    unreadCount: 1,
    isOnline: true,
    lastActive: 'Active now',
    lastMessage: {
      id: 'm1',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      text: 'Hey Alex! Did you get a chance to see that Sardinian drone footage I sent over?',
      createdAt: '12m ago',
      isRead: false,
    }
  },
  {
    id: 'conv_group_creatives',
    participant: MOCK_USERS[2],
    isGroup: true,
    groupName: 'Qevora Designers & Creators',
    groupMembers: [CURRENT_USER, MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[5]],
    unreadCount: 0,
    isOnline: true,
    lastActive: 'Active now',
    lastMessage: {
      id: 'm_grp',
      conversationId: 'conv_group_creatives',
      senderId: 'user_marcus',
      text: 'Let’s sync on the new photography presets collection tomorrow!',
      createdAt: '45m ago',
      isRead: true,
    }
  },
  {
    id: 'conv_marcus',
    participant: MOCK_USERS[2],
    unreadCount: 0,
    isOnline: false,
    lastActive: '2h ago',
    lastMessage: {
      id: 'm2',
      conversationId: 'conv_marcus',
      senderId: 'user_me',
      text: 'Thanks for the interior recommendations Marcus, the lighting turned out great.',
      createdAt: '2h ago',
      isRead: true,
    }
  },
  {
    id: 'conv_sophia',
    participant: MOCK_USERS[3],
    unreadCount: 0,
    isOnline: true,
    lastActive: 'Active now',
    lastMessage: {
      id: 'm3',
      conversationId: 'conv_sophia',
      senderId: 'user_sophia',
      text: 'Let’s definitely grab a coffee next time you’re in Seattle!',
      createdAt: 'Yesterday',
      isRead: true,
    }
  },
  {
    id: 'conv_request_maya',
    participant: MOCK_USERS[5],
    unreadCount: 1,
    isOnline: true,
    isRequest: true, // Message requests tab
    lastActive: 'Active now',
    lastMessage: {
      id: 'm_req',
      conversationId: 'conv_request_maya',
      senderId: 'user_maya',
      text: 'Hi Alex! Loved your post on accessible contrast tokens. Would love to collaborate on open-source.',
      createdAt: '3h ago',
      isRead: false,
    }
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_elena: [
    {
      id: 'm_e1',
      conversationId: 'conv_elena',
      senderId: 'user_me',
      text: 'Elena, your coastal landscape collection on Qevora is mind-blowing!',
      createdAt: '10:14 AM',
      isRead: true,
    },
    {
      id: 'm_e2',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      text: 'Thank you so much Alex! It was an early 5 AM climb up the cliffs, totally worth the fog clearing up.',
      createdAt: '10:18 AM',
      isRead: true,
      reaction: '❤️',
    },
    {
      id: 'm_e3',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      text: 'Hey Alex! Did you get a chance to see that Sardinian drone footage I sent over?',
      createdAt: '10:24 AM',
      isRead: false,
    }
  ],
  conv_group_creatives: [
    {
      id: 'mg1',
      conversationId: 'conv_group_creatives',
      senderId: 'user_elena',
      text: 'Welcome everyone to the Qevora creator circle! Excited to share our work.',
      createdAt: '9:00 AM',
      isRead: true,
    },
    {
      id: 'mg2',
      conversationId: 'conv_group_creatives',
      senderId: 'user_me',
      text: 'Stoked to be here! The new multi-photo carousel support on Qevora looks awesome.',
      createdAt: '9:15 AM',
      isRead: true,
    },
    {
      id: 'mg3',
      conversationId: 'conv_group_creatives',
      senderId: 'user_marcus',
      text: 'Let’s sync on the new photography presets collection tomorrow!',
      createdAt: '10:00 AM',
      isRead: true,
    }
  ],
  conv_marcus: [
    {
      id: 'm_m1',
      conversationId: 'conv_marcus',
      senderId: 'user_marcus',
      text: 'Here are the floorplan sketches for the minimalist studio layout.',
      createdAt: 'Yesterday',
      isRead: true,
    },
    {
      id: 'm_m2',
      conversationId: 'conv_marcus',
      senderId: 'user_me',
      text: 'Thanks for the interior recommendations Marcus, the lighting turned out great.',
      createdAt: 'Yesterday',
      isRead: true,
    }
  ],
  conv_sophia: [
    {
      id: 'm_s1',
      conversationId: 'conv_sophia',
      senderId: 'user_sophia',
      text: 'Have you tried natural processed Geisha beans from Panama yet?',
      createdAt: 'Oct 23',
      isRead: true,
    },
    {
      id: 'm_s2',
      conversationId: 'conv_sophia',
      senderId: 'user_me',
      text: 'Not yet! Where did you get yours?',
      createdAt: 'Oct 23',
      isRead: true,
    },
    {
      id: 'm_s3',
      conversationId: 'conv_sophia',
      senderId: 'user_sophia',
      text: 'Let’s definitely grab a coffee next time you’re in Seattle!',
      createdAt: 'Oct 23',
      isRead: true,
    }
  ],
  conv_request_maya: [
    {
      id: 'm_req',
      conversationId: 'conv_request_maya',
      senderId: 'user_maya',
      text: 'Hi Alex! Loved your post on accessible contrast tokens. Would love to collaborate on open-source.',
      createdAt: '3h ago',
      isRead: false,
    }
  ]
};

export const INITIAL_LIVE_STREAMS: LiveStream[] = [
  {
    id: 'live_elena',
    hostUser: MOCK_USERS[1],
    title: 'Live Drone Flight & Sunset Grading from Sintra Coast',
    category: 'Photography & Filmmaking',
    viewerCount: 1420,
    isLive: true,
    coverImage: '/src/assets/images/post_aerial_coast_1792946122681.jpg',
    chatMessages: [
      { id: 'l1', user: MOCK_USERS[2], text: 'That ocean gradient looks unbelievable!', timestamp: '2s ago' },
      { id: 'l2', user: MOCK_USERS[3], text: 'What ND filter are you running on the Mavic?', timestamp: '5s ago' },
      { id: 'l3', user: MOCK_USERS[4], text: 'Greeting from Tokyo Elena! 🙌', timestamp: '9s ago' },
    ]
  },
  {
    id: 'live_marcus_scheduled',
    hostUser: MOCK_USERS[2],
    title: 'Architectural Joinery & Daylight Design Live Q&A',
    category: 'Design & Architecture',
    viewerCount: 0,
    isLive: false,
    scheduledFor: 'Today at 6:00 PM PST',
    coverImage: '/src/assets/images/post_minimal_interior_1792946123767.jpg',
    chatMessages: []
  },
  {
    id: 'live_sophia_scheduled',
    hostUser: MOCK_USERS[3],
    title: 'Pour-Over Sensory Analysis & Tasting Notes',
    category: 'Lifestyle & Culinary',
    viewerCount: 0,
    isLive: false,
    scheduledFor: 'Tomorrow at 10:00 AM PST',
    coverImage: '/src/assets/images/post_coffee_latte_1792946124419.jpg',
    chatMessages: []
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    user: MOCK_USERS[1],
    postId: 'post_1',
    postSnippet: 'Sunday morning light study in our newly completed...',
    createdAt: '10m ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'comment',
    user: MOCK_USERS[2],
    postId: 'post_1',
    postSnippet: 'The gradient of that water is surreal Elena!',
    createdAt: '35m ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'follow',
    user: MOCK_USERS[4],
    createdAt: '2h ago',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'mention',
    user: MOCK_USERS[5],
    postId: 'post_4',
    postSnippet: '...collaborating with @alexvance on accessible color...',
    createdAt: '5h ago',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'live',
    user: MOCK_USERS[1],
    postSnippet: 'Elena Rostova started a live stream: "Live Drone Flight..."',
    createdAt: '15m ago',
    isRead: false,
  }
];

export const INITIAL_REPORTS: ReportTicket[] = [
  {
    id: 'REP-1024',
    targetType: 'post',
    targetId: 'post_spam_sample',
    targetTitle: 'Suspicious crypto giveaway link posted in feed',
    reportedBy: 'user_marcus',
    reason: 'Spam or scam',
    details: 'Spam promotional link soliciting crypto wallet connections.',
    status: 'pending',
    createdAt: '1h ago',
  },
  {
    id: 'REP-1025',
    targetType: 'comment',
    targetId: 'comm_offensive_sample',
    targetTitle: 'Abusive language on street photography post',
    reportedBy: 'user_sophia',
    reason: 'Harassment or hate speech',
    details: 'Targeted insulting remarks towards creator.',
    status: 'pending',
    createdAt: '3h ago',
  },
  {
    id: 'REP-1022',
    targetType: 'user',
    targetId: 'bot_impersonator',
    targetTitle: 'Fake duplicate account pretending to be Elena Rostova',
    reportedBy: 'user_elena',
    reason: 'Intellectual property violation',
    details: 'Copied profile pictures and bio verbatim.',
    status: 'resolved',
    createdAt: 'Yesterday',
  }
];

export const INITIAL_SAVED_COLLECTIONS: SavedCollection[] = [
  {
    id: 'col_1',
    name: 'Coastlines & Horizons',
    coverUrl: '/src/assets/images/post_aerial_coast_1792946122681.jpg',
    postIds: ['post_1'],
  },
  {
    id: 'col_2',
    name: 'Nordic Spaces',
    coverUrl: '/src/assets/images/post_minimal_interior_1792946123767.jpg',
    postIds: ['post_2'],
  },
  {
    id: 'col_3',
    name: 'Coffee Culture',
    coverUrl: '/src/assets/images/post_coffee_latte_1792946124419.jpg',
    postIds: ['post_3'],
  }
];

export const INITIAL_DRAFTS: DraftPost[] = [
  {
    id: 'draft_1',
    content: 'Draft notes on architectural framing and soft natural lighting in coastal houses.',
    mediaUrls: ['/src/assets/images/post_minimal_interior_1792946123767.jpg'],
    tags: ['architecture', 'draft'],
    location: 'Lisbon, Portugal',
    savedAt: 'Yesterday',
  }
];

export const TRENDING_TOPICS = [
  { tag: '#QevoraLaunch', postsCount: '24.8K', category: 'Community' },
  { tag: '#CleanArchitecture', postsCount: '18.2K', category: 'Design' },
  { tag: '#DronePhotography', postsCount: '12.5K', category: 'Visual Arts' },
  { tag: '#NordicInteriors', postsCount: '9.4K', category: 'Living' },
  { tag: '#TokyoRain', postsCount: '7.1K', category: 'Travel' },
  { tag: '#SlowLiving', postsCount: '6.3K', category: 'Mindfulness' },
];
