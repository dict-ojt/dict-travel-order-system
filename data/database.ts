// ============================================
// DICT Travel Order System - Client-Side Database
// ============================================

import { Page } from '../types';

// ============================================
// DIVISIONS
// ============================================
export interface Division {
    id: string;
    code: string;
    name: string;
    acronym: string;
    head: string;
    headPosition: string;
    headAvatar: string;
    employeeCount: number;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    description: string;
}

export const divisions: Division[] = [
    {
        id: 'div-001',
        code: 'MISS',
        name: 'Management Information Systems Service',
        acronym: 'MISS',
        head: 'Maria L. Cruz',
        headPosition: 'Director IV',
        headAvatar: 'https://i.pravatar.cc/100?u=maria',
        employeeCount: 24,
        email: 'miss@dict.gov.ph',
        phone: '+63 2 8920-0101',
        status: 'active',
        description: 'Responsible for ICT infrastructure and systems development'
    },
    {
        id: 'div-002',
        code: 'ICTO',
        name: 'Information & Communications Technology Office',
        acronym: 'ICTO',
        head: 'Juan D. Santos',
        headPosition: 'Director III',
        headAvatar: 'https://i.pravatar.cc/100?u=juan',
        employeeCount: 32,
        email: 'icto@dict.gov.ph',
        phone: '+63 2 8920-0102',
        status: 'active',
        description: 'Oversees national ICT policies and programs'
    },
    {
        id: 'div-003',
        code: 'ICTD',
        name: 'ICT Development Division',
        acronym: 'ICTD',
        head: 'Ana R. Reyes',
        headPosition: 'Chief',
        headAvatar: 'https://i.pravatar.cc/100?u=ana',
        employeeCount: 18,
        email: 'ictd@dict.gov.ph',
        phone: '+63 2 8920-0103',
        status: 'active',
        description: 'Develops and maintains ICT applications'
    },
    {
        id: 'div-004',
        code: 'HRMD',
        name: 'Human Resource Management Division',
        acronym: 'HRMD',
        head: 'Pedro M. Garcia',
        headPosition: 'Chief',
        headAvatar: 'https://i.pravatar.cc/100?u=pedro',
        employeeCount: 15,
        email: 'hrmd@dict.gov.ph',
        phone: '+63 2 8920-0104',
        status: 'active',
        description: 'Manages employee relations and human resources'
    },
    {
        id: 'div-005',
        code: 'FAD',
        name: 'Finance and Administrative Division',
        acronym: 'FAD',
        head: 'Rosa T. Mendoza',
        headPosition: 'Chief',
        headAvatar: 'https://i.pravatar.cc/100?u=rosa',
        employeeCount: 20,
        email: 'fad@dict.gov.ph',
        phone: '+63 2 8920-0105',
        status: 'active',
        description: 'Handles financial and administrative operations'
    },
    {
        id: 'div-006',
        code: 'LEGAL',
        name: 'Legal Affairs Division',
        acronym: 'LEGAL',
        head: 'Carlos B. Lim',
        headPosition: 'Chief',
        headAvatar: 'https://i.pravatar.cc/100?u=carlos',
        employeeCount: 8,
        email: 'legal@dict.gov.ph',
        phone: '+63 2 8920-0106',
        status: 'active',
        description: 'Provides legal counsel and services'
    },
    {
        id: 'div-007',
        code: 'PROC',
        name: 'Procurement Division',
        acronym: 'PROC',
        head: 'Elena V. Torres',
        headPosition: 'Chief',
        headAvatar: 'https://i.pravatar.cc/100?u=elena',
        employeeCount: 12,
        email: 'procurement@dict.gov.ph',
        phone: '+63 2 8920-0107',
        status: 'active',
        description: 'Manages procurement and supply chain'
    },
    {
        id: 'div-008',
        code: 'RO-NCR',
        name: 'Regional Office - NCR',
        acronym: 'RO-NCR',
        head: 'Miguel A. Fernandez',
        headPosition: 'Regional Director',
        headAvatar: 'https://i.pravatar.cc/100?u=miguel',
        employeeCount: 19,
        email: 'ncr@dict.gov.ph',
        phone: '+63 2 8920-0108',
        status: 'active',
        description: 'Regional operations for National Capital Region'
    }
];

// ============================================
// EMPLOYEES
// ============================================
export interface Employee {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    divisionId: string;
    divisionCode: string;
    avatar: string;
    status: 'active' | 'on-leave' | 'inactive';
    hireDate: string;
}

export const employees: Employee[] = [
    {
        id: 'emp-001',
        employeeId: 'DICT-2026-001',
        firstName: 'Maria',
        lastName: 'Cruz',
        fullName: 'Maria L. Cruz',
        email: 'maria.cruz@dict.gov.ph',
        phone: '+63 917 123 4501',
        position: 'Director IV',
        divisionId: 'div-001',
        divisionCode: 'MISS',
        avatar: 'https://i.pravatar.cc/100?u=maria',
        status: 'active',
        hireDate: '2018-03-15'
    },
    {
        id: 'emp-002',
        employeeId: 'DICT-2026-002',
        firstName: 'Juan',
        lastName: 'Santos',
        fullName: 'Juan D. Santos',
        email: 'juan.santos@dict.gov.ph',
        phone: '+63 917 123 4502',
        position: 'Director III',
        divisionId: 'div-002',
        divisionCode: 'ICTO',
        avatar: 'https://i.pravatar.cc/100?u=juan',
        status: 'active',
        hireDate: '2019-06-20'
    },
    {
        id: 'emp-003',
        employeeId: 'DICT-2026-003',
        firstName: 'Ana',
        lastName: 'Reyes',
        fullName: 'Ana R. Reyes',
        email: 'ana.reyes@dict.gov.ph',
        phone: '+63 917 123 4503',
        position: 'Chief',
        divisionId: 'div-003',
        divisionCode: 'ICTD',
        avatar: 'https://i.pravatar.cc/100?u=ana',
        status: 'active',
        hireDate: '2020-01-10'
    },
    {
        id: 'emp-004',
        employeeId: 'DICT-2026-004',
        firstName: 'Pedro',
        lastName: 'Garcia',
        fullName: 'Pedro M. Garcia',
        email: 'pedro.garcia@dict.gov.ph',
        phone: '+63 917 123 4504',
        position: 'Chief',
        divisionId: 'div-004',
        divisionCode: 'HRMD',
        avatar: 'https://i.pravatar.cc/100?u=pedro',
        status: 'active',
        hireDate: '2017-08-05'
    },
    {
        id: 'emp-005',
        employeeId: 'DICT-2026-005',
        firstName: 'Rosa',
        lastName: 'Mendoza',
        fullName: 'Rosa T. Mendoza',
        email: 'rosa.mendoza@dict.gov.ph',
        phone: '+63 917 123 4505',
        position: 'Chief',
        divisionId: 'div-005',
        divisionCode: 'FAD',
        avatar: 'https://i.pravatar.cc/100?u=rosa',
        status: 'active',
        hireDate: '2016-11-12'
    },
    {
        id: 'emp-006',
        employeeId: 'DICT-2026-006',
        firstName: 'Carlos',
        lastName: 'Lim',
        fullName: 'Carlos B. Lim',
        email: 'carlos.lim@dict.gov.ph',
        phone: '+63 917 123 4506',
        position: 'Chief',
        divisionId: 'div-006',
        divisionCode: 'LEGAL',
        avatar: 'https://i.pravatar.cc/100?u=carlos',
        status: 'active',
        hireDate: '2021-02-28'
    },
    {
        id: 'emp-007',
        employeeId: 'DICT-2026-007',
        firstName: 'Elena',
        lastName: 'Torres',
        fullName: 'Elena V. Torres',
        email: 'elena.torres@dict.gov.ph',
        phone: '+63 917 123 4507',
        position: 'Chief',
        divisionId: 'div-007',
        divisionCode: 'PROC',
        avatar: 'https://i.pravatar.cc/100?u=elena',
        status: 'active',
        hireDate: '2019-09-18'
    },
    {
        id: 'emp-008',
        employeeId: 'DICT-2026-008',
        firstName: 'Miguel',
        lastName: 'Fernandez',
        fullName: 'Miguel A. Fernandez',
        email: 'miguel.fernandez@dict.gov.ph',
        phone: '+63 917 123 4508',
        position: 'Regional Director',
        divisionId: 'div-008',
        divisionCode: 'RO-NCR',
        avatar: 'https://i.pravatar.cc/100?u=miguel',
        status: 'active',
        hireDate: '2018-04-22'
    },
    {
        id: 'emp-009',
        employeeId: 'DICT-2026-009',
        firstName: 'Sofia',
        lastName: 'Villanueva',
        fullName: 'Sofia C. Villanueva',
        email: 'sofia.villanueva@dict.gov.ph',
        phone: '+63 917 123 4509',
        position: 'IT Specialist II',
        divisionId: 'div-001',
        divisionCode: 'MISS',
        avatar: 'https://i.pravatar.cc/100?u=sofia',
        status: 'active',
        hireDate: '2022-07-01'
    },
    {
        id: 'emp-010',
        employeeId: 'DICT-2026-010',
        firstName: 'Ricardo',
        lastName: 'Dela Cruz',
        fullName: 'Ricardo P. Dela Cruz',
        email: 'ricardo.delacruz@dict.gov.ph',
        phone: '+63 917 123 4510',
        position: 'Administrative Officer III',
        divisionId: 'div-005',
        divisionCode: 'FAD',
        avatar: 'https://i.pravatar.cc/100?u=ricardo',
        status: 'active',
        hireDate: '2020-05-15'
    }
];

// ============================================
// TRAVEL SOURCES (Locations)
// ============================================
export interface TravelSource {
    id: string;
    code: string;
    name: string;
    type: 'hub' | 'regional' | 'training' | 'satellite';
    region: string;
    address: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    status: 'active' | 'inactive';
}

export const travelSources: TravelSource[] = [
    {
        id: 'loc-001',
        code: 'DICT-HQ',
        name: 'DICT Headquarters',
        type: 'hub',
        region: 'NCR',
        address: 'C.P. Garcia Ave, Diliman, Quezon City',
        contactPerson: 'Maria L. Cruz',
        contactPhone: '+63 2 8920-0101',
        contactEmail: 'hq@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-002',
        code: 'DICT-R1',
        name: 'DICT Regional Office I',
        type: 'regional',
        region: 'Region I - Ilocos',
        address: 'City of San Fernando, La Union',
        contactPerson: 'Antonio M. Ramos',
        contactPhone: '+63 72 888-1234',
        contactEmail: 'region1@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-003',
        code: 'DICT-R2',
        name: 'DICT Regional Office II',
        type: 'regional',
        region: 'Region II - Cagayan Valley',
        address: 'Tuguegarao City, Cagayan',
        contactPerson: 'Bella S. Tan',
        contactPhone: '+63 78 844-5678',
        contactEmail: 'region2@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-004',
        code: 'DICT-R3',
        name: 'DICT Regional Office III',
        type: 'regional',
        region: 'Region III - Central Luzon',
        address: 'City of San Fernando, Pampanga',
        contactPerson: 'Carlos J. Aquino',
        contactPhone: '+63 45 961-2345',
        contactEmail: 'region3@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-005',
        code: 'DICT-R4A',
        name: 'DICT Regional Office IV-A',
        type: 'regional',
        region: 'Region IV-A - CALABARZON',
        address: 'Calamba City, Laguna',
        contactPerson: 'Diana R. Lopez',
        contactPhone: '+63 49 545-6789',
        contactEmail: 'region4a@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-006',
        code: 'DICT-TC1',
        name: 'DICT Training Center - Manila',
        type: 'training',
        region: 'NCR',
        address: 'Intramuros, Manila',
        contactPerson: 'Elena V. Torres',
        contactPhone: '+63 2 8527-1234',
        contactEmail: 'training.manila@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-007',
        code: 'DICT-HUB-CEBU',
        name: 'DICT Tech Hub Cebu',
        type: 'hub',
        region: 'Region VII - Central Visayas',
        address: 'Cebu IT Park, Cebu City',
        contactPerson: 'Roberto C. Tan',
        contactPhone: '+63 32 234-5678',
        contactEmail: 'techhub.cebu@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-008',
        code: 'DICT-HUB-DAVAO',
        name: 'DICT Tech Hub Davao',
        type: 'hub',
        region: 'Region XI - Davao',
        address: 'Lanang, Davao City',
        contactPerson: 'Fatima B. Santos',
        contactPhone: '+63 82 227-8901',
        contactEmail: 'techhub.davao@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-009',
        code: 'DICT-R7',
        name: 'DICT Regional Office VII',
        type: 'regional',
        region: 'Region VII - Central Visayas',
        address: 'Cebu City, Cebu',
        contactPerson: 'Manuel L. Gomez',
        contactPhone: '+63 32 253-4567',
        contactEmail: 'region7@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-010',
        code: 'DICT-SAT-BAGUIO',
        name: 'DICT Satellite Office - Baguio',
        type: 'satellite',
        region: 'CAR - Cordillera',
        address: 'Baguio City, Benguet',
        contactPerson: 'Grace A. Palma',
        contactPhone: '+63 74 442-7890',
        contactEmail: 'baguio@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-011',
        code: 'DICT-HUB-ILOILO',
        name: 'DICT Tech Hub Iloilo',
        type: 'hub',
        region: 'Region VI - Western Visayas',
        address: 'Iloilo Business Park, Iloilo City',
        contactPerson: 'Jose P. Marcos',
        contactPhone: '+63 33 337-1234',
        contactEmail: 'techhub.iloilo@dict.gov.ph',
        status: 'active'
    },
    {
        id: 'loc-012',
        code: 'DICT-HUB-ZAMBO',
        name: 'DICT Tech Hub Zamboanga',
        type: 'hub',
        region: 'Region IX - Zamboanga Peninsula',
        address: 'Zamboanga City',
        contactPerson: 'Amina S. Hassan',
        contactPhone: '+63 62 991-5678',
        contactEmail: 'techhub.zamboanga@dict.gov.ph',
        status: 'active'
    }
];

// ============================================
// TRAVEL ORDERS
// ============================================
export interface TravelLeg {
    id: string;
    fromLocationId: string;
    toLocationId: string;
    startDate: string;
    endDate: string;
    distanceKm: number;
    isReturn: boolean;
}

export interface TravelOrder {
    id: string;
    orderNumber: string;
    employeeId: string;
    employeeName: string;
    employeeAvatar: string;
    divisionCode: string;
    purpose: string;
    originId: string;
    originName: string;
    destinationId: string;
    destinationName: string;
    departureDate: string;
    returnDate: string;
    vehicle: string;
    estimatedKm: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    createdAt: string;
    approvedBy?: string;
    approvedAt?: string;
    remarks?: string;
    legs?: TravelLeg[];
    fundSource?: string;
    expenses?: string[];
    approvalSteps?: string;
}

export const travelOrders: TravelOrder[] = [
    {
        id: 'to-001',
        orderNumber: 'TO-2026-001',
        employeeId: 'emp-001',
        employeeName: 'Maria L. Cruz',
        employeeAvatar: 'https://i.pravatar.cc/100?u=maria',
        divisionCode: 'MISS',
        purpose: 'ICT Infrastructure Assessment - Visayas Region',
        originId: 'loc-001',
        originName: 'DICT Headquarters',
        destinationId: 'loc-011',
        destinationName: 'DICT Tech Hub Iloilo',
        departureDate: '2026-02-15',
        returnDate: '2026-02-19',
        vehicle: 'Commercial Air',
        estimatedKm: 1210,
        status: 'approved',
        createdAt: '2026-02-10',
        approvedBy: 'Juan D. Santos',
        approvedAt: '2026-02-11',
        fundSource: 'General Fund',
        expenses: ['actual', 'perdiem'],
        approvalSteps: 'Direct Supervisor → HR',
        legs: [
            {
                id: 'leg-001',
                fromLocationId: 'loc-001',
                toLocationId: 'loc-007',
                startDate: '2026-02-15',
                endDate: '2026-02-16',
                distanceKm: 570,
                isReturn: false
            },
            {
                id: 'leg-002',
                fromLocationId: 'loc-007',
                toLocationId: 'loc-011',
                startDate: '2026-02-16',
                endDate: '2026-02-18',
                distanceKm: 180,
                isReturn: false
            },
            {
                id: 'leg-003',
                fromLocationId: 'loc-011',
                toLocationId: 'loc-001',
                startDate: '2026-02-18',
                endDate: '2026-02-19',
                distanceKm: 465,
                isReturn: true
            }
        ]
    },
    {
        id: 'to-002',
        orderNumber: 'TO-2026-002',
        employeeId: 'emp-002',
        employeeName: 'Juan D. Santos',
        employeeAvatar: 'https://i.pravatar.cc/100?u=juan',
        divisionCode: 'ICTO',
        purpose: 'Policy Coordination Meeting',
        originId: 'loc-001',
        originName: 'DICT Headquarters',
        destinationId: 'loc-004',
        destinationName: 'DICT Regional Office III',
        departureDate: '2026-02-18',
        returnDate: '2026-02-18',
        vehicle: 'Official Fleet',
        estimatedKm: 85,
        status: 'pending',
        createdAt: '2026-02-12'
    },
    {
        id: 'to-003',
        orderNumber: 'TO-2026-003',
        employeeId: 'emp-003',
        employeeName: 'Ana R. Reyes',
        employeeAvatar: 'https://i.pravatar.cc/100?u=ana',
        divisionCode: 'ICTD',
        purpose: 'Multi-Region System Deployment & Training',
        originId: 'loc-001',
        originName: 'DICT Headquarters',
        destinationId: 'loc-008',
        destinationName: 'DICT Tech Hub Davao',
        departureDate: '2026-02-20',
        returnDate: '2026-02-27',
        vehicle: 'Commercial Air',
        estimatedKm: 1955,
        status: 'pending',
        createdAt: '2026-02-14',
        fundSource: 'Special Projects',
        expenses: ['actual', 'perdiem'],
        approvalSteps: 'Director → Finance → HR',
        legs: [
            {
                id: 'leg-001',
                fromLocationId: 'loc-001',
                toLocationId: 'loc-007',
                startDate: '2026-02-20',
                endDate: '2026-02-22',
                distanceKm: 570,
                isReturn: false
            },
            {
                id: 'leg-002',
                fromLocationId: 'loc-007',
                toLocationId: 'loc-008',
                startDate: '2026-02-22',
                endDate: '2026-02-25',
                distanceKm: 405,
                isReturn: false
            },
            {
                id: 'leg-003',
                fromLocationId: 'loc-008',
                toLocationId: 'loc-001',
                startDate: '2026-02-25',
                endDate: '2026-02-27',
                distanceKm: 980,
                isReturn: true
            }
        ]
    },
    {
        id: 'to-004',
        orderNumber: 'TO-2026-004',
        employeeId: 'emp-009',
        employeeName: 'Sofia C. Villanueva',
        employeeAvatar: 'https://i.pravatar.cc/100?u=sofia',
        divisionCode: 'MISS',
        purpose: 'Network Infrastructure Audit',
        originId: 'loc-001',
        originName: 'DICT Headquarters',
        destinationId: 'loc-002',
        destinationName: 'DICT Regional Office I',
        departureDate: '2026-02-19',
        returnDate: '2026-02-20',
        vehicle: 'Official Fleet',
        estimatedKm: 270,
        status: 'approved',
        createdAt: '2026-02-13',
        approvedBy: 'Maria L. Cruz',
        approvedAt: '2026-02-14'
    },
    {
        id: 'to-005',
        orderNumber: 'TO-2026-005',
        employeeId: 'emp-007',
        employeeName: 'Elena V. Torres',
        employeeAvatar: 'https://i.pravatar.cc/100?u=elena',
        divisionCode: 'PROC',
        purpose: 'Procurement Workshop',
        originId: 'loc-001',
        originName: 'DICT Headquarters',
        destinationId: 'loc-006',
        destinationName: 'DICT Training Center - Manila',
        departureDate: '2026-02-16',
        returnDate: '2026-02-16',
        vehicle: 'Official Fleet',
        estimatedKm: 15,
        status: 'completed',
        createdAt: '2026-02-08',
        approvedBy: 'Rosa T. Mendoza',
        approvedAt: '2024-02-09'
    },
    {
        id: 'to-006',
        orderNumber: 'TO-2024-006',
        employeeId: 'emp-008',
        employeeName: 'Miguel A. Fernandez',
        employeeAvatar: 'https://i.pravatar.cc/100?u=miguel',
        divisionCode: 'RO-NCR',
        purpose: 'Regional Coordination Meeting',
        originId: 'loc-001',
        originName: 'DICT Headquarters',
        destinationId: 'loc-005',
        destinationName: 'DICT Regional Office IV-A',
        departureDate: '2024-02-22',
        returnDate: '2024-02-22',
        vehicle: 'Private Reimburse',
        estimatedKm: 60,
        status: 'rejected',
        createdAt: '2024-02-15',
        remarks: 'Insufficient budget allocation for this quarter'
    }
];

// ============================================
// APPROVALS
// ============================================
export interface Approval {
    id: string;
    travelOrderId: string;
    orderNumber: string;
    requestorId: string;
    requestorName: string;
    requestorAvatar: string;
    requestorDivision: string;
    purpose: string;
    destination: string;
    travelDate: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    processedAt?: string;
    processedBy?: string;
    remarks?: string;
}

export const approvals: Approval[] = [
    {
        id: 'apr-001',
        travelOrderId: 'to-002',
        orderNumber: 'TO-2024-002',
        requestorId: 'emp-002',
        requestorName: 'Juan D. Santos',
        requestorAvatar: 'https://i.pravatar.cc/100?u=juan',
        requestorDivision: 'ICTO',
        purpose: 'Policy Coordination Meeting',
        destination: 'DICT Regional Office III',
        travelDate: '2024-02-18',
        status: 'pending',
        submittedAt: '2024-02-12'
    },
    {
        id: 'apr-002',
        travelOrderId: 'to-003',
        orderNumber: 'TO-2024-003',
        requestorId: 'emp-003',
        requestorName: 'Ana R. Reyes',
        requestorAvatar: 'https://i.pravatar.cc/100?u=ana',
        requestorDivision: 'ICTD',
        purpose: 'System Deployment & Training',
        destination: 'DICT Tech Hub Davao',
        travelDate: '2024-02-20',
        status: 'pending',
        submittedAt: '2024-02-14'
    },
    {
        id: 'apr-003',
        travelOrderId: 'to-001',
        orderNumber: 'TO-2024-001',
        requestorId: 'emp-001',
        requestorName: 'Maria L. Cruz',
        requestorAvatar: 'https://i.pravatar.cc/100?u=maria',
        requestorDivision: 'MISS',
        purpose: 'ICT Infrastructure Assessment',
        destination: 'DICT Tech Hub Cebu',
        travelDate: '2024-02-15',
        status: 'approved',
        submittedAt: '2024-02-10',
        processedAt: '2024-02-11',
        processedBy: 'Juan D. Santos'
    },
    {
        id: 'apr-004',
        travelOrderId: 'to-004',
        orderNumber: 'TO-2024-004',
        requestorId: 'emp-009',
        requestorName: 'Sofia C. Villanueva',
        requestorAvatar: 'https://i.pravatar.cc/100?u=sofia',
        requestorDivision: 'MISS',
        purpose: 'Network Infrastructure Audit',
        destination: 'DICT Regional Office I',
        travelDate: '2024-02-19',
        status: 'approved',
        submittedAt: '2024-02-13',
        processedAt: '2024-02-14',
        processedBy: 'Maria L. Cruz'
    },
    {
        id: 'apr-005',
        travelOrderId: 'to-006',
        orderNumber: 'TO-2024-006',
        requestorId: 'emp-008',
        requestorName: 'Miguel A. Fernandez',
        requestorAvatar: 'https://i.pravatar.cc/100?u=miguel',
        requestorDivision: 'RO-NCR',
        purpose: 'Regional Coordination Meeting',
        destination: 'DICT Regional Office IV-A',
        travelDate: '2024-02-22',
        status: 'rejected',
        submittedAt: '2024-02-15',
        processedAt: '2024-02-16',
        processedBy: 'Rosa T. Mendoza',
        remarks: 'Insufficient budget allocation for this quarter'
    }
];

// ============================================
// DASHBOARD STATISTICS
// ============================================
export const getDashboardStats = () => {
    const totalEmployees = employees.length;
    const totalDivisions = divisions.length;
    const totalLocations = travelSources.length;

    const totalOrders = travelOrders.length;
    const approvedOrders = travelOrders.filter(o => o.status === 'approved').length;
    const pendingOrders = travelOrders.filter(o => o.status === 'pending').length;
    const completedOrders = travelOrders.filter(o => o.status === 'completed').length;
    const rejectedOrders = travelOrders.filter(o => o.status === 'rejected').length;

    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    const approvedToday = approvals.filter(a => a.status === 'approved').length;
    const rejectedToday = approvals.filter(a => a.status === 'rejected').length;

    return {
        totalEmployees,
        totalDivisions,
        totalLocations,
        totalOrders,
        approvedOrders,
        pendingOrders,
        completedOrders,
        rejectedOrders,
        pendingApprovals,
        approvedToday,
        rejectedToday,
        activeWorkflows: pendingOrders + pendingApprovals
    };
};

// ============================================
// CURRENT USER (Mock Session)
// ============================================
export const currentUser = employees[0]; // Maria L. Cruz

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getEmployeeById = (id: string) => employees.find(e => e.id === id);
export const getEmployeesByDivision = (divisionId: string) => employees.filter(e => e.divisionId === divisionId);
export const getDivisionById = (id: string) => divisions.find(d => d.id === id);
export const getDivisionByCode = (code: string) => divisions.find(d => d.code === code);
export const getTravelSourceById = (id: string) => travelSources.find(s => s.id === id);
export const getTravelOrderById = (id: string) => travelOrders.find(o => o.id === id);
export const getApprovalById = (id: string) => approvals.find(a => a.id === id);

export const getTravelOrdersByDate = (date: string) => travelOrders.filter(o => o.departureDate === date || o.returnDate === date);

export const getLocationsByType = (type: TravelSource['type']) => travelSources.filter(s => s.type === type);
export const getLocationCounts = () => ({
    total: travelSources.length,
    hubs: travelSources.filter(s => s.type === 'hub').length,
    regional: travelSources.filter(s => s.type === 'regional').length,
    training: travelSources.filter(s => s.type === 'training').length,
    satellite: travelSources.filter(s => s.type === 'satellite').length
});

export const getDivisionStats = () => ({
    total: divisions.length,
    totalPersonnel: divisions.reduce((sum, d) => sum + d.employeeCount, 0),
    activeUnits: divisions.filter(d => d.status === 'active').length,
    avgTeamSize: Math.round(divisions.reduce((sum, d) => sum + d.employeeCount, 0) / divisions.length)
});
