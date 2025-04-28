import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, Users, Ticket, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket as TicketType } from '../../types';
import { formatDate, getStatusColor } from '../../utils/helpers';

export default function DashboardPage() {
  const { user, isSalesTeam } = useAuth();
  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedTickets: 0,
    totalCustomers: 0,
    pendingPayments: 0
  });
  const [recentTickets, setRecentTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Using mock data until API endpoints are ready
        setStats({
          openTickets: 12,
          resolvedTickets: 28,
          totalCustomers: 45,
          pendingPayments: isSalesTeam() ? 5 : 0
        });
        
        setRecentTickets([
          {
            id: 1,
            ticket_number: 'TKT-00001',
            title: 'Cannot access premium content',
            description: 'Customer reports they cannot access premium content after subscription renewal',
            status: 'open',
            priority: 'high',
            customer: {
              id: 1,
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '555-123-4567',
              company: 'Acme Corp',
              created_at: '2025-01-15T09:30:00Z',
              updated_at: '2025-01-15T09:30:00Z'
            },
            assigned_to: 2,
            created_by: 1,
            created_at: '2025-03-01T10:30:00Z',
            updated_at: '2025-03-01T10:30:00Z'
          },
          {
            id: 2,
            ticket_number: 'TKT-00002',
            title: 'Billing discrepancy',
            description: 'Customer was charged twice for monthly subscription',
            status: 'in_progress',
            priority: 'medium',
            customer: {
              id: 2,
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane@example.com',
              phone: '555-987-6543',
              company: 'Smith & Co',
              created_at: '2025-01-20T14:15:00Z',
              updated_at: '2025-01-20T14:15:00Z'
            },
            assigned_to: 1,
            created_by: 1,
            created_at: '2025-03-02T09:15:00Z',
            updated_at: '2025-03-02T11:30:00Z'
          }
        ]);
      } catch (error) {
        console.error('Error setting dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isSalesTeam]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.first_name || user?.username}!
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{stats.openTickets}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/tickets?status=open" className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resolved Tickets</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{stats.resolvedTickets}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/tickets?status=resolved" className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{stats.totalCustomers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/customers" className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {isSalesTeam() && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Payments</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{stats.pendingPayments}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/reports/payments" className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Tickets */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tickets</h3>
          <Link to="/tickets" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        
        {isLoading ? (
          <div className="px-4 py-10 sm:px-6 text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-600 rounded-full" />
            <p className="mt-2 text-sm text-gray-500">Loading recent tickets...</p>
          </div>
        ) : recentTickets.length > 0 ? (
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <Link to={`/tickets/${ticket.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">{ticket.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span>#{ticket.ticket_number}</span>
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <span>{ticket.customer.first_name} {ticket.customer.last_name}</span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Created {formatDate(ticket.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 sm:px-6 text-center">
            <p className="text-sm text-gray-500">No recent tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}