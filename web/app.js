/**
 * SMART HOTEL MANAGEMENT SYSTEM - CORE LOGIC & OOP ARCHITECTURE
 * Kỹ nghệ Hướng đối tượng mô phỏng trên JavaScript ES6+
 */

// ==========================================
// 1. DOMAIN MODELS & OOP HIERARCHY
// ==========================================

class Room {
    constructor(id, number, type, floor, basePrice, status, amenities = []) {
        this.id = id;
        this.number = number;
        this.type = type; // STANDARD, DELUXE, SUITE
        this.floor = floor;
        this.basePrice = basePrice;
        this.status = status; // AVAILABLE, OCCUPIED, CLEANING, BOOKED, MAINTENANCE
        this.amenities = amenities;
        this.guest = null;
        this.checkInDate = null;
        this.checkOutDate = null;
        this.services = [];
    }

    calculatePrice(days, isPeak = false) {
        return this.basePrice * days * (isPeak ? 1.15 : 1.0);
    }
}

class StandardRoom extends Room {
    constructor(id, number, floor) {
        super(id, number, 'STANDARD', floor, 500000, 'AVAILABLE', [
            'Giường đơn/đôi', 'Điều hòa 2 chiều', 'TV 43 inch', 'Wifi cáp quang'
        ]);
    }

    calculatePrice(days, isPeak = false) {
        return this.basePrice * days * (isPeak ? 1.10 : 1.0);
    }
}

class DeluxeRoom extends Room {
    constructor(id, number, floor, hasBalcony = true) {
        super(id, number, 'DELUXE', floor, 1000000, 'AVAILABLE', [
            'Giường King-size', 'Bồn tắm nằm', 'Ban công view đẹp', 'Minibar miễn phí nước'
        ]);
        this.hasBalcony = hasBalcony;
    }

    calculatePrice(days, isPeak = false) {
        const rate = isPeak ? 1.20 : 1.0;
        return (this.basePrice * days * rate) + (this.hasBalcony ? 150000 * days : 0);
    }
}

class SuiteRoom extends Room {
    constructor(id, number, floor, hasButler = true) {
        super(id, number, 'SUITE', floor, 2500000, 'AVAILABLE', [
            'Phòng khách riêng', 'Bồn sục Jacuzzi', 'Rượu vang chào đón', 'Quản gia cá nhân 24/7'
        ]);
        this.hasButler = hasButler;
    }

    calculatePrice(days, isPeak = false) {
        const rate = isPeak ? 1.30 : 1.0;
        let total = this.basePrice * days * rate;
        if (days >= 5) total *= 0.90; // Giảm 10% cho kỳ nghỉ từ 5 ngày
        return total;
    }
}

// ==========================================
// 2. FACTORY PATTERN: RoomFactory
// ==========================================
class RoomFactory {
    static create(type, id, number, floor) {
        switch (type.toUpperCase()) {
            case 'STANDARD': return new StandardRoom(id, number, floor);
            case 'DELUXE': return new DeluxeRoom(id, number, floor, true);
            case 'SUITE': return new SuiteRoom(id, number, floor, true);
            default: throw new Error(`Loại phòng không hỗ trợ: ${type}`);
        }
    }
}

// ==========================================
// 3. RISK ENGINE (BLACKLIST & VIP WHITELIST)
// ==========================================
const RiskEngine = {
    blacklists: [
        { cccd: '001200000005', name: 'Trần Văn Quỵt', reason: 'Phá hoại Smart TV phòng 302, quỵt 2.400.000đ tiền Minibar', date: '12/08/2026' },
        { cccd: '079200000009', name: 'Nguyễn Thị Gian Lận', reason: 'Sử dụng thẻ ngân hàng giả mạo, gây rối trật tự lúc 2h sáng', date: '02/09/2026' }
    ],
    vipWhitelists: [
        { cccd: '001200000004', name: 'Lê Hoàng Yến', tier: 'VIP Diamond', discount: 0.10, depositFree: true, note: 'Tặng 2 ly cocktail chào đón tại quầy bar tầng thượng' },
        { cccd: '079200000008', name: 'Vũ Mạnh Hùng', tier: 'VIP Platinum', discount: 0.10, depositFree: true, note: 'Miễn phí giặt là 1 bộ cao cấp, ưu tiên nhận phòng sớm' }
    ],

    check(cccd) {
        const cleanCccd = (cccd || '').trim();
        const bl = this.blacklists.find(b => b.cccd === cleanCccd);
        if (bl) {
            return { status: 'BLACKLIST', data: bl };
        }
        const vip = this.vipWhitelists.find(v => v.cccd === cleanCccd);
        if (vip) {
            return { status: 'VIP', data: vip };
        }
        return { status: 'NORMAL', data: null };
    },

    addBlacklist(item) {
        this.blacklists.push(item);
        this.save();
    },

    removeBlacklist(cccd) {
        this.blacklists = this.blacklists.filter(b => b.cccd !== cccd);
        this.save();
    },

    addVip(item) {
        this.vipWhitelists.push(item);
        this.save();
    },

    removeVip(cccd) {
        this.vipWhitelists = this.vipWhitelists.filter(v => v.cccd !== cccd);
        this.save();
    },

    save() {
        localStorage.setItem('hotel_blacklists', JSON.stringify(this.blacklists));
        localStorage.setItem('hotel_vips', JSON.stringify(this.vipWhitelists));
    },

    load() {
        const bl = localStorage.getItem('hotel_blacklists');
        const v = localStorage.getItem('hotel_vips');
        if (bl) this.blacklists = JSON.parse(bl);
        if (v) this.vipWhitelists = JSON.parse(v);
    }
};

// ==========================================
// 4. APPLICATION STATE & STORAGE
// ==========================================

const SERVICES_MENU = [
    { id: 'S01', name: 'Bia Heineken Silver (Lon)', price: 45000, icon: 'beer' },
    { id: 'S02', name: 'Nước khoáng Lavie Premium', price: 25000, icon: 'droplet' },
    { id: 'S03', name: 'Nước ngọt Coca-Cola 330ml', price: 30000, icon: 'cup-soda' },
    { id: 'S04', name: 'Snack khoai tây Pringles', price: 55000, icon: 'cookie' },
    { id: 'S05', name: 'Giặt ủi cao cấp (Bộ)', price: 80000, icon: 'shirt' },
    { id: 'S06', name: 'Suất Massage Body & Spa (60p)', price: 350000, icon: 'sparkles' },
    { id: 'S07', name: 'Buffet sáng Quốc tế (Vé)', price: 180000, icon: 'utensils' }
];

class HotelApp {
    constructor() {
        this.currentTab = 'matrix';
        this.activeFilter = 'ALL';
        this.rooms = [];
        this.bookings = [];
        this.transactions = [];
        this.init();
    }

    init() {
        RiskEngine.load();
        this.loadOrSeedData();
        this.updateHeaderStats();
        this.switchTab('matrix');
        lucide.createIcons();
    }

    loadOrSeedData() {
        const storedRooms = localStorage.getItem('hotel_rooms_state');
        const storedBookings = localStorage.getItem('hotel_bookings_state');
        const storedTrans = localStorage.getItem('hotel_trans_state');

        if (storedRooms) {
            const rawList = JSON.parse(storedRooms);
            this.rooms = rawList.map(r => {
                const room = RoomFactory.create(r.type, r.id, r.number, r.floor);
                Object.assign(room, r);
                return room;
            });
        } else {
            this.seedRooms();
        }

        this.bookings = storedBookings ? JSON.parse(storedBookings) : [
            { id: 'BK-1001', roomNumber: '103', guestName: 'Hoàng Thu Thủy', cccd: '001200000007', phone: '0912345678', checkIn: '2026-09-22', checkOut: '2026-09-25', totalDays: 3, deposit: 450000, status: 'CONFIRMED' },
            { id: 'BK-1002', roomNumber: '201', guestName: 'Đỗ Quốc Đạt', cccd: '001200000010', phone: '0988776655', checkIn: '2026-09-23', checkOut: '2026-09-26', totalDays: 3, deposit: 900000, status: 'CONFIRMED' }
        ];

        this.transactions = storedTrans ? JSON.parse(storedTrans) : [
            { id: 'TX-901', roomNumber: '102', guestName: 'Lê Hoàng Nam', amount: 1590000, date: '2026-09-19 14:20', method: 'Chuyển khoản QR' },
            { id: 'TX-902', roomNumber: '301', guestName: 'Phạm Thanh Thảo (VIP)', amount: 5670000, date: '2026-09-18 11:30', method: 'Thẻ tín dụng' }
        ];

        this.saveState();
    }

    seedRooms() {
        this.rooms = [
            // Tầng 1: Standard
            RoomFactory.create('STANDARD', 'R101', '101', 1),
            RoomFactory.create('STANDARD', 'R102', '102', 1),
            RoomFactory.create('STANDARD', 'R103', '103', 1),
            RoomFactory.create('STANDARD', 'R104', '104', 1),
            // Tầng 2: Deluxe
            RoomFactory.create('DELUXE', 'R201', '201', 2),
            RoomFactory.create('DELUXE', 'R202', '202', 2),
            RoomFactory.create('DELUXE', 'R203', '203', 2),
            RoomFactory.create('DELUXE', 'R204', '204', 2),
            // Tầng 3: Suite VIP
            RoomFactory.create('SUITE', 'R301', '301', 3),
            RoomFactory.create('SUITE', 'R302', '302', 3),
            RoomFactory.create('SUITE', 'R303', '303', 3),
            RoomFactory.create('SUITE', 'R304', '304', 3),
        ];

        // Gán trạng thái thực tế
        this.rooms[1].status = 'OCCUPIED';
        this.rooms[1].guest = { name: 'Trần Văn Hùng', cccd: '001200000003', phone: '0901234567', isVip: false };
        this.rooms[1].checkInDate = '2026-09-18';
        this.rooms[1].checkOutDate = '2026-09-21';
        this.rooms[1].services = [{ id: 'S01', name: 'Bia Heineken Silver (Lon)', price: 45000, qty: 2 }];

        this.rooms[2].status = 'BOOKED';
        this.rooms[2].guest = { name: 'Hoàng Thu Thủy', cccd: '001200000007', phone: '0912345678' };

        this.rooms[3].status = 'CLEANING';

        this.rooms[5].status = 'OCCUPIED';
        this.rooms[5].guest = { name: 'Lê Hoàng Yến', cccd: '001200000004', phone: '0977889900', isVip: true, discount: 0.10 };
        this.rooms[5].checkInDate = '2026-09-19';
        this.rooms[5].checkOutDate = '2026-09-22';
        this.rooms[5].services = [
            { id: 'S06', name: 'Suất Massage Body & Spa (60p)', price: 350000, qty: 1 },
            { id: 'S02', name: 'Nước khoáng Lavie Premium', price: 25000, qty: 2 }
        ];

        this.rooms[7].status = 'CLEANING';

        this.rooms[9].status = 'OCCUPIED';
        this.rooms[9].guest = { name: 'Đặng Minh Tuấn', cccd: '001200000006', phone: '0933445566', isVip: false };
        this.rooms[9].checkInDate = '2026-09-17';
        this.rooms[9].checkOutDate = '2026-09-21';
        this.rooms[9].services = [
            { id: 'S01', name: 'Bia Heineken Silver (Lon)', price: 45000, qty: 4 },
            { id: 'S04', name: 'Snack khoai tây Pringles', price: 55000, qty: 2 }
        ];

        this.rooms[11].status = 'MAINTENANCE';
    }

    saveState() {
        localStorage.setItem('hotel_rooms_state', JSON.stringify(this.rooms));
        localStorage.setItem('hotel_bookings_state', JSON.stringify(this.bookings));
        localStorage.setItem('hotel_trans_state', JSON.stringify(this.transactions));
        this.updateHeaderStats();
    }

    resetMockData() {
        Swal.fire({
            title: 'Khôi phục dữ liệu mẫu?',
            text: 'Toàn bộ dữ liệu phòng, đơn đặt phòng và hóa đơn sẽ trở về trạng thái demo mặc định.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Đồng ý khôi phục',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('hotel_rooms_state');
                localStorage.removeItem('hotel_bookings_state');
                localStorage.removeItem('hotel_trans_state');
                localStorage.removeItem('hotel_blacklists');
                localStorage.removeItem('hotel_vips');
                RiskEngine.blacklists = [
                    { cccd: '001200000005', name: 'Trần Văn Quỵt', reason: 'Phá hoại Smart TV phòng 302, quỵt 2.400.000đ tiền Minibar', date: '12/08/2026' },
                    { cccd: '079200000009', name: 'Nguyễn Thị Gian Lận', reason: 'Sử dụng thẻ ngân hàng giả mạo, gây rối trật tự lúc 2h sáng', date: '02/09/2026' }
                ];
                RiskEngine.vipWhitelists = [
                    { cccd: '001200000004', name: 'Lê Hoàng Yến', tier: 'VIP Diamond', discount: 0.10, depositFree: true, note: 'Tặng 2 ly cocktail chào đón tại quầy bar tầng thượng' },
                    { cccd: '079200000008', name: 'Vũ Mạnh Hùng', tier: 'VIP Platinum', discount: 0.10, depositFree: true, note: 'Miễn phí giặt là 1 bộ cao cấp, ưu tiên nhận phòng sớm' }
                ];
                RiskEngine.save();
                this.loadOrSeedData();
                this.switchTab(this.currentTab);
                Swal.fire('Đã khôi phục!', 'Dữ liệu mẫu đã được thiết lập lại thành công.', 'success');
            }
        });
    }

    updateHeaderStats() {
        const avail = this.rooms.filter(r => r.status === 'AVAILABLE').length;
        const occ = this.rooms.filter(r => r.status === 'OCCUPIED').length;
        const clean = this.rooms.filter(r => r.status === 'CLEANING').length;
        const book = this.rooms.filter(r => r.status === 'BOOKED').length;

        document.getElementById('stat-available').textContent = avail;
        document.getElementById('stat-occupied').textContent = occ;
        document.getElementById('stat-cleaning').textContent = clean;
        document.getElementById('stat-booked').textContent = book;
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.nav-item').forEach(el => {
            el.className = 'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-300 hover:bg-slate-800 hover:text-white';
        });
        const activeNav = document.getElementById(`nav-${tab}`);
        if (activeNav) {
            activeNav.className = 'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all bg-amber-500 text-slate-950 shadow-md font-semibold';
        }

        const container = document.getElementById('main-container');
        switch (tab) {
            case 'matrix': this.renderMatrixTab(container); break;
            case 'booking': this.renderBookingTab(container); break;
            case 'risk': this.renderRiskTab(container); break;
            case 'services': this.renderServicesTab(container); break;
            case 'analytics': this.renderAnalyticsTab(container); break;
        }
        lucide.createIcons();
    }

    renderMatrixTab(container) {
        const filteredRooms = this.rooms.filter(r => {
            if (this.activeFilter === 'ALL') return true;
            if (['1', '2', '3'].includes(this.activeFilter)) return r.floor == this.activeFilter;
            return r.status === this.activeFilter;
        });

        const floors = [
            { num: 3, name: 'Tầng 3 - Hạng Sang (Suite Room)', rooms: filteredRooms.filter(r => r.floor === 3) },
            { num: 2, name: 'Tầng 2 - Cao Cấp (Deluxe Room)', rooms: filteredRooms.filter(r => r.floor === 2) },
            { num: 1, name: 'Tầng 1 - Tiêu Chuẩn (Standard Room)', rooms: filteredRooms.filter(r => r.floor === 1) }
        ];

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900">Sơ Đồ Tầng & Phòng Thời Gian Thực</h2>
                        <p class="text-xs text-slate-500">Giám sát trạng thái 12 buồng phòng theo thời gian thực</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                        <button onclick="app.setFilter('ALL')" class="px-2.5 py-1.5 rounded-md transition-all ${this.activeFilter === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}">Tất cả</button>
                        <button onclick="app.setFilter('AVAILABLE')" class="px-2.5 py-1.5 rounded-md transition-all ${this.activeFilter === 'AVAILABLE' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}">🟢 Trống</button>
                        <button onclick="app.setFilter('OCCUPIED')" class="px-2.5 py-1.5 rounded-md transition-all ${this.activeFilter === 'OCCUPIED' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}">🔴 Đang ở</button>
                        <button onclick="app.setFilter('CLEANING')" class="px-2.5 py-1.5 rounded-md transition-all ${this.activeFilter === 'CLEANING' ? 'bg-amber-500 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}">🟡 Chờ dọn</button>
                        <button onclick="app.setFilter('BOOKED')" class="px-2.5 py-1.5 rounded-md transition-all ${this.activeFilter === 'BOOKED' ? 'bg-indigo-500 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}">🔵 Đã đặt</button>
                        <span class="w-[1px] h-4 bg-slate-300 mx-1"></span>
                        <button onclick="app.setFilter('1')" class="px-2 py-1.5 rounded-md ${this.activeFilter === '1' ? 'bg-white font-bold shadow-sm' : 'text-slate-600'}">Tầng 1</button>
                        <button onclick="app.setFilter('2')" class="px-2 py-1.5 rounded-md ${this.activeFilter === '2' ? 'bg-white font-bold shadow-sm' : 'text-slate-600'}">Tầng 2</button>
                        <button onclick="app.setFilter('3')" class="px-2 py-1.5 rounded-md ${this.activeFilter === '3' ? 'bg-white font-bold shadow-sm' : 'text-slate-600'}">Tầng 3</button>
                    </div>
                </div>

                ${floors.map(floor => floor.rooms.length > 0 ? `
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
                            <h3 class="font-bold text-sm text-slate-800">${floor.name}</h3>
                            <span class="text-xs text-slate-400">(${floor.rooms.length} phòng)</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            ${floor.rooms.map(room => this.renderRoomCard(room)).join('')}
                        </div>
                    </div>
                ` : '').join('')}
            </div>
        `;
    }

    renderRoomCard(room) {
        let statusBadge = '';
        let borderClass = 'border-slate-200';
        let actionButtons = '';

        switch (room.status) {
            case 'AVAILABLE':
                borderClass = 'border-emerald-200 hover:border-emerald-400 bg-white';
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sẵn sàng đón khách
                </span>`;
                actionButtons = `
                    <button onclick="app.openCheckInModal('${room.number}')" class="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1">
                        <i data-lucide="log-in" class="w-3.5 h-3.5"></i> Check-in
                    </button>
                    <button onclick="app.openQuickBookingModal('${room.number}')" class="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all" title="Đặt trước">
                        <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i>
                    </button>
                `;
                break;

            case 'OCCUPIED':
                borderClass = 'border-rose-200 hover:border-rose-400 bg-rose-50/20';
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Đang lưu trú
                </span>`;
                actionButtons = `
                    <button onclick="app.openServiceOrderModal('${room.number}')" class="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1">
                        <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Gọi Minibar
                    </button>
                    <button onclick="app.openCheckOutModal('${room.number}')" class="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1">
                        <i data-lucide="receipt" class="w-3.5 h-3.5"></i> Check-out
                    </button>
                `;
                break;

            case 'CLEANING':
                borderClass = 'border-amber-200 hover:border-amber-400 bg-amber-50/20';
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Chờ dọn dẹp
                </span>`;
                actionButtons = `
                    <button onclick="app.finishCleaning('${room.number}')" class="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i> Hoàn tất dọn dẹp
                    </button>
                `;
                break;

            case 'BOOKED':
                borderClass = 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/20';
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Đã đặt trước
                </span>`;
                actionButtons = `
                    <button onclick="app.openCheckInModal('${room.number}', true)" class="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1">
                        <i data-lucide="log-in" class="w-3.5 h-3.5"></i> Check-in khách đặt
                    </button>
                `;
                break;

            case 'MAINTENANCE':
                borderClass = 'border-slate-300 bg-slate-50';
                statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Đang bảo trì
                </span>`;
                actionButtons = `
                    <button onclick="app.finishMaintenance('${room.number}')" class="w-full py-1.5 px-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-all">
                        Khôi phục phòng
                    </button>
                `;
                break;
        }

        const typeColor = room.type === 'SUITE' ? 'bg-purple-100 text-purple-700' :
                          room.type === 'DELUXE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700';

        return `
            <div class="rounded-xl border ${borderClass} shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between h-56 bg-white">
                <div>
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center gap-1.5">
                                <h4 class="text-xl font-black text-slate-900 tracking-tight">Phòng ${room.number}</h4>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${typeColor}">${room.type}</span>
                            </div>
                            <p class="text-xs text-slate-500 font-semibold mt-0.5">${room.basePrice.toLocaleString('vi-VN')} đ <span class="text-[10px] font-normal text-slate-400">/đêm</span></p>
                        </div>
                        ${statusBadge}
                    </div>

                    <div class="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                        ${room.status === 'OCCUPIED' && room.guest ? `
                            <div class="space-y-1">
                                <p class="text-slate-900 font-semibold truncate flex items-center gap-1">
                                    <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400"></i> ${room.guest.name}
                                    ${room.guest.isVip ? '<span class="text-[10px] font-black bg-amber-100 text-amber-800 px-1 rounded border border-amber-300">★ VIP</span>' : ''}
                                </p>
                                <p class="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i> Trả: ${room.checkOutDate || 'Chưa định'}
                                </p>
                                ${room.services && room.services.length > 0 ? `
                                    <p class="text-[11px] text-amber-600 font-medium truncate flex items-center gap-1">
                                        <i data-lucide="wine" class="w-3.5 h-3.5"></i> Minibar: ${room.services.reduce((sum, s) => sum + s.price * s.qty, 0).toLocaleString('vi-VN')} đ
                                    </p>
                                ` : '<p class="text-[11px] text-slate-400 italic">Chưa phát sinh minibar</p>'}
                            </div>
                        ` : room.status === 'BOOKED' && room.guest ? `
                            <div class="space-y-1">
                                <p class="text-slate-800 font-semibold truncate flex items-center gap-1">
                                    <i data-lucide="bookmark" class="w-3.5 h-3.5 text-indigo-500"></i> Khách: ${room.guest.name}
                                </p>
                                <p class="text-[11px] text-slate-500">Giữ chỗ trước</p>
                            </div>
                        ` : `
                            <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                <i data-lucide="check-circle-2" class="w-3 h-3 inline text-emerald-500"></i> ${room.amenities.slice(0, 2).join(', ')}
                            </p>
                        `}
                    </div>
                </div>

                <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                    ${actionButtons}
                </div>
            </div>
        `;
    }

    setFilter(filter) {
        this.activeFilter = filter;
        this.renderMatrixTab(document.getElementById('main-container'));
        lucide.createIcons();
    }

    renderBookingTab(container) {
        container.innerHTML = `
            <div class="space-y-6">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900">Quản Lý Đặt Phòng & Lịch Trình</h2>
                        <p class="text-xs text-slate-500">Thuật toán chống Overbooking: Tự động loại trừ các phòng giao thoa thời gian</p>
                    </div>
                    <button onclick="app.openNewBookingModal()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all">
                        <i data-lucide="calendar-plus" class="w-4 h-4"></i> Tạo Đơn Đặt Phòng Mới
                    </button>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h3 class="font-bold text-sm text-slate-900">Danh Sách Lịch Đặt Chỗ Hiện Tại (${this.bookings.length} đơn)</h3>
                        <span class="text-xs text-slate-500">Tự động cập nhật phòng tương ứng khi Check-in</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                                <tr>
                                    <th class="py-3 px-4">Mã Đơn</th>
                                    <th class="py-3 px-4">Khách Hàng</th>
                                    <th class="py-3 px-4">Số CCCD / Hộ Chiếu</th>
                                    <th class="py-3 px-4">Phòng Đặt</th>
                                    <th class="py-3 px-4">Lịch Lưu Trú</th>
                                    <th class="py-3 px-4">Tiền Cọc</th>
                                    <th class="py-3 px-4">Trạng Thái</th>
                                    <th class="py-3 px-4 text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${this.bookings.length === 0 ? `
                                    <tr><td colspan="8" class="text-center py-8 text-slate-400">Chưa có đơn đặt phòng nào</td></tr>
                                ` : this.bookings.map(b => `
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="py-3 px-4 font-mono font-bold text-slate-900">${b.id}</td>
                                        <td class="py-3 px-4">
                                            <p class="font-semibold text-slate-900">${b.guestName}</p>
                                            <p class="text-[11px] text-slate-400">${b.phone}</p>
                                        </td>
                                        <td class="py-3 px-4 font-mono text-slate-600">${b.cccd}</td>
                                        <td class="py-3 px-4">
                                            <span class="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800">Phòng ${b.roomNumber}</span>
                                        </td>
                                        <td class="py-3 px-4 text-slate-600">
                                            <p>${b.checkIn} $ightarrow$ ${b.checkOut}</p>
                                            <p class="text-[11px] text-slate-400 font-medium">${b.totalDays} đêm</p>
                                        </td>
                                        <td class="py-3 px-4 font-semibold text-emerald-600">${b.deposit.toLocaleString('vi-VN')} đ</td>
                                        <td class="py-3 px-4">
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
                                                ${b.status}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                <button onclick="app.openCheckInModal('${b.roomNumber}', true, '${b.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] transition-all">
                                                    Check-in
                                                </button>
                                                <button onclick="app.cancelBooking('${b.id}')" class="px-2 py-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 rounded text-[11px] transition-all" title="Hủy đơn">
                                                    Hủy
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderRiskTab(container) {
        container.innerHTML = `
            <div class="space-y-6">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900">Quản Trị Rủi Ro & Chăm Sóc Khách Hàng (Risk Engine)</h2>
                        <p class="text-xs text-slate-500">Tự động đối soát CCCD/Hộ chiếu khi khách làm thủ tục Check-in hoặc Đặt phòng</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="app.openAddBlacklistModal()" class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all">
                            <i data-lucide="user-x" class="w-4 h-4"></i> Thêm Blacklist (Cấm)
                        </button>
                        <button onclick="app.openAddVipModal()" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all">
                            <i data-lucide="crown" class="w-4 h-4"></i> Thêm Khách VIP
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Cột Blacklist -->
                    <div class="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden flex flex-col">
                        <div class="px-5 py-3.5 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
                            <div class="flex items-center gap-2 text-rose-800 font-bold text-sm">
                                <i data-lucide="shield-ban" class="w-4 h-4 text-rose-600"></i>
                                <span>DANH SÁCH ĐEN (BLACKLIST - CẤM PHỤC VỤ)</span>
                            </div>
                            <span class="text-xs bg-rose-600 text-white font-black px-2 py-0.5 rounded-full">${RiskEngine.blacklists.length}</span>
                        </div>
                        <div class="p-4 flex-1 divide-y divide-slate-100">
                            ${RiskEngine.blacklists.map(bl => `
                                <div class="py-3 flex items-start justify-between gap-3">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <p class="font-bold text-slate-900 text-sm">${bl.name}</p>
                                            <span class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">${bl.cccd}</span>
                                        </div>
                                        <p class="text-xs text-rose-600 font-medium">⚠️ ${bl.reason}</p>
                                        <p class="text-[11px] text-slate-400">Ghi nhận ngày: ${bl.date}</p>
                                    </div>
                                    <button onclick="app.removeBlacklist('${bl.cccd}')" class="text-xs text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-all" title="Gỡ bỏ lệnh cấm">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Cột VIP Whitelist -->
                    <div class="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
                        <div class="px-5 py-3.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                            <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
                                <i data-lucide="star" class="w-4 h-4 text-amber-600"></i>
                                <span>KHÁCH HÀNG THÂN THIẾT (VIP WHITELIST)</span>
                            </div>
                            <span class="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">${RiskEngine.vipWhitelists.length}</span>
                        </div>
                        <div class="p-4 flex-1 divide-y divide-slate-100">
                            ${RiskEngine.vipWhitelists.map(vip => `
                                <div class="py-3 flex items-start justify-between gap-3">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <p class="font-bold text-slate-900 text-sm">${vip.name}</p>
                                            <span class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">${vip.cccd}</span>
                                            <span class="text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">${vip.tier}</span>
                                        </div>
                                        <p class="text-xs text-emerald-600 font-medium">✨ Chiết khấu 10% giá phòng | Miễn phí cọc 0đ</p>
                                        <p class="text-[11px] text-slate-500">${vip.note}</p>
                                    </div>
                                    <button onclick="app.removeVip('${vip.cccd}')" class="text-xs text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-all" title="Xóa VIP">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderServicesTab(container) {
        const occupiedRooms = this.rooms.filter(r => r.status === 'OCCUPIED');

        container.innerHTML = `
            <div class="space-y-6">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900">Bảng Giá Dịch Vụ Minibar & Vận Hành Khách Sạn</h2>
                    <p class="text-xs text-slate-500">Tự động cộng dồn vào hóa đơn buồng phòng đang lưu trú theo thời gian thực</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 class="font-bold text-sm text-slate-900 mb-4">Danh Mục Dịch Vụ Có Sẵn</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${SERVICES_MENU.map(item => `
                                <div class="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                                            <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-slate-800 text-xs">${item.name}</p>
                                            <p class="text-xs font-semibold text-emerald-600 mt-0.5">${item.price.toLocaleString('vi-VN')} đ</p>
                                        </div>
                                    </div>
                                    <span class="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">${item.id}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 class="font-bold text-sm text-slate-900 mb-2">Gọi Đồ Nhanh Cho Buồng Phòng</h3>
                            <p class="text-xs text-slate-500 mb-4">Chọn phòng đang có khách lưu trú để bổ sung đồ uống hoặc dịch vụ</p>

                            ${occupiedRooms.length === 0 ? `
                                <p class="text-xs text-slate-400 py-6 text-center italic">Hiện không có phòng nào đang có khách lưu trú</p>
                            ` : `
                                <div class="space-y-2">
                                    ${occupiedRooms.map(r => `
                                        <div class="p-3 rounded-lg border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div>
                                                <p class="font-bold text-slate-900 text-xs">Phòng ${r.number} - ${r.guest ? r.guest.name : ''}</p>
                                                <p class="text-[11px] text-amber-600">Đã dùng: ${(r.services || []).reduce((sum, s) => sum + s.price * s.qty, 0).toLocaleString('vi-VN')} đ</p>
                                            </div>
                                            <button onclick="app.openServiceOrderModal('${r.number}')" class="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-all flex items-center gap-1">
                                                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Thêm món
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                            💡 Mẹo: Có thể gọi trực tiếp từ Sơ đồ phòng Matrix bằng nút "Gọi Minibar".
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAnalyticsTab(container) {
        const totalRooms = this.rooms.length;
        const occupiedRooms = this.rooms.filter(r => r.status === 'OCCUPIED').length;
        const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
        const totalRevenue = this.transactions.reduce((sum, t) => sum + t.amount, 0);

        container.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Tỷ Lệ Lấp Đầy (Occupancy)</p>
                            <h3 class="text-2xl font-black text-slate-900 mt-1">${occupancyRate}%</h3>
                            <p class="text-[11px] text-emerald-600 mt-1 font-medium">${occupiedRooms}/${totalRooms} buồng phòng đang có khách</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <i data-lucide="percent" class="w-6 h-6"></i>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Tổng Doanh Thu Đã Thu</p>
                            <h3 class="text-2xl font-black text-slate-900 mt-1">${totalRevenue.toLocaleString('vi-VN')} đ</h3>
                            <p class="text-[11px] text-slate-500 mt-1">Từ các giao dịch thanh toán check-out</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <i data-lucide="badge-dollar-sign" class="w-6 h-6"></i>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Khách VIP Phục Vụ</p>
                            <h3 class="text-2xl font-black text-slate-900 mt-1">${RiskEngine.vipWhitelists.length}</h3>
                            <p class="text-[11px] text-emerald-600 mt-1 font-medium">Hưởng ưu đãi 10% & Miễn phí cọc</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <i data-lucide="crown" class="w-6 h-6"></i>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase">Ngăn Chặn Rủi Ro</p>
                            <h3 class="text-2xl font-black text-rose-600 mt-1">${RiskEngine.blacklists.length}</h3>
                            <p class="text-[11px] text-rose-600 mt-1 font-medium">Đối tượng trong Danh Sách Đen</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                            <i data-lucide="shield-alert" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 class="font-bold text-sm text-slate-900 mb-4">Cơ Cấu Doanh Thu Theo Hạng Phòng</h3>
                        <div class="h-64 flex items-center justify-center">
                            <canvas id="chart-room-type"></canvas>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 class="font-bold text-sm text-slate-900 mb-4">Doanh Thu 7 Ngày Gần Nhất (Triệu VNĐ)</h3>
                        <div class="h-64 flex items-center justify-center">
                            <canvas id="chart-revenue-week"></canvas>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-200">
                        <h3 class="font-bold text-sm text-slate-900">Lịch Sử Giao Dịch & Hóa Đơn Đã Thu</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                                <tr>
                                    <th class="py-3 px-4">Mã GD</th>
                                    <th class="py-3 px-4">Phòng</th>
                                    <th class="py-3 px-4">Khách Hàng</th>
                                    <th class="py-3 px-4">Thời Gian</th>
                                    <th class="py-3 px-4">Phương Thức</th>
                                    <th class="py-3 px-4 text-right">Tổng Tiền</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${this.transactions.map(t => `
                                    <tr class="hover:bg-slate-50">
                                        <td class="py-3 px-4 font-mono font-bold text-slate-900">${t.id}</td>
                                        <td class="py-3 px-4 font-semibold text-slate-800">Phòng ${t.roomNumber}</td>
                                        <td class="py-3 px-4 text-slate-800">${t.guestName}</td>
                                        <td class="py-3 px-4 text-slate-500">${t.date}</td>
                                        <td class="py-3 px-4">
                                            <span class="px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium text-slate-700">${t.method}</span>
                                        </td>
                                        <td class="py-3 px-4 text-right font-bold text-emerald-600">${t.amount.toLocaleString('vi-VN')} đ</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            const chartRoomEl = document.getElementById('chart-room-type');
            if (chartRoomEl) {
                new Chart(chartRoomEl, {
                    type: 'doughnut',
                    data: {
                        labels: ['Standard Room', 'Deluxe Room', 'Suite VIP Room'],
                        datasets: [{
                            data: [25, 40, 35],
                            backgroundColor: ['#64748b', '#3b82f6', '#a855f7'],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } }
                    }
                });
            }

            const chartRevEl = document.getElementById('chart-revenue-week');
            if (chartRevEl) {
                new Chart(chartRevEl, {
                    type: 'bar',
                    data: {
                        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                        datasets: [{
                            label: 'Doanh thu (triệu đ)',
                            data: [4.2, 5.8, 6.1, 7.5, 12.0, 15.6, 9.4],
                            backgroundColor: '#f59e0b',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }, 100);
    }

    openCheckInModal(roomNumber, isPrebooked = false, bookingId = null) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;

        let prefillName = '';
        let prefillCccd = '';
        let prefillPhone = '';
        if (isPrebooked && room.guest) {
            prefillName = room.guest.name || '';
            prefillCccd = room.guest.cccd || '';
            prefillPhone = room.guest.phone || '';
        }

        const modalHtml = `
            <div id="checkin-modal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="log-in" class="w-5 h-5 text-amber-400"></i>
                            <h3 class="font-bold text-base">Thủ Tục Check-in: Phòng ${room.number} (${room.type})</h3>
                        </div>
                        <button onclick="app.closeModal('checkin-modal')" class="text-slate-400 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="app.handleCheckInSubmit(event, '${room.number}', '${bookingId || ''}')" class="p-6 space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số CCCD / Hộ Chiếu (Bắt buộc kiểm tra rủi ro)</label>
                            <div class="relative">
                                <input type="text" id="checkin-cccd" required value="${prefillCccd}" oninput="app.evaluateRisk(this.value)" placeholder="Ví dụ: 001200000004 (VIP) hoặc 001200000005 (Blacklist)"
                                    class="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono">
                                <span class="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">Tự động quét</span>
                            </div>
                        </div>

                        <div id="risk-alert-box" class="hidden"></div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và Tên Khách Hàng</label>
                                <input type="text" id="checkin-name" required value="${prefillName}" placeholder="Nguyễn Văn A" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số Điện Thoại</label>
                                <input type="tel" id="checkin-phone" required value="${prefillPhone}" placeholder="0912345678" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày Trả Phòng Dự Kiến</label>
                                <input type="date" id="checkin-checkout-date" required class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tiền Đặt Cọc (Deposit)</label>
                                <input type="text" id="checkin-deposit" readonly value="Tiêu chuẩn: 30%" class="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-600 rounded-lg font-bold">
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                            <button type="button" onclick="app.closeModal('checkin-modal')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold">Hủy</button>
                            <button type="submit" id="btn-submit-checkin" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
                                <i data-lucide="check" class="w-4 h-4"></i> Xác Nhận Check-in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modalHtml;
        lucide.createIcons();

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('checkin-checkout-date').value = tomorrow.toISOString().split('T')[0];

        if (prefillCccd) {
            this.evaluateRisk(prefillCccd);
        }
    }

    evaluateRisk(cccd) {
        const alertBox = document.getElementById('risk-alert-box');
        const submitBtn = document.getElementById('btn-submit-checkin');
        const depositInput = document.getElementById('checkin-deposit');
        const nameInput = document.getElementById('checkin-name');

        if (!cccd || cccd.trim().length < 4) {
            alertBox.className = 'hidden';
            submitBtn.disabled = false;
            submitBtn.className = 'px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5';
            submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Xác Nhận Check-in';
            lucide.createIcons();
            return;
        }

        const risk = RiskEngine.check(cccd);

        if (risk.status === 'BLACKLIST') {
            alertBox.className = 'p-3.5 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs animate-pulse';
            alertBox.innerHTML = `
                <div class="flex items-start gap-2">
                    <i data-lucide="shield-alert" class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <strong class="font-bold text-rose-900 block text-sm uppercase">CẢNH BÁO: KHÁCH HÀNG THUỘC DANH SÁCH ĐEN!</strong>
                        <p class="mt-0.5">${risk.data.name} - Vi phạm: <em>${risk.data.reason}</em></p>
                        <p class="text-[11px] font-bold text-rose-700 mt-1">HỆ THỐNG KHÓA CHECK-IN - VUI LÒNG BÁO CHO QUẢN LÝ AN NINH!</p>
                    </div>
                </div>
            `;
            if (nameInput && !nameInput.value) nameInput.value = risk.data.name;
            depositInput.value = 'BỊ CẤM PHỤC VỤ';

            submitBtn.disabled = true;
            submitBtn.className = 'px-5 py-2 bg-rose-300 text-rose-700 rounded-lg text-xs font-bold cursor-not-allowed';
            submitBtn.innerHTML = '<i data-lucide="ban" class="w-4 h-4"></i> TỪ CHỐI CHECK-IN (BLACKLIST)';
            lucide.createIcons();

        } else if (risk.status === 'VIP') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            alertBox.className = 'p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 text-amber-900 text-xs';
            alertBox.innerHTML = `
                <div class="flex items-start gap-2">
                    <i data-lucide="crown" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <strong class="font-bold text-amber-950 block text-sm uppercase">⭐ CHÀO ĐÓN KHÁCH HÀNG ${risk.data.tier}!</strong>
                        <p class="mt-0.5">${risk.data.name} - Đặc quyền: <strong>Giảm 10% giá phòng</strong> & <strong>Miễn phí đặt cọc 0đ</strong>.</p>
                        <p class="text-[11px] text-amber-700 italic mt-0.5">${risk.data.note}</p>
                    </div>
                </div>
            `;
            if (nameInput && !nameInput.value) nameInput.value = risk.data.name;
            depositInput.value = '0 VNĐ (MIỄN PHÍ CỌC VIP)';

            submitBtn.disabled = false;
            submitBtn.className = 'px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-black shadow-md transition-all flex items-center gap-1.5';
            submitBtn.innerHTML = '<i data-lucide="check-check" class="w-4 h-4"></i> Tiếp Đón VIP & Check-in';
            lucide.createIcons();

        } else {
            alertBox.className = 'hidden';
            depositInput.value = '30% Tổng giá phòng';
            submitBtn.disabled = false;
            submitBtn.className = 'px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5';
            submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Xác Nhận Check-in';
            lucide.createIcons();
        }
    }

    handleCheckInSubmit(e, roomNumber, bookingId) {
        e.preventDefault();
        const cccd = document.getElementById('checkin-cccd').value.trim();
        const name = document.getElementById('checkin-name').value.trim();
        const phone = document.getElementById('checkin-phone').value.trim();
        const checkOut = document.getElementById('checkin-checkout-date').value;

        const risk = RiskEngine.check(cccd);
        if (risk.status === 'BLACKLIST') {
            Swal.fire('Cảnh báo an ninh!', 'Không thể check-in cho đối tượng thuộc Danh Sách Đen!', 'error');
            return;
        }

        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;

        room.status = 'OCCUPIED';
        room.guest = {
            name,
            cccd,
            phone,
            isVip: risk.status === 'VIP',
            discount: risk.status === 'VIP' ? 0.10 : 0
        };
        room.checkInDate = new Date().toISOString().split('T')[0];
        room.checkOutDate = checkOut;
        room.services = room.services || [];

        if (bookingId) {
            this.bookings = this.bookings.filter(b => b.id !== bookingId);
        }

        this.saveState();
        this.closeModal('checkin-modal');
        this.switchTab('matrix');

        Swal.fire({
            title: risk.status === 'VIP' ? 'Đón tiếp Khách VIP thành công!' : 'Check-in thành công!',
            text: `Phòng ${room.number} đã bàn giao chìa khóa cho khách: ${name}.`,
            icon: 'success',
            confirmButtonColor: '#f59e0b'
        });
    }

    openServiceOrderModal(roomNumber) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room || room.status !== 'OCCUPIED') return;

        const modalHtml = `
            <div id="service-modal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Gọi Minibar & Dịch Vụ: Phòng ${room.number}</h3>
                            <p class="text-xs text-slate-800">Khách: ${room.guest ? room.guest.name : ''}</p>
                        </div>
                        <button onclick="app.closeModal('service-modal')" class="text-slate-800 hover:text-black">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                        <div class="divide-y divide-slate-100">
                            ${SERVICES_MENU.map(item => `
                                <div class="py-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p class="font-bold text-slate-900 text-xs">${item.name}</p>
                                        <p class="text-xs font-semibold text-emerald-600">${item.price.toLocaleString('vi-VN')} đ</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button type="button" onclick="app.adjustServiceQty('${item.id}', -1)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">-</button>
                                        <span id="qty-${item.id}" class="w-6 text-center font-bold text-xs">0</span>
                                        <button type="button" onclick="app.adjustServiceQty('${item.id}', 1)" class="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-sm">+</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <div>
                            <span class="text-xs text-slate-500">Cộng dồn phát sinh:</span>
                            <p id="service-subtotal" class="font-black text-amber-600 text-base">0 đ</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="app.closeModal('service-modal')" class="px-4 py-2 text-slate-600 text-xs font-semibold">Đóng</button>
                            <button onclick="app.confirmAddServices('${room.number}')" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow transition-all">Ghi Nhận Món</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modalHtml;
        lucide.createIcons();
        window.tempOrder = {};
    }

    adjustServiceQty(serviceId, delta) {
        window.tempOrder = window.tempOrder || {};
        const current = window.tempOrder[serviceId] || 0;
        const next = Math.max(0, current + delta);
        window.tempOrder[serviceId] = next;

        const el = document.getElementById(`qty-${serviceId}`);
        if (el) el.textContent = next;

        let total = 0;
        for (const [sId, qty] of Object.entries(window.tempOrder)) {
            const item = SERVICES_MENU.find(m => m.id === sId);
            if (item) total += item.price * qty;
        }
        document.getElementById('service-subtotal').textContent = `${total.toLocaleString('vi-VN')} đ`;
    }

    confirmAddServices(roomNumber) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;

        let addedCount = 0;
        for (const [sId, qty] of Object.entries(window.tempOrder || {})) {
            if (qty > 0) {
                const item = SERVICES_MENU.find(m => m.id === sId);
                const existing = room.services.find(s => s.id === sId);
                if (existing) {
                    existing.qty += qty;
                } else {
                    room.services.push({ id: item.id, name: item.name, price: item.price, qty });
                }
                addedCount += qty;
            }
        }

        if (addedCount > 0) {
            this.saveState();
            this.closeModal('service-modal');
            this.switchTab('matrix');
            Swal.fire('Thành công!', `Đã ghi nhận ${addedCount} món/dịch vụ vào phòng ${room.number}.`, 'success');
        } else {
            this.closeModal('service-modal');
        }
    }

    openCheckOutModal(roomNumber) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room || room.status !== 'OCCUPIED') return;

        const checkIn = new Date(room.checkInDate || new Date());
        const checkOut = new Date(room.checkOutDate || new Date());
        let days = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)));

        const roomTotal = room.basePrice * days;
        const serviceTotal = (room.services || []).reduce((sum, s) => sum + s.price * s.qty, 0);
        const subtotal = roomTotal + serviceTotal;

        const isVip = room.guest && room.guest.isVip;
        const discount = isVip ? Math.round(roomTotal * 0.10) : 0;
        const vat = Math.round((subtotal - discount) * 0.08);
        const finalAmount = subtotal - discount + vat;

        const modalHtml = `
            <div id="checkout-modal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-base">Thanh Toán & Trả Phòng ${room.number}</h3>
                            <p class="text-xs text-slate-400">Khách hàng: ${room.guest ? room.guest.name : ''} (CCCD: ${room.guest ? room.guest.cccd : ''})</p>
                        </div>
                        <button onclick="app.closeModal('checkout-modal')" class="text-slate-400 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div class="flex justify-between font-semibold text-slate-800">
                                <span>Tiền phòng (${room.type} x ${days} đêm):</span>
                                <span>${roomTotal.toLocaleString('vi-VN')} đ</span>
                            </div>

                            ${(room.services || []).map(s => `
                                <div class="flex justify-between text-slate-600">
                                <span>• ${s.name} (x${s.qty}):</span>
                                <span>${(s.price * s.qty).toLocaleString('vi-VN')} đ</span>
                                </div>
                            `).join('')}

                            <div class="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                                <span>Tạm tính (Subtotal):</span>
                                <span>${subtotal.toLocaleString('vi-VN')} đ</span>
                            </div>

                            ${isVip ? `
                                <div class="flex justify-between text-amber-700 font-bold">
                                    <span>★ Chiết khấu thành viên VIP (10% tiền phòng):</span>
                                    <span>-${discount.toLocaleString('vi-VN')} đ</span>
                                </div>
                            ` : ''}

                            <div class="flex justify-between text-slate-500">
                                <span>Thuế GTGT (VAT 8%):</span>
                                <span>+${vat.toLocaleString('vi-VN')} đ</span>
                            </div>

                            <div class="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-950">
                                <span>TỔNG THANH TOÁN (FINAL):</span>
                                <span class="text-rose-600 text-base">${finalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Phương Thức Thanh Toán</label>
                            <div class="grid grid-cols-3 gap-3">
                                <label class="p-3 border rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-50 transition-all font-semibold text-xs border-amber-500 bg-amber-50/50">
                                    <input type="radio" name="pay-method" value="Chuyển khoản QR" checked class="hidden">
                                    <i data-lucide="qr-code" class="w-5 h-5 text-amber-600"></i>
                                    <span>VietQR Code</span>
                                </label>
                                <label class="p-3 border rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-50 transition-all font-semibold text-xs border-slate-200">
                                    <input type="radio" name="pay-method" value="Tiền mặt" class="hidden">
                                    <i data-lucide="banknote" class="w-5 h-5 text-emerald-600"></i>
                                    <span>Tiền mặt</span>
                                </label>
                                <label class="p-3 border rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-50 transition-all font-semibold text-xs border-slate-200">
                                    <input type="radio" name="pay-method" value="Thẻ tín dụng" class="hidden">
                                    <i data-lucide="credit-card" class="w-5 h-5 text-blue-600"></i>
                                    <span>Thẻ POS</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <button onclick="app.printInvoice('${room.number}', ${roomTotal}, ${serviceTotal}, ${discount}, ${vat}, ${finalAmount})" class="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all">
                            <i data-lucide="printer" class="w-4 h-4"></i> In Hóa Đơn
                        </button>
                        <div class="flex gap-2">
                            <button onclick="app.closeModal('checkout-modal')" class="px-4 py-2 text-slate-600 text-xs font-semibold">Hủy</button>
                            <button onclick="app.confirmCheckOut('${room.number}', ${finalAmount})" class="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5">
                                <i data-lucide="check" class="w-4 h-4"></i> Thu Tiền & Check-out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modalHtml;
        lucide.createIcons();
    }

    confirmCheckOut(roomNumber, finalAmount) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;

        const guestName = room.guest ? room.guest.name : 'Khách vãng lai';

        const txId = `TX-${Math.floor(100 + Math.random() * 900)}`;
        this.transactions.unshift({
            id: txId,
            roomNumber: room.number,
            guestName: guestName,
            amount: finalAmount,
            date: new Date().toLocaleString('vi-VN'),
            method: 'Chuyển khoản QR'
        });

        room.status = 'CLEANING';
        room.guest = null;
        room.services = [];
        room.checkInDate = null;
        room.checkOutDate = null;

        this.saveState();
        this.closeModal('checkout-modal');
        this.switchTab('matrix');

        Swal.fire({
            title: 'Hoàn tất Check-out!',
            text: `Đã thu ${finalAmount.toLocaleString('vi-VN')} đ từ khách ${guestName}. Phòng ${room.number} đã tự động chuyển sang trạng thái CHỜ DỌN DẸP.`,
            icon: 'success',
            confirmButtonColor: '#10b981'
        });
    }

    printInvoice(roomNumber, roomTotal, serviceTotal, discount, vat, finalAmount) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;

        const printArea = document.getElementById('printable-invoice');
        printArea.innerHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
                <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: #0f172a;">KHÁCH SẠN GRAND IMPERIAL</h2>
                    <p style="margin: 3px 0; font-size: 12px; color: #666;">Địa chỉ: 88 Đại Lộ Hoàng Gia, Đà Nẵng | Hotline: 1900 8888</p>
                    <h3 style="margin-top: 15px; color: #d97706;">HÓA ĐƠN THANH TOÁN DỊCH VỤ</h3>
                </div>

                <div style="margin-top: 15px; font-size: 13px;">
                    <p><strong>Số phòng:</strong> ${room.number} (${room.type})</p>
                    <p><strong>Khách hàng:</strong> ${room.guest ? room.guest.name : ''} - CCCD: ${room.guest ? room.guest.cccd : ''}</p>
                    <p><strong>Ngày xuất:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;">
                    <thead>
                        <tr style="background: #f1f5f9; border-bottom: 1px solid #ccc;">
                            <th style="padding: 8px; text-align: left;">Khoản mục</th>
                            <th style="padding: 8px; text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">Tiền phòng lưu trú</td>
                            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${roomTotal.toLocaleString('vi-VN')} đ</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">Dịch vụ Minibar & Khác</td>
                            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${serviceTotal.toLocaleString('vi-VN')} đ</td>
                        </tr>
                        ${discount > 0 ? `
                        <tr style="color: #d97706;">
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">Chiết khấu thành viên VIP (10%)</td>
                            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">-${discount.toLocaleString('vi-VN')} đ</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">Thuế VAT (8%)</td>
                            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">+${vat.toLocaleString('vi-VN')} đ</td>
                        </tr>
                        <tr style="font-weight: bold; font-size: 14px;">
                            <td style="padding: 10px 8px;">TỔNG THANH TOÁN</td>
                            <td style="padding: 10px 8px; text-align: right; color: #dc2626;">${finalAmount.toLocaleString('vi-VN')} đ</td>
                        </tr>
                    </tbody>
                </table>

                <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
                    <p>Cảm ơn quý khách đã tin tưởng và lựa chọn Grand Imperial!</p>
                    <p><em>Hẹn gặp lại quý khách trong kỳ nghỉ tiếp theo.</em></p>
                </div>
            </div>
        `;

        window.print();
    }

    finishCleaning(roomNumber) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;
        room.status = 'AVAILABLE';
        this.saveState();
        this.switchTab('matrix');
        Swal.fire('Đã dọn xong!', `Phòng ${room.number} đã sẵn sàng đón khách mới.`, 'success');
    }

    finishMaintenance(roomNumber) {
        const room = this.rooms.find(r => r.number === roomNumber);
        if (!room) return;
        room.status = 'AVAILABLE';
        this.saveState();
        this.switchTab('matrix');
        Swal.fire('Khôi phục phòng!', `Phòng ${room.number} đã hoàn tất bảo trì.`, 'success');
    }

    openNewBookingModal() {
        const modalHtml = `
            <div id="booking-modal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="calendar-plus" class="w-5 h-5 text-amber-400"></i>
                            <h3 class="font-bold text-base">Tạo Đơn Đặt Phòng Trực Tuyến</h3>
                        </div>
                        <button onclick="app.closeModal('booking-modal')" class="text-slate-400 hover:text-white">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form onsubmit="app.handleNewBookingSubmit(event)" class="p-6 space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày Nhận Phòng (Check-in)</label>
                                <input type="date" id="book-checkin" required onchange="app.filterAvailableBookingRooms()" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày Trả Phòng (Check-out)</label>
                                <input type="date" id="book-checkout" required onchange="app.filterAvailableBookingRooms()" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Chọn Buồng Phòng Trống (Chống Overbooking)</label>
                            <select id="book-room-select" required class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option value="">-- Vui lòng chọn ngày để hệ thống lọc phòng trống --</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số CCCD Khách Hàng (Kiểm tra rủi ro)</label>
                            <input type="text" id="book-cccd" required oninput="app.evaluateBookingRisk(this.value)" placeholder="Ví dụ: 001200000004 (VIP) hoặc 001200000005 (Blacklist)"
                                class="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono">
                        </div>

                        <div id="book-risk-alert" class="hidden"></div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Họ Tên Khách</label>
                                <input type="text" id="book-name" required placeholder="Trần Thị B" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số Điện Thoại</label>
                                <input type="tel" id="book-phone" required placeholder="0988112233" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                            <button type="button" onclick="app.closeModal('booking-modal')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold">Hủy</button>
                            <button type="submit" id="btn-submit-booking" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
                                <i data-lucide="bookmark" class="w-4 h-4"></i> Xác Nhận Giữ Phòng
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modalHtml;
        lucide.createIcons();

        const today = new Date();
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + 2);

        document.getElementById('book-checkin').value = today.toISOString().split('T')[0];
        document.getElementById('book-checkout').value = nextDay.toISOString().split('T')[0];
        this.filterAvailableBookingRooms();
    }

    openQuickBookingModal(roomNumber) {
        this.openNewBookingModal();
        setTimeout(() => {
            const select = document.getElementById('book-room-select');
            if (select) select.value = roomNumber;
        }, 150);
    }

    filterAvailableBookingRooms() {
        const inDate = document.getElementById('book-checkin').value;
        const outDate = document.getElementById('book-checkout').value;
        const select = document.getElementById('book-room-select');
        if (!select) return;

        if (!inDate || !outDate || inDate >= outDate) {
            select.innerHTML = '<option value="">-- Ngày trả phòng phải sau ngày nhận phòng! --</option>';
            return;
        }

        const conflictedRoomNumbers = new Set();

        this.bookings.forEach(b => {
            if (inDate < b.checkOut && outDate > b.checkIn) {
                conflictedRoomNumbers.add(b.roomNumber);
            }
        });

        this.rooms.forEach(r => {
            if (r.status === 'OCCUPIED' && r.checkOutDate) {
                if (inDate < r.checkOutDate) {
                    conflictedRoomNumbers.add(r.number);
                }
            } else if (r.status === 'MAINTENANCE') {
                conflictedRoomNumbers.add(r.number);
            }
        });

        const availableRooms = this.rooms.filter(r => !conflictedRoomNumbers.has(r.number));

        if (availableRooms.length === 0) {
            select.innerHTML = '<option value="">⚠️ Hết phòng trống trong khoảng thời gian này!</option>';
        } else {
            select.innerHTML = availableRooms.map(r => `
                <option value="${r.number}">Phòng ${r.number} (${r.type} - ${r.basePrice.toLocaleString('vi-VN')} đ/đêm)</option>
            `).join('');
        }
    }

    evaluateBookingRisk(cccd) {
        const alertBox = document.getElementById('book-risk-alert');
        const submitBtn = document.getElementById('btn-submit-booking');
        const nameInput = document.getElementById('book-name');

        if (!cccd || cccd.trim().length < 4) {
            alertBox.className = 'hidden';
            submitBtn.disabled = false;
            submitBtn.className = 'px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-md';
            submitBtn.innerHTML = '<i data-lucide="bookmark" class="w-4 h-4"></i> Xác Nhận Giữ Phòng';
            lucide.createIcons();
            return;
        }

        const risk = RiskEngine.check(cccd);
        if (risk.status === 'BLACKLIST') {
            alertBox.className = 'p-3 rounded-xl bg-rose-50 border border-rose-400 text-rose-800 text-xs';
            alertBox.innerHTML = `<strong>⚠️ TỪ CHỐI ĐẶT PHÒNG:</strong> Đối tượng ${risk.data.name} vi phạm: ${risk.data.reason}`;
            submitBtn.disabled = true;
            submitBtn.className = 'px-5 py-2 bg-rose-300 text-rose-700 rounded-lg text-xs font-bold cursor-not-allowed';
            submitBtn.innerHTML = 'KHÓA BỞI BLACKLIST';
        } else if (risk.status === 'VIP') {
            alertBox.className = 'p-3 rounded-xl bg-amber-50 border border-amber-400 text-amber-900 text-xs';
            alertBox.innerHTML = `<strong>⭐ KHÁCH HÀNG ${risk.data.tier}:</strong> Tự động chiết khấu 10% & Miễn phí cọc 0đ.`;
            if (nameInput && !nameInput.value) nameInput.value = risk.data.name;
            submitBtn.disabled = false;
            submitBtn.className = 'px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold';
        } else {
            alertBox.className = 'hidden';
            submitBtn.disabled = false;
            submitBtn.className = 'px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-md';
        }
    }

    handleNewBookingSubmit(e) {
        e.preventDefault();
        const roomNumber = document.getElementById('book-room-select').value;
        const inDate = document.getElementById('book-checkin').value;
        const outDate = document.getElementById('book-checkout').value;
        const cccd = document.getElementById('book-cccd').value.trim();
        const name = document.getElementById('book-name').value.trim();
        const phone = document.getElementById('book-phone').value.trim();

        if (!roomNumber) {
            Swal.fire('Lỗi', 'Vui lòng chọn phòng hợp lệ!', 'warning');
            return;
        }

        const risk = RiskEngine.check(cccd);
        if (risk.status === 'BLACKLIST') {
            Swal.fire('Từ chối!', 'Khách hàng nằm trong danh sách đen!', 'error');
            return;
        }

        const room = this.rooms.find(r => r.number === roomNumber);
        const days = Math.max(1, Math.round((new Date(outDate) - new Date(inDate)) / (1000 * 60 * 60 * 24)));
        const total = room.basePrice * days;
        const deposit = risk.status === 'VIP' ? 0 : Math.round(total * 0.30);

        const newBooking = {
            id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
            roomNumber,
            guestName: name,
            cccd,
            phone,
            checkIn: inDate,
            checkOut: outDate,
            totalDays: days,
            deposit: deposit,
            status: 'CONFIRMED'
        };

        this.bookings.unshift(newBooking);

        const todayStr = new Date().toISOString().split('T')[0];
        if (inDate <= todayStr && room.status === 'AVAILABLE') {
            room.status = 'BOOKED';
            room.guest = { name, cccd, phone };
        }

        this.saveState();
        this.closeModal('booking-modal');
        this.switchTab('booking');

        Swal.fire({
            title: 'Đặt phòng thành công!',
            text: `Đã tạo mã đơn ${newBooking.id} cho phòng ${roomNumber}. Tiền cọc: ${deposit.toLocaleString('vi-VN')} đ.`,
            icon: 'success',
            confirmButtonColor: '#f59e0b'
        });
    }

    cancelBooking(bookingId) {
        Swal.fire({
            title: 'Hủy đơn đặt phòng?',
            text: `Bạn có chắc muốn hủy đơn đặt ${bookingId} không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý hủy',
            cancelButtonText: 'Không',
            confirmButtonColor: '#e11d48'
        }).then(result => {
            if (result.isConfirmed) {
                const b = this.bookings.find(item => item.id === bookingId);
                if (b) {
                    const room = this.rooms.find(r => r.number === b.roomNumber);
                    if (room && room.status === 'BOOKED') {
                        room.status = 'AVAILABLE';
                        room.guest = null;
                    }
                }
                this.bookings = this.bookings.filter(item => item.id !== bookingId);
                this.saveState();
                this.switchTab('booking');
                Swal.fire('Đã hủy!', 'Đơn đặt phòng đã được hủy thành công.', 'success');
            }
        });
    }

    openAddBlacklistModal() {
        const modalHtml = `
            <div id="add-bl-modal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
                        <h3 class="font-bold text-base">Thêm Đối Tượng Vào Blacklist</h3>
                        <button onclick="app.closeModal('add-bl-modal')" class="text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
                    </div>
                    <form onsubmit="app.handleAddBlacklist(event)" class="p-6 space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số CCCD / Hộ Chiếu</label>
                            <input type="text" id="bl-cccd" required placeholder="001200000005" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và Tên</label>
                            <input type="text" id="bl-name" required placeholder="Họ tên đối tượng" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Lý Do Vi Phạm Chi Tiết</label>
                            <textarea id="bl-reason" required rows="3" placeholder="Mô tả hành vi phá hoại tài sản, quỵt tiền hoặc gây rối..." class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
                        </div>
                        <div class="pt-3 border-t flex justify-end gap-2">
                            <button type="button" onclick="app.closeModal('add-bl-modal')" class="px-4 py-2 text-slate-600 text-xs font-semibold">Hủy</button>
                            <button type="submit" class="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs">Thêm Vào Blacklist</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('modal-container').innerHTML = modalHtml;
        lucide.createIcons();
    }

    handleAddBlacklist(e) {
        e.preventDefault();
        const cccd = document.getElementById('bl-cccd').value.trim();
        const name = document.getElementById('bl-name').value.trim();
        const reason = document.getElementById('bl-reason').value.trim();
        RiskEngine.addBlacklist({
            cccd,
            name,
            reason,
            date: new Date().toLocaleDateString('vi-VN')
        });
        this.closeModal('add-bl-modal');
        this.switchTab('risk');
        Swal.fire('Đã thêm Blacklist!', `Đã cấm phục vụ đối tượng: ${name}.`, 'success');
    }

    removeBlacklist(cccd) {
        Swal.fire({
            title: 'Gỡ bỏ lệnh cấm?',
            text: `Bạn có chắc muốn xóa số CCCD ${cccd} khỏi Blacklist?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý gỡ'
        }).then(result => {
            if (result.isConfirmed) {
                RiskEngine.removeBlacklist(cccd);
                this.switchTab('risk');
                Swal.fire('Đã gỡ bỏ!', 'Đối tượng đã được xóa khỏi danh sách đen.', 'success');
            }
        });
    }

    openAddVipModal() {
        const modalHtml = `
            <div id="add-vip-modal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div class="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between">
                        <h3 class="font-bold text-base">Thêm Khách Hàng VIP Thân Thiết</h3>
                        <button onclick="app.closeModal('add-vip-modal')" class="text-slate-950"><i data-lucide="x" class="w-5 h-5"></i></button>
                    </div>
                    <form onsubmit="app.handleAddVip(event)" class="p-6 space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số CCCD / Hộ Chiếu</label>
                            <input type="text" id="vip-cccd" required placeholder="001200000004" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và Tên</label>
                            <input type="text" id="vip-name" required placeholder="Họ tên khách VIP" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Hạng Thẻ Thành Viên</label>
                            <select id="vip-tier" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">
                                <option value="VIP Diamond">VIP Diamond (Hạng Kim Cương)</option>
                                <option value="VIP Platinum">VIP Platinum (Hạng Bạch Kim)</option>
                                <option value="VIP Gold">VIP Gold (Hạng Vàng)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi Chú Đãi Ngộ Riêng</label>
                            <input type="text" id="vip-note" placeholder="Ví dụ: Tặng quà sinh nhật, rượu vang chào mừng..." class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">
                        </div>
                        <div class="pt-3 border-t flex justify-end gap-2">
                            <button type="button" onclick="app.closeModal('add-vip-modal')" class="px-4 py-2 text-slate-600 text-xs font-semibold">Hủy</button>
                            <button type="submit" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs">Lưu Khách VIP</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('modal-container').innerHTML = modalHtml;
        lucide.createIcons();
    }

    handleAddVip(e) {
        e.preventDefault();
        const cccd = document.getElementById('vip-cccd').value.trim();
        const name = document.getElementById('vip-name').value.trim();
        const tier = document.getElementById('vip-tier').value;
        const note = document.getElementById('vip-note').value.trim() || 'Ưu đãi chuẩn VIP';

        RiskEngine.addVip({
            cccd,
            name,
            tier,
            discount: 0.10,
            depositFree: true,
            note
        });
        this.closeModal('add-vip-modal');
        this.switchTab('risk');
        Swal.fire('Thành công!', `Đã thêm khách hàng ${name} vào danh sách ${tier}.`, 'success');
    }

    removeVip(cccd) {
        Swal.fire({
            title: 'Hủy trạng thái VIP?',
            text: `Bạn có chắc muốn xóa CCCD ${cccd} khỏi danh sách VIP?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý'
        }).then(result => {
            if (result.isConfirmed) {
                RiskEngine.removeVip(cccd);
                this.switchTab('risk');
                Swal.fire('Đã cập nhật!', 'Đã gỡ bỏ trạng thái VIP.', 'success');
            }
        });
    }

    handleSearch(query) {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
            this.setFilter('ALL');
            return;
        }

        const match = this.rooms.filter(r => {
            const numMatch = r.number.toLowerCase().includes(q);
            const guestMatch = r.guest && (
                r.guest.name.toLowerCase().includes(q) ||
                (r.guest.cccd && r.guest.cccd.includes(q))
            );
            return numMatch || guestMatch;
        });

        if (this.currentTab !== 'matrix') {
            this.switchTab('matrix');
        }

        const container = document.getElementById('main-container');
        container.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                    <p class="text-sm font-bold text-slate-800">Kết quả tìm kiếm cho: "<span class="text-amber-600">${query}</span>" (${match.length} phòng tìm thấy)</p>
                    <button onclick="app.setFilter('ALL'); document.getElementById('global-search').value='';" class="text-xs text-slate-500 hover:text-slate-800">Xóa tìm kiếm</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${match.map(r => this.renderRoomCard(r)).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    closeModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.remove();
    }
}

// Khởi chạy ứng dụng toàn cục
window.app = new HotelApp();
