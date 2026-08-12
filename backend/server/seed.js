import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import SavedJob from './models/SavedJob.js';

export const seedDatabase = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount > 0) {
      console.log('Database already populated with jobs.');
      return;
    }

    console.log('Seeding initial JobConnect data...');

    const sampleJobs = [
      {
        title: 'UI/UX Designer',
        company: 'TechSoft Pvt Ltd',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
        location: 'Hyderabad, India',
        description:
          'We are looking for an experienced UI/UX Designer to craft intuitive, user-friendly digital experiences. You will collaborate closely with product managers and engineers to define user flows, wireframes, visual designs, and interactive prototypes.',
        responsibilities: [
          'Design user interfaces for web and mobile applications',
          'Create high-fidelity wireframes and interactive prototypes in Figma',
          'Work closely with developers to ensure design fidelity during implementation',
          'Conduct user research and usability testing',
          'Improve overall product experience and maintain design systems',
        ],
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        experience: '1-3 years',
        salaryMin: 4,
        salaryMax: 7,
        jobType: 'Full Time',
        category: 'Design',
        postedDate: '2 days ago',
      },
      {
        title: 'Frontend Developer',
        company: 'Webify Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
        location: 'Bangalore, India',
        description:
          'Seeking a passionate Frontend Developer skilled in React.js, Tailwind CSS, and modern JavaScript. You will build scalable, responsive web components with crisp animations and high performance.',
        responsibilities: [
          'Develop reusable React UI components and state logic',
          'Optimize web app performance and accessibility',
          'Integrate REST APIs and handle complex client-side interactions',
          'Collaborate with UI designers to translate designs into code',
        ],
        skills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'REST API'],
        experience: '1-3 years',
        salaryMin: 5,
        salaryMax: 9,
        jobType: 'Full Time',
        category: 'IT & Software',
        postedDate: '3 days ago',
      },
      {
        title: 'Product Designer',
        company: 'DesignHub Studios',
        companyLogo: 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=120&q=80',
        location: 'Hyderabad, India',
        description:
          'DesignHub is seeking a Product Designer to build next-generation enterprise SaaS products. You will own the design lifecycle from concept to launch.',
        responsibilities: [
          'Lead end-to-end product design efforts',
          'Create system designs, user journey maps, and visual assets',
          'Conduct competitive audits and design reviews',
        ],
        skills: ['Product Design', 'Figma', 'User Research', 'Wireframing'],
        experience: '3-5 years',
        salaryMin: 6,
        salaryMax: 10,
        jobType: 'Full Time',
        category: 'Design',
        postedDate: '1 day ago',
      },
      {
        title: 'Full Stack Engineer',
        company: 'InnovateX Labs',
        companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=120&q=80',
        location: 'Pune, India',
        description:
          'Looking for a Full Stack Developer experienced in Node.js, Express, MongoDB, and React to develop high-throughput cloud web platforms.',
        responsibilities: [
          'Architect and maintain REST APIs with Node/Express',
          'Design MongoDB schemas and optimize queries',
          'Build responsive React user interfaces',
        ],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'JavaScript'],
        experience: '3-5 years',
        salaryMin: 8,
        salaryMax: 14,
        jobType: 'Full Time',
        category: 'IT & Software',
        postedDate: '4 days ago',
      },
      {
        title: 'Digital Marketing Specialist',
        company: 'BrandBoost Agency',
        companyLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&q=80',
        location: 'Mumbai, India',
        description:
          'Drive organic growth, Google Ads, SEO campaigns, and social media presence for leading e-commerce brands across India.',
        responsibilities: [
          'Manage PPC, Meta Ads, and SEO strategies',
          'Analyze campaign metrics using Google Analytics',
          'Optimize conversion funnels and ad spend ROI',
        ],
        skills: ['SEO', 'Google Analytics', 'Social Media Ads', 'Content Strategy'],
        experience: '1-3 years',
        salaryMin: 3.5,
        salaryMax: 6,
        jobType: 'Full Time',
        category: 'Marketing',
        postedDate: '5 days ago',
      },
      {
        title: 'Backend Developer (Node.js)',
        company: 'CloudScale Technologies',
        companyLogo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=120&q=80',
        location: 'Chennai, India',
        description:
          'Join our backend team to build real-time microservices, JWT authentication gates, and database indexing strategies.',
        responsibilities: [
          'Build secure REST & GraphQL endpoints',
          'Implement OAuth2 and JWT authorization schemes',
          'Optimize database queries for low latency',
        ],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API'],
        experience: '3-5 years',
        salaryMin: 7,
        salaryMax: 12,
        jobType: 'Remote',
        category: 'IT & Software',
        postedDate: 'Just now',
      },
      {
        title: 'Junior React Intern',
        company: 'NextGen Apps',
        companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80',
        location: 'Delhi, India',
        description:
          'Great opportunity for freshers and students to learn professional software engineering, Git workflows, and React development.',
        responsibilities: [
          'Assist senior developers in component creation',
          'Fix UI bugs and write unit tests',
          'Participate in daily agile standup meetings',
        ],
        skills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Git'],
        experience: '0-1 years',
        salaryMin: 2,
        salaryMax: 3.5,
        jobType: 'Internship',
        category: 'Engineering',
        postedDate: '1 day ago',
      },
      {
        title: 'Enterprise Sales Manager',
        company: 'Apex Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80',
        location: 'Mumbai, India',
        description:
          'Lead B2B SaaS product sales, generate inbound enterprise pipelines, and close high-value business contracts.',
        responsibilities: [
          'Build customer relationships with C-level executives',
          'Conduct product demos and pitch proposals',
          'Achieve quarterly revenue targets',
        ],
        skills: ['B2B Sales', 'Lead Generation', 'CRM', 'Negotiation'],
        experience: '5+ years',
        salaryMin: 12,
        salaryMax: 20,
        jobType: 'Full Time',
        category: 'Sales',
        postedDate: '3 days ago',
      },
      {
        title: 'Data Analyst',
        company: 'FinMetrics Analytics',
        companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80',
        location: 'Bangalore, India',
        description:
          'Transform raw financial transactions into actionable business dashboards using SQL, Python, and PowerBI.',
        responsibilities: [
          'Build automated data pipeline reporting dashboards',
          'Run predictive statistical models',
          'Present insights to key stakeholders',
        ],
        skills: ['SQL', 'Python', 'PowerBI', 'Data Visualization', 'Excel'],
        experience: '1-3 years',
        salaryMin: 5,
        salaryMax: 8.5,
        jobType: 'Full Time',
        category: 'IT & Software',
        postedDate: '6 days ago',
      },
      {
        title: 'Product Manager',
        company: 'PayQuick FinTech',
        companyLogo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=120&q=80',
        location: 'Hyderabad, India',
        description:
          'Define product roadmaps, prioritize feature backlogs, and drive cross-functional engineering teams in a fast-paced fintech setup.',
        responsibilities: [
          'Write PRDs and feature specifications',
          'Analyze user metrics and conversion rates',
          'Coordinate engineering, design, and marketing sprints',
        ],
        skills: ['Product Management', 'Agile', 'Jira', 'User Research', 'Analytics'],
        experience: '3-5 years',
        salaryMin: 10,
        salaryMax: 18,
        jobType: 'Full Time',
        category: 'Marketing',
        postedDate: '2 days ago',
      },
    ];

    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`Successfully seeded ${createdJobs.length} jobs.`);

    // Create default demo user, recruiter user & admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const recruiterHashedPassword = await bcrypt.hash('recruiter123', salt);
    const adminHashedPassword = await bcrypt.hash('admin123', salt);

    const demoUser = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'candidate',
      phone: '+91 98765 43210',
      headline: 'UI/UX Designer & Frontend Developer',
      location: 'Hyderabad, India',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript', 'React.js'],
      resume: {
        filename: 'sample_resume.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        originalName: 'john_doe_resume.pdf',
        size: 1258291, // ~1.2 MB
        uploadedAt: new Date(),
      },
    });

    const recruiterUser = await User.create({
      fullName: 'Sarah Jenkins',
      email: 'recruiter@jobportal.com',
      password: recruiterHashedPassword,
      role: 'recruiter',
      phone: '+91 98888 77777',
      headline: 'Talent Acquisition Partner at TechCorp',
      location: 'Bengaluru, India',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    });

    const adminUser = await User.create({
      fullName: 'Admin Manager',
      email: 'admin@jobportal.com',
      password: adminHashedPassword,
      role: 'admin',
      phone: '+91 99999 00000',
      headline: 'Portal Administrator & System Lead',
      location: 'Sri Vasavi Engg College, Tadepalligudem, India',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    });

    console.log(`Created accounts -> Candidate: ${demoUser.email}, Recruiter: ${recruiterUser.email}, Admin: ${adminUser.email}`);

    // Create sample applications with various statuses so all screens can be viewed
    const uiJob = createdJobs.find((j) => j.title === 'UI/UX Designer');
    const feJob = createdJobs.find((j) => j.title === 'Frontend Developer');
    const pdJob = createdJobs.find((j) => j.title === 'Product Designer');
    const fsJob = createdJobs.find((j) => j.title === 'Full Stack Engineer');

    if (uiJob) {
      await Application.create({
        user: demoUser._id,
        job: uiJob._id,
        resume: demoUser.resume,
        coverLetter:
          'I am extremely excited to apply for the UI/UX Designer role at TechSoft. With over 2 years of experience creating sleek mobile and web interfaces in Figma and prototyping responsive user flows, I am confident I can bring tremendous value to your team.',
        status: 'Interview',
        interview: {
          date: '2026-08-25',
          time: '11:00 AM',
          mode: 'Online (Google Meet)',
          meetingUrl: 'https://meet.google.com/abc-defg-hij',
          interviewer: 'Rohit Sharma (HR Manager)',
          message: 'Please be available 10 minutes before the interview. All the best!',
          status: 'Scheduled',
        },
      });
    }

    if (feJob) {
      await Application.create({
        user: demoUser._id,
        job: feJob._id,
        resume: demoUser.resume,
        coverLetter: 'I have hands-on experience building clean React web apps and responsive Tailwind designs.',
        status: 'In Review',
      });
    }

    if (pdJob) {
      await Application.create({
        user: demoUser._id,
        job: pdJob._id,
        resume: demoUser.resume,
        coverLetter: 'Looking forward to bringing my product design skills to DesignHub Studios!',
        status: 'Offered',
        offerDetails: {
          position: 'Product Designer',
          company: 'DesignHub Studios',
          joiningDate: '1st September 2026',
          package: '₹8.5 LPA',
          letterUrl: '#',
        },
      });
    }

    if (fsJob) {
      await Application.create({
        user: demoUser._id,
        job: fsJob._id,
        resume: demoUser.resume,
        coverLetter: 'Enthusiastic full-stack engineer eager to tackle backend and frontend challenges.',
        status: 'Rejected',
      });
    }

    if (uiJob) {
      await SavedJob.create({
        user: demoUser._id,
        job: uiJob._id,
      });
    }

    console.log('Sample applications and saved jobs seeded successfully!');
  } catch (error) {
    console.error('Seed Database Error:', error.message);
  }
};
