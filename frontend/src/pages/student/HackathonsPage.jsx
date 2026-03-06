import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Users, Clock, Search, Filter } from 'lucide-react';
import { hackathonAPI } from '../../services/api';
import '../../styles/HackathonsPage.css';

// Stable, always-available Unsplash images (by topic/keyword - reliable CDN)
const IMGS = {
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=70',
    code: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=70',
    laptop: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=70',
    meeting: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=70',
    server: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=70',
    ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=70',
    mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=70',
    cyber: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop&q=70',
    space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=70',
    data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=70',
    startup: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=70',
    hardware: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=70',
    blockchain: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=70',
    women: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop&q=70',
    robot: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=70',
    globe: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=70',
};

const FALLBACK = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=70';

const liveChallenges = [

    // ── GOVT / NATIONAL ────────────────────────────────────────────────────────
    { title: 'Smart India Hackathon 2026', type: 'Govt of India', img: IMGS.team, prize: '₹1,00,000 Per Theme', stats: { students: '25k+', days: 'Aug 2026' }, badge: 'Premier', link: 'https://www.sih.gov.in/' },
    { title: 'Kavach 2026', type: 'Govt of India', img: IMGS.cyber, prize: '₹1,00,000', stats: { students: '5k+', days: 'Apr 2026' }, badge: 'Defence', link: 'https://kavach.mic.gov.in/' },
    { title: 'Toycathon 2026', type: 'Govt of India', img: IMGS.robot, prize: '₹50,000', stats: { students: '3k+', days: 'Mar 2026' }, badge: 'Innovation', link: 'https://toycathon.mic.gov.in/' },
    { title: 'NASA Space Apps 2026 (India)', type: 'Govt of India', img: IMGS.space, prize: '$5,000', stats: { students: '8k+', days: 'Oct 2026' }, badge: 'Space', link: 'https://www.spaceappschallenge.org/' },
    { title: 'MeitY Grand Hackathon 2026', type: 'Govt of India', img: IMGS.laptop, prize: '₹2,00,000', stats: { students: '10k+', days: 'Jun 2026' }, badge: 'Digital India', link: 'https://meity.gov.in/' },
    { title: 'Pradhan Mantri Yuva Shakti Hackathon 2026', type: 'Govt of India', img: IMGS.team, prize: '₹75,000', stats: { students: '6k+', days: 'Sep 2026' }, badge: 'Youth', link: 'https://mic.gov.in/' },
    { title: 'India AI Hackathon 2026', type: 'Govt of India', img: IMGS.ai, prize: '₹3,00,000', stats: { students: '12k+', days: 'Jul 2026' }, badge: 'AI Mission', link: 'https://indiaai.gov.in/' },

    // ── AI / ML ─────────────────────────────────────────────────────────────────
    { title: 'Google AI Challenge 2026', type: 'AI / ML', img: IMGS.ai, prize: '$50,000', stats: { students: '20k+', days: 'Mar 2026' }, badge: 'AI', link: 'https://ai.google/challenges/' },
    { title: 'Hugging Face Open LLM Challenge 2026', type: 'AI / ML', img: IMGS.code, prize: '$30,000', stats: { students: '15k+', days: 'Apr 2026' }, badge: 'LLM', link: 'https://huggingface.co/' },
    { title: 'Kaggle AI Open Challenge 2026', type: 'AI / ML', img: IMGS.data, prize: '$25,000', stats: { students: '50k+', days: 'May 2026' }, badge: 'Data', link: 'https://www.kaggle.com/competitions' },
    { title: 'MIT Media Lab AI Ethics Hack 2026', type: 'AI / ML', img: IMGS.meeting, prize: '$15,000', stats: { students: '3k+', days: 'Feb 2026' }, badge: 'Ethics', link: 'https://www.media.mit.edu/' },
    { title: 'OpenAI AISF Hackathon 2026', type: 'AI / ML', img: IMGS.robot, prize: '$40,000', stats: { students: '10k+', days: 'Jun 2026' }, badge: 'GPT', link: 'https://openai.com/' },
    { title: 'NVIDIA AI Hackathon 2026', type: 'AI / ML', img: IMGS.hardware, prize: '$60,000', stats: { students: '12k+', days: 'Aug 2026' }, badge: 'GPU', link: 'https://www.nvidia.com/en-us/startups/' },
    { title: 'AWS AI & ML Hackathon 2026', type: 'AI / ML', img: IMGS.server, prize: '$35,000', stats: { students: '18k+', days: 'Jul 2026' }, badge: 'Cloud AI', link: 'https://aws.amazon.com/hackathons/' },

    // ── WEB DEVELOPMENT ─────────────────────────────────────────────────────────
    { title: 'MLH Global Hackathon 2026', type: 'Web Development', img: IMGS.laptop, prize: '$20,000', stats: { students: '40k+', days: 'Rolling' }, badge: 'Web', link: 'https://mlh.io/' },
    { title: 'Hashnode x Netlify Hackathon 2026', type: 'Web Development', img: IMGS.code, prize: '$10,000', stats: { students: '8k+', days: 'Mar 2026' }, badge: 'Jamstack', link: 'https://hashnode.com/' },
    { title: 'Vercel Next.js Hackathon 2026', type: 'Web Development', img: IMGS.laptop, prize: '$25,000', stats: { students: '15k+', days: 'May 2026' }, badge: 'Next.js', link: 'https://vercel.com/' },
    { title: 'GitHub DevHacks 2026', type: 'Web Development', img: IMGS.code, prize: '$30,000', stats: { students: '25k+', days: 'Jun 2026' }, badge: 'Open Source', link: 'https://github.com/' },
    { title: 'Dev.to Hackathon 2026', type: 'Web Development', img: IMGS.laptop, prize: '$5,000', stats: { students: '7k+', days: 'Apr 2026' }, badge: 'Community', link: 'https://dev.to/' },
    { title: 'Supabase Launch Week Hack 2026', type: 'Web Development', img: IMGS.server, prize: '$15,000', stats: { students: '10k+', days: 'Jul 2026' }, badge: 'Backend', link: 'https://supabase.com/' },
    { title: 'Cloudflare Developer Challenge 2026', type: 'Web Development', img: IMGS.globe, prize: '$20,000', stats: { students: '12k+', days: 'Sep 2026' }, badge: 'Edge', link: 'https://www.cloudflare.com/' },

    // ── CYBERSECURITY ───────────────────────────────────────────────────────────
    { title: 'DEF CON CTF 2026', type: 'Cybersecurity', img: IMGS.cyber, prize: '$50,000', stats: { students: '10k+', days: 'Aug 2026' }, badge: 'CTF', link: 'https://defcon.org/' },
    { title: 'PicoCTF 2026', type: 'Cybersecurity', img: IMGS.code, prize: '$10,000', stats: { students: '60k+', days: 'Mar 2026' }, badge: 'CTF', link: 'https://picoctf.org/' },
    { title: 'CSAW CTF 2026', type: 'Cybersecurity', img: IMGS.cyber, prize: '$25,000', stats: { students: '18k+', days: 'Sep 2026' }, badge: 'Capture Flag', link: 'https://ctf.csaw.io/' },
    { title: 'National Cyber Olympiad Hackathon 2026', type: 'Cybersecurity', img: IMGS.hardware, prize: '₹5,00,000', stats: { students: '20k+', days: 'Nov 2026' }, badge: 'National', link: 'https://www.ncowebsite.org/' },
    { title: 'Google CTF 2026', type: 'Cybersecurity', img: IMGS.cyber, prize: '$30,000', stats: { students: '15k+', days: 'Jun 2026' }, badge: 'Google', link: 'https://ctftime.org/' },
    { title: 'HackTheBox University CTF 2026', type: 'Cybersecurity', img: IMGS.laptop, prize: '$15,000', stats: { students: '22k+', days: 'Dec 2026' }, badge: 'HTB', link: 'https://www.hackthebox.com/' },
    { title: 'NSA CyberStart 2026', type: 'Cybersecurity', img: IMGS.cyber, prize: 'Scholarship', stats: { students: '30k+', days: 'Jan 2026' }, badge: 'Students', link: 'https://www.cyberstart.com/' },

    // ── MOBILE APP DEVELOPMENT ──────────────────────────────────────────────────
    { title: 'Flutter Hackathon 2026', type: 'Mobile App Dev', img: IMGS.mobile, prize: '$20,000', stats: { students: '12k+', days: 'Apr 2026' }, badge: 'Flutter', link: 'https://flutter.dev/' },
    { title: 'Google Play Indie Games Festival 2026', type: 'Mobile App Dev', img: IMGS.mobile, prize: '$30,000', stats: { students: '5k+', days: 'May 2026' }, badge: 'Games', link: 'https://play.google.com/dev/indie-games/' },
    { title: 'Apple Swift Student Challenge 2026', type: 'Mobile App Dev', img: IMGS.laptop, prize: 'WWDC Ticket', stats: { students: '8k+', days: 'Feb 2026' }, badge: 'Swift', link: 'https://developer.apple.com/swift-student-challenge/' },
    { title: 'React Native Hackathon 2026', type: 'Mobile App Dev', img: IMGS.code, prize: '$15,000', stats: { students: '9k+', days: 'Jun 2026' }, badge: 'RN', link: 'https://reactnative.dev/' },
    { title: 'Expo Mobile Dev Contest 2026', type: 'Mobile App Dev', img: IMGS.mobile, prize: '$10,000', stats: { students: '6k+', days: 'Aug 2026' }, badge: 'Expo', link: 'https://expo.dev/' },
    { title: 'Samsung Developer Challenge 2026', type: 'Mobile App Dev', img: IMGS.hardware, prize: '$50,000', stats: { students: '15k+', days: 'Jul 2026' }, badge: 'Samsung', link: 'https://developer.samsung.com/' },
    { title: 'Android Dev Challenge 2026', type: 'Mobile App Dev', img: IMGS.mobile, prize: '$25,000', stats: { students: '20k+', days: 'Sep 2026' }, badge: 'Android', link: 'https://developer.android.com/' },

    // ── BLOCKCHAIN / WEB3 ────────────────────────────────────────────────────────
    { title: 'ETHGlobal Bangkok 2026', type: 'Web3 & Blockchain', img: IMGS.blockchain, prize: '$300,000', stats: { students: '10k+', days: 'Feb 2026' }, badge: 'Ethereum', link: 'https://ethglobal.com/' },
    { title: 'Solana Breakpoint Hackathon 2026', type: 'Web3 & Blockchain', img: IMGS.blockchain, prize: '$1,000,000', stats: { students: '8k+', days: 'May 2026' }, badge: 'Solana', link: 'https://solana.com/hackathon' },
    { title: 'Polygon BUIDL IT 2026', type: 'Web3 & Blockchain', img: IMGS.globe, prize: '$200,000', stats: { students: '6k+', days: 'Mar 2026' }, badge: 'Layer 2', link: 'https://polygon.technology/' },
    { title: 'Chainlink Hackathon 2026', type: 'Web3 & Blockchain', img: IMGS.server, prize: '$100,000', stats: { students: '5k+', days: 'Apr 2026' }, badge: 'Oracles', link: 'https://chain.link/' },
    { title: 'Aptos Code Collision 2026', type: 'Web3 & Blockchain', img: IMGS.blockchain, prize: '$150,000', stats: { students: '4k+', days: 'Jan 2026' }, badge: 'Move', link: 'https://aptosfoundation.org/' },
    { title: 'NEAR Protocol Hacks 2026', type: 'Web3 & Blockchain', img: IMGS.globe, prize: '$250,000', stats: { students: '3k+', days: 'Ongoing' }, badge: 'Web3', link: 'https://near.org/hackathon' },
    { title: 'Filecoin Open Data Hack 2026', type: 'Web3 & Blockchain', img: IMGS.laptop, prize: '$150,000', stats: { students: '5k+', days: 'May 2026' }, badge: 'Storage', link: 'https://filecoin.io/' },

    // ── DATA SCIENCE ────────────────────────────────────────────────────────────
    { title: 'Kaggle Data Science Bowl 2026', type: 'Data Science', img: IMGS.data, prize: '$100,000', stats: { students: '40k+', days: 'Jan 2026' }, badge: 'Kaggle', link: 'https://www.kaggle.com/c/data-science-bowl' },
    { title: 'DataHack Summit 2026', type: 'Data Science', img: IMGS.data, prize: '$25,000', stats: { students: '15k+', days: 'Mar 2026' }, badge: 'Analytics', link: 'https://datahack.analyticsvidhya.com/' },
    { title: 'Zindi Africa Challenge 2026', type: 'Data Science', img: IMGS.globe, prize: '$10,000', stats: { students: '20k+', days: 'Feb 2026' }, badge: 'Africa', link: 'https://zindi.africa/' },
    { title: 'DrivenData Competitions 2026', type: 'Data Science', img: IMGS.data, prize: '$20,000', stats: { students: '12k+', days: 'Apr 2026' }, badge: 'Social Good', link: 'https://www.drivendata.org/' },
    { title: 'Snowflake Data Hack 2026', type: 'Data Science', img: IMGS.server, prize: '$50,000', stats: { students: '8k+', days: 'Jun 2026' }, badge: 'Snowflake', link: 'https://www.snowflake.com/' },
    { title: 'Databricks ML Hackathon 2026', type: 'Data Science', img: IMGS.ai, prize: '$40,000', stats: { students: '10k+', days: 'Jul 2026' }, badge: 'Spark', link: 'https://www.databricks.com/' },
    { title: 'IBM Z Datathon 2026', type: 'Data Science', img: IMGS.laptop, prize: '$15,000', stats: { students: '6k+', days: 'Sep 2026' }, badge: 'IBM', link: 'https://www.ibm.com/z' },

    // ── CLOUD COMPUTING ──────────────────────────────────────────────────────────
    { title: 'Google Cloud Hackathon 2026', type: 'Cloud Computing', img: IMGS.server, prize: '$50,000', stats: { students: '20k+', days: 'Feb 2026' }, badge: 'GCP', link: 'https://cloud.google.com/community/hackathon' },
    { title: 'Microsoft Azure Hackathon 2026', type: 'Cloud Computing', img: IMGS.laptop, prize: '$40,000', stats: { students: '18k+', days: 'Mar 2026' }, badge: 'Azure', link: 'https://azure.microsoft.com/en-us/developer/' },
    { title: 'AWS Build On India 2026', type: 'Cloud Computing', img: IMGS.server, prize: '$30,000', stats: { students: '22k+', days: 'May 2026' }, badge: 'AWS', link: 'https://aws.amazon.com/events/aws-build-on-india/' },
    { title: 'IBM Cloud Hackathon 2026', type: 'Cloud Computing', img: IMGS.globe, prize: '$20,000', stats: { students: '10k+', days: 'Jun 2026' }, badge: 'IBM', link: 'https://developer.ibm.com/' },
    { title: 'Oracle Cloud Challenge 2026', type: 'Cloud Computing', img: IMGS.server, prize: '$25,000', stats: { students: '8k+', days: 'Jul 2026' }, badge: 'OCI', link: 'https://developer.oracle.com/' },
    { title: 'Alibaba Cloud Developer Contest 2026', type: 'Cloud Computing', img: IMGS.globe, prize: '$35,000', stats: { students: '12k+', days: 'Aug 2026' }, badge: 'Alibaba', link: 'https://developer.aliyun.com/' },
    { title: 'DigitalOcean App Platform Hackathon 2026', type: 'Cloud Computing', img: IMGS.laptop, prize: '$12,000', stats: { students: '7k+', days: 'Sep 2026' }, badge: 'DO', link: 'https://www.digitalocean.com/' },

    // ── HARDWARE / IoT ──────────────────────────────────────────────────────────
    { title: 'Arduino Hackathon 2026', type: 'Hardware & IoT', img: IMGS.hardware, prize: '$15,000', stats: { students: '8k+', days: 'Mar 2026' }, badge: 'Arduino', link: 'https://www.arduino.cc/' },
    { title: 'Texas Instruments Innovation Challenge 2026', type: 'Hardware & IoT', img: IMGS.hardware, prize: '$30,000', stats: { students: '5k+', days: 'Apr 2026' }, badge: 'TI', link: 'https://www.ti.com/' },
    { title: 'Qualcomm Design in India Challenge 2026', type: 'Hardware & IoT', img: IMGS.hardware, prize: '$50,000', stats: { students: '7k+', days: 'Feb 2026' }, badge: 'Qualcomm', link: 'https://www.qualcomm.com/company/locations/india/' },
    { title: 'Raspberry Pi Foundation Hackathon 2026', type: 'Hardware & IoT', img: IMGS.hardware, prize: '$10,000', stats: { students: '6k+', days: 'Jun 2026' }, badge: 'RPi', link: 'https://www.raspberrypi.org/' },
    { title: 'Bosch IoT Hackathon 2026', type: 'Hardware & IoT', img: IMGS.server, prize: '$25,000', stats: { students: '4k+', days: 'Aug 2026' }, badge: 'Bosch', link: 'https://www.bosch.com/' },
    { title: 'Seeed Studio Grove Hackathon 2026', type: 'Hardware & IoT', img: IMGS.hardware, prize: '$8,000', stats: { students: '3k+', days: 'Sep 2026' }, badge: 'IoT', link: 'https://www.seeedstudio.com/' },
    { title: 'Intel IoT Hackathon 2026', type: 'Hardware & IoT', img: IMGS.hardware, prize: '$40,000', stats: { students: '10k+', days: 'Jul 2026' }, badge: 'Intel', link: 'https://www.intel.com/' },

    // ── OPEN SOURCE ──────────────────────────────────────────────────────────────
    { title: 'Google Summer of Code 2026', type: 'Open Source', img: IMGS.code, prize: '$3,000-$6,600 Stipend', stats: { students: '20k+', days: 'Feb 2026' }, badge: 'GSoC', link: 'https://summerofcode.withgoogle.com/' },
    { title: 'MLH Fellowship 2026', type: 'Open Source', img: IMGS.team, prize: '$5,000 Stipend', stats: { students: '10k+', days: 'Rolling' }, badge: 'MLH', link: 'https://fellowship.mlh.io/' },
    { title: 'Outreachy Winter 2026', type: 'Open Source', img: IMGS.women, prize: '$7,000 Stipend', stats: { students: '5k+', days: 'Aug 2026' }, badge: 'Outreachy', link: 'https://www.outreachy.org/' },
    { title: 'Season of Docs 2026', type: 'Open Source', img: IMGS.laptop, prize: '$5,000 Stipend', stats: { students: '3k+', days: 'Mar 2026' }, badge: 'Docs', link: 'https://developers.google.com/season-of-docs' },
    { title: 'GirlScript Summer of Code 2026', type: 'Open Source', img: IMGS.women, prize: 'Prizes + Swag', stats: { students: '15k+', days: 'May 2026' }, badge: 'GSSoC', link: 'https://gssoc.girlscript.tech/' },
    { title: 'Hacktoberfest 2026', type: 'Open Source', img: IMGS.code, prize: 'Swag Kit', stats: { students: '100k+', days: 'Oct 2026' }, badge: 'Community', link: 'https://hacktoberfest.com/' },
    { title: 'Linux Foundation Mentorship 2026', type: 'Open Source', img: IMGS.laptop, prize: '$3,000-$6,000 Stipend', stats: { students: '4k+', days: 'Rolling' }, badge: 'Linux', link: 'https://mentorship.lfx.linuxfoundation.org/' },

    // ── STARTUP / ENTREPRENEURSHIP ───────────────────────────────────────────────
    { title: 'Y Combinator Startup School Hackathon 2026', type: 'Startup', img: IMGS.startup, prize: 'Funding + Mentorship', stats: { students: '30k+', days: 'Mar 2026' }, badge: 'YC', link: 'https://www.startupschool.org/' },
    { title: 'MIT $100K Entrepreneurship Comp 2026', type: 'Startup', img: IMGS.team, prize: '$100,000', stats: { students: '5k+', days: 'Jan 2026' }, badge: 'MIT', link: 'https://mit100k.org/' },
    { title: 'T-Hub Innovation Challenge 2026', type: 'Startup', img: IMGS.startup, prize: '₹25,00,000', stats: { students: '8k+', days: 'Apr 2026' }, badge: 'T-Hub', link: 'https://t-hub.co/' },
    { title: 'Microsoft Founders Hub Hackathon 2026', type: 'Startup', img: IMGS.laptop, prize: '$100,000 in Credits', stats: { students: '10k+', days: 'Feb 2026' }, badge: 'MS', link: 'https://foundershub.startups.microsoft.com/' },
    { title: 'Shark Tank India Startup Challenge 2026', type: 'Startup', img: IMGS.startup, prize: '₹1,00,00,000', stats: { students: '12k+', days: 'Year Round' }, badge: 'Shark Tank', link: 'https://www.sonyliv.com/shows/shark-tank-india' },
    { title: 'Startup India Grand Challenge 2026', type: 'Startup', img: IMGS.globe, prize: '₹50,00,000', stats: { students: '20k+', days: 'Jun 2026' }, badge: 'DPIIT', link: 'https://www.startupindia.gov.in/' },
    { title: 'Amazon Create on AWS 2026', type: 'Startup', img: IMGS.server, prize: '$100,000 Credits', stats: { students: '15k+', days: 'Sep 2026' }, badge: 'Amazon', link: 'https://aws.amazon.com/startups/' },

    // ── SOCIAL IMPACT ────────────────────────────────────────────────────────────
    { title: 'UN Datathon 2026', type: 'Social Impact', img: IMGS.globe, prize: '$10,000', stats: { students: '5k+', days: 'Nov 2026' }, badge: 'UN', link: 'https://unstats.un.org/bigdata/events/2026/un-datathon/' },
    { title: 'HackForLA 2026', type: 'Social Impact', img: IMGS.globe, prize: 'Impact + Skills', stats: { students: '2k+', days: 'Year Round' }, badge: 'Civic Tech', link: 'https://www.hackforla.org/' },
    { title: 'Code for America 2026', type: 'Social Impact', img: IMGS.team, prize: 'Impact Recognition', stats: { students: '4k+', days: 'Feb 2026' }, badge: 'Civic', link: 'https://www.codeforamerica.org/' },
    { title: 'Microsoft AI for Good Hack 2026', type: 'Social Impact', img: IMGS.ai, prize: '$50,000', stats: { students: '8k+', days: 'Mar 2026' }, badge: 'AI Good', link: 'https://www.microsoft.com/en-us/ai/ai-for-good' },
    { title: 'Ashoka Changemakers Hack 2026', type: 'Social Impact', img: IMGS.women, prize: '$15,000', stats: { students: '3k+', days: 'Apr 2026' }, badge: 'Ashoka', link: 'https://www.ashoka.org/en-in/' },
    { title: 'World Food Programme Hackathon 2026', type: 'Social Impact', img: IMGS.globe, prize: '$20,000', stats: { students: '5k+', days: 'May 2026' }, badge: 'WFP', link: 'https://www.wfp.org/' },
    { title: 'Climate Change AI Hackathon 2026', type: 'Social Impact', img: IMGS.space, prize: '$25,000', stats: { students: '6k+', days: 'Jun 2026' }, badge: 'Climate', link: 'https://www.climatechange.ai/' },

    // ── WOMEN IN TECH ─────────────────────────────────────────────────────────────
    { title: 'Grace Hopper Hackathon 2026', type: 'Women in Tech', img: IMGS.women, prize: '$20,000', stats: { students: '10k+', days: 'Sep 2026' }, badge: 'GHC', link: 'https://ghc.anitab.org/' },
    { title: 'SheBuilds Hackathon 2026', type: 'Women in Tech', img: IMGS.women, prize: '$10,000', stats: { students: '5k+', days: 'Mar 2026' }, badge: 'SheBuilds', link: 'https://shebuilds.tech/' },
    { title: 'WiHacks 2026', type: 'Women in Tech', img: IMGS.women, prize: '$8,000', stats: { students: '3k+', days: 'Apr 2026' }, badge: 'Women', link: 'https://www.wihacks.co/' },
    { title: 'AnitaB.org Hackathon 2026', type: 'Women in Tech', img: IMGS.meeting, prize: '$15,000', stats: { students: '7k+', days: 'Jun 2026' }, badge: 'AnitaB', link: 'https://anitab.org/' },
    { title: 'WomenHack Global 2026', type: 'Women in Tech', img: IMGS.women, prize: '$12,000', stats: { students: '4k+', days: 'Jul 2026' }, badge: 'Global', link: 'https://womenhack.com/' },
    { title: 'Girl Geek X Hackathon 2026', type: 'Women in Tech', img: IMGS.women, prize: '$6,000', stats: { students: '2k+', days: 'Aug 2026' }, badge: 'GirlGeek', link: 'https://girlgeek.io/' },
    { title: 'PyLadies Hackathon 2026', type: 'Women in Tech', img: IMGS.code, prize: '$5,000', stats: { students: '3k+', days: 'Oct 2026' }, badge: 'Python', link: 'https://pyladies.com/' },

];

const HackathonsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const handleImgError = (e) => {
        e.target.onerror = null;            // prevent infinite loop
        e.target.src = FALLBACK;
    };

    const handleApply = async (hackathonTitle, link) => {
        try {
            await hackathonAPI.logActivity({ hackathonTitle, actionType: 'enroll' });
            toast.success(`Activity recorded. Redirecting to ${hackathonTitle}...`);
            setTimeout(() => window.open(link, '_blank'), 1000);
        } catch {
            window.open(link, '_blank');
        }
    };

    const typeOptions = ['All', ...Array.from(new Set(liveChallenges.map(c => c.type))).sort()];

    const filteredChallenges = useMemo(() => {
        return liveChallenges.filter(comp => {
            const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'All' || comp.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [searchTerm, filterType]);

    return (
        <div className="hackathons-page">

            {/* ── Header ──────────────────────────────────────── */}
            <header className="hackathons-header">
                <div className="hackathons-header-text">
                    <h1>Live Hackathons &amp; Competitions</h1>
                    <p>Discover, filter, and participate in upcoming global coding challenges.</p>
                </div>

                <div className="hackathons-controls">
                    {/* Count badge */}
                    <span className="hack-count-badge">
                        {filteredChallenges.length}&nbsp;
                        {filteredChallenges.length === 1 ? 'Hackathon' : 'Hackathons'}
                    </span>

                    {/* Search */}
                    <div className="hackathons-search-wrap">
                        <Search className="hackathons-search-icon" size={14} />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <div className="hackathons-filter-wrap">
                        <Filter className="hackathons-filter-icon" size={14} />
                        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                            {typeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* ── Cards ───────────────────────────────────────── */}
            <div className="hackathons-grid">
                {filteredChallenges.length > 0 ? (
                    filteredChallenges.map((comp, idx) => (
                        <div key={idx} className="hack-card">
                            {/* Image */}
                            <div className="hack-card-img-wrap">
                                <img
                                    src={comp.img}
                                    alt={comp.title}
                                    onError={handleImgError}
                                    loading="lazy"
                                />
                                <span className="hack-card-badge">{comp.badge}</span>
                            </div>

                            {/* Body */}
                            <div className="hack-card-body">
                                <span className="hack-card-type">{comp.type}</span>
                                <h3 className="hack-card-title">{comp.title}</h3>

                                <div className="hack-card-stats">
                                    <span><Users size={13} /> {comp.stats.students}</span>
                                    <span><Clock size={13} /> {comp.stats.days} Left</span>
                                </div>

                                <button
                                    className="hack-card-apply"
                                    onClick={() => handleApply(comp.title, comp.link)}
                                >
                                    Apply Now
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="hack-card-footer">
                                <span className="hack-card-footer-label">Prize Pool</span>
                                <span className="hack-card-footer-value" title={comp.prize}>
                                    {comp.prize}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="hackathons-empty">
                        <Search size={44} />
                        <h3>No challenges found</h3>
                        <p>Try adjusting your search or filters.</p>
                        <button onClick={() => { setSearchTerm(''); setFilterType('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HackathonsPage;
