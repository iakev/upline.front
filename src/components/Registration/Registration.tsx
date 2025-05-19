import { OptimizedImage } from '../common/OptimizedImage';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// Define type for certification data
interface Certification {
  id: number;
  name: string;
  logo: string;
  alt: string;
  link?: string; // Optional link URL
}

const Registration = () => {
  // Use the defined interface
  const certifications: Certification[] = [
    {
      id: 1,
      name: 'REGISTRAR OF COMPANIES',
      logo: '/images/certifications/registrar.png',
      alt: 'Registrar of Companies Certification',
      link: '#', // Placeholder link - replace with actual URL or remove
    },
    {
      id: 2,
      name: 'NATIONAL CONSTRUCTION AUTHORITY (NCA)',
      logo: '/images/certifications/nca.png',
      alt: 'National Construction Authority Certification',
      link: '#', // Placeholder link
    },
    {
      id: 3,
      name: 'YAGPO',
      logo: '/images/certifications/yagpo.png',
      alt: 'YAGPO Certification',
      // No link example
    },
  ];

  const [gridRef, isGridVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Certifications</h2>
        <div
          ref={gridRef}
          className={`grid md:grid-cols-3 gap-8 transition-opacity duration-1000 ease-in ${
            isGridVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {certifications.map((cert) => {
            const CardContent = (
              <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
                <OptimizedImage src={cert.logo} alt={cert.alt} className="h-24 mb-4 object-contain" />
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
              </div>
            );

            return (
              <div key={cert.id}>
                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                    aria-label={`View certification for ${cert.name}`}
                  >
                    {CardContent}
                  </a>
                ) : (
                  CardContent
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Registration;
