import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpaceCard = ({ title, img, category, link }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    // Eliminamos cursor-pointer de aquí porque el Link ya lo trae
    className="min-w-75 md:min-w-[calc(33.33%-1.5rem)] snap-start group"
  >
    <Link to={link} className="block w-full h-full"> {/* El Link envuelve todo */}
      <div className="overflow-hidden bg-[#F3F2EE] aspect-4/3 mb-6 rounded-sm">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-2">
          {category}
        </span>
        <h3 className="text-lg font-light text-gray-900 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  </motion.div>
);

export default SpaceCard;