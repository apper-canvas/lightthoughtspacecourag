import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('all');
  
  // Icon declarations
  const MenuIcon = getIcon('Menu');
  const ChevronRightIcon = getIcon('ChevronRight');
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FolderIcon = getIcon('Folder');
  const StarIcon = getIcon('Star');
  const ClockIcon = getIcon('Clock');
  const ArchiveIcon = getIcon('Archive');
  const BookOpenIcon = getIcon('BookOpen');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const CalendarIcon = getIcon('Calendar');
  const ListTodoIcon = getIcon('ListTodo');

  // Mock data for workspaces and pages
  const workspaces = [
    {
      id: 1,
      name: "Personal",
      icon: "User",
      pages: [
        { id: 1, title: "My Tasks", icon: "CheckSquare" },
        { id: 2, title: "Reading List", icon: "BookOpen" },
        { id: 3, title: "Travel Plans", icon: "Map" },
      ]
    },
    {
      id: 2,
      name: "Work",
      icon: "Briefcase",
      pages: [
        { id: 4, title: "Project Alpha", icon: "Rocket" },
        { id: 5, title: "Meeting Notes", icon: "FileText" },
        { id: 6, title: "Roadmap", icon: "GitBranch" },
      ]
    }
  ];

  const handleCreatePage = () => {
    toast.success("New page created! Start adding content now.");
  };

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Sidebar - Collapsible */}
      <motion.aside 
        initial={{ width: sidebarOpen ? 280 : 0 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.2 }}
        className={`${sidebarOpen ? 'block' : 'hidden'} border-r border-surface-200 dark:border-surface-700 overflow-hidden`}
      >
        <div className="h-full flex flex-col bg-surface-100/50 dark:bg-surface-800/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Workspaces</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search pages..." 
              className="input pl-9 py-2 text-sm"
            />
          </div>
          
          <div className="space-y-1 mb-6">
            <button 
              onClick={() => setActiveView('all')}
              className={`flex items-center gap-2 w-full p-2 rounded-lg text-left ${activeView === 'all' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              <LayoutGridIcon className="w-4 h-4" />
              <span>All Pages</span>
            </button>
            <button 
              onClick={() => setActiveView('favorites')}
              className={`flex items-center gap-2 w-full p-2 rounded-lg text-left ${activeView === 'favorites' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              <StarIcon className="w-4 h-4" />
              <span>Favorites</span>
            </button>
            <button 
              onClick={() => setActiveView('recent')}
              className={`flex items-center gap-2 w-full p-2 rounded-lg text-left ${activeView === 'recent' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              <ClockIcon className="w-4 h-4" />
              <span>Recent</span>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            {workspaces.map(workspace => {
              const WorkspaceIcon = getIcon(workspace.icon);
              return (
                <div key={workspace.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-surface-600 dark:text-surface-400">
                    <WorkspaceIcon className="w-4 h-4" />
                    <span className="font-medium">{workspace.name}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {workspace.pages.map(page => {
                      const PageIcon = getIcon(page.icon);
                      return (
                        <button 
                          key={page.id}
                          className="flex items-center gap-2 w-full p-2 rounded-lg text-left text-sm hover:bg-surface-200 dark:hover:bg-surface-700"
                        >
                          <PageIcon className="w-4 h-4 text-surface-500" />
                          <span>{page.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-auto pt-4 border-t border-surface-200 dark:border-surface-700">
            <button 
              onClick={handleCreatePage}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              New Page
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="m-4 p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        )}
        
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to ThoughtSpace</h1>
            <p className="text-surface-600 dark:text-surface-400 max-w-xl">
              Organize your thoughts, notes, and projects in one flexible workspace.
              Create pages, databases, and more with our powerful editor.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                className="btn bg-primary text-white rounded-full px-4 py-1 flex items-center gap-1 text-sm"
              >
                <BookOpenIcon className="w-4 h-4" />
                <span>Pages</span>
              </button>
              <button 
                className="btn bg-surface-200 dark:bg-surface-700 rounded-full px-4 py-1 flex items-center gap-1 text-sm"
              >
                <LayoutGridIcon className="w-4 h-4" />
                <span>Databases</span>
              </button>
              <button 
                className="btn bg-surface-200 dark:bg-surface-700 rounded-full px-4 py-1 flex items-center gap-1 text-sm"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar</span>
              </button>
              <button 
                className="btn bg-surface-200 dark:bg-surface-700 rounded-full px-4 py-1 flex items-center gap-1 text-sm"
              >
                <ListTodoIcon className="w-4 h-4" />
                <span>Tasks</span>
              </button>
            </div>
          </div>
          
          {/* Main Feature Component */}
          <MainFeature />
        </div>
      </div>
    </div>
  );
};

export default Home;