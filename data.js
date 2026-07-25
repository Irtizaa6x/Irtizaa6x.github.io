// ============================================================
//   IRTIJA — DATA FILE
//   Version 2.1 · Complete Rewrite
//   All content data for the portfolio
//   Maintained separately for easy editing
// ============================================================

// ============================================================
//   SKILLS DATA
// ============================================================

const skills = {
    // Cybersecurity
    cyber: [
        { name: 'Threat Analysis', icon: 'fas fa-shield-alt' },
        { name: 'Vulnerability Assessment', icon: 'fas fa-search' },
        { name: 'Defensive Strategies', icon: 'fas fa-lock' },
        { name: 'Penetration Testing', icon: 'fas fa-user-secret' },
        { name: 'Incident Response', icon: 'fas fa-bolt' },
        { name: 'Network Security', icon: 'fas fa-network-wired' },
        { name: 'Cryptography', icon: 'fas fa-key' },
        { name: 'Security Auditing', icon: 'fas fa-clipboard-check' },
        { name: 'Risk Management', icon: 'fas fa-chart-line' },
        { name: 'Firewalls', icon: 'fas fa-firewall' },
        { name: 'IDS/IPS', icon: 'fas fa-bell' },
        { name: 'Malware Analysis', icon: 'fas fa-skull' },
        { name: 'Social Engineering', icon: 'fas fa-user-friends' },
    ],
    // Web Dev & Programming
    web: [
        { name: 'HTML5 & CSS3', icon: 'fab fa-html5' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Python', icon: 'fab fa-python' },
        { name: 'C Programming', icon: 'fas fa-code' },
        { name: 'Responsive Design', icon: 'fas fa-mobile-alt' },
        { name: 'React (Learning)', icon: 'fab fa-react' },
        { name: 'Node.js', icon: 'fab fa-node' },
        { name: 'Git', icon: 'fab fa-git-alt' },
        { name: 'SQL', icon: 'fas fa-database' },
        { name: 'APIs', icon: 'fas fa-plug' },
        { name: 'UI/UX Principles', icon: 'fas fa-paint-brush' },
        { name: 'Mobile-First', icon: 'fas fa-mobile' },
        { name: 'Accessibility (WCAG)', icon: 'fas fa-universal-access' },
    ],
    // Networking & Web Tech
    networking: [
        { name: 'TCP/IP Protocol Suite', icon: 'fas fa-network-wired' },
        { name: 'DNS & DHCP', icon: 'fas fa-server' },
        { name: 'Firewall Configuration', icon: 'fas fa-firewall' },
        { name: 'Cloud Computing', icon: 'fas fa-cloud' },
        { name: 'Linux Administration', icon: 'fab fa-linux' },
        { name: 'AWS (Learning)', icon: 'fab fa-aws' },
        { name: 'Ubuntu', icon: 'fab fa-ubuntu' },
        { name: 'Apache', icon: 'fas fa-server' },
        { name: 'Nginx', icon: 'fas fa-server' },
        { name: 'VLANs', icon: 'fas fa-network-wired' },
        { name: 'Subnetting', icon: 'fas fa-sitemap' },
        { name: 'VPN', icon: 'fas fa-lock' },
        { name: 'SSL/TLS', icon: 'fas fa-certificate' },
    ],
    // Professional Skills & Tools
    professional: [
        { name: 'Leadership & Team Management', icon: 'fas fa-users' },
        { name: 'Discipline & Integrity', icon: 'fas fa-shield-alt' },
        { name: 'Time Management', icon: 'fas fa-clock' },
        { name: 'Teamwork & Collaboration', icon: 'fas fa-handshake' },
        { name: 'Communication', icon: 'fas fa-comment' },
        { name: 'Critical Thinking', icon: 'fas fa-brain' },
        { name: 'Problem Solving', icon: 'fas fa-lightbulb' },
        { name: 'Adaptability', icon: 'fas fa-people-arrows' },
        { name: 'Decision Making', icon: 'fas fa-flag' },
        { name: 'Professionalism', icon: 'fas fa-briefcase' },
        { name: 'Continuous Learning', icon: 'fas fa-graduation-cap' },
        { name: 'Documentation', icon: 'fas fa-file-alt' },
    ],
};

// ============================================================
//   EXPERIENCE DATA (Activities & Leadership)
// ============================================================

const experiences = [
    {
        id: 'gucc',
        title: 'Member · GUCC Cyber Security Society',
        startDate: '2025-01-01',
        endDate: null, // ongoing
        icon: 'fa-user-secret',
        role: 'Active Member',
        description:
            'Actively participating in cybersecurity workshops, CTF competitions, and network security discussions. Learning the fundamentals of threat analysis, vulnerability assessment, and defensive strategies. Collaborating with peers on security research and practical challenges.',
        parentClub: 'Green University Cyber Security Society',
        certButtons: [
            {
                label: 'View Society',
                url: '#',
                icon: 'fas fa-external-link-alt',
            },
        ],
    },
    {
        id: 'bncc',
        title: 'Cadet · BNCC Green University Platoon',
        startDate: '2024-01-01',
        endDate: null,
        icon: 'fa-shield-alt',
        role: 'Cadet',
        description:
            'Developed leadership, discipline, and teamwork through rigorous military-style training. Performed under pressure and learned the value of responsibility, integrity, and commitment. Participated in drills, parades, and leadership exercises.',
        parentClub: 'Bangladesh National Cadet Corps (BNCC)',
        certButtons: [],
    },
    {
        id: 'webdev',
        title: 'Web Development & Projects',
        startDate: '2025-01-01',
        endDate: null,
        icon: 'fa-code',
        role: 'Developer',
        description:
            'Building personal projects and portfolios to strengthen frontend development skills. Working with HTML, CSS, JavaScript, and modern UI frameworks to create responsive, accessible, and performant web experiences.',
        parentClub: 'Self-Initiated',
        certButtons: [
            {
                label: 'View GitHub',
                url: 'https://github.com/Irtizaa6x',
                icon: 'fab fa-github',
            },
            {
                label: 'View Projects',
                url: 'projects.html',
                icon: 'fas fa-code-branch',
            },
        ],
    },
];

// ============================================================
//   EDUCATION DATA (Degrees & Academic Background)
// ============================================================

const education = [
    {
        id: 'bsc',
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'Green University of Bangladesh',
        major: 'Computer Science & Engineering (CSE)',
        gpa: '3.14',
        startYear: '2025',
        endYear: null, // ongoing
        board: null,
        note: '4th semester (Trimester) • Ongoing',
        semesters: [
            {
                name: 'Semester 250',
                courses: [
                    { code: 'CSE 100', title: 'Computational Thinking and Problem Solving', credits: 1.5, grade: 'A+',
                        gradePoint: 4.0 },
                    { code: 'CSE 101-CSE(181)', title: 'Discrete Mathematics', credits: 3, grade: 'A-', gradePoint: 3.5 },
                    { code: 'ESP 009', title: 'Academic English', credits: 0, grade: 'A', gradePoint: 3.75 },
                ],
            },
            {
                name: 'Semester 252',
                courses: [
                    { code: 'CSE 103-CSE(181)', title: 'Structured Programming', credits: 3, grade: 'C+',
                        gradePoint: 2.5 },
                    { code: 'CHE 101-CSE(181)', title: 'Chemistry', credits: 3, grade: 'B', gradePoint: 3.0 },
                    { code: 'CSE 104-CSE(181)', title: 'Structured Programming Lab', credits: 1.5, grade: 'A-',
                        gradePoint: 3.5 },
                    { code: 'ESP 101', title: 'Academic English I', credits: 3, grade: 'B-', gradePoint: 2.75 },
                    { code: 'MAT 101(V1)', title: 'Calculus for Computing', credits: 3, grade: 'C+', gradePoint: 2.5 },
                    { code: 'CHE 102-CSE(181)', title: 'Chemistry Lab', credits: 1, grade: 'A+', gradePoint: 4.0 },
                ],
            },
            {
                name: 'Semester 261',
                courses: [
                    { code: 'CSE 205 (V1)', title: 'Data Structures', credits: 3, grade: 'A-', gradePoint: 3.5 },
                    { code: 'EEE 101', title: 'Introduction to Electrical Engineering', credits: 3, grade: 'B',
                        gradePoint: 3.0 },
                    { code: 'MAT 103(V1)', title: 'Linear Algebra and Vector Analysis', credits: 3, grade: 'B',
                        gradePoint: 3.0 },
                    { code: 'CSE 206 (V1)', title: 'Data Structures Lab', credits: 1.5, grade: 'B+', gradePoint: 3.25 },
                    { code: 'PHY 101-CSE(181)', title: 'Physics I', credits: 3, grade: 'B+', gradePoint: 3.25 },
                    { code: 'EEE 102 (V1)', title: 'Introduction to Electrical Engineering Lab', credits: 1, grade: 'A+',
                        gradePoint: 4.0 },
                ],
            },
        ],
    },
    {
        id: 'hsc',
        degree: 'Higher Secondary Certificate (HSC)',
        institution: 'Giasuddin Islamic Model College',
        major: 'Science',
        gpa: '5.00',
        startYear: '2022',
        endYear: '2024',
        board: 'Dhaka',
        note: null,
        subjects: [
            { code: '101', name: 'BANGLA', grade: 'A' },
            { code: '107', name: 'ENGLISH', grade: 'A' },
            { code: '275', name: 'INFORMATION & COMMUNICATION TECHNOLOGY', grade: 'A+' },
            { code: '174', name: 'PHYSICS', grade: 'A+' },
            { code: '176', name: 'CHEMISTRY', grade: 'A+' },
            { code: '178', name: 'BIOLOGY', grade: 'A+' },
            { code: '265', name: 'HIGHER MATHEMATICS', grade: 'A+' },
        ],
    },
    {
        id: 'ssc',
        degree: 'Secondary School Certificate (SSC)',
        institution: 'Rafiqul Islam School & College',
        major: 'Science',
        gpa: '4.72',
        startYear: '2020',
        endYear: '2022',
        board: 'Dhaka',
        note: null,
        subjects: [
            { code: '101', name: 'BANGLA', grade: 'A' },
            { code: '107', name: 'ENGLISH', grade: 'A+' },
            { code: '109', name: 'MATHEMATICS', grade: 'A+' },
            { code: '150', name: 'BANGLADESH AND GLOBAL STUDIES', grade: 'B' },
            { code: '111', name: 'ISLAM AND MORAL EDUCATION', grade: 'A-' },
            { code: '136', name: 'PHYSICS', grade: 'A+' },
            { code: '137', name: 'CHEMISTRY', grade: 'A+' },
            { code: '126', name: 'HIGHER MATHEMATICS', grade: 'A+' },
            { code: '154', name: 'INFORMATION AND COMMUNICATION TECHNOLOGY', grade: 'A' },
            { code: '138', name: 'BIOLOGY', grade: 'A+' },
            { code: '147', name: 'PHYSICAL EDUCATION, HEALTH AND SPORTS', grade: 'A+' },
            { code: '156', name: 'CAREER EDUCATION', grade: 'A+' },
        ],
    },
];

// ============================================================
//   PROJECTS DATA
// ============================================================

const projects = [
    {
        id: 'portfolio-website',
        title: 'Personal Portfolio Website',
        description:
            'A fully responsive, accessible, and performant portfolio website built with HTML, CSS, and JavaScript. Features a modular architecture, dark mode, and real-time local time display.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
        image: '',
        links: {
            live: 'https://irtizaa6x.github.io',
            github: 'https://github.com/Irtizaa6x/Irtizaa6x.github.io',
        },
    },
    {
        id: 'network-scanner',
        title: 'Network Scanner Tool',
        description:
            'A Python-based network scanning tool that discovers active hosts, open ports, and services on a local network. Built for learning network security fundamentals.',
        tags: ['Python', 'Networking', 'Security'],
        image: '',
        links: {
            github: 'https://github.com/Irtizaa6x/network-scanner',
        },
    },
    // Add more projects as they are developed
];

// ============================================================
//   CERTIFICATIONS DATA — Restored with proper links
// ============================================================

const certifications = [
    {
        id: 'cybersecurity-fundamentals',
        title: 'Cybersecurity Fundamentals',
        issuer: 'Green University Cyber Security Society',
        description:
            'Exploring core cybersecurity concepts including threat analysis, vulnerability assessment, and defensive strategies. Active participation in workshops and hands-on exercises.',
        date: '2025',
        link: 'skills.html#cyber',
        ongoing: true,
    },
    {
        id: 'bncc-leadership',
        title: 'BNCC Leadership Training',
        issuer: 'Bangladesh National Cadet Corps',
        description:
            'Leadership development through military-style training. Focus on discipline, teamwork, integrity, and performing under pressure.',
        date: '2024',
        link: 'experience.html#timeline-title',
        ongoing: true,
    },
    {
        id: 'hsc-gpa-500',
        title: 'HSC GPA 5.00',
        issuer: 'Dhaka Board, Bangladesh',
        description:
            'Achieved a perfect GPA of 5.00 in the Higher Secondary Certificate examination. Recognized for outstanding academic performance.',
        date: '2024',
        link: 'education.html#hsc-details',
        ongoing: false,
    },
    {
        id: 'ssc-gpa-472',
        title: 'SSC GPA 4.72',
        issuer: 'Dhaka Board, Bangladesh',
        description:
            'Secured a GPA of 4.72 in the Secondary School Certificate examination. Demonstrated excellence in Science and Mathematics.',
        date: '2022',
        link: 'education.html#ssc-details',
        ongoing: false,
    },
];

// ============================================================
//   CONTACT INFORMATION
// ============================================================

const contact = {
    email: 'irtija.x.k6@hotmail.com',
    phonePrimary: '+8801518940566',
    phoneSecondary: '+8801886940566',
    github: 'https://github.com/Irtizaa6x',
    linkedin: 'https://linkedin.com/in/irtija-talha',
    discordUsername: 'naz.irt.k6',
    whatsapp: 'https://wa.me/qr/H3R2HPTW66G3P1',
};

// ============================================================
//   SOCIAL LINKS
// ============================================================

const socialLinks = [
    { platform: 'Facebook', url: 'https://www.facebook.com/irtija.webhop.me', icon: 'fab fa-facebook-f' },
    { platform: 'Instagram', url: 'https://www.instagram.com/7d6_nev', icon: 'fab fa-instagram' },
    { platform: 'X (Twitter)', url: 'https://www.x.com/irtijaXtalha', icon: 'fab fa-x-twitter' },
    { platform: 'Threads', url: 'https://www.threads.com/7d6_nev', icon: 'fab fa-threads' },
    { platform: 'GitHub', url: 'https://github.com/Irtizaa6x', icon: 'fab fa-github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/irtija-talha', icon: 'fab fa-linkedin-in' },
    { platform: 'WhatsApp', url: 'https://wa.me/qr/H3R2HPTW66G3P1', icon: 'fab fa-whatsapp' },
    { platform: 'Discord', url: '#', icon: 'fab fa-discord' }, // handled by copy script
];

// ============================================================
//   EXPOSE GLOBALLY (for use in other scripts)
// ============================================================

// Using `var` or `const` at top-level in a script makes them global.
// We'll ensure they are available via `window` as well (for safety).
if (typeof window !== 'undefined') {
    window.skills = skills;
    window.experiences = experiences;
    window.education = education;
    window.projects = projects;
    window.certifications = certifications;
    window.contact = contact;
    window.socialLinks = socialLinks;
}
