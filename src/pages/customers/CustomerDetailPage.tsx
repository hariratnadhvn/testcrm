import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Phone, Mail, Building, Calendar, Edit, Clock, RefreshCcw, TicketPlus } from 'lucide-react';
import { Customer, Ticket } from '../../types';
import { API_URL, SUBSCRIPTION_STATUSES } from '../../config/constants';
import { formatDate, getStatusColor } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import axios from 'axios';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isSalesTeam } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'subscription'>(
    'overview'
  );

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, these would be actual API calls
        // const customerResponse = await axios.get(`${API_URL}/customers/${id}/`);
        // const ticketsResponse = await axios.get(`${API_URL}/tickets/?customer_id=${id}`);
        
        // Mock data for demonstration
        setTimeout(() => {
          setCustomer({
            id: parseInt(id || '1'),
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '555-123-4567',
            company: 'Acme Corp',
            created_at: '2025-01-15T09:30:00Z',
            updated_at: '2025-02-10T14:45:00Z'
          });
          
          setCustomerTickets([
            {
              id: 1,
              ticket_number: 'TKT-00001',
              title: 'Cannot access premium content',
              description: 'Customer reports they cannot access premium content after subscription renewal',
              status: 'open',
              priority: 'high',
              customer: {
                id: parseInt(id || '1'),
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
              updated_at: '2025-03-01T10:30:00Z',
              subscription: {
                id: 1,
                ticket_id: 1,
                plan: 'Premium',
                status: 'active',
                billing_cycle: 'monthly',
                start_date: '2025-01-15T00:00:00Z',
                end_date: '2026-01-15T00:00:00Z',
                created_at: '2025-01-15T09:30:00Z'
              },
              payments: [
                {
                  id: 1,
                  ticket_id: 1,
                  amount: 49.99,
                  status: 'completed',
                  payment_method: 'Credit Card',
                  payment_date: '2025-03-01T10:00:00Z',
                  created_at: '2025-03-01T10:00:00Z'
                }
              ]
            }
          ]);
          
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setIsLoading(false);
      }
    };
    
    fetchCustomerData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Customer not found</h3>
          <p className="mt-2 text-sm text-gray-500">
            The customer you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            to="/customers"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const subscription = customerTickets[0]?.subscription;
  const payments = customerTickets[0]?.payments;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/customers" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
      </div>
      
      {/* Customer header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {customer.first_name} {customer.last_name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{customer.company}</p>
          </div>
          <Link
            to={`/customers/${id}/edit`}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Link>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Email</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{customer.email}</div>
            </div>
            <div className="sm:col-span-1">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Phone</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{customer.phone}</div>
            </div>
            <div className="sm:col-span-1">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Company</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{customer.company}</div>
            </div>
            <div className="sm:col-span-1">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Customer since</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{formatDate(customer.created_at)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tickets
          </button>
          {isSalesTeam() && (
            <button
              onClick={() => setActiveTab('subscription')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscription'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subscription & Payments
            </button>
          )}
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Overview</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Recent Activity</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ul className="divide-y divide-gray-200">
                      <li className="py-3">
                        <div className="flex items-center">
                          <RefreshCcw className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm">
                            <span className="font-medium">Subscription renewed</span> on{' '}
                            <time dateTime="2025-01-15">January 15, 2025</time>
                          </p>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-center">
                          <TicketPlus className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm">
                            <span className="font-medium">New ticket created:</span>{' '}
                            <Link to="/tickets/1" className="text-blue-600 hover:text-blue-800">
                              Cannot access premium content
                            </Link>{' '}
                            on <time dateTime="2025-03-01">March 1, 2025</time>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total tickets</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerTickets.length}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(customer.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
        
        {activeTab === 'tickets' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Tickets</h3>
              {isSalesTeam() && (
                <Link
                  to={{
                    pathname: "/tickets/new",
                    search: `?customer_id=${customer.id}`
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <TicketPlus className="h-4 w-4 mr-1.5" />
                  New Ticket
                </Link>
              )}
            </div>
            <div className="border-t border-gray-200">
              {customerTickets.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {customerTickets.map((ticket) => (
                    <li key={ticket.id}>
                      <Link to={`/tickets/${ticket.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">{ticket.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <Badge 
                                color={
                                  ticket.status === 'open' ? 'yellow' : 
                                  ticket.status === 'in_progress' ? 'blue' : 
                                  ticket.status === 'resolved' ? 'green' : 'gray'
                                }
                              >
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge 
                                className="ml-2"
                                color={
                                  ticket.priority === 'high' ? 'red' : 
                                  ticket.priority === 'medium' ? 'yellow' : 'blue'
                                }
                              >
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                #{ticket.ticket_number}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p>Created {formatDate(ticket.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No tickets found for this customer.</p>
                  {isSalesTeam() && (
                    <Link
                      to={{
                        pathname: "/tickets/new",
                        search: `?customer_id=${customer.id}`
                      }}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <TicketPlus className="h-4 w-4 mr-1.5" />
                      Create First Ticket
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'subscription' && isSalesTeam() && (
          <div className="space-y-6">
            {/* Subscription info */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Details</h3>
              </div>
              {subscription ? (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Plan</dt>
                      <dd className="mt-1 text-sm text-gray-900">{subscription.plan}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <Badge 
                          color={
                            subscription.status === 'active' ? 'green' : 
                            subscription.status === 'cancelled' ? 'red' : 'gray'
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{subscription.billing_cycle}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(subscription.start_date)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">End Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(subscription.end_date)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6 text-center">
                  <p className="text-sm text-gray-500">No subscription information available.</p>
                </div>
              )}
            </div>
            
            {/* Payment history */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
              </div>
              <div className="border-t border-gray-200">
                {payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(payment.payment_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${payment.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.payment_method}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                color={
                                  payment.status === 'completed' ? 'green' : 
                                  payment.status === 'pending' ? 'yellow' : 'red'
                                }
                              >
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-sm text-gray-500">No payment history available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}