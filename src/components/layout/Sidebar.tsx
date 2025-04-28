import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, Users, BarChart, Settings, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  mobile?: boolean;
  closeSidebar?: () => void;
}

export default function Sidebar({ mobile = false, closeSidebar }: SidebarProps) {
  const location = useLocation();
  const { isSalesTeam } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart, salesOnly: true },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];
  
  const filteredNavigation = navigation.filter(item => 
    !item.salesOnly || (item.salesOnly && isSalesTeam())
  );

  return (
    <div className="h-full flex flex-col bg-blue-700">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          {mobile && (
            <button
              className="ml-auto text-white focus:outline-none"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          )}
          {!mobile && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-blue-700 font-bold text-xl">C</div>
              <h1 className="ml-2 text-xl font-semibold text-white">CRM System</h1>
            </div>
          )}
        </div>
        
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-600',
                  'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150'
                )}
                onClick={mobile && closeSidebar}
              >
                <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-blue-800">
        <Link
          to="#help"
          className="flex items-center text-sm font-medium text-blue-100 hover:text-white"
        >
          <span className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-blue-100 mr-3">
            ?
          </span>
          <span>Help & Support</span>
        </Link>
      </div>
    </div>
  );
}