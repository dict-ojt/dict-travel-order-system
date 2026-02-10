import React, { useState } from 'react';
import { ArrowLeft, Clock, Route, ArrowRight, Wallet, Car, FileText, Calendar, Edit, Trash2 } from 'lucide-react';
import { Page } from '../types';
import { TravelOrder, travelSources, TravelLeg } from '../data/database';

interface TravelOrderDetailsProps {
    order: TravelOrder;
    onNavigate: (page: Page) => void;
    onBack: () => void;
}

const TravelOrderDetails: React.FC<TravelOrderDetailsProps> = ({ order, onNavigate, onBack }) => {
    const [isProcessing] = useState(false);

    // Use actual legs from order if they exist, otherwise create a single leg fallback
    const legs: TravelLeg[] = order.legs && order.legs.length > 0
        ? order.legs
        : [{
            id: 'leg-fallback',
            fromLocationId: order.originId || 'unknown',
            toLocationId: order.destinationId || 'unknown',
            startDate: order.departureDate,
            endDate: order.returnDate,
            distanceKm: order.estimatedKm,
            isReturn: false
        }];

    // Helper to resolve location names
    const getLocationName = (id: string, fallbackName?: string) => {
        if (fallbackName && id === fallbackName) return fallbackName; // If the ID is actually a name (legacy/fallback)
        const source = travelSources.find(s => s.id === id);
        return source ? source.name : (fallbackName || id);
    };

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

    const getStatusColor = (status: TravelOrder['status']) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'cancelled': return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const totalDistance = order.legs?.reduce((sum, leg) => sum + leg.distanceKm, 0) || order.estimatedKm;
    const overallStartDate = order.departureDate;
    const overallEndDate = order.returnDate;
    const tripDuration = overallStartDate && overallEndDate
        ? Math.ceil((new Date(overallEndDate).getTime() - new Date(overallStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1)
        : 0;

    return (
        <div className="max-w-5xl mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Travel Order Details</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{order.orderNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {order.status === 'pending' && (
                        <>
                            <button disabled={isProcessing} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg" title="Edit">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button disabled={isProcessing} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg" title="Cancel Order">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-6">

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
                                        <React.Fragment key={leg.id || index}>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getLegColorLight(index)}`}>
                                                <div className={`w-2 h-2 rounded-full ${getLegColor(index)}`} />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {getLocationName(leg.fromLocationId, index === 0 ? order.originName : undefined)}
                                                </span>
                                            </div>
                                            {index < legs.length - 1 && (
                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                            )}
                                            {index === legs.length - 1 && (
                                                <>
                                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getLegColorLight(index)}`}>
                                                        <div className={`w-2 h-2 rounded-full ${getLegColor(index)}`} />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {getLocationName(leg.toLocationId, index === legs.length - 1 ? order.destinationName : undefined)}
                                                        </span>
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
                                    <div key={leg.id || index} className="relative">
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
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {getLocationName(leg.fromLocationId, index === 0 ? order.originName : undefined)}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-500">To:</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {getLocationName(leg.toLocationId, index === legs.length - 1 ? order.destinationName : undefined)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                        <Route className="w-4 h-4" />
                                                        <span>{leg.distanceKm?.toLocaleString() || 0} km</span>
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
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{order.vehicle || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Purpose</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                {order.purpose}
                            </p>
                        </div>

                        {/* Remarks */}
                        {order.remarks && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Remarks</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                    {order.remarks}
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
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{order.fundSource || 'General Fund'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Vehicle to be Used</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    <Car className="w-4 h-4 text-slate-400" />
                                    {order.vehicle || 'Not specified'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                            <p className="text-xs text-slate-500 mb-2">Additional Travel Expenses</p>
                            <div className="flex flex-wrap gap-2">
                                {order.expenses && order.expenses.map(expense => (
                                    <span key={expense} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-dash-blue text-sm rounded-lg border border-blue-200 dark:border-blue-800">
                                        {getExpenseLabel(expense)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow & Approvals */}
                <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{order.approvalSteps}</p>
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

            </div>
        </div>
    );
};

export default TravelOrderDetails;
