// ==========================================
//  DATA.JS – All dynamic content for portfolio
//  Edit this file to update experiences & skills
// ==========================================

// ==========================================
//  EXPERIENCES
//  Add new experiences here or update endDate
//  to mark them as completed.
// ==========================================
const experiences = [
    {
        id: 'gucc',
        title: 'GUCC Cyber Security Society',
        role: 'Member',
        startDate: '2025-10-01',   // YYYY-MM-DD format
        endDate: null,            // null = ongoing, set date to end
        icon: 'fa-user-secret',
        description: 'Active member of Green University Cyber Security Society — participating in workshops, CTF culture, threat modeling, and security awareness.',
        parentClub: 'Green University Computer Club (GUCC) of Green University of Bangladesh.'
    },
    {
        id: 'bncc',
        title: 'Bangladesh National Cadet Corps (BNCC)',
        role: 'Cadet',
        startDate: '2025-08-21',
        endDate: null,
        icon: 'fa-shield-alt',
        description: 'Cadet under BNCC 51 Naval Flotilla — rigorous training in discipline, leadership, and crisis management.',
        parentClub: null
    },
    {
        id: 'certifications',
        title: 'Certifications & Achievements',
        role: 'Learner',
        startDate: '2025-06-01',
        endDate: null,
        icon: 'fa-certificate',
        description: 'Continuous learning on cybersecurity platforms.',
        certButtons: [
            {
                label: 'Codecademy',
                url: 'https://www.codecademy.com/users/Irtija.Talha/achievements',
                img: 'https://www.codecademy.com/favicon.ico'
            },
            {
                label: 'Cybrary',
                url: 'https://app.cybrary.it/browse/Irtija_talha',
                icon: 'fa-shield-alt'
            },
            {
                label: 'TryHackMe',
                url: 'https://tryhackme.com/p/irtija.talha',
                img: 'https://tryhackme.com/favicon.ico'
            }
        ]
    }
    // Add more experiences like:
    // {
    //     id: 'internship',
    //     title: 'Cybersecurity Intern',
    //     role: 'Intern',
    //     startDate: '2026-07-01',
    //     endDate: '2026-09-30',   // ended
    //     icon: 'fa-briefcase',
    //     description: 'Worked on vulnerability assessments...',
    //     parentClub: 'Some Company'
    // }
];

// ==========================================
//  SKILLS
//  Four categories – add/remove skills freely.
//  Each skill can have a custom icon (FontAwesome)
// ==========================================
const skills = {
    cyber: [
        { name: 'Penetration Testing Fundamentals', icon: 'fa-crosshairs' },
        { name: 'Offensive Security Intro', icon: 'fa-bullhorn' },
        { name: 'Defensive Security Intro', icon: 'fa-shield' },
        { name: 'Linux Basics (Ubuntu, BlackArch)', icon: 'fa-linux' },
        { name: 'Ethical Hacking Fundamentals', icon: 'fa-user-secret' },
        { name: 'Cybersecurity Ethics & Legal', icon: 'fa-balance-scale' },
        { name: 'Cybrary: Orientation & Careers in Cyber', icon: 'fa-chalkboard-user' },
        { name: 'TryHackMe: How Websites Work', icon: 'fa-flag-checkered' },
        { name: 'DNS in Detail (THM)', icon: 'fa-dns' },
        { name: 'HTTP in Detail', icon: 'fa-plug' },
        { name: 'What is Networking? (THM)', icon: 'fa-network-wired' },
        { name: 'Pentesting Fundamentals', icon: 'fa-user-ninja' },
        { name: 'Defensive Security Intro (THM)', icon: 'fa-shield-virus' },
        { name: 'Careers in Cyber (THM)', icon: 'fa-briefcase' },
        { name: 'Offensive Security Intro (THM)', icon: 'fa-arrow-trend-up' },
        { name: 'Security Tools Awareness', icon: 'fa-tools' },
        { name: 'Putting It All Together (THM)', icon: 'fa-layer-group' },
        { name: 'Networking Fundamentals', icon: 'fa-shield-alt' },
        { name: 'DNS & HTTP Fundamentals', icon: 'fa-dns' },
        { name: 'Website Architecture & Web Communication', icon: 'fa-code' }
    ],
    web: [
        { name: 'HTML5 (Semantic, Forms, Tables)', icon: 'fa-html5' },
        { name: 'CSS3 (Flex/Grid, Box Model)', icon: 'fa-css3-alt' },
        { name: 'JavaScript (Variables, Conditionals)', icon: 'fa-js' },
        { name: 'Learn HTML: Elements & Structure', icon: 'fa-code' },
        { name: 'HTML Tables & Document Standards', icon: 'fa-table' },
        { name: 'HTML Forms & Form Validation', icon: 'fa-check-circle' },
        { name: 'CSS Typography, Colors & Visual Rules', icon: 'fa-palette' },
        { name: 'CSS Box Model & Positioning', icon: 'fa-square' },
        { name: 'Front-End Development Intro', icon: 'fa-laptop' },
        { name: 'Overview of the Internet & Web Development', icon: 'fa-globe' },
        { name: 'Languages for Web Development', icon: 'fa-language' },
        { name: 'JavaScript Variables & Conditionals', icon: 'fa-js' },
        { name: 'Dog Years Project', icon: 'fa-dog' },
        { name: 'Kelvin Weather Project', icon: 'fa-temperature-high' },
        { name: 'Structured Programming (C)', icon: 'fa-code' },
        { name: 'Data Structures & Lab', icon: 'fa-database' },
        { name: 'Computational Thinking', icon: 'fa-brain' },
        { name: 'Problem Solving', icon: 'fa-puzzle-piece' }
    ],
    networking: [
        { name: 'DNS Fundamentals', icon: 'fa-dns' },
        { name: 'HTTP/HTTPS Protocol', icon: 'fa-lock' },
        { name: 'Client-Server Architecture', icon: 'fa-server' },
        { name: 'Basic Computer Networking', icon: 'fa-network-wired' },
        { name: 'Internet Protocol Fundamentals', icon: 'fa-globe' },
        { name: 'How Websites Work', icon: 'fa-question-circle' },
        { name: 'Security Principles & Best Practices', icon: 'fa-shield-alt' },
        { name: 'Client-Server Communication', icon: 'fa-sync-alt' },
        { name: 'Internet & Web Fundamentals', icon: 'fa-wifi' }
    ],
    professional: [
        { name: 'Analytical Thinking', icon: 'fa-chart-line' },
        { name: 'Complex Problem Solving', icon: 'fa-cogs' },
        { name: 'Self-Learning & Research', icon: 'fa-book' },
        { name: 'Continuous Learning Mindset', icon: 'fa-sync-alt' },
        { name: 'Technical Documentation', icon: 'fa-file-alt' },
        { name: 'Team Collaboration', icon: 'fa-users' },
        { name: 'Time Management (BNCC)', icon: 'fa-clock' },
        { name: 'Adaptability & Leadership', icon: 'fa-hand-sparkles' },
        { name: 'Technical Research', icon: 'fa-flask' },
        { name: 'Microsoft Office (Word, Excel, Sheets)', icon: 'fa-file-excel' },
        { name: 'Google Docs / Sheets', icon: 'fa-google' },
        { name: 'Logo Design (Canva)', icon: 'fa-paintbrush' },
        { name: 'Video Editing (Wondershare Filmora)', icon: 'fa-video' },
        { name: 'Git/GitHub Fundamentals', icon: 'fa-git-alt' }
    ]
};
