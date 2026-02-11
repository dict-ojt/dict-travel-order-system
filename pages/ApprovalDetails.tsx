import React, { useState } from 'react';
import { MapPin, Calendar, Car, Wallet, Users, CheckCircle, FileText, Route, ArrowRight, Clock, X, Download, CheckCircle2, XCircle } from 'lucide-react';
import { Page } from '../types';
import { Approval, getTravelOrderById, getEmployeeById, travelSources, employees, currentUser, TravelLeg } from '../data/database';

interface ApprovalDetailsProps {
  approval: Approval;
  onNavigate: (page: Page) => void;
}

const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({ approval, onNavigate }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const travelOrder = getTravelOrderById(approval.travelOrderId);
  const requestor = getEmployeeById(approval.requestorId);

  // Use actual legs from travelOrder if they exist, otherwise create a single leg fallback
  const legs: TravelLeg[] = travelOrder?.legs?.length 
    ? travelOrder.legs 
    : travelOrder 
      ? [{
          id: 'leg-fallback',
          fromLocationId: travelOrder.originId,
          toLocationId: travelOrder.destinationId,
          startDate: travelOrder.departureDate,
          endDate: travelOrder.returnDate,
          distanceKm: travelOrder.estimatedKm,
          isReturn: false
        }]
      : [];

  const travelers = requestor ? [requestor] : [];
  const fundSource = travelOrder?.fundSource || 'General Fund';
  const expenses = travelOrder?.expenses || ['actual'];
  const approvalSteps = travelOrder?.approvalSteps || 'Direct Supervisor → HR';
  const remarks = travelOrder?.remarks || '';

  const getLocationName = (id: string) => travelSources.find(s => s.id === id)?.name || id;

  const getLegColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    return colors[index % colors.length];
  };

  const getLegColorLight = (index: number) => {
    const colors = ['bg-blue-50 border-blue-200', 'bg-purple-50 border-purple-200', 'bg-green-50 border-green-200', 'bg-amber-50 border-amber-200', 'bg-rose-50 border-rose-200', 'bg-cyan-50 border-cyan-200'];
    return colors[index % colors.length];
  };
  const getExpenseLabel = (value: string) => {
    const labels: Record<string, string> = {
      actual: 'Actual Expenses',
      perdiem: 'Per Diem',
      official: 'Official Time',
      noclaim: 'No Claim',
      na: 'N/A'
    };
    return labels[value] || value;
  };

  const getStatusColor = (status: Approval['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
  const overallStartDate = legs[0]?.startDate || '';
  const overallEndDate = legs[legs.length - 1]?.endDate || '';
  const tripDuration = overallStartDate && overallEndDate 
    ? Math.ceil((new Date(overallEndDate).getTime() - new Date(overallStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1)
    : 0;

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsProcessing(false);
    onNavigate(Page.APPROVALS);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsProcessing(false);
    setShowRejectModal(false);
    onNavigate(Page.APPROVALS);
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Approval Details</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{approval.orderNumber}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(approval.status)}`}>
          {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
        </span>
      </div>

      <div className="space-y-6">
        {/* Requestor Info Card */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <img src={approval.requestorAvatar} alt={approval.requestorName} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{approval.requestorName}</h2>
                <p className="text-sm text-slate-500">{requestor?.position} • {approval.requestorDivision}</p>
                <p className="text-sm text-slate-400 mt-1">{requestor?.email}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p className="flex items-center gap-1.5 justify-end">
                  <Clock className="w-4 h-4" />
                  Submitted: {new Date(approval.submittedAt).toLocaleDateString()}
                </p>
                {approval.processedAt && (
                  <p className="mt-1">Processed: {new Date(approval.processedAt).toLocaleDateString()}</p>
                )}
                {approval.processedBy && (
                  <p className="mt-1">By: {approval.processedBy}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Travel Details */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-dash-blue" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Travel Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Route and schedule information</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Multi-Leg Route Overview */}
            {legs.length > 1 && (
              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Route Overview</p>
                <div className="flex flex-wrap items-center gap-2">
                  {legs.map((leg, index) => (
                    <React.Fragment key={leg.id}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getLegColorLight(index)}`}>
                        <div className={`w-2 h-2 rounded-full ${getLegColor(index)}`} />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{getLocationName(leg.fromLocationId)}</span>
                      </div>
                      {index < legs.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      )}
                      {index === legs.length - 1 && (
                        <>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getLegColorLight(index)}`}>
                            <div className={`w-2 h-2 rounded-full ${getLegColor(index)}`} />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{getLocationName(leg.toLocationId)}</span>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Legs */}
            {legs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{legs.length > 1 ? 'Travel Legs' : 'Travel Route'}</p>
                {legs.map((leg, index) => (
                  <div key={leg.id} className="relative">
                    {index > 0 && (
                      <div className="absolute -top-3 left-6 w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                    )}
                    <div className={`flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg hover:shadow-sm transition-shadow`}>
                      <div className={`w-8 h-8 ${getLegColor(index)} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <span className="text-slate-500">From:</span>
                          <span className="font-medium text-slate-900 dark:text-white">{getLocationName(leg.fromLocationId)}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">To:</span>
                          <span className="font-medium text-slate-900 dark:text-white">{getLocationName(leg.toLocationId)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Route className="w-4 h-4" />
                            <span>{leg.distanceKm.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>{leg.startDate} → {leg.endDate}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              ({Math.ceil((new Date(leg.endDate).getTime() - new Date(leg.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days)
                            </span>
                          </div>
                          {leg.isReturn && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                              Return
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Total Distance</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{totalDistance.toLocaleString()} km</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{tripDuration} {tripDuration === 1 ? 'day' : 'days'}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Vehicle</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{travelOrder?.vehicle || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Purpose</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                {approval.purpose}
              </p>
            </div>

            {/* Remarks */}
            {remarks && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Remarks</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                  {remarks}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Budget & Vehicle */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Budget & Vehicle</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Funding and transportation details</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Fund Source</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{fundSource}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Vehicle to be Used</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-slate-400" />
                  {travelOrder?.vehicle || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 mb-2">Additional Travel Expenses</p>
              <div className="flex flex-wrap gap-2">
                {expenses.map(expense => (
                  <span key={expense} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-dash-blue text-sm rounded-lg border border-blue-200 dark:border-blue-800">
                    {getExpenseLabel(expense)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Travelers */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Travelers</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personnel traveling</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {travelers.map((traveler, index) => (
                <div key={traveler.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <span className="w-8 h-8 bg-dash-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <img src={traveler.avatar} alt={traveler.fullName} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{traveler.fullName}</p>
                    <p className="text-xs text-slate-500">{traveler.position} • {traveler.divisionCode}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow & Approvals */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Workflow & Approvals</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Approval routing configuration</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Approval Steps</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{approvalSteps}</p>
            </div>
          </div>
        </section>

        {/* Attachments */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attachments</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Supporting documents</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No attachments uploaded</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        {approval.status === 'pending' && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setShowRejectModal(true)} 
              disabled={isProcessing}
              className="px-6 py-2.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button 
              onClick={handleApprove} 
              disabled={isProcessing}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Approve'}
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Reject Travel Order</h3>
              <button onClick={() => setShowRejectModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Please provide a reason for rejecting this travel order request.
            </p>
            <textarea
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              rows={4}
              placeholder="Enter rejection remarks..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowRejectModal(false)} 
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject} 
                disabled={!rejectRemarks.trim() || isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDetails;
