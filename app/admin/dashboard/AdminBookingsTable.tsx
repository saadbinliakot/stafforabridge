'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateBookingStatus,
  updateBookingDetails,
  deleteBooking,
  createManualBooking,
} from './actions';
import { NotificationToast, type NotificationMessage } from '@/components/ui/NotificationToast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type Booking = {
  id: string;
  user_id: string | null;
  service_type: string;
  booking_date: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  created_at: string;
};

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const SERVICES_LIST = [
  'Appointment Setting & Scheduling',
  'Virtual Healthcare Assistance',
  'Patient Intake & Registration',
  'Insurance & Eligibility Verification',
  'Prior Authorization',
  'Medical Billing',
  'Medical Coding',
  'Provider Credentialing & Enrollment',
  'Clinical Documentation',
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function AdminBookingsTable({
  bookings,
  activeStatus,
}: {
  bookings: Booking[];
  activeStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState(activeStatus || 'all');

  // Editor states
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form states for Inline Create
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newServiceType, setNewServiceType] = useState(SERVICES_LIST[0]);
  const [newBookingDate, setNewBookingDate] = useState('');
  const [newStatus, setNewStatus] = useState('pending');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form states for Inline Edit
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editService, setEditService] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Filtered rows with safe strings
  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (currentStatus !== 'all') {
      list = list.filter((b) => b.status === currentStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((b) => {
        const name = (b.contact_name || '').toLowerCase();
        const email = (b.contact_email || '').toLowerCase();
        const phone = (b.contact_phone || '').toLowerCase();
        const service = (b.service_type || '').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q) || service.includes(q);
      });
    }
    return list;
  }, [bookings, currentStatus, searchQuery]);

  function setFilter(status: string) {
    setCurrentStatus(status);
    const url = status === 'all' ? '/admin/dashboard' : `/admin/dashboard?status=${status}`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', url);
    }
  }

  async function handleQuickStatusChange(id: string, nextStatus: string) {
    try {
      await updateBookingStatus(id, nextStatus);
      setNotification({
        type: 'success',
        message: `Booking status changed to ${nextStatus.toUpperCase()}.`,
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update status',
      });
    }
  }

  function startEdit(b: Booking) {
    setIsCreating(false);
    setEditingBooking(b);
    setEditName(b.contact_name || '');
    setEditEmail(b.contact_email || '');
    setEditPhone(b.contact_phone || '');
    setEditService(b.service_type || SERVICES_LIST[0]);
    setEditDate(b.booking_date ? b.booking_date.slice(0, 16) : '');
    setEditStatus(b.status || 'pending');
    setEditError(null);
  }

  async function handleInlineCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      await createManualBooking({
        contactName: newContactName,
        contactEmail: newContactEmail,
        contactPhone: newContactPhone,
        serviceType: newServiceType,
        bookingDate: newBookingDate,
        status: newStatus,
      });
      setIsCreating(false);
      setNewContactName('');
      setNewContactEmail('');
      setNewContactPhone('');
      setNewBookingDate('');
      setNotification({
        type: 'success',
        message: 'New consultation booking created successfully.',
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create booking');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleInlineEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBooking) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await updateBookingDetails(editingBooking.id, {
        contactName: editName,
        contactEmail: editEmail,
        contactPhone: editPhone,
        serviceType: editService,
        bookingDate: editDate,
        status: editStatus,
      });
      setEditingBooking(null);
      setNotification({
        type: 'success',
        message: `Booking for ${editName} updated successfully.`,
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setEditError(err.message || 'Failed to save changes');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const targetName = deleteTarget.name;
    try {
      await deleteBooking(deleteTarget.id);
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: `Booking record for "${targetName}" deleted successfully.`,
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setDeleteTarget(null);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete booking',
      });
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* On-Screen Luxury Notification Toast */}
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      {/* In-App Confirmation Modal (No Web Popups) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Booking Record"
        message={`Are you sure you want to permanently delete the booking record for "${deleteTarget?.name}"? All associated notes and schedule details will be removed.`}
        confirmLabel="Confirm Delete"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Control Console: Search, Action, Filter Tabs — Clean Surface (No Bulky Underlying Box) */}
      <div className="flex flex-col gap-8 w-full">
        {/* Top bar: Search + Add Booking with Generous Spacing */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full mb-2">
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8e8e8e',
                zIndex: 2,
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search contact, email, service…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                paddingLeft: '44px',
                paddingRight: '40px',
                backgroundColor: '#121212',
                color: '#ffffff',
                border: '1px solid #333333',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
              }}
              className="focus:border-white focus:ring-1 focus:ring-white/40 placeholder:text-neutral-500 transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  padding: 0,
                  margin: 0,
                  backgroundColor: '#262626',
                  border: '1px solid #3a3a3a',
                  borderRadius: '50%',
                  color: '#d4d4d4',
                  cursor: 'pointer',
                  zIndex: 2,
                  fontSize: '11px',
                  lineHeight: 1,
                }}
                className="hover:bg-white hover:text-black hover:border-white transition-all"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => {
                setEditingBooking(null);
                setIsCreating((prev) => !prev);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '46px',
                padding: '0 24px',
                backgroundColor: isCreating ? '#1e1e1e' : '#ffffff',
                color: isCreating ? '#ffffff' : '#000000',
                border: '1px solid ' + (isCreating ? '#383838' : '#ffffff'),
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isCreating ? 'none' : '0 2px 12px rgba(255, 255, 255, 0.18)',
                whiteSpace: 'nowrap',
              }}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>{isCreating ? '✕' : '+'}</span>
              <span>{isCreating ? 'Close Creator' : 'Add New Booking'}</span>
            </button>
          </div>
        </div>

        {/* Inline Create Booking Panel */}
        {isCreating && (
          <form
            onSubmit={handleInlineCreate}
            className="p-6 rounded-xl bg-[#121212] border border-white/20 shadow-2xl flex flex-col gap-4 font-mono text-xs animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-[#252525] pb-3">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400 font-bold">+</span> New Booking Entry (Executive Desk)
              </h4>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-neutral-400 hover:text-white cursor-pointer text-xs"
              >
                ✕ Close
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-red-950/60 border border-red-700 text-red-200 rounded-md">
                ⚠ {createError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Miller"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="doctor@practice.com"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (416) 555-0199"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Outsourcing Role
                </label>
                <div className="relative">
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                    className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
                  >
                    {SERVICES_LIST.map((s) => (
                      <option key={s} value={s} className="bg-[#111111] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Date & Time (UTC/Local)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newBookingDate}
                  onChange={(e) => setNewBookingDate(e.target.value)}
                  className="w-full h-[42px] px-3.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none [color-scheme:dark] text-xs font-mono"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Initial Status
                </label>
                <div className="relative">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
                  >
                    <option value="pending" className="bg-[#111111] text-amber-300">Pending</option>
                    <option value="confirmed" className="bg-[#111111] text-emerald-300">Confirmed</option>
                    <option value="completed" className="bg-[#111111] text-blue-300">Completed</option>
                    <option value="cancelled" className="bg-[#111111] text-neutral-400">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded border border-[#333333] text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-neutral-200 shadow-md"
              >
                {createLoading ? 'Creating…' : 'Create Booking'}
              </button>
            </div>
          </form>
        )}

        {/* Inline Edit Booking Panel */}
        {editingBooking && (
          <form
            onSubmit={handleInlineEdit}
            className="p-6 rounded-xl bg-[#121212] border border-blue-500/40 shadow-2xl flex flex-col gap-4 font-mono text-xs animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-[#252525] pb-3">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">✏</span> Modify Booking · {editingBooking.contact_name}
              </h4>
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="text-neutral-400 hover:text-white cursor-pointer text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-red-950/60 border border-red-700 text-red-200 rounded-md">
                ⚠ {editError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Outsourcing Role
                </label>
                <div className="relative">
                  <select
                    value={editService}
                    onChange={(e) => setEditService(e.target.value)}
                    className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
                  >
                    {SERVICES_LIST.map((s) => (
                      <option key={s} value={s} className="bg-[#111111] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full h-[42px] px-3.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none [color-scheme:dark] text-xs font-mono"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
                  >
                    <option value="pending" className="bg-[#111111] text-amber-300">Pending</option>
                    <option value="confirmed" className="bg-[#111111] text-emerald-300">Confirmed</option>
                    <option value="completed" className="bg-[#111111] text-blue-300">Completed</option>
                    <option value="cancelled" className="bg-[#111111] text-neutral-400">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="px-4 py-2 rounded border border-[#333333] text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-neutral-200 shadow-md"
              >
                {editLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Status Filter Segmented Controls */}
        <div className="pt-6 border-t border-[#1e1e1e] mt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 font-bold block">
              Filter by Status
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              Showing {filteredBookings.length} of {bookings.length} total bookings
            </span>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap">
            {STATUS_TABS.map((tab) => {
              const active = tab.value === currentStatus;
              const count =
                tab.value === 'all'
                  ? bookings.length
                  : bookings.filter((b) => b.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilter(tab.value)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '38px',
                    padding: '0 16px',
                    backgroundColor: active ? '#ffffff' : '#141414',
                    color: active ? '#000000' : '#b8b8b8',
                    border: '1px solid ' + (active ? '#ffffff' : '#282828'),
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: active ? 700 : 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? '0 0 16px rgba(255, 255, 255, 0.2)' : 'none',
                  }}
                  className="hover:border-white/50 hover:text-white"
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '22px',
                      height: '20px',
                      padding: '0 6px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: active ? '#000000' : '#242424',
                      color: active ? '#ffffff' : '#d4d4d4',
                      border: active ? 'none' : '1px solid #363636',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Table or High-Contrast Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-[#0c0c0c] border border-[#222222] rounded-lg shadow-2xl flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#2c2c2c] flex items-center justify-center mb-4 text-neutral-300">
            <svg className="w-6 h-6" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-white font-bold mb-2">
            No Bookings Found
          </h3>
          <p className="font-mono text-xs text-neutral-300 max-w-md mx-auto mb-6 leading-relaxed">
            {searchQuery
              ? `No records match your search query "${searchQuery}" in "${activeStatus}" filter.`
              : activeStatus !== 'all'
              ? `There are currently 0 bookings categorized under "${activeStatus}".`
              : 'The consultation bookings ledger is currently empty. Patient inquiries and scheduled sessions will log here automatically.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingBooking(null);
              setIsCreating(true);
            }}
            className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold font-mono text-xs uppercase tracking-wider rounded-md cursor-pointer transition-all shadow-md"
          >
            + Create First Booking
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#222222] bg-[#0c0c0c] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#141414] font-mono text-[11px] tracking-wider uppercase text-neutral-200 font-bold">
                <th className="py-5 px-6">Contact Name</th>
                <th className="py-5 px-6">Service Requested</th>
                <th className="py-5 px-6">Contact Details</th>
                <th className="py-5 px-6">Scheduled Date</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f] font-mono text-xs">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-[#141414] transition-colors duration-150"
                >
                  {/* Contact */}
                  <td className="py-5 px-6">
                    <p className="font-bold text-white text-sm">{b.contact_name}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Submitted {formatDate(b.created_at)}
                    </p>
                  </td>

                  {/* Service */}
                  <td className="py-5 px-6">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        backgroundColor: '#161616',
                        border: '1px solid #333333',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.3,
                      }}
                    >
                      {b.service_type}
                    </span>
                  </td>

                  {/* Contact Details */}
                  <td className="py-5 px-6 space-y-1.5 text-xs">
                    <a
                      href={`mailto:${b.contact_email}`}
                      className="block text-neutral-300 hover:text-white underline decoration-neutral-600 hover:decoration-white truncate max-w-[220px]"
                    >
                      {b.contact_email}
                    </a>
                    <a
                      href={`tel:${b.contact_phone}`}
                      className="block text-neutral-400 hover:text-white font-mono text-[11px]"
                    >
                      {b.contact_phone}
                    </a>
                  </td>

                  {/* Booking Date */}
                  <td className="py-5 px-6 text-xs text-white font-medium whitespace-nowrap">
                    {formatDate(b.booking_date)}
                  </td>

                  {/* Status Dropdown (Quick in-place edit) */}
                  <td className="py-5 px-6">
                    <select
                      value={b.status}
                      onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                      disabled={isPending}
                      className={`text-xs font-mono tracking-wider uppercase px-3.5 py-2 rounded-md cursor-pointer border outline-none font-bold ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60'
                          : b.status === 'completed'
                          ? 'bg-blue-950/40 text-blue-300 border-blue-700/60'
                          : b.status === 'cancelled'
                          ? 'bg-neutral-900 text-neutral-400 border-neutral-700'
                          : 'bg-amber-950/40 text-amber-300 border-amber-700/60'
                      }`}
                    >
                      <option value="pending" className="bg-[#111111] text-amber-300">Pending</option>
                      <option value="confirmed" className="bg-[#111111] text-emerald-300">Confirmed</option>
                      <option value="completed" className="bg-[#111111] text-blue-300">Completed</option>
                      <option value="cancelled" className="bg-[#111111] text-neutral-400">Cancelled</option>
                    </select>
                  </td>

                  {/* Action buttons */}
                  <td className="py-5 px-6 text-right space-x-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => startEdit(b)}
                      className="font-mono text-xs uppercase text-neutral-300 hover:text-white px-3 py-1.5 bg-[#181818] hover:bg-[#242424] border border-[#333333] rounded-md transition-all cursor-pointer font-bold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: b.id, name: b.contact_name })}
                      className="font-mono text-xs uppercase text-red-300 hover:text-white px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 border border-red-800/60 rounded-md transition-all cursor-pointer font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
