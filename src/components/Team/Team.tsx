import React from 'react';
import InteractiveCard from '../ui/InteractiveCard';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  placeholder?: string;
  description: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembersData: TeamMember[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'CEO & Founder',
    image: '/images/team/member-1.jpg',
    placeholder: '/images/team/member-1-placeholder.jpg',
    description: 'Visionary leader with over 20 years of construction experience.',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'mailto:john.doe@constructco.com',
    },
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Chief Architect',
    image: '/images/team/member-2.jpg',
    placeholder: '/images/team/member-2-placeholder.jpg',
    description: 'Innovative architect focused on sustainable and functional design.',
    social: {
      linkedin: '#',
      email: 'mailto:jane.smith@constructco.com',
    },
  },
  {
    id: 3,
    name: 'Robert Johnson',
    role: 'Head of Operations',
    image: '/images/team/member-3.jpg',
    placeholder: '/images/team/member-3-placeholder.jpg',
    description: 'Ensuring smooth project execution and operational efficiency.',
    social: {
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'Emily White',
    role: 'Project Manager',
    image: '/images/team/member-4.jpg',
    placeholder: '/images/team/member-4-placeholder.jpg',
    description: 'Dedicated project manager keeping timelines and budgets on track.',
    social: {
      linkedin: '#',
      email: 'mailto:emily.white@constructco.com',
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const Team: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      className="py-16 md:py-24 bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The driving force behind our success - experienced, dedicated, and passionate professionals.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembersData.map((member) => (
            <InteractiveCard
              key={member.id}
              imageSrc={member.image}
              placeholderSrc={member.placeholder}
              imageAlt={member.name}
              title={member.name}
              description=""
              variants={itemVariants}
              className="text-center"
            >
              <>
                <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 mb-4 px-4">{member.description}</p>
                <div className="mt-4 flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-700"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500"
                      aria-label={`${member.name} Twitter`}
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {member.social.email && (
                    <a
                      href={member.social.email}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail size={20} />
                    </a>
                  )}
                </div>
              </>
            </InteractiveCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Team;
