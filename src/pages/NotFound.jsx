import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Icon declarations
  const HomeIcon = getIcon('Home');
  const SearchIcon = getIcon('Search');
  
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="neu-light p-6 md:p-8 rounded-full">
            <SearchIcon className="w-12 h-12 md:w-16 md:h-16 text-primary dark:text-primary-light" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="mb-8 text-surface-600 dark:text-surface-400">
          We couldn't find the page you're looking for. It might have been moved, 
          deleted, or perhaps it never existed.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <button 
            className="btn btn-secondary flex items-center justify-center gap-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;