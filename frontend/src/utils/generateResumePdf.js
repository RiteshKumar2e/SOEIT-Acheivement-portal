import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const generateResumePdf = (data) => {
    const { student, achievements, courses, internships, projects } = data;

    // Create new jsPDF instance (A4 size, portrait)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', // points are easier for precise typography
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = margin;

    const checkPageBreak = (spaceNeeded) => {
        if (cursorY + spaceNeeded > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            cursorY = margin;
        }
    };

    // --- Header (Name and Contact) ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(student.name.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 25;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const contactInfo = [];
    if (student.phone) contactInfo.push({ text: `+91-${student.phone.replace('+91-', '')}` });
    if (student.email) contactInfo.push({ text: student.email });
    if (student.linkedIn) contactInfo.push({ text: 'LinkedIn', url: student.linkedIn.startsWith('http') ? student.linkedIn : `https://${student.linkedIn}` });
    if (student.github) contactInfo.push({ text: 'GitHub', url: student.github.startsWith('http') ? student.github : `https://${student.github}` });
    if (student.portfolio) contactInfo.push({ text: 'Portfolio', url: student.portfolio.startsWith('http') ? student.portfolio : `https://${student.portfolio}` });
    
    // Draw contact info centered
    let totalContactWidth = 0;
    contactInfo.forEach((info, index) => {
        totalContactWidth += doc.getTextWidth(info.text);
        if (index < contactInfo.length - 1) totalContactWidth += doc.getTextWidth('  |  ');
    });
    
    let currentX = (pageWidth - totalContactWidth) / 2;
    contactInfo.forEach((info, index) => {
        if (info.url) {
            doc.setTextColor(17, 85, 204); // URL Blue
            if (doc.textWithLink) {
                doc.textWithLink(info.text, currentX, cursorY, { url: info.url });
            } else {
                doc.text(info.text, currentX, cursorY); // Fallback
            }
            doc.setTextColor(0, 0, 0); // Reset
        } else {
            doc.text(info.text, currentX, cursorY);
        }
        currentX += doc.getTextWidth(info.text);
        
        if (index < contactInfo.length - 1) {
            doc.text('  |  ', currentX, cursorY);
            currentX += doc.getTextWidth('  |  ');
        }
    });
    cursorY += 30;

    // --- Helper specific to ATS formatting ---
    const drawSectionHeader = (title) => {
        checkPageBreak(40);
        cursorY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title.toUpperCase(), margin, cursorY);
        cursorY += 5;
        // Line break
        doc.setLineWidth(1);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 15;
    };

    const drawRow = (leftText, rightText, isBoldLeft = true, isItalicRight = false, rightLink = null) => {
        checkPageBreak(20);
        doc.setFont('helvetica', isBoldLeft ? 'bold' : 'normal');
        doc.setFontSize(10.5);
        doc.text(leftText, margin, cursorY);

        if (rightText) {
            doc.setFont('helvetica', isItalicRight ? 'italic' : 'normal');
            if (rightLink) {
                doc.setTextColor(17, 85, 204);
                const textW = doc.getTextWidth(rightText);
                if (doc.textWithLink) {
                    doc.textWithLink(rightText, pageWidth - margin - textW, cursorY, { url: rightLink.startsWith('http') ? rightLink : `https://${rightLink}` });
                } else {
                    doc.text(rightText, pageWidth - margin, cursorY, { align: 'right' });
                }
                doc.setTextColor(0, 0, 0);
            } else {
                doc.text(rightText, pageWidth - margin, cursorY, { align: 'right' });
            }
        }
        cursorY += 14;
    };

    const drawBullet = (text) => {
        if (!text.trim()) return;
        checkPageBreak(15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(text.trim(), contentWidth - 15);
        doc.text('•', margin + 5, cursorY);
        doc.text(splitText, margin + 18, cursorY);
        cursorY += (14 * splitText.length);
    };

    // --- Career Objective ---
    if (student.bio) {
        drawSectionHeader('Career Objective');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitBio = doc.splitTextToSize(student.bio, contentWidth);
        doc.text(splitBio, margin, cursorY);
        cursorY += (14 * splitBio.length) + 10;
    }

    // --- Education ---
    drawSectionHeader('Education');
    drawRow(student.universityName || 'Arka Jain University, Jamshedpur', student.universityCgpa ? `CGPA: ${student.universityCgpa}` : '', true, false);
    // Derive batch range from student.batch
    // Formats: 'Aug-2022' (new) → 'Aug 2022 - May 2026'  |  '2022' (legacy) → 'Aug 2022 - May 2026'
    const parseBatchRange = (batch) => {
        if (!batch) return '';
        const dashIdx = batch.indexOf('-');
        if (dashIdx !== -1) {
            const mon = batch.substring(0, dashIdx); // e.g. 'Aug'
            const yr  = batch.substring(dashIdx + 1); // e.g. '2022'
            const endYr = String(parseInt(yr) + 4);
            return `${mon} ${yr} - May ${endYr}`;
        }
        // Legacy: year-only
        const yr = batch.replace(/[^0-9]/g, '').slice(0, 4);
        return yr ? `Aug ${yr} - May ${String(parseInt(yr) + 4)}` : '';
    };
    const batchRange = parseBatchRange(student.batch);
    drawRow(`Bachelor of Technology in ${student.department || 'Computer Science & Engineering'}`, batchRange, false, true);
    cursorY += 5;

    if (student.edu12thSchool) {
        drawRow(student.edu12thSchool, student.edu12thPercent ? `Percentage: ${student.edu12thPercent}` : '', true, false);
        drawRow('Senior Secondary (PCM/PCB)', student.edu12thYear || '', false, true);
        cursorY += 5;
    }

    if (student.edu10thSchool) {
        drawRow(student.edu10thSchool, student.edu10thPercent ? `Percentage: ${student.edu10thPercent}` : '', true, false);
        drawRow('Secondary Education', student.edu10thYear || '', false, true);
        cursorY += 5;
    }

    // --- Technical Skills ---
    if (student.skills) {
        drawSectionHeader('Technical Skills');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const skillLines = student.skills.split('\n').filter(s => s.trim());
        skillLines.forEach(line => {
            checkPageBreak(15);
            const parts = line.split(':');
            if (parts.length > 1) {
                doc.setFont('helvetica', 'bold');
                doc.text(`${parts[0].trim()}:`, margin, cursorY);
                const titleWidth = doc.getTextWidth(`${parts[0].trim()}: `);
                doc.setFont('helvetica', 'normal');
                doc.text(parts.slice(1).join(':').trim(), margin + titleWidth, cursorY);
            } else {
                doc.text(line.trim(), margin, cursorY);
            }
            cursorY += 16;
        });
    }

    // --- Experience / Internships ---
    if (internships && internships.length > 0) {
        drawSectionHeader('Experience');
        internships.forEach(exp => {
            const startStr = exp.start_date ? format(new Date(exp.start_date), 'MMM yyyy') : '';
            const endStr = exp.status === 'Ongoing' ? 'Present' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : '');
            
            drawRow(exp.company_name, `${startStr} - ${endStr}`, true, false);
            drawRow(exp.role, exp.location || '', false, true);
            if (exp.description) {
                exp.description.split('\n').forEach(line => drawBullet(line));
            }
            cursorY += 8;
        });
    }

    // --- Projects ---
    if (projects && projects.length > 0) {
        drawSectionHeader('Projects');
        projects.forEach(proj => {
            drawRow(`${proj.title} | ${proj.techStack || ''}`, proj.githubLink ? 'GitHub Link' : '', true, false, proj.githubLink);
            if (proj.description) {
                proj.description.split('\n').forEach(line => drawBullet(line));
            }
            cursorY += 8;
        });
    }

    // --- Achievements ---
    const legitAchievements = achievements?.filter(a => a.category !== 'Internship' && a.category !== 'Project');
    if (legitAchievements && legitAchievements.length > 0) {
        drawSectionHeader('Achievements');
        legitAchievements.forEach(ach => {
            checkPageBreak(15);
            const dateStr = ach.date ? ` (${format(new Date(ach.date), 'yyyy')})` : '';
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(`${ach.title}`, margin, cursorY);
            const titleW = doc.getTextWidth(`${ach.title} `);
            doc.setFont('helvetica', 'normal');
            
            const achText = `— ${ach.description || 'Verified Accomplishment'}${dateStr}.`;
            const splitAch = doc.splitTextToSize(achText, contentWidth - titleW);
            
            doc.text(splitAch[0], margin + titleW, cursorY);
            if (splitAch.length > 1) {
                cursorY += 14;
                doc.text(splitAch.slice(1), margin, cursorY);
                cursorY += (14 * (splitAch.length - 1));
            } else {
                cursorY += 14;
            }
            cursorY += 4;
        });
    }

    // --- Certifications & Courses ---
    if (courses && courses.length > 0) {
        drawSectionHeader('Relevant Courses & Certifications');
        courses.forEach(course => {
            checkPageBreak(15);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`• `, margin, cursorY);
            doc.setFont('helvetica', 'bold');
            doc.text(`${course.course_name}`, margin + 12, cursorY);
            const titleW = doc.getTextWidth(`${course.course_name} `);
            doc.setFont('helvetica', 'normal');
            doc.text(`— ${course.platform} (${course.status})`, margin + 12 + titleW, cursorY);
            cursorY += 16;
        });
    }

    // Save PDF natively as raw text vectors, ensuring 100% ATS score parsed text!
    doc.save(`${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
};
