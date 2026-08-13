// ============================================================
//   EXPDATA.JS — Experience Data
//   Version 2.0 · Professional
//   Exposes window.experiences for dynamic rendering.
//   Edit this file to update your experience timeline.
// ============================================================

(function() {
    'use strict';

    /**
     * EXPERIENCES — Array of professional & extracurricular activities.
     * Each entry includes:
     *   - id          : Unique identifier (used for anchors).
     *   - title       : Display title (with organisation/role).
     *   - startDate   : ISO date string (YYYY-MM-DD).
     *   - endDate     : ISO date string or null (ongoing).
     *   - icon        : Font Awesome icon class (without 'fa-' prefix).
     *   - role        : Your role / position.
     *   - description : Detailed description (supports HTML).
     *   - parentClub  : Parent organisation (if applicable).
     *   - certButtons : Array of { label, url, icon } for action buttons.
     */
    const experiences = [
        {
            id: 'gucc',
            title: 'Member · GUCC Cyber Security Society',
            startDate: '2025-01-01',
            endDate: null, // ongoing
            icon: 'fa-user-secret',
            role: 'Active Member',
            description:
                'Actively participating in cybersecurity workshops, CTF competitions, and network security discussions. ' +
                'Learning the fundamentals of threat analysis, vulnerability assessment, and defensive strategies. ' +
                'Collaborating with peers on security research and practical challenges.',
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
                'Developed leadership, discipline, and teamwork through rigorous military-style training. ' +
                'Performed under pressure and learned the value of responsibility, integrity, and commitment. ' +
                'Participated in drills, parades, and leadership exercises.',
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
                'Building personal projects and portfolios to strengthen frontend development skills. ' +
                'Working with HTML, CSS, JavaScript, and modern UI frameworks to create responsive, ' +
                'accessible, and performant web experiences.',
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
    //   EXPOSE GLOBALLY
    // ============================================================

    if (typeof window !== 'undefined') {
        window.experiences = experiences;
    }

    // Optional: console log for debugging
    console.log('✅ expdata.js loaded — %d experience entries.', experiences.length);

})();
