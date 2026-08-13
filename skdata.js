// ============================================================
//   SKDATA.JS — Skills Data
//   Version 2.0 · Professional
//   Exposes window.skills for dynamic rendering.
//   Edit this file to update your skills, levels, and progress.
// ============================================================

(function() {
    'use strict';

    /**
     * SKILLS — Object containing all skill categories.
     * Each category includes:
     *   - title       : Display name of the category.
     *   - icon        : Font Awesome icon class (without 'fa-' prefix).
     *   - description : Brief description of the category.
     *   - items       : Array of { name, level, progress }.
     *        name     : Skill name.
     *        level    : 'Beginner', 'Intermediate', or 'Advanced'.
     *        progress : Percentage (0-100) for the skill bar.
     *   - tags        : Array of related keywords/tools (displayed as tags).
     */
    const skills = {
        // ----- Cybersecurity -----
        cyber: {
            title: 'Cybersecurity',
            icon: 'fa-user-secret',
            description:
                'Building foundational knowledge in threat analysis, vulnerability assessment, ' +
                'and defensive strategies. Currently exploring penetration testing and incident response.',
            items: [
                { name: 'Threat Analysis', level: 'Intermediate', progress: 70 },
                { name: 'Vulnerability Assessment', level: 'Intermediate', progress: 65 },
                { name: 'Defensive Strategies', level: 'Beginner', progress: 50 },
                { name: 'Penetration Testing', level: 'Beginner', progress: 40 },
                { name: 'Incident Response', level: 'Beginner', progress: 35 },
            ],
            tags: [
                'Network Security',
                'Cryptography',
                'Security Auditing',
                'Risk Management',
                'Firewalls',
                'IDS/IPS',
                'Malware Analysis',
                'Social Engineering',
            ],
        },

        // ----- Web Dev & Programming -----
        web: {
            title: 'Web Dev & Programming',
            icon: 'fa-code',
            description:
                'Writing clean, maintainable code in multiple languages. ' +
                'Building web interfaces with modern frameworks and following best practices ' +
                'for performance and accessibility.',
            items: [
                { name: 'HTML5 & CSS3', level: 'Advanced', progress: 85 },
                { name: 'JavaScript', level: 'Intermediate', progress: 70 },
                { name: 'Python', level: 'Intermediate', progress: 60 },
                { name: 'C Programming', level: 'Intermediate', progress: 65 },
                { name: 'Responsive Design', level: 'Advanced', progress: 80 },
            ],
            tags: [
                'React (Learning)',
                'Node.js',
                'Git',
                'SQL',
                'APIs',
                'UI/UX Principles',
                'Mobile-First',
                'Accessibility (WCAG)',
            ],
        },

        // ----- Networking & Web Technologies -----
        networking: {
            title: 'Networking & Web Technologies',
            icon: 'fa-network-wired',
            description:
                'Understanding the infrastructure that powers the internet — ' +
                'from protocols to cloud architecture. Building knowledge in network security ' +
                'and systems administration.',
            items: [
                { name: 'TCP/IP Protocol Suite', level: 'Intermediate', progress: 70 },
                { name: 'DNS & DHCP', level: 'Intermediate', progress: 65 },
                { name: 'Firewall Configuration', level: 'Beginner', progress: 45 },
                { name: 'Cloud Computing', level: 'Beginner', progress: 40 },
                { name: 'Linux Administration', level: 'Intermediate', progress: 60 },
            ],
            tags: [
                'AWS (Learning)',
                'Ubuntu',
                'Apache',
                'Nginx',
                'VLANs',
                'Subnetting',
                'VPN',
                'SSL/TLS',
            ],
        },

        // ----- Professional Skills & Tools -----
        professional: {
            title: 'Professional Skills & Tools',
            icon: 'fa-briefcase',
            description:
                'Soft skills and tools that enable effective collaboration, ' +
                'leadership, and project management in professional environments.',
            items: [
                { name: 'Leadership & Team Management', level: 'Advanced', progress: 85 },
                { name: 'Discipline & Integrity', level: 'Advanced', progress: 95 },
                { name: 'Time Management', level: 'Advanced', progress: 80 },
                { name: 'Teamwork & Collaboration', level: 'Advanced', progress: 90 },
                { name: 'Communication', level: 'Advanced', progress: 85 },
            ],
            tags: [
                'Collaboration',
                'Critical Thinking',
                'Problem Solving',
                'Adaptability',
                'Decision Making',
                'Professionalism',
                'Continuous Learning',
                'Documentation',
            ],
        },
    };

    // ============================================================
    //   EXPOSE GLOBALLY
    // ============================================================

    if (typeof window !== 'undefined') {
        window.skills = skills;
    }

    // Optional: console log for debugging
    console.log('✅ skdata.js loaded — %d skill categories.', Object.keys(skills).length);

})();
