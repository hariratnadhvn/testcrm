import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, AlertCircle, Clock, Edit, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Ticket as TicketType } from '../../types';
import { API_URL } from '../../config/constants';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import axios from 'axios';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isSalesTeam } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would be an actual API call
        // const response = await axios.get(`${API_URL}/tickets/${id}/`);
        
        // Mock data for demonstration
        setTimeout(() => {
          setTicket({
            id: parseInt(id || '1'),
            ticket_number: 'TKT-00001',
            title: 'Cannot access premium content',
            description: 'Customer reports they cannot access premium content after subscription renewal. They\'ve tried logging out and back in, clearing cache, and using a different browser but still can\'t access the content they\'ve paid for. Subscription shows as active in their account.',
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
            assigned_to: user?.id || null,
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
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
        setIsLoading(false);
      }
    };
    
    fetchTicketData();
  }, [id, user?.id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      // In a real implementation, this would be an actual API call
      // await axios.patch(`${API_URL}/tickets/${id}/`, { status: newStatus });
      
      // For demonstration, we'll just update the local state
      setTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      // In a real implementation, this would be an actual API call
      // await axios.post(`${API_URL}/tickets/${id}/comments/`, { content: comment });
      
      // For demonstration, we'll just clear the comment field
      setComment('');
      alert('Comment submitted successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Ticket not found</h3>
          <p className="mt-2 text-sm text-gray-500">
            The ticket you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            to="/tickets"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/tickets" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.ticket_number}</h1>
            <p className="text-sm text-gray-500">Created {formatDate(ticket.created_at)}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/tickets/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Link>
        </div>
      </div>
      
      {/* Ticket details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{ticket.title}</h3>
          <div className="mt-1 flex flex-wrap gap-2">
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
              color={
                ticket.priority === 'high' ? 'red' : 
                ticket.priority === 'medium' ? 'yellow' : 'blue'
              }
            >
              {ticket.priority}
            </Badge>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link to={`/customers/${ticket.customer.id}`} className="text-blue-600 hover:text-blue-800">
                  {ticket.customer.first_name} {ticket.customer.last_name}
                </Link>
              </dd>
              <dd className="mt-1 text-sm text-gray-500">{ticket.customer.email}</dd>
              <dd className="mt-1 text-sm text-gray-500">{ticket.customer.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.customer.company}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{ticket.description}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Subscription and payment details (only for sales team) */}
      {isSalesTeam() && (
        <div className="space-y-4">
          {/* Subscription details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
            >
              <h3 className="text-lg font-medium leading-6 text-gray-900">Subscription Details</h3>
              {showSubscriptionDetails ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {showSubscriptionDetails && ticket.subscription && (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Plan</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ticket.subscription.plan}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <Badge 
                        color={
                          ticket.subscription.status === 'active' ? 'green' : 
                          ticket.subscription.status === 'cancelled' ? 'red' : 'gray'
                        }
                      >
                        {ticket.subscription.status}
                      </Badge>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{ticket.subscription.billing_cycle}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(ticket.subscription.start_date)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(ticket.subscription.end_date)}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
          
          {/* Payment details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
            >
              <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Details</h3>
              {showPaymentDetails ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {showPaymentDetails && ticket.payments && (
              <div className="border-t border-gray-200">
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
                    {ticket.payments.map((payment) => (
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
            )}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Actions</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Update Status
              </label>
              <select
                id="status"
                name="status"
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="sm:ml-auto">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => alert('This would assign the ticket to you')}
              >
                <User className="h-4 w-4 mr-1.5" />
                Assign to Me
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Comment */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Add Comment</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form onSubmit={handleSubmitComment}>
            <div>
              <label htmlFor="comment" className="sr-only">
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                placeholder="Add your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Add Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}