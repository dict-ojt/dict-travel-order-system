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
    latitude: number;
    longitude: number;
    status: 'active' | 'inactive';
}

export const travelSources: TravelSource[] = [
    // --- NCR ---
    {
        id: 'loc-ncr-01',
        code: 'DICT-CO',
        name: 'DICT Central Office (Main)',
        type: 'hub',
        region: 'NCR',
        address: 'DICT Building, C.P. Garcia Avenue, Diliman, Quezon City',
        contactPerson: 'Office of the Secretary',
        contactPhone: '+63 2 8920-0101',
        contactEmail: 'osec@dict.gov.ph',
        latitude: 14.6515,
        longitude: 121.0493,
        status: 'active'
    },
    {
        id: 'loc-ncr-02',
        code: 'DICT-ANNEX',
        name: 'DICT Annex (Studio 7)',
        type: 'hub',
        region: 'NCR',
        address: 'Studio 7 Bldg., 807 EDSA, South Triangle, Quezon City',
        contactPerson: 'Admin',
        contactPhone: '+63 2 8920-0101',
        contactEmail: 'admin@dict.gov.ph',
        latitude: 14.6330,
        longitude: 121.0360,
        status: 'active'
    },
    {
        id: 'loc-ncr-03',
        code: 'DICT-NGDC',
        name: 'National Government Data Center',
        type: 'hub',
        region: 'NCR',
        address: 'C.P. Garcia Avenue, Diliman, Quezon City',
        contactPerson: 'Data Center Ops',
        contactPhone: '+63 2 8920-0101',
        contactEmail: 'ngdc@dict.gov.ph',
        latitude: 14.6518,
        longitude: 121.0495,
        status: 'active'
    },
    {
        id: 'loc-ncr-04',
        code: 'DICT-VAL',
        name: 'DICT Valenzuela Field Office',
        type: 'satellite',
        region: 'NCR',
        address: 'Gotaco Bldg. II, McArthur Highway, Marulas, Valenzuela City',
        contactPerson: 'Field Officer',
        contactPhone: '+63 2 8920-0100',
        contactEmail: 'ncr.valenzuela@dict.gov.ph',
        latitude: 14.6750,
        longitude: 120.9750,
        status: 'active'
    },
    {
        id: 'loc-ncr-05',
        code: 'DICT-QC-FO',
        name: 'DICT Quezon City Field Operations',
        type: 'satellite',
        region: 'NCR',
        address: '1013 Quirino Highway, Novaliches, Quezon City',
        contactPerson: 'Field Officer',
        contactPhone: '+63 2 8920-0100',
        contactEmail: 'ncr.qc@dict.gov.ph',
        latitude: 14.7200,
        longitude: 121.0500,
        status: 'active'
    },
    // --- Attached Agencies (NCR) ---
    {
        id: 'loc-ncr-ntc',
        code: 'NTC-MAIN',
        name: 'National Telecommunications Commission',
        type: 'hub',
        region: 'NCR',
        address: 'NTC Bldg., BIR Road, East Triangle, Diliman, Quezon City',
        contactPerson: 'NTC Admin',
        contactPhone: '+63 2 8924-4008',
        contactEmail: 'ntc@gov.ph',
        latitude: 14.6420,
        longitude: 121.0430,
        status: 'active'
    },
    {
        id: 'loc-ncr-npc',
        code: 'NPC-MAIN',
        name: 'National Privacy Commission',
        type: 'hub',
        region: 'NCR',
        address: '5th Floor, Delegation Building, PICC Complex, Pasay City',
        contactPerson: 'NPC Admin',
        contactPhone: '+63 2 8234-2228',
        contactEmail: 'info@privacy.gov.ph',
        latitude: 14.5570,
        longitude: 120.9830,
        status: 'active'
    },
    {
        id: 'loc-ncr-cicc',
        code: 'CICC-MAIN',
        name: 'Cybercrime Investigation and Coordinating Center',
        type: 'hub',
        region: 'NCR',
        address: '#49 Don A. Roces Avenue, Brgy. Paligsahan, Quezon City',
        contactPerson: 'CICC Admin',
        contactPhone: '+63 2 8920-0100',
        contactEmail: 'info@cicc.gov.ph',
        latitude: 14.6300,
        longitude: 121.0250,
        status: 'active'
    },

    // --- CAR ---
    {
        id: 'loc-car-01',
        code: 'DICT-CAR-RO',
        name: 'DICT CAR Regional Office',
        type: 'regional',
        region: 'CAR',
        address: 'Utility Road, Off Wagner Road, Baguio City',
        contactPerson: 'Regional Director',
        contactPhone: '+63 74 442-0101',
        contactEmail: 'car@dict.gov.ph',
        latitude: 16.4023,
        longitude: 120.5960,
        status: 'active'
    },
    { id: 'loc-car-02', code: 'DICT-ABRA', name: 'DICT Abra Provincial Office', type: 'satellite', region: 'CAR', address: 'Bangued (Poblacion), Abra', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 17.595, longitude: 120.618, status: 'active' },
    { id: 'loc-car-03', code: 'DICT-APAYAO', name: 'DICT Apayao Provincial Office', type: 'satellite', region: 'CAR', address: 'Luna (San Isidro Sur), Apayao', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 18.328, longitude: 121.371, status: 'active' },
    { id: 'loc-car-04', code: 'DICT-BENGUET', name: 'DICT Benguet Provincial Office', type: 'satellite', region: 'CAR', address: 'La Trinidad (Provincial Capitol), Benguet', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 16.456, longitude: 120.588, status: 'active' },
    { id: 'loc-car-05', code: 'DICT-IFUGAO', name: 'DICT Ifugao Provincial Office', type: 'satellite', region: 'CAR', address: 'Lagawe (Poblacion East), Ifugao', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 16.800, longitude: 121.117, status: 'active' },
    { id: 'loc-car-06', code: 'DICT-KALINGA', name: 'DICT Kalinga Provincial Office', type: 'satellite', region: 'CAR', address: 'Tabuk City (Bulanao), Kalinga', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 17.417, longitude: 121.442, status: 'active' },
    { id: 'loc-car-07', code: 'DICT-MTPROV', name: 'DICT Mountain Province Office', type: 'satellite', region: 'CAR', address: 'Bontoc (Poblacion), Mountain Province', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 17.089, longitude: 120.976, status: 'active' },

    // --- Region I ---
    {
        id: 'loc-r1-01',
        code: 'DICT-R1-RO',
        name: 'DICT Region I Regional Office',
        type: 'regional',
        region: 'Region I',
        address: 'McArthur Highway, San Fernando City, La Union',
        contactPerson: 'Regional Director',
        contactPhone: '+63 72 888-1234',
        contactEmail: 'region1@dict.gov.ph',
        latitude: 16.6159,
        longitude: 120.3209,
        status: 'active'
    },
    { id: 'loc-r1-02', code: 'DICT-INORTE', name: 'DICT Ilocos Norte Provincial Office', type: 'satellite', region: 'Region I', address: 'P. Hernando St., Laoag City', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 18.1960, longitude: 120.5927, status: 'active' },
    { id: 'loc-r1-03', code: 'DICT-ISUR', name: 'DICT Ilocos Sur Provincial Office', type: 'satellite', region: 'Region I', address: 'Tamag, Vigan City', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 17.574, longitude: 120.387, status: 'active' },
    { id: 'loc-r1-04', code: 'DICT-LAUNION', name: 'DICT La Union Provincial Office', type: 'satellite', region: 'Region I', address: 'Catbangen, San Fernando City', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 16.616, longitude: 120.320, status: 'active' },
    { id: 'loc-r1-05', code: 'DICT-PANG', name: 'DICT Pangasinan Provincial Office', type: 'satellite', region: 'Region I', address: 'Capitol Compound, Lingayen, Pangasinan', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 16.02, longitude: 120.23, status: 'active' },

    // --- Region II ---
    {
        id: 'loc-r2-01',
        code: 'DICT-R2-RO',
        name: 'DICT Region II Regional Office',
        type: 'regional',
        region: 'Region II',
        address: '2 Bagay Road, Tuguegarao City, Cagayan',
        contactPerson: 'Regional Director',
        contactPhone: '+63 78 844-5678',
        contactEmail: 'region2@dict.gov.ph',
        latitude: 17.6132,
        longitude: 121.7270,
        status: 'active'
    },
    { id: 'loc-r2-02', code: 'DICT-BATANES', name: 'DICT Batanes Provincial Office', type: 'satellite', region: 'Region II', address: 'National Road, Basco, Batanes', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 20.448, longitude: 121.970, status: 'active' },
    { id: 'loc-r2-03', code: 'DICT-CAGAYAN', name: 'DICT Cagayan Provincial Office', type: 'satellite', region: 'Region II', address: 'Tuguegarao City, Cagayan', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 17.6131, longitude: 121.7269, status: 'active' },
    { id: 'loc-r2-04', code: 'DICT-ISABELA', name: 'DICT Isabela Provincial Office', type: 'satellite', region: 'Region II', address: 'Capitol Compound, Ilagan City, Isabela', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 17.148, longitude: 121.888, status: 'active' },
    { id: 'loc-r2-05', code: 'DICT-NVIZ', name: 'DICT Nueva Vizcaya Provincial Office', type: 'satellite', region: 'Region II', address: 'Capitol Compound, Bayombong, Nueva Vizcaya', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 16.48, longitude: 121.14, status: 'active' },
    { id: 'loc-r2-06', code: 'DICT-QUIRINO', name: 'DICT Quirino Provincial Office', type: 'satellite', region: 'Region II', address: 'San Marcos, Cabarroguis, Quirino', contactPerson: 'Provincial Officer', contactPhone: '', contactEmail: '', latitude: 16.52, longitude: 121.52, status: 'active' },

    // --- Region III ---
    {
        id: 'loc-r3-01',
        code: 'DICT-R3-RO',
        name: 'DICT Region III Regional Office',
        type: 'regional',
        region: 'Region III',
        address: '3F Marison Square Bldg, Sta. Rita, Guiguinto, Bulacan',
        contactPerson: 'Regional Director',
        contactPhone: '+63 44 794-0101',
        contactEmail: 'region3@dict.gov.ph',
        latitude: 14.835,
        longitude: 120.880,
        status: 'active'
    },
    { id: 'loc-r3-02', code: 'DICT-AURORA', name: 'DICT Aurora Provincial Office', type: 'satellite', region: 'Region III', address: 'ATC Compound, Brgy. Calabuanan, Baler, Aurora', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 15.758, longitude: 121.56, status: 'active' },
    { id: 'loc-r3-03', code: 'DICT-BATAAN', name: 'DICT Bataan Provincial Office', type: 'satellite', region: 'Region III', address: 'DICT Bldg, J.P. Rizal St., Balanga City, Bataan', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 14.678, longitude: 120.54, status: 'active' },
    { id: 'loc-r3-04', code: 'DICT-BULACAN', name: 'DICT Bulacan Provincial Office', type: 'satellite', region: 'Region III', address: 'Malolos City, Bulacan', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 14.852, longitude: 120.816, status: 'active' },
    { id: 'loc-r3-05', code: 'DICT-NECIJA', name: 'DICT Nueva Ecija Provincial Office', type: 'satellite', region: 'Region III', address: 'Business Center, Palayan City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 15.54, longitude: 121.08, status: 'active' },
    { id: 'loc-r3-06', code: 'DICT-PAMP', name: 'DICT Pampanga Provincial Office', type: 'satellite', region: 'Region III', address: 'Ubas St., Dau, Mabalacat City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 15.17, longitude: 120.58, status: 'active' },
    { id: 'loc-r3-07', code: 'DICT-TARLAC', name: 'DICT Tarlac Provincial Office', type: 'satellite', region: 'Region III', address: 'Macabulos Drive, Brgy. San Roque, Tarlac City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 15.48, longitude: 120.59, status: 'active' },
    { id: 'loc-r3-08', code: 'DICT-ZAMB', name: 'DICT Zambales Provincial Office', type: 'satellite', region: 'Region III', address: 'PEO Compound, Balili, Iba, Zambales', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 15.33, longitude: 119.98, status: 'active' },

    // --- Region IV-A ---
    {
        id: 'loc-r4a-01',
        code: 'DICT-R4A-RO',
        name: 'DICT Region IV-A Regional Office',
        type: 'regional',
        region: 'Region IV-A',
        address: 'Capitol Site, Telecom Road, Kumintang Ibaba, Batangas City',
        contactPerson: 'Regional Director',
        contactPhone: '+63 43 723-0101',
        contactEmail: 'region4a@dict.gov.ph',
        latitude: 13.76,
        longitude: 121.06,
        status: 'active'
    },
    { id: 'loc-r4a-02', code: 'DICT-CAVITE', name: 'DICT Cavite Provincial Office', type: 'satellite', region: 'Region IV-A', address: 'Capitol Compound, Trece Martires City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 14.28, longitude: 120.87, status: 'active' },
    { id: 'loc-r4a-03', code: 'DICT-LAGUNA', name: 'DICT Laguna Provincial Office', type: 'satellite', region: 'Region IV-A', address: 'Capitol Compound, Santa Cruz, Laguna', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 14.27, longitude: 121.41, status: 'active' },
    { id: 'loc-r4a-04', code: 'DICT-BATANGAS', name: 'DICT Batangas Provincial Office', type: 'satellite', region: 'Region IV-A', address: 'Kumintang Ibaba, Batangas City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 13.76, longitude: 121.06, status: 'active' },
    { id: 'loc-r4a-05', code: 'DICT-RIZAL', name: 'DICT Rizal Provincial Office', type: 'satellite', region: 'Region IV-A', address: 'Ynares Center, Antipolo City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 14.59, longitude: 121.17, status: 'active' },
    { id: 'loc-r4a-06', code: 'DICT-QUEZON', name: 'DICT Quezon Provincial Office', type: 'satellite', region: 'Region IV-A', address: 'Capitol Compound, Lucena City', contactPerson: '', contactPhone: '', contactEmail: '', latitude: 13.93, longitude: 121.61, status: 'active' },

    // --- Region IV-B ---
    {
        id: 'loc-r4b-01',
        code: 'DICT-R4B-RO',
        name: 'DICT Region IV-B Regional Office',
        type: 'regional',
        region: 'MIMAROPA',
        address: 'Calapan City, Oriental Mindoro',
        contactPerson: 'Regional Director',
        contactPhone: '+63 43 288-0101',
        contactEmail: 'mimaropa@dict.gov.ph',
        latitude: 13.41,
        longitude: 121.18,
        status: 'active'
    },
    { id: 'loc-r4b-02', code: 'DICT-MARIN', name: 'DICT Marinduque Provincial Office', type: 'satellite', region: 'MIMAROPA', address: 'Capitol Compound, Boac, Marinduque', latitude: 13.45, longitude: 121.84, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r4b-03', code: 'DICT-OCCMIN', name: 'DICT Occidental Mindoro Provincial Office', type: 'satellite', region: 'MIMAROPA', address: 'Capitol Compound, Mamburao, Occidental Mindoro', latitude: 13.22, longitude: 120.59, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r4b-04', code: 'DICT-ORMIN', name: 'DICT Oriental Mindoro Provincial Office', type: 'satellite', region: 'MIMAROPA', address: 'Guinobatan, Calapan City', latitude: 13.41, longitude: 121.18, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r4b-05', code: 'DICT-PALAWAN', name: 'DICT Palawan Provincial Office', type: 'satellite', region: 'MIMAROPA', address: 'Sta. Monica, Puerto Princesa City, Palawan', latitude: 9.77, longitude: 118.75, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r4b-06', code: 'DICT-ROMBLON', name: 'DICT Romblon Provincial Office', type: 'satellite', region: 'MIMAROPA', address: 'Poblacion, Romblon, Romblon', latitude: 12.57, longitude: 122.27, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region V ---
    { id: 'loc-r5-01', code: 'DICT-R5-RO', name: 'DICT Region V Regional Office', type: 'regional', region: 'Region V', address: 'Rawis, Legazpi City, Albay', contactPerson: 'Regional Director', contactPhone: '+63 52 742-0101', contactEmail: 'region5@dict.gov.ph', latitude: 13.14, longitude: 123.74, status: 'active' },
    { id: 'loc-r5-02', code: 'DICT-ALBAY', name: 'DICT Albay Provincial Office', type: 'satellite', region: 'Region V', address: 'Legazpi City, Albay', latitude: 13.14, longitude: 123.74, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r5-03', code: 'DICT-CAMNOR', name: 'DICT Camarines Norte Provincial Office', type: 'satellite', region: 'Region V', address: 'Poblacion, Daet, Camarines Norte', latitude: 14.11, longitude: 122.95, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r5-04', code: 'DICT-CAMSUR', name: 'DICT Camarines Sur Provincial Office', type: 'satellite', region: 'Region V', address: 'Capitol Complex, Pili, Camarines Sur', latitude: 13.58, longitude: 123.27, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r5-05', code: 'DICT-CATAN', name: 'DICT Catanduanes Provincial Office', type: 'satellite', region: 'Region V', address: 'San Isidro Village, Virac, Catanduanes', latitude: 13.58, longitude: 124.23, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r5-06', code: 'DICT-MASBATE', name: 'DICT Masbate Provincial Office', type: 'satellite', region: 'Region V', address: 'Capitol Compound, Masbate City', latitude: 12.37, longitude: 123.62, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r5-07', code: 'DICT-SORSOGON', name: 'DICT Sorsogon Provincial Office', type: 'satellite', region: 'Region V', address: 'Capitol Compound, Sorsogon City', latitude: 12.97, longitude: 124.01, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region VI ---
    { id: 'loc-r6-01', code: 'DICT-R6-RO', name: 'DICT Region VI Regional Office', type: 'regional', region: 'Region VI', address: 'Zamora St., Iloilo City', contactPerson: 'Regional Director', contactPhone: '+63 33 337-0101', contactEmail: 'region6@dict.gov.ph', latitude: 10.70, longitude: 122.57, status: 'active' },
    { id: 'loc-r6-02', code: 'DICT-AKLAN', name: 'DICT Aklan Provincial Office', type: 'satellite', region: 'Region VI', address: 'Capitol Site, Kalibo, Aklan', latitude: 11.71, longitude: 122.36, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r6-03', code: 'DICT-ANTIQUE', name: 'DICT Antique Provincial Office', type: 'satellite', region: 'Region VI', address: 'San Jose de Buenavista, Antique', latitude: 10.74, longitude: 121.94, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r6-04', code: 'DICT-CAPIZ', name: 'DICT Capiz Provincial Office', type: 'satellite', region: 'Region VI', address: 'Banica, Roxas City, Capiz', latitude: 11.58, longitude: 122.75, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r6-05', code: 'DICT-GUIMARAS', name: 'DICT Guimaras Provincial Office', type: 'satellite', region: 'Region VI', address: 'San Miguel, Jordan, Guimaras', latitude: 10.59, longitude: 122.59, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r6-06', code: 'DICT-ILOILO', name: 'DICT Iloilo Provincial Office', type: 'satellite', region: 'Region VI', address: 'Parola, Iloilo City', latitude: 10.70, longitude: 122.57, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r6-07', code: 'DICT-NEGACC', name: 'DICT Negros Occidental Provincial Office', type: 'satellite', region: 'Region VI', address: 'Panaad Park, Bacolod City', latitude: 10.64, longitude: 122.97, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region VII ---
    { id: 'loc-r7-01', code: 'DICT-R7-RO', name: 'DICT Region VII Regional Office', type: 'regional', region: 'Region VII', address: 'DICT Building, Pigafetta St., Port Area, Cebu City', contactPerson: 'Regional Director', contactPhone: '+63 32 255-0101', contactEmail: 'region7@dict.gov.ph', latitude: 10.29, longitude: 123.90, status: 'active' },
    { id: 'loc-r7-02', code: 'DICT-BOHOL', name: 'DICT Bohol Provincial Office', type: 'satellite', region: 'Region VII', address: 'New Capitol Site, Tagbilaran City', latitude: 9.65, longitude: 123.85, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r7-03', code: 'DICT-CEBU', name: 'DICT Cebu Provincial Office', type: 'satellite', region: 'Region VII', address: 'Port Area, Cebu City', latitude: 10.29, longitude: 123.90, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r7-04', code: 'DICT-NEGOR', name: 'DICT Negros Oriental Provincial Office', type: 'satellite', region: 'Region VII', address: 'Capitol Area, Dumaguete City', latitude: 9.31, longitude: 123.30, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r7-05', code: 'DICT-SIQUIJOR', name: 'DICT Siquijor Provincial Office', type: 'satellite', region: 'Region VII', address: 'Poblacion, Siquijor', latitude: 9.21, longitude: 123.51, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region VIII ---
    { id: 'loc-r8-01', code: 'DICT-R8-RO', name: 'DICT Region VIII Regional Office', type: 'regional', region: 'Region VIII', address: 'Tacloban City, Leyte', contactPerson: 'Regional Director', contactPhone: '+63 53 323-0101', contactEmail: 'region8@dict.gov.ph', latitude: 11.24, longitude: 125.00, status: 'active' },
    { id: 'loc-r8-02', code: 'DICT-BILIRAN', name: 'DICT Biliran Provincial Office', type: 'satellite', region: 'Region VIII', address: 'P.I. Garcia St., Naval, Biliran', latitude: 11.56, longitude: 124.40, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r8-03', code: 'DICT-ESAMAR', name: 'DICT Eastern Samar Provincial Office', type: 'satellite', region: 'Region VIII', address: 'Capitol Site, Borongan City', latitude: 11.61, longitude: 125.43, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r8-04', code: 'DICT-LEYTE', name: 'DICT Leyte Provincial Office', type: 'satellite', region: 'Region VIII', address: 'Kanhuraw Hill, Tacloban City', latitude: 11.24, longitude: 125.00, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r8-05', code: 'DICT-NSAMAR', name: 'DICT Northern Samar Provincial Office', type: 'satellite', region: 'Region VIII', address: 'Capitol Site, Catarman', latitude: 12.50, longitude: 124.63, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r8-06', code: 'DICT-SAMAR', name: 'DICT Western Samar Provincial Office', type: 'satellite', region: 'Region VIII', address: 'Catbalogan City, Samar', latitude: 11.77, longitude: 124.88, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r8-07', code: 'DICT-SLEYTE', name: 'DICT Southern Leyte Provincial Office', type: 'satellite', region: 'Region VIII', address: 'Capitol Sunken Garden, Maasin City', latitude: 10.13, longitude: 124.84, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region IX ---
    { id: 'loc-r9-01', code: 'DICT-R9-RO', name: 'DICT Region IX Regional Office', type: 'regional', region: 'Region IX', address: 'DICT Building, Zone IV, Port Area, Zamboanga City', contactPerson: 'Regional Director', contactPhone: '+63 62 991-0101', contactEmail: 'region9@dict.gov.ph', latitude: 6.90, longitude: 122.07, status: 'active' },
    { id: 'loc-r9-02', code: 'DICT-ZDN', name: 'DICT Zamboanga del Norte Provincial Office', type: 'satellite', region: 'Region IX', address: 'Biasong, Dipolog City', latitude: 8.58, longitude: 123.33, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r9-03', code: 'DICT-ZDS', name: 'DICT Zamboanga del Sur Provincial Office', type: 'satellite', region: 'Region IX', address: 'Balangasan, Pagadian City', latitude: 7.82, longitude: 123.44, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r9-04', code: 'DICT-ZSIB', name: 'DICT Zamboanga Sibugay Provincial Office', type: 'satellite', region: 'Region IX', address: 'Capitol Heights, Ipil', latitude: 7.78, longitude: 122.58, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r9-05', code: 'DICT-ISABELA-CITY', name: 'DICT Isabela City Field Office', type: 'satellite', region: 'Region IX', address: 'Port Area, Isabela City, Basilan', latitude: 6.70, longitude: 121.97, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region X ---
    { id: 'loc-r10-01', code: 'DICT-R10-RO', name: 'DICT Region X Regional Office', type: 'regional', region: 'Region X', address: 'Cagayan de Oro City', contactPerson: 'Regional Director', contactPhone: '+63 88 856-0101', contactEmail: 'region10@dict.gov.ph', latitude: 8.48, longitude: 124.64, status: 'active' },
    { id: 'loc-r10-02', code: 'DICT-BUK', name: 'DICT Bukidnon Provincial Office', type: 'satellite', region: 'Region X', address: 'Capitol Compound, Malaybalay City', latitude: 8.15, longitude: 125.12, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r10-03', code: 'DICT-CAMHN', name: 'DICT Camiguin Provincial Office', type: 'satellite', region: 'Region X', address: 'Capitol Compound, Mambajao', latitude: 9.25, longitude: 124.71, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r10-04', code: 'DICT-LDN', name: 'DICT Lanao del Norte Provincial Office', type: 'satellite', region: 'Region X', address: 'Capitol Compound, Tubod', latitude: 8.05, longitude: 123.79, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r10-05', code: 'DICT-MISOCC', name: 'DICT Misamis Occidental Provincial Office', type: 'satellite', region: 'Region X', address: 'Capitol Compound, Oroquieta City', latitude: 8.48, longitude: 123.80, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r10-06', code: 'DICT-MISOR', name: 'DICT Misamis Oriental Provincial Office', type: 'satellite', region: 'Region X', address: 'Hayes St., Cagayan de Oro City', latitude: 8.48, longitude: 124.64, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region XI ---
    { id: 'loc-r11-01', code: 'DICT-R11-RO', name: 'DICT Region XI Regional Office', type: 'regional', region: 'Region XI', address: 'F. Torres St., Davao City', contactPerson: 'Regional Director', contactPhone: '+63 82 222-0101', contactEmail: 'region11@dict.gov.ph', latitude: 7.07, longitude: 125.60, status: 'active' },
    { id: 'loc-r11-02', code: 'DICT-DDEORO', name: 'DICT Davao de Oro Provincial Office', type: 'satellite', region: 'Region XI', address: 'Capitol Complex, Nabunturan', latitude: 7.60, longitude: 125.96, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r11-03', code: 'DICT-DDN', name: 'DICT Davao del Norte Provincial Office', type: 'satellite', region: 'Region XI', address: 'Capitol Road, Tagum City', latitude: 7.44, longitude: 125.80, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r11-04', code: 'DICT-DDS', name: 'DICT Davao del Sur Provincial Office', type: 'satellite', region: 'Region XI', address: 'Capitol Compound, Digos City', latitude: 6.74, longitude: 125.35, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r11-05', code: 'DICT-DOCC', name: 'DICT Davao Occidental Provincial Office', type: 'satellite', region: 'Region XI', address: 'Poblacion, Malita', latitude: 6.41, longitude: 125.61, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r11-06', code: 'DICT-DOR', name: 'DICT Davao Oriental Provincial Office', type: 'satellite', region: 'Region XI', address: 'Capitol Hill, Mati City', latitude: 6.95, longitude: 126.21, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region XII ---
    { id: 'loc-r12-01', code: 'DICT-R12-RO', name: 'DICT Region XII Regional Office', type: 'regional', region: 'Region XII', address: 'Koronadal City, South Cotabato', contactPerson: 'Regional Director', contactPhone: '+63 83 228-0101', contactEmail: 'region12@dict.gov.ph', latitude: 6.49, longitude: 124.84, status: 'active' },
    { id: 'loc-r12-02', code: 'DICT-COTABATO', name: 'DICT Cotabato Provincial Office', type: 'satellite', region: 'Region XII', address: 'Amas, Kidapawan City', latitude: 7.00, longitude: 125.08, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r12-03', code: 'DICT-SARAN', name: 'DICT Sarangani Provincial Office', type: 'satellite', region: 'Region XII', address: 'Capitol Compound, Alabel', latitude: 6.10, longitude: 125.28, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r12-04', code: 'DICT-SCOT', name: 'DICT South Cotabato Provincial Office', type: 'satellite', region: 'Region XII', address: 'Carpenter Hill, Koronadal City', latitude: 6.49, longitude: 124.84, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r12-05', code: 'DICT-SKUD', name: 'DICT Sultan Kudarat Provincial Office', type: 'satellite', region: 'Region XII', address: 'Capitol Compound, Isulan', latitude: 6.63, longitude: 124.60, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- Region XIII ---
    { id: 'loc-r13-01', code: 'DICT-R13-RO', name: 'DICT Caraga Regional Office', type: 'regional', region: 'Region XIII', address: 'Jose Rosales Ave., Butuan City', contactPerson: 'Regional Director', contactPhone: '+63 85 342-0101', contactEmail: 'caraga@dict.gov.ph', latitude: 8.94, longitude: 125.53, status: 'active' },
    { id: 'loc-r13-02', code: 'DICT-ADN', name: 'DICT Agusan del Norte Provincial Office', type: 'satellite', region: 'Region XIII', address: 'Capitol Drive, Butuan City', latitude: 8.94, longitude: 125.53, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r13-03', code: 'DICT-ADS', name: 'DICT Agusan del Sur Provincial Office', type: 'satellite', region: 'Region XIII', address: 'Patin-ay, Prosperidad', latitude: 8.59, longitude: 125.92, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r13-04', code: 'DICT-DINAGAT', name: 'DICT Dinagat Islands Provincial Office', type: 'satellite', region: 'Region XIII', address: 'Capitol Compound, San Jose', latitude: 10.12, longitude: 125.58, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r13-05', code: 'DICT-SDN', name: 'DICT Surigao del Norte Provincial Office', type: 'satellite', region: 'Region XIII', address: 'Capitol Compound, Surigao City', latitude: 9.79, longitude: 125.49, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-r13-06', code: 'DICT-SDS', name: 'DICT Surigao del Sur Provincial Office', type: 'satellite', region: 'Region XIII', address: 'Capitol Hills, Tandag City', latitude: 9.07, longitude: 126.19, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },

    // --- BARMM ---
    { id: 'loc-barmm-01', code: 'DICT-LDS', name: 'DICT Lanao del Sur Provincial Office', type: 'satellite', region: 'BARMM', address: 'Marawi Resort Hotel, Marawi City', latitude: 8.00, longitude: 124.28, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-barmm-02', code: 'DICT-MAG', name: 'DICT Maguindanao Provincial Office', type: 'satellite', region: 'BARMM', address: 'ORG Compound, Cotabato City', latitude: 7.22, longitude: 124.24, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-barmm-03', code: 'DICT-SULU', name: 'DICT Sulu Provincial Office', type: 'satellite', region: 'BARMM', address: 'Capitol Site, Jolo', latitude: 6.05, longitude: 121.00, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
    { id: 'loc-barmm-04', code: 'DICT-TAWI', name: 'DICT Tawi-Tawi Provincial Office', type: 'satellite', region: 'BARMM', address: 'Capitol Hill, Bongao', latitude: 5.03, longitude: 119.77, status: 'active', contactPerson: '', contactPhone: '', contactEmail: '' },
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
