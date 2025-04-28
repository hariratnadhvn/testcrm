import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Customer } from '../../types';
import { API_URL, TICKET_STATUSES, PRIORITY_LEVELS, SUBSCRIPTION_STATUSES, BILLING_CYCLES } from '../../config/constants';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CreateTicketPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCustomerId = searchParams.get('customer_id');
  
  // Form state
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    customer_id: preSelectedCustomerId || '',
    assigned_to: ''
  });
  
  // Subscription details
  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'Basic',
    status: 'active',
    billing_cycle: 'monthly',
    start_date: new Date().toISOString().split('T')[0]
  });
  
  // Payment details
  const [paymentData, setPaymentData] = useState({
    amount: '',
    status: 'completed',
    payment_method: 'Credit Card',
    payment_date: new Date().toISOString().split('T')[0]
  });
  
  // UI state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  
  // Calculate end date based on start date and billing cycle
  useEffect(() => {
    if (subscriptionData.start_date) {
      const startDate = new Date(subscriptionData.start_date);
      const endDate = new Date(startDate);
      
      if (subscriptionData.billing_cycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (subscriptionData.billing_cycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      // This is just for display purposes, not actually setting it in the state
      const endDateElement = document.getElementById('subscription-end-date');
      if (endDateElement) {
        endDateElement.textContent = endDate.toLocaleDateString();
      }
    }
  }, [subscriptionData.start_date, subscriptionData.billing_cycle]);
  
  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        // In a real implementation, this would be an actual API call
        // const response = await axios.get(`${API_URL}/customers/`);
        // setCustomers(response.data);
        
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
            }
          ]);
          setIsLoadingCustomers(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setIsLoadingCustomers(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  // Fetch customer details if pre-selected
  useEffect(() => {
    if (preSelectedCustomerId) {
      setTicketData(prev => ({ ...prev, customer_id: preSelectedCustomerId }));
    }
  }, [preSelectedCustomerId]);
  
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubscriptionData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketData.title.trim() || !ticketData.description.trim() || !ticketData.customer_id) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would be an actual API call
      // const response = await axios.post(`${API_URL}/tickets/`, {
      //   ...ticketData,
      //   subscription: showSubscriptionForm ? subscriptionData : null,
      //   payment: showPaymentForm ? paymentData : null,
      //   created_by: user?.id
      // });
      
      // For demonstration, we'll simulate a successful response
      setTimeout(() => {
        toast.success('Ticket created successfully');
        navigate('/tickets');
      }, 1500);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/tickets" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticket details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Ticket Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Enter the details of the support ticket
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={ticketData.title}
                    onChange={handleTicketChange}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={ticketData.description}
                    onChange={handleTicketChange}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={ticketData.status}
                    onChange={handleTicketChange}
                  >
                    {TICKET_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1">
                  <select
                    id="priority"
                    name="priority"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={ticketData.priority}
                    onChange={handleTicketChange}
                  >
                    {PRIORITY_LEVELS.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">
                  Customer <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="customer_id"
                    name="customer_id"
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={ticketData.customer_id}
                    onChange={handleTicketChange}
                    disabled={isLoadingCustomers}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} - {customer.company}
                      </option>
                    ))}
                  </select>
                </div>
                {isLoadingCustomers && (
                  <p className="mt-1 text-sm text-gray-500">Loading customers...</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Subscription details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Add subscription details if applicable
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSubscriptionForm(!showSubscriptionForm)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              {showSubscriptionForm ? (
                <>
                  <X className="h-4 w-4 mr-1.5" />
                  Remove
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add
                </>
              )}
            </button>
          </div>
          
          {showSubscriptionForm && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                    Plan
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="plan"
                      id="plan"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={subscriptionData.plan}
                      onChange={handleSubscriptionChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="sub-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="sub-status"
                      name="status"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={subscriptionData.status}
                      onChange={handleSubscriptionChange}
                    >
                      {SUBSCRIPTION_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="billing_cycle" className="block text-sm font-medium text-gray-700">
                    Billing Cycle
                  </label>
                  <div className="mt-1">
                    <select
                      id="billing_cycle"
                      name="billing_cycle"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={subscriptionData.billing_cycle}
                      onChange={handleSubscriptionChange}
                    >
                      {BILLING_CYCLES.map((cycle) => (
                        <option key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="start_date"
                      id="start_date"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={subscriptionData.start_date}
                      onChange={handleSubscriptionChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    End Date (Calculated)
                  </label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <span id="subscription-end-date" className="text-sm text-gray-700">
                      {(() => {
                        const startDate = new Date(subscriptionData.start_date);
                        const endDate = new Date(startDate);
                        
                        if (subscriptionData.billing_cycle === 'monthly') {
                          endDate.setMonth(endDate.getMonth() + 1);
                        } else if (subscriptionData.billing_cycle === 'yearly') {
                          endDate.setFullYear(endDate.getFullYear() + 1);
                        }
                        
                        return endDate.toLocaleDateString();
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Payment details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Add payment details if applicable
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              {showPaymentForm ? (
                <>
                  <X className="h-4 w-4 mr-1.5" />
                  Remove
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add
                </>
              )}
            </button>
          </div>
          
          {showPaymentForm && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={paymentData.amount}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="payment-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="payment-status"
                      name="status"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={paymentData.status}
                      onChange={handlePaymentChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <div className="mt-1">
                    <select
                      id="payment_method"
                      name="payment_method"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={paymentData.payment_method}
                      onChange={handlePaymentChange}
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                    Payment Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="payment_date"
                      id="payment_date"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={paymentData.payment_date}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to="/tickets"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Trash className="h-4 w-4 mr-1.5" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}