import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Ticket, Filter, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Ticket as TicketType } from '../../types';
import { API_URL, TICKET_STATUSES, PRIORITY_LEVELS } from '../../config/constants';
import { formatDate, getStatusColor } from '../../utils/helpers';
import axios from 'axios';

export default function TicketsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSalesTeam } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (statusFilter) params.append('status', statusFilter);
        if (priorityFilter) params.append('priority', priorityFilter);
        if (searchQuery) params.append('search', searchQuery);
        
        // In a real implementation, this would fetch from the API
        // const response = await axios.get(`${API_URL}/tickets/?${params.toString()}`);
        // setTickets(response.data.results);
        // setTotalPages(Math.ceil(response.data.count / 10));
        
        // Mock data for demonstration
        setTimeout(() => {
          setTickets([
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
            },
            {
              id: 3,
              ticket_number: 'TKT-00003',
              title: 'Feature request: Dark mode',
              description: 'Customer requesting dark mode for the dashboard',
              status: 'open',
              priority: 'low',
              customer: {
                id: 3,
                first_name: 'Michael',
                last_name: 'Johnson',
                email: 'michael@example.com',
                phone: '555-333-2222',
                company: 'Johnson LLC',
                created_at: '2025-02-05T11:45:00Z',
                updated_at: '2025-02-05T11:45:00Z'
              },
              assigned_to: null,
              created_by: 2,
              created_at: '2025-03-03T14:20:00Z',
              updated_at: '2025-03-03T14:20:00Z'
            },
            {
              id: 4,
              ticket_number: 'TKT-00004',
              title: 'Password reset issue',
              description: 'Customer cannot reset password using the forgot password link',
              status: 'resolved',
              priority: 'high',
              customer: {
                id: 4,
                first_name: 'Sarah',
                last_name: 'Wilson',
                email: 'sarah@example.com',
                phone: '555-444-1111',
                company: 'Wilson Technologies',
                created_at: '2025-02-10T09:30:00Z',
                updated_at: '2025-02-10T09:30:00Z'
              },
              assigned_to: 3,
              created_by: 1,
              created_at: '2025-03-04T08:15:00Z',
              updated_at: '2025-03-04T16:30:00Z'
            },
            {
              id: 5,
              ticket_number: 'TKT-00005',
              title: 'API integration help',
              description: 'Customer needs assistance integrating our API with their system',
              status: 'in_progress',
              priority: 'medium',
              customer: {
                id: 5,
                first_name: 'Robert',
                last_name: 'Brown',
                email: 'robert@example.com',
                phone: '555-666-7777',
                company: 'Brown Enterprises',
                created_at: '2025-02-15T13:20:00Z',
                updated_at: '2025-02-15T13:20:00Z'
              },
              assigned_to: 2,
              created_by: 2,
              created_at: '2025-03-05T10:45:00Z',
              updated_at: '2025-03-05T14:30:00Z'
            }
          ]);
          setTotalPages(3);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setIsLoading(false);
      }
    };
    
    fetchTickets();
  }, [page, statusFilter, priorityFilter, searchQuery]);
  
  const handleFilterApply = () => {
    // Update URL with filters
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);
    if (searchQuery) params.append('search', searchQuery);
    
    navigate(`/tickets?${params.toString()}`);
    setPage(1);
    setShowFilters(false);
  };
  
  const handleFilterReset = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setSearchQuery('');
    navigate('/tickets');
    setPage(1);
    setShowFilters(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer support tickets
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          {isSalesTeam() && (
            <Link
              to="/tickets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Link>
          )}
        </div>
      </div>
      
      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                {TICKET_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All Priorities</option>
                {PRIORITY_LEVELS.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search-filter"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={handleFilterReset}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              onClick={handleFilterApply}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Tickets list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-4 py-10 sm:px-6 text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-600 rounded-full" />
            <p className="mt-2 text-sm text-gray-500">Loading tickets...</p>
          </div>
        ) : tickets.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link to={`/tickets/${ticket.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Ticket className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {ticket.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            #{ticket.ticket_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {ticket.customer.first_name} {ticket.customer.last_name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {ticket.customer.company}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Created {formatDate(ticket.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-10 sm:px-6 text-center">
            <p className="text-sm text-gray-500">No tickets found.</p>
            {isSalesTeam() && (
              <Link
                to="/tickets/new"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Ticket
              </Link>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {tickets.length > 0 && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{tickets.length}</span> of{' '}
                <span className="font-medium">25</span> results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}