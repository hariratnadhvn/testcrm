import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Plus, Users, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Customer } from '../../types';
import { API_URL } from '../../config/constants';
import { formatDate } from '../../utils/helpers';
import axios from 'axios';

export default function CustomersPage() {
  const { isSalesTeam } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would be an actual API call
        // const response = await axios.get(`${API_URL}/customers/?page=${page}&search=${searchQuery}`);
        // setCustomers(response.data.results);
        // setTotalPages(Math.ceil(response.data.count / 10));
        
        // Mock data for demonstration
        setTimeout(() => {
          setCustomers([
            {
              id: 1,
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '555-123-4567',
              company: 'Acme Corp',
              created_at: '2025-01-15T09:30:00Z',
              updated_at: '2025-01-15T09:30:00Z'
            },
            {
              id: 2,
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane@example.com',
              phone: '555-987-6543',
              company: 'Smith & Co',
              created_at: '2025-01-20T14:15:00Z',
              updated_at: '2025-01-20T14:15:00Z'
            },
            {
              id: 3,
              first_name: 'Michael',
              last_name: 'Johnson',
              email: 'michael@example.com',
              phone: '555-333-2222',
              company: 'Johnson LLC',
              created_at: '2025-02-05T11:45:00Z',
              updated_at: '2025-02-05T11:45:00Z'
            },
            {
              id: 4,
              first_name: 'Sarah',
              last_name: 'Wilson',
              email: 'sarah@example.com',
              phone: '555-444-1111',
              company: 'Wilson Technologies',
              created_at: '2025-02-10T09:30:00Z',
              updated_at: '2025-02-10T09:30:00Z'
            },
            {
              id: 5,
              first_name: 'Robert',
              last_name: 'Brown',
              email: 'robert@example.com',
              phone: '555-666-7777',
              company: 'Brown Enterprises',
              created_at: '2025-02-15T13:20:00Z',
              updated_at: '2025-02-15T13:20:00Z'
            }
          ]);
          setTotalPages(2);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching customers:', error);
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [page, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer accounts and information
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
              to="/customers/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Customer
            </Link>
          )}
        </div>
      </div>
      
      {/* Search and filters */}
      <div className={`bg-white shadow rounded-lg p-4 ${showFilters ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearch}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search-customer" className="block text-sm font-medium text-gray-700">
                Search Customers
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search-customer"
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:self-end">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Customers list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-4 py-10 sm:px-6 text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-600 rounded-full" />
            <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
          </div>
        ) : customers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <li key={customer.id}>
                <Link to={`/customers/${customer.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {customer.first_name[0]}{customer.last_name[0]}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {customer.company}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Customer since {formatDate(customer.created_at)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-10 sm:px-6 text-center">
            <p className="text-sm text-gray-500">No customers found.</p>
            {isSalesTeam() && (
              <Link
                to="/customers/new"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Link>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {customers.length > 0 && (
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{customers.length}</span> of{' '}
                <span className="font-medium">20</span> results
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