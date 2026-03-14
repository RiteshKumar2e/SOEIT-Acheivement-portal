/**
 * Scoring logic based on ARKA JAIN UNIVERSITY Activity Points criteria.
 */

const calculatePoints = (data) => {
    const { category, level, title = '', description = '' } = data;
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();

    /**
     * Map levels to indices 1-5 (Level I - College to Level V - International)
     */
    const getLevelIndex = (lvl) => {
        if (lvl.includes('Level V')) return 5;
        if (lvl.includes('Level IV')) return 4;
        if (lvl.includes('Level III')) return 3;
        if (lvl.includes('Level II')) return 2;
        if (lvl.includes('Level I')) return 1;
        // Fallback for older strings
        if (lvl === 'International') return 5;
        if (lvl === 'National') return 4;
        if (lvl === 'State' || lvl === 'University') return 3;
        if (lvl === 'Zonal') return 2;
        if (lvl === 'College' || lvl === 'Department') return 1;
        return 1;
    };

    const idx = getLevelIndex(level);

    /**
     * Helper for winning bonuses (Sports & Cultural)
     */
    const getPrizeBonus = (lvlIdx) => {
        const isWinner = lowerTitle.includes('first') || lowerTitle.includes('1st') || lowerTitle.includes('winner');
        const isSecond = lowerTitle.includes('second') || lowerTitle.includes('2nd') || lowerTitle.includes('runner');
        const isThird = lowerTitle.includes('third') || lowerTitle.includes('3rd');

        // Level IV/V carry higher bonuses (20/16/12) vs Level I-III (10/8/5)
        if (isWinner) return lvlIdx >= 4 ? 20 : 10;
        if (isSecond) return lvlIdx >= 4 ? 16 : 8;
        if (isThird) return lvlIdx >= 4 ? 12 : 5;
        return 0;
    };

    // SECTION A (Mandatory) [1-4]
    if (category === 'Communication Skills' || lowerTitle.includes('communicative english')) return 5;
    if (category === 'Hardware Skills' || lowerTitle.includes('hardware lab')) return 5;
    if (category === 'Technical Skill Development') {
        if (lowerTitle.includes('simulation') || lowerTitle.includes('matlab') || lowerTitle.includes('cad') || lowerTitle.includes('p-spice')) return 5;
        if (lowerTitle.includes('skill development program') || lowerTitle.includes('30 hrs')) return 15;
        return 15;
    }

    // SECTION B
    switch (category) {
        case 'National Initiatives': // Sl No 5: NSS/NCC
            if (lowerTitle.includes('nss') || lowerTitle.includes('ncc')) {
                let pts = 60;
                if (lowerTitle.includes('certificate c') || lowerTitle.includes('outstanding')) pts += 20;
                if (lowerTitle.includes('integration camp') || lowerTitle.includes('pre republic') || lowerTitle.includes('south india')) pts += 10;
                if (lowerTitle.includes('republic day parade') || lowerTitle.includes('youth exchange')) pts += 20;
                return Math.min(pts, 80);
            }
            return 60;

        case 'Sports & Games': { // Sl No 6-7
            const base = { 1: 8, 2: 15, 3: 25, 4: 40, 5: 60 }[idx] || 8;
            const bonus = getPrizeBonus(idx);
            return Math.min(base + bonus, idx >= 4 ? 80 : 60);
        }

        case 'Cultural Activities': { // Sl No 8-10
            const base = { 1: 8, 2: 12, 3: 20, 4: 40, 5: 60 }[idx] || 8;
            const bonus = getPrizeBonus(idx);
            return Math.min(base + bonus, idx >= 4 ? 80 : 60);
        }

        case 'Leadership & Management': { // Sl No 11-15
            if (lowerTitle.includes('chairman')) return 30;
            if (lowerTitle.includes('secretary') || lowerTitle.includes('editor')) return 25;
            if (lowerTitle.includes('core coordinator')) return 15;
            if (lowerTitle.includes('sub coordinator')) return 10;
            if (lowerTitle.includes('member') || lowerTitle.includes('board') || lowerTitle.includes('senate')) return 15;
            if (lowerTitle.includes('class representative') || lowerTitle.includes('representative')) return 10;
            return 5; // Volunteer
        }

        case 'Professional Self Initiatives': {
            // Sl No 16: Tech Fests and Tech Quiz
            if (lowerTitle.includes('fest') || lowerTitle.includes('quiz')) {
                return { 1: 10, 2: 20, 3: 30, 4: 40, 5: 50 }[idx] || 10;
            }
            // Sl No 17: MOOC
            if (lowerTitle.includes('mooc') || lowerTitle.includes('nptel') || lowerTitle.includes('coursera')) return 50;
            // Sl No 18: Foreign Language
            if (lowerTitle.includes('toefl') || lowerTitle.includes('ielts') || lowerTitle.includes('language') || lowerTitle.includes('bec')) return 50;
            // Sl No 19: Professional Societies
            if (lowerTitle.includes('society') || lowerTitle.includes('ieee') || lowerTitle.includes('asme')) {
                return { 1: 10, 2: 15, 3: 20, 4: 30, 5: 40 }[idx] || 10;
            }
            // Sl No 20: Conference at IITs/NITs
            if (lowerTitle.includes('iit') || lowerTitle.includes('nit')) {
                if (lowerTitle.includes('conference') || lowerTitle.includes('seminar') || lowerTitle.includes('webinar') || lowerTitle.includes('workshop')) return 15;
                // Sl No 21-22: Paper/Poster at IIT/NIT
                if (lowerTitle.includes('paper')) return (lowerTitle.includes('best') || lowerDesc.includes('recognition')) ? 30 : 20;
                if (lowerTitle.includes('poster')) return (lowerTitle.includes('best') || lowerDesc.includes('recognition')) ? 20 : 10;
            }
            // Sl No 23-24: Paper/Poster (Other Institutions)
            if (lowerTitle.includes('paper')) return (lowerTitle.includes('best') || lowerDesc.includes('recognition')) ? 10 : 8;
            if (lowerTitle.includes('poster')) return (lowerTitle.includes('best') || lowerDesc.includes('recognition')) ? 6 : 4;
            // Sl No 25: Internship
            if (lowerTitle.includes('internship') || lowerTitle.includes('training')) return 20;
            // Sl No 26: Visits
            if (lowerTitle.includes('visit') || lowerTitle.includes('exhibition')) return 5;
            return 10;
        }

        case 'Entrepreneurship': { // Sl No 27-36
            if (lowerTitle.includes('startup registered') || lowerTitle.includes('start-up registered')) return 60;
            if (lowerTitle.includes('patent')) {
                if (lowerTitle.includes('licensed')) return 80;
                if (lowerTitle.includes('approved')) return 50;
                if (lowerTitle.includes('published')) return 35;
                return 30; // Filed
            }
            if (lowerTitle.includes('venture') || lowerTitle.includes('funding')) return 80;
            if (lowerTitle.includes('startup employment')) return 80;
            if (lowerTitle.includes('prototype') || lowerTitle.includes('award')) return 60;
            if (lowerTitle.includes('innovative technology') || lowerTitle.includes('innovations')) return 60;
            if (lowerTitle.includes('societal innovations')) return 50;
            return 60;
        }

        case 'Community Outreach Activities': { // Sl No 38
            if (lowerTitle.includes('2 week')) return 20;
            if (lowerTitle.includes('1 week')) return 10;
            return 10;
        }

        default:
            return 10;
    }
};

module.exports = { calculatePoints };
