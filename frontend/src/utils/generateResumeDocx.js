import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, TabStopType, TabStopPosition, UnderlineType, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const generateResumeDocx = async (data) => {
    const { student, achievements, courses, internships, projects } = data;

    const createContactInfo = () => {
        const formatUrl = (url) => url.startsWith('http') ? url : `https://${url}`;

        const children = [];
        const addSeparator = () => {
            if (children.length > 0) {
                children.push(new TextRun({ text: "  |  ", size: 20, font: "Calibri", color: "000000" }));
            }
        };

        if (student.phone) {
            addSeparator();
            children.push(new TextRun({ text: `+91-${student.phone.replace('+91-', '')}`, size: 20, font: "Calibri", color: "000000" }));
        }
        if (student.email) {
            addSeparator();
            children.push(new TextRun({ text: student.email, size: 20, font: "Calibri", color: "000000" }));
        }
        if (student.linkedIn) {
            addSeparator();
            children.push(new ExternalHyperlink({
                children: [new TextRun({ text: "LinkedIn", size: 20, font: "Calibri", color: "1155cc", underline: { type: UnderlineType.SINGLE, color: "1155cc" } })],
                link: formatUrl(student.linkedIn),
            }));
        }
        if (student.github) {
            addSeparator();
            children.push(new ExternalHyperlink({
                children: [new TextRun({ text: "GitHub", size: 20, font: "Calibri", color: "1155cc", underline: { type: UnderlineType.SINGLE, color: "1155cc" } })],
                link: formatUrl(student.github),
            }));
        }
        if (student.portfolio) {
            addSeparator();
            children.push(new ExternalHyperlink({
                children: [new TextRun({ text: "Portfolio", size: 20, font: "Calibri", color: "1155cc", underline: { type: UnderlineType.SINGLE, color: "1155cc" } })],
                link: formatUrl(student.portfolio),
            }));
        }

        return new Paragraph({
            alignment: AlignmentType.CENTER,
            children: children,
            spacing: { after: 150 },
        });
    };

    const sections = [];

    // Header
    sections.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: student.name,
                    size: 48, // 24pt
                    bold: true,
                    font: "Calibri"
                })
            ],
            spacing: { after: 50 },
        }),
        createContactInfo()
    );

    const createSectionHeader = (title) => {
        return new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
                new TextRun({
                    text: title,
                    size: 24,
                    bold: true,
                    font: "Calibri",
                })
            ],
            border: {
                bottom: {
                    color: "000000",
                    space: 1,
                    value: BorderStyle.SINGLE,
                    size: 4,
                },
            },
            spacing: { before: 180, after: 120 }
        });
    };

    const createRow = (leftText, rightText, boldLeft = false, italicLeft = false, boldRight = false, italicRight = false, rightLink = null) => {
        const formatUrl = (url) => url.startsWith('http') ? url : `https://${url}`;
        
        const rightChildren = [];
        if (rightLink) {
            rightChildren.push(new ExternalHyperlink({
                children: [new TextRun({ text: `\t${rightText}`, bold: boldRight, italics: italicRight, size: 21, font: "Calibri", color: "1155cc", underline: { type: UnderlineType.SINGLE, color: "1155cc" } })],
                link: formatUrl(rightLink),
            }));
        } else {
            rightChildren.push(new TextRun({ text: `\t${rightText}`, bold: boldRight, italics: italicRight, size: 21, font: "Calibri" }));
        }

        return new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: 9500 }],
            children: [
                new TextRun({ text: leftText, bold: boldLeft, italics: italicLeft, size: 21, font: "Calibri" }),
                ...rightChildren
            ],
            spacing: { before: 40, after: 40 }
        });
    };

    const createBulletPoint = (text, isSubBullet = false) => {
        return new Paragraph({
            children: [
                new TextRun({ 
                    text: isSubBullet ? `◦  ${text}` : `–  ${text}`, 
                    size: 20, 
                    font: "Calibri" 
                })
            ],
            indent: { left: isSubBullet ? 720 : 360 },
            spacing: { before: 30, after: 30 }
        });
    };

    // Career Objective Section
    if (student.bio) {
        sections.push(
            createSectionHeader("Career Objective"),
            new Paragraph({
                children: [
                    new TextRun({
                        text: student.bio,
                        size: 20,
                        font: "Calibri"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 100 }
            })
        );
    }

    // Education Section
    sections.push(createSectionHeader("Education"));
    
    // Derive batch range from student.batch
    // Formats: 'Aug-2022' (new) → 'Aug. 2022 – May 2026'  |  '2022' (legacy) → 'Aug. 2022 – May 2026'
    const parseBatchRange = (batch) => {
        if (!batch) return '';
        const dashIdx = batch.indexOf('-');
        if (dashIdx !== -1) {
            const mon = batch.substring(0, dashIdx); // e.g. 'Aug'
            const yr  = batch.substring(dashIdx + 1); // e.g. '2022'
            const endYr = String(parseInt(yr) + 4);
            return `${mon}. ${yr} \u2013 May ${endYr}`;
        }
        // Legacy: year-only
        const yr = batch.replace(/[^0-9]/g, '').slice(0, 4);
        return yr ? `Aug. ${yr} \u2013 May ${String(parseInt(yr) + 4)}` : '';
    };
    const batchRange = parseBatchRange(student.batch);
    sections.push(createRow(
        student.universityName || 'Arka Jain University, Jamshedpur', 
        student.universityCgpa ? `CGPA: ${student.universityCgpa}` : 'Arka Jain University',
        true, false, false, false
    ));
    sections.push(createRow(
        `Bachelor of Technology in ${student.department || 'Computer Science & Engineering'}`, 
        batchRange,
        false, true, false, false
    ));
    
    // 12th
    if (student.edu12thSchool) {
        sections.push(createRow(
            student.edu12thSchool,
            student.edu12thPercent ? `Percentage: ${student.edu12thPercent}` : '',
            true, false, false, false
        ));
        sections.push(createRow(
            'Senior Secondary (PCM/PCB)',
            student.edu12thYear || '',
            false, true, false, false
        ));
    }

    // 10th
    if (student.edu10thSchool) {
        sections.push(createRow(
            student.edu10thSchool,
            student.edu10thPercent ? `Percentage: ${student.edu10thPercent}` : '',
            true, false, false, false
        ));
        sections.push(createRow(
            'Secondary Education',
            student.edu10thYear || '',
            false, true, false, false
        ));
    }

    // Technical Skills
    if (student.skills) {
        sections.push(createSectionHeader("Technical Skills"));
        const skillLines = student.skills.split('\n').filter(s => s.trim());
        skillLines.forEach(line => {
            const parts = line.split(':');
            if (parts.length > 1) {
                sections.push(new Paragraph({
                    children: [
                        new TextRun({ text: `${parts[0].trim()}: `, bold: true, size: 21, font: "Calibri" }),
                        new TextRun({ text: parts.slice(1).join(':').trim(), size: 21, font: "Calibri" })
                    ],
                    spacing: { before: 40, after: 40 }
                }));
            } else {
                sections.push(new Paragraph({
                    children: [
                        new TextRun({ text: line.trim(), size: 21, font: "Calibri" })
                    ],
                    spacing: { before: 40, after: 40 }
                }));
            }
        });
    }

    // Experience Section (Internships)
    if (internships && internships.length > 0) {
        sections.push(createSectionHeader("Experience"));
        internships.forEach(exp => {
            const startStr = exp.start_date ? format(new Date(exp.start_date), 'MMM yyyy') : '';
            const endStr = exp.status === 'Ongoing' ? 'Present' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : '');
            
            sections.push(createRow(
                exp.company_name, 
                `${startStr} – ${endStr}`,
                true, false, false, false
            ));
            
            sections.push(createRow(
                exp.role, 
                exp.location || '',
                false, true, false, true
            ));

            if (exp.description) {
                exp.description.split('\n').filter(d => d.trim()).forEach(line => {
                    sections.push(createBulletPoint(line.trim()));
                });
            }
        });
    }

    // Projects Section
    if (projects && projects.length > 0) {
        sections.push(createSectionHeader("Projects"));
        projects.forEach(proj => {
            const leftText = `${proj.title} | ${proj.techStack || ''}`;
            let rightText = '';
            if (proj.githubLink) rightText = 'GitHub Link';
            
            sections.push(createRow(
                leftText, 
                rightText,
                true, false, false, false,
                proj.githubLink || null
            ));

            if (proj.description) {
                proj.description.split('\n').filter(d => d.trim()).forEach(line => {
                    sections.push(createBulletPoint(line.trim()));
                });
            }
        });
    }

    // Achievements Section (Bulleted like Ritesh image)
    const legitAchievements = achievements?.filter(a => a.category !== 'Internship' && a.category !== 'Project');
    if (legitAchievements && legitAchievements.length > 0) {
        sections.push(createSectionHeader("Achievements"));
        legitAchievements.forEach(ach => {
            const dateStr = ach.date ? ` (${format(new Date(ach.date), 'yyyy')})` : '';
            sections.push(new Paragraph({
                children: [
                    new TextRun({ text: `${ach.title}`, bold: true, size: 20, font: "Calibri" }),
                    new TextRun({ text: ` — ${ach.description || 'Verified Accomplishment'}${dateStr}.`, size: 20, font: "Calibri" })
                ],
                indent: { left: 180 },
                spacing: { before: 40, after: 40 }
            }));
        });
    }

    // Skills / Courses combined
    if (courses && courses.length > 0) {
        sections.push(createSectionHeader("Relevant Courses & Certifications"));
        courses.forEach(course => {
            sections.push(new Paragraph({
                children: [
                    new TextRun({ text: `• ${course.course_name}`, bold: true, size: 20, font: "Calibri" }),
                    new TextRun({ text: ` — ${course.platform} (${course.status})`, size: 20, font: "Calibri" })
                ],
                spacing: { before: 20, after: 20 }
            }));
        });
    }

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 24,
                        bold: true,
                        font: "Calibri",
                        color: "000000",
                    },
                    paragraph: {
                        spacing: { before: 180, after: 120 },
                    },
                },
                {
                    id: "Normal",
                    name: "Normal",
                    run: {
                        font: "Calibri",
                        size: 20,
                        color: "000000"
                    }
                }
            ],
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720,    // 0.5 inch
                            right: 720,
                            bottom: 720,
                            left: 720,
                        },
                    },
                },
                children: sections,
            },
        ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${student.name.replace(/\s+/g, '_')}_Resume.docx`);
};
