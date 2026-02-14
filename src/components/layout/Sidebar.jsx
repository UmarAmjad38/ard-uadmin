import { Link, useLocation, NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiGrid, 
  FiFileText, 
  FiFolder, 
  FiUsers, 
  FiMail,
  FiLogOut,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLayout,
  FiHelpCircle,
  FiBarChart2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/properties', icon: FiGrid, label: 'Properties' },
    { path: '/blogs', icon: FiFileText, label: 'Blogs' },
    { path: '/categories', icon: FiFolder, label: 'Categories' },
    { path: '/hero-sections', icon: FiLayout, label: 'Hero Sections' }, // Added Hero Sections link
    { path: '/qnas', icon: FiHelpCircle, label: 'QnA' }, // Added QnA link
    { path: '/stats', icon: FiBarChart2, label: 'Stats' }, // Added Stats link
    // { path: '/team', icon: FiUsers, label: 'Team' }, // Commented out Team link
    { path: '/contacts', icon: FiMail, label: 'Contacts' },
    { path: '/profile', icon: FiSettings, label: 'Settings' }, // Added Profile Settings link
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-100 shadow-premium transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20 w-64' : 'w-64'}`}
      >
        {/* Desktop Collapse Toggle - Floating Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-10 z-50 w-6 h-6 bg-white border border-gray-100 rounded-full shadow-soft items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-100 transition-all duration-300 group"
        >
          {isCollapsed ? (
            <FiChevronRight className="w-4 h-4 group-hover:scale-110" />
          ) : (
            <FiChevronLeft className="w-4 h-4 group-hover:scale-110" />
          )}
        </button>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Section - Cute Rounded */}
          <div className={`flex items-center justify-center ${isCollapsed ? 'py-8' : 'px-6 py-8'}`}>
            <div className={`bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'w-12 h-12' : 'p-4 w-full'}`}>
              <h1 className={`font-bold text-xl text-primary-700 tracking-tighter transition-all duration-200 ${isCollapsed ? 'hidden' : 'block opacity-100'}`}>
                Property Admin
              </h1>
              {isCollapsed && <span className="text-xl font-black text-primary-700">P</span>}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                        isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'gap-3 px-4 py-3 w-full'
                      } ${
                        active
                          ? 'bg-primary-600 text-white shadow-soft font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-200 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} />
                      {!isCollapsed && (
                        <span className="text-sm whitespace-nowrap transition-all duration-200">
                          {item.label}
                        </span>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout - Enhanced */}
          <div className={`mt-auto border-t border-gray-100 bg-gray-50/50 transition-all duration-300 overflow-hidden ${isCollapsed ? 'p-2' : 'px-4 py-6'}`}>
            <div className={`mb-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'px-4 py-3 gap-3'}`}>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-700 font-bold text-lg border border-primary-200 shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 overflow-hidden transition-all duration-200">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className={`flex items-center rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group relative ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'gap-3 px-4 py-3 w-full'}`}
            >
              <FiLogOut className="w-5 h-5 transition-colors flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap transition-all duration-200">Logout</span>}
              
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
