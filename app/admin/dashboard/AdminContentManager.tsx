'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AdminBookingsTable } from './AdminBookingsTable';
import {
  createJobAction,
  updateJobAction,
  deleteJobAction,
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
  createCaseStudyAction,
  updateCaseStudyAction,
  deleteCaseStudyAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  deleteContactMessageAction,
} from './content-actions';
import { NotificationToast, type NotificationMessage } from '@/components/ui/NotificationToast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type TabKey = 'bookings' | 'inquiries' | 'careers' | 'faqs' | 'case-studies' | 'testimonials';

export function AdminContentManager({
  bookings,
  activeStatus,
  jobs,
  faqs,
  caseStudies,
  testimonials,
  contactMessages = [],
}: {
  bookings: any[];
  activeStatus: string;
  jobs: any[];
  faqs: any[];
  caseStudies: any[];
  testimonials: any[];
  contactMessages?: any[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('bookings');

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Master Management Sub-Navbar — Clean Surface (No Bulky Underlying Box) */}
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '4px 0',
          marginBottom: '6px',
        }}
      >
        {[
          { key: 'bookings', label: 'Bookings Registry' },
          { key: 'inquiries', label: 'Inquiries & Messages' },
          { key: 'careers', label: 'Careers & Roles' },
          { key: 'faqs', label: 'FAQs Knowledgebase' },
          { key: 'case-studies', label: 'Case Studies' },
          { key: 'testimonials', label: 'Client Testimonials' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              style={{
                flex: '0 0 auto',
                minHeight: '44px',
                padding: '0 22px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                backgroundColor: isActive ? '#ffffff' : '#141414',
                color: isActive ? '#000000' : '#b0b0b0',
                border: '1px solid ' + (isActive ? '#ffffff' : '#282828'),
                boxShadow: isActive ? '0 0 16px rgba(255, 255, 255, 0.2)' : 'none',
                whiteSpace: 'nowrap',
              }}
              className="hover:border-white/50 hover:text-white"
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Render Active View */}
      {activeTab === 'bookings' && (
        <AdminBookingsTable bookings={bookings} activeStatus={activeStatus} />
      )}

      {activeTab === 'inquiries' && (
        <InquiriesCMSView messages={contactMessages} />
      )}

      {activeTab === 'careers' && (
        <CareersCMSView jobs={jobs} />
      )}

      {activeTab === 'faqs' && (
        <FaqsCMSView faqs={faqs} />
      )}

      {activeTab === 'case-studies' && (
        <CaseStudiesCMSView caseStudies={caseStudies} />
      )}

      {activeTab === 'testimonials' && (
        <TestimonialsCMSView testimonials={testimonials} />
      )}
    </div>
  );
}

// ============================================================================
// CAREERS & ROLES CMS VIEW
// ============================================================================
function CareersCMSView({ jobs }: { jobs: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const filtered = jobs.filter((j) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const title = (j.title || '').toLowerCase();
    const category = (j.category || '').toLowerCase();
    const location = (j.location || '').toLowerCase();
    return title.includes(q) || category.includes(q) || location.includes(q);
  });

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const { id, title } = deleteTarget;
    try {
      await deleteJobAction(id);
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: `Career role "${title}" was permanently deleted.`,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setDeleteTarget(null);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete role',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Healthcare Role"
        message={`Are you sure you want to delete the job posting "${deleteTarget?.title}"? It will be removed from the public careers page.`}
        confirmLabel="Delete Role"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Action Bar — Clean Surface (No Bulky Underlying Box) */}
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
            placeholder="Search roles by title, category, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '44px',
              paddingRight: '40px',
              backgroundColor: '#141414',
              color: '#ffffff',
              border: '1px solid #2e2e2e',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
            }}
            className="focus:border-white focus:ring-1 focus:ring-white/40 placeholder:text-neutral-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
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
              setEditingJob(null);
              setIsCreating((p) => !p);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 22px',
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
            <span>{isCreating ? 'Close Creator' : 'Post New Role'}</span>
          </button>
        </div>
      </div>

      {/* Inline Create / Edit Role Form */}
      {(isCreating || editingJob) && (
        <InlineJobForm
          job={editingJob}
          onClose={() => {
            setIsCreating(false);
            setEditingJob(null);
          }}
          onSuccess={(msg) => {
            setIsCreating(false);
            setEditingJob(null);
            setNotification({ type: 'success', message: msg });
            startTransition(() => router.refresh());
          }}
        />
      )}

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((job) => (
          <div
            key={job.id || job.slug}
            className="bg-[#0c0c0c] border border-[#222222] p-8 rounded-xl flex flex-col justify-between hover:border-neutral-500 transition-all shadow-xl"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#181818] border border-[#2e2e2e] text-neutral-300 rounded">
                  {job.category}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded font-bold ${
                    job.status === 'published'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-700/60'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {job.status || 'published'}
                </span>
              </div>

              <h4 className="font-display text-lg text-white font-bold mb-2">
                {job.title}
              </h4>
              <p className="font-mono text-xs text-neutral-400 mb-4">
                {job.location} · {job.employmentType || job.employment_type}
              </p>
              <p className="font-mono text-xs text-neutral-300 line-clamp-3 leading-relaxed mb-6">
                {job.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1f1f1f] flex justify-between items-center">
              <span className="font-mono text-[10px] text-neutral-500 truncate max-w-[150px]">
                /{job.slug}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingJob(job);
                  }}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333333] text-neutral-200 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: job.id, title: job.title })}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineJobForm({
  job,
  onClose,
  onSuccess,
}: {
  job?: any;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [title, setTitle] = useState(job?.title || '');
  const [slug, setSlug] = useState(job?.slug || '');
  const [category, setCategory] = useState(job?.category || 'Virtual Healthcare Support');
  const [location, setLocation] = useState(job?.location || 'Remote — International');
  const [employmentType, setEmploymentType] = useState(job?.employmentType || job?.employment_type || 'Full-time');
  const [summary, setSummary] = useState(job?.summary || '');
  const [status, setStatus] = useState(job?.status || 'published');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        title,
        slug: generatedSlug,
        category,
        location,
        employmentType,
        summary,
        status,
      };
      if (job?.id && !job.id.startsWith('static-')) {
        await updateJobAction(job.id, payload);
        onSuccess(`Role "${title}" was updated successfully.`);
      } else {
        await createJobAction(payload);
        onSuccess(`New role "${title}" was published successfully.`);
      }
    } catch (e: any) {
      setErr(e.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-7 rounded-xl bg-[#121212] border border-white/20 shadow-2xl flex flex-col gap-4 font-mono text-xs animate-fade-in"
    >
      <div className="flex justify-between items-center border-b border-[#252525] pb-3">
        <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
          {job ? `✏ Edit Role · ${job.title}` : '+ Post New Role (Careers CMS)'}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white cursor-pointer text-xs"
        >
          ✕ Cancel
        </button>
      </div>

      {err && (
        <div className="p-3 bg-red-950/60 border border-red-700 text-red-200 rounded-md">
          ⚠ {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Role Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Clinical Documentation Specialist"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!job) {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
              }
            }}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            URL Slug
          </label>
          <input
            type="text"
            required
            placeholder="clinical-documentation-specialist"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
            >
              <option value="Virtual Healthcare Support" className="bg-[#111111] text-white">Virtual Healthcare Support</option>
              <option value="Revenue Cycle Management" className="bg-[#111111] text-white">Revenue Cycle Management</option>
              <option value="Provider Operations" className="bg-[#111111] text-white">Provider Operations</option>
              <option value="Healthcare Documentation" className="bg-[#111111] text-white">Healthcare Documentation</option>
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
            Location
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-[42px] px-3.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none text-xs font-mono"
          />
        </div>
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
            >
              <option value="published" className="bg-[#111111] text-emerald-300">Published</option>
              <option value="draft" className="bg-[#111111] text-neutral-400">Draft</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
          Role Summary & Overview
        </label>
        <textarea
          required
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-[#333333] text-neutral-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-neutral-200 shadow-md"
        >
          {loading ? 'Saving…' : job ? 'Update Role' : 'Publish Role'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// FAQS CMS VIEW
// ============================================================================
function FaqsCMSView({ faqs }: { faqs: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; question: string } | null>(null);

  const categories = Array.from(new Set(faqs.map((f) => f.category || 'General')));

  const filtered = faqs.filter((f) => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const question = (f.question || '').toLowerCase();
    const answer = (f.answer || '').toLowerCase();
    return question.includes(q) || answer.includes(q);
  });

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const { id, question } = deleteTarget;
    try {
      await deleteFaqAction(id);
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: `FAQ "${question}" was deleted successfully.`,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setDeleteTarget(null);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete FAQ',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Knowledgebase FAQ"
        message={`Are you sure you want to delete the question "${deleteTarget?.question}"?`}
        confirmLabel="Delete FAQ"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Action Bar — Clean Surface (No Bulky Underlying Box) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full mb-2">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 items-stretch sm:items-center">
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
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
              placeholder="Search FAQs question or answer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                paddingLeft: '44px',
                paddingRight: '40px',
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2e2e2e',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
              }}
              className="focus:border-white focus:ring-1 focus:ring-white/40 placeholder:text-neutral-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
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
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                height: '44px',
                paddingLeft: '16px',
                paddingRight: '36px',
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #2e2e2e',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                outline: 'none',
              }}
              className="appearance-none cursor-pointer [color-scheme:dark] focus:border-white transition-all"
            >
              <option value="all" className="bg-[#111111] text-white">All Categories ({faqs.length})</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#111111] text-white">
                  {c}
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
        <div style={{ flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setIsCreating((p) => !p);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 22px',
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
              flexShrink: 0,
            }}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{isCreating ? '✕' : '+'}</span>
            <span>{isCreating ? 'Close Creator' : 'Add New FAQ'}</span>
          </button>
        </div>
      </div>

      {/* Inline Create / Edit FAQ Form */}
      {(isCreating || editingFaq) && (
        <InlineFaqForm
          faq={editingFaq}
          onClose={() => {
            setIsCreating(false);
            setEditingFaq(null);
          }}
          onSuccess={(msg) => {
            setIsCreating(false);
            setEditingFaq(null);
            setNotification({ type: 'success', message: msg });
            startTransition(() => router.refresh());
          }}
        />
      )}

      {/* FAQs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((faq) => (
          <div
            key={faq.id || faq.question}
            className="bg-[#0c0c0c] border border-[#222222] p-8 rounded-xl flex flex-col justify-between hover:border-neutral-500 transition-all shadow-xl"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#181818] border border-[#2e2e2e] text-neutral-300 rounded">
                  {faq.category}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded font-bold ${
                    faq.published !== false
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-700/60'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {faq.published !== false ? 'Published' : 'Hidden'}
                </span>
              </div>
              <h4 className="font-display text-base text-white font-bold mb-3">
                {faq.question}
              </h4>
              <p className="font-mono text-xs text-neutral-300 leading-relaxed mb-6 line-clamp-4">
                {faq.answer}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1f1f1f] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingFaq(faq);
                }}
                className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333333] text-neutral-200 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget({ id: faq.id, question: faq.question })}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineFaqForm({
  faq,
  onClose,
  onSuccess,
}: {
  faq?: any;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [question, setQuestion] = useState(faq?.question || '');
  const [answer, setAnswer] = useState(faq?.answer || '');
  const [category, setCategory] = useState(faq?.category || 'Compliance & Governance');
  const [sortOrder, setSortOrder] = useState<number>(faq?.sort_order ?? 0);
  const [published, setPublished] = useState<boolean>(faq?.published ?? true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        question,
        answer,
        category,
        sortOrder: Number(sortOrder) || 0,
        published,
      };
      if (faq?.id && !faq.id.startsWith('static-')) {
        await updateFaqAction(faq.id, payload);
        onSuccess('FAQ was updated successfully.');
      } else {
        await createFaqAction(payload);
        onSuccess('New FAQ was added successfully.');
      }
    } catch (e: any) {
      setErr(e.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-7 rounded-xl bg-[#121212] border border-white/20 shadow-2xl flex flex-col gap-4 font-mono text-xs animate-fade-in"
    >
      <div className="flex justify-between items-center border-b border-[#252525] pb-3">
        <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
          {faq ? `✏ Edit FAQ · ${faq.category}` : '+ Add New Knowledgebase FAQ'}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white cursor-pointer text-xs"
        >
          ✕ Cancel
        </button>
      </div>

      {err && (
        <div className="p-3 bg-red-950/60 border border-red-700 text-red-200 rounded-md">
          ⚠ {err}
        </div>
      )}

      <div>
        <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
          Question
        </label>
        <input
          type="text"
          required
          placeholder="e.g. How does Novalink guarantee PIPEDA compliance?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Category
          </label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Visibility
          </label>
          <div className="relative">
            <select
              value={published ? 'true' : 'false'}
              onChange={(e) => setPublished(e.target.value === 'true')}
              className="w-full h-[42px] appearance-none pl-3.5 pr-9 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none cursor-pointer [color-scheme:dark] text-xs font-mono"
            >
              <option value="true" className="bg-[#111111] text-emerald-300">Published</option>
              <option value="false" className="bg-[#111111] text-neutral-400">Hidden / Draft</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
          Detailed Answer
        </label>
        <textarea
          required
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-[#333333] text-neutral-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-neutral-200 shadow-md"
        >
          {loading ? 'Saving…' : faq ? 'Update FAQ' : 'Save FAQ'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// CASE STUDIES CMS VIEW
// ============================================================================
function CaseStudiesCMSView({ caseStudies }: { caseStudies: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCs, setEditingCs] = useState<any | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const filtered = caseStudies.filter((cs) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const title = (cs.title || '').toLowerCase();
    const industry = (cs.industry || '').toLowerCase();
    const challenge = (cs.challenge || '').toLowerCase();
    const workflow = (cs.workflow || '').toLowerCase();
    return title.includes(q) || industry.includes(q) || challenge.includes(q) || workflow.includes(q);
  });

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const { id, title } = deleteTarget;
    try {
      await deleteCaseStudyAction(id);
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: `Case study "${title}" was removed successfully.`,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setDeleteTarget(null);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete Case Study',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Case Study"
        message={`Are you sure you want to permanently delete the case study "${deleteTarget?.title}"?`}
        confirmLabel="Delete Case Study"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Action Bar — Clean Surface (No Bulky Underlying Box) */}
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
            placeholder="Search case studies by title, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '44px',
              paddingRight: '40px',
              backgroundColor: '#141414',
              color: '#ffffff',
              border: '1px solid #2e2e2e',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
            }}
            className="focus:border-white focus:ring-1 focus:ring-white/40 placeholder:text-neutral-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
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
              setEditingCs(null);
              setIsCreating((p) => !p);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 22px',
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
              flexShrink: 0,
            }}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{isCreating ? '✕' : '+'}</span>
            <span>{isCreating ? 'Close Creator' : 'Add Case Study'}</span>
          </button>
        </div>
      </div>

      {/* Inline Create / Edit Case Study Form */}
      {(isCreating || editingCs) && (
        <InlineCaseStudyForm
          study={editingCs}
          onClose={() => {
            setIsCreating(false);
            setEditingCs(null);
          }}
          onSuccess={(msg) => {
            setIsCreating(false);
            setEditingCs(null);
            setNotification({ type: 'success', message: msg });
            startTransition(() => router.refresh());
          }}
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((cs) => (
          <div
            key={cs.id || cs.slug}
            className="bg-[#0c0c0c] border border-[#222222] p-8 rounded-xl flex flex-col justify-between hover:border-neutral-500 transition-all shadow-xl"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#181818] border border-[#2e2e2e] text-neutral-300 rounded inline-block mb-3">
                {cs.industry}
              </span>
              <h4 className="font-display text-lg text-white font-bold mb-2">
                {cs.title}
              </h4>
              <p className="font-mono text-xs text-neutral-300 line-clamp-3 mb-4 leading-relaxed">
                {cs.challenge}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1f1f1f] flex justify-between items-center">
              <span className="font-mono text-[10px] text-neutral-500 truncate max-w-[150px]">
                /{cs.slug}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCs(cs);
                  }}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333333] text-neutral-200 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: cs.id, title: cs.title })}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineCaseStudyForm({
  study,
  onClose,
  onSuccess,
}: {
  study?: any;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [title, setTitle] = useState(study?.title || '');
  const [slug, setSlug] = useState(study?.slug || '');
  const [industry, setIndustry] = useState(study?.industry || 'Multi-Specialty Surgical');
  const [challenge, setChallenge] = useState(study?.challenge || '');
  const [workflow, setWorkflow] = useState(study?.workflow || '');
  const [approach, setApproach] = useState(study?.approach || '');
  const [operationalImpact, setOperationalImpact] = useState(study?.operationalImpact || study?.operational_impact || '');
  const [metrics, setMetrics] = useState(study?.metrics ? study.metrics.join('\n') : '');
  const [quote, setQuote] = useState(study?.quote || '');
  const [publishedStatus, setPublishedStatus] = useState(study?.publishedStatus || study?.published_status || 'published');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        industry,
        challenge,
        workflow,
        approach,
        operationalImpact,
        metrics: metrics.split('\n').map((m: string) => m.trim()).filter(Boolean),
        quote,
        publishedStatus,
      };
      if (study?.id && !study.id.startsWith('static-')) {
        await updateCaseStudyAction(study.id, payload);
        onSuccess(`Case study "${title}" was updated.`);
      } else {
        await createCaseStudyAction(payload);
        onSuccess(`New case study "${title}" was created.`);
      }
    } catch (e: any) {
      setErr(e.message || 'Failed to save Case Study');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-7 rounded-xl bg-[#121212] border border-white/20 shadow-2xl flex flex-col gap-4 font-mono text-xs animate-fade-in"
    >
      <div className="flex justify-between items-center border-b border-[#252525] pb-3">
        <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
          {study ? `✏ Edit Case Study · ${study.title}` : '+ Add Case Study (Resources CMS)'}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white cursor-pointer text-xs"
        >
          ✕ Cancel
        </button>
      </div>

      {err && (
        <div className="p-3 bg-red-950/60 border border-red-700 text-red-200 rounded-md">
          ⚠ {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
          Operational Challenge
        </label>
        <textarea
          required
          rows={3}
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-[#333333] text-neutral-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-neutral-200 shadow-md"
        >
          {loading ? 'Saving…' : study ? 'Update Study' : 'Publish Study'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// TESTIMONIALS CMS VIEW
// ============================================================================
function TestimonialsCMSView({ testimonials }: { testimonials: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = testimonials.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = (t.name || '').toLowerCase();
    const company = (t.company || '').toLowerCase();
    const role = (t.role || '').toLowerCase();
    const industry = (t.industry || '').toLowerCase();
    const quote = (t.quote || '').toLowerCase();
    return name.includes(q) || company.includes(q) || role.includes(q) || industry.includes(q) || quote.includes(q);
  });

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    try {
      await deleteTestimonialAction(id);
      setDeleteTarget(null);
      setNotification({
        type: 'success',
        message: `Testimonial from "${name}" was deleted.`,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setDeleteTarget(null);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete testimonial',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Testimonial"
        message={`Are you sure you want to remove the testimonial from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Testimonial"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Action Bar — Clean Surface (No Bulky Underlying Box) */}
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
            placeholder="Search testimonials by name, company, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '44px',
              paddingRight: '40px',
              backgroundColor: '#141414',
              color: '#ffffff',
              border: '1px solid #2e2e2e',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
            }}
            className="focus:border-white focus:ring-1 focus:ring-white/40 placeholder:text-neutral-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
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
              setEditingTestimonial(null);
              setIsCreating((p) => !p);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 22px',
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
              flexShrink: 0,
            }}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{isCreating ? '✕' : '+'}</span>
            <span>{isCreating ? 'Close Creator' : 'Add Testimonial'}</span>
          </button>
        </div>
      </div>

      {/* Inline Create / Edit Testimonial Form */}
      {(isCreating || editingTestimonial) && (
        <InlineTestimonialForm
          testimonial={editingTestimonial}
          onClose={() => {
            setIsCreating(false);
            setEditingTestimonial(null);
          }}
          onSuccess={(msg) => {
            setIsCreating(false);
            setEditingTestimonial(null);
            setNotification({ type: 'success', message: msg });
            startTransition(() => router.refresh());
          }}
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((t) => (
          <div
            key={t.id || t.name + t.company}
            className="bg-[#0c0c0c] border border-[#222222] p-8 rounded-xl flex flex-col justify-between hover:border-neutral-500 transition-all shadow-xl"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#181818] border border-[#2e2e2e] text-neutral-300 rounded">
                  {t.industry || 'Healthcare'}
                </span>
                <span className="text-amber-400 text-xs font-mono">★★★★★</span>
              </div>
              <p className="font-mono text-xs text-neutral-200 italic mb-4 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#1f1f1f] flex justify-between items-end">
              <div>
                <p className="font-display text-xs text-white font-bold">{t.name}</p>
                <p className="font-mono text-[10px] text-neutral-400">{t.role} · {t.company}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTestimonial(t);
                  }}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333333] text-neutral-200 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: t.id, name: t.name })}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 hover:text-white rounded text-xs font-mono uppercase cursor-pointer font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineTestimonialForm({
  testimonial,
  onClose,
  onSuccess,
}: {
  testimonial?: any;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [name, setName] = useState(testimonial?.name || '');
  const [role, setRole] = useState(testimonial?.role || '');
  const [company, setCompany] = useState(testimonial?.company || '');
  const [quote, setQuote] = useState(testimonial?.quote || '');
  const [industry, setIndustry] = useState(testimonial?.industry || 'Multi-Specialty Clinic');
  const [published, setPublished] = useState<boolean>(testimonial?.published ?? true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        name,
        role,
        company,
        quote,
        industry,
        published,
      };
      if (testimonial?.id && !testimonial.id.startsWith('static-')) {
        await updateTestimonialAction(testimonial.id, payload);
        onSuccess(`Testimonial from "${name}" was updated.`);
      } else {
        await createTestimonialAction(payload);
        onSuccess(`New testimonial from "${name}" was published.`);
      }
    } catch (e: any) {
      setErr(e.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-7 rounded-xl bg-[#121212] border border-white/20 shadow-2xl flex flex-col gap-4 font-mono text-xs animate-fade-in"
    >
      <div className="flex justify-between items-center border-b border-[#252525] pb-3">
        <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
          {testimonial ? `✏ Edit Testimonial · ${testimonial.name}` : '+ Add Client Testimonial'}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white cursor-pointer text-xs"
        >
          ✕ Cancel
        </button>
      </div>

      {err && (
        <div className="p-3 bg-red-950/60 border border-red-700 text-red-200 rounded-md">
          ⚠ {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Client Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Jonathan Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Role
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Medical Director"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
            Organization / Practice
          </label>
          <input
            type="text"
            required
            placeholder="e.g. West Coast Specialty Clinic"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-neutral-300 uppercase tracking-wider text-[11px] font-bold">
          Quote / Feedback
        </label>
        <textarea
          required
          rows={3}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#181818] text-white border border-[#303030] rounded focus:border-white focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-[#333333] text-neutral-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-neutral-200 shadow-md"
        >
          {loading ? 'Saving…' : testimonial ? 'Update Testimonial' : 'Publish Testimonial'}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// INQUIRIES & DIRECT CONTACT MESSAGES CMS VIEW
// ============================================================================
function InquiriesCMSView({ messages }: { messages: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = messages.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = (m.full_name || '').toLowerCase();
    const email = (m.work_email || '').toLowerCase();
    const company = (m.company || '').toLowerCase();
    const jobTitle = (m.job_title || '').toLowerCase();
    const message = (m.message || '').toLowerCase();
    const country = (m.country || '').toLowerCase();
    const services = Array.isArray(m.interested_services)
      ? m.interested_services.join(' ').toLowerCase()
      : '';
    return (
      name.includes(q) ||
      email.includes(q) ||
      company.includes(q) ||
      jobTitle.includes(q) ||
      message.includes(q) ||
      country.includes(q) ||
      services.includes(q)
    );
  });

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteContactMessageAction(deleteTarget.id);
      setNotification({
        type: 'success',
        message: `Inquiry from "${deleteTarget.name}" deleted successfully.`,
      });
      setDeleteTarget(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setDeleteTarget(null);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete inquiry.',
      });
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Contact Inquiry"
        message={`Are you sure you want to permanently delete the inquiry message from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Control Console: Search & Metadata — Clean Surface (No Bulky Underlying Box) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full mb-3">
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
            placeholder="Search inquiries by client name, email, company, message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
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

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of {messages.length} total inquiries
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-6">
        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-[#111111] border border-[#262626] rounded-xl shadow-xl">
            <p className="font-mono text-sm text-neutral-400">
              {messages.length === 0
                ? 'No client contact messages received yet.'
                : 'No messages match your search criteria.'}
            </p>
          </div>
        ) : (
          filtered.map((msg) => {
            const dateStr = msg.created_at
              ? new Date(msg.created_at).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Unknown date';

            return (
              <div
                key={msg.id}
                style={{
                  backgroundColor: '#101010',
                  border: '1px solid #2c2c2c',
                  borderRadius: '14px',
                  padding: '24px 28px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Header: Name, Org type, Date, and Delete Button */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #222222',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.01em',
                        margin: 0,
                      }}
                    >
                      {msg.full_name}
                    </h3>
                    {msg.organization_type && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#181818',
                          border: '1px solid #383838',
                          color: '#60a5fa',
                          fontWeight: 600,
                        }}
                      >
                        {msg.organization_type.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: '#777777',
                      }}
                    >
                      {dateStr}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: msg.id, name: msg.full_name })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '32px',
                        padding: '0 14px',
                        backgroundColor: '#1c1010',
                        color: '#f87171',
                        border: '1px solid #4a1d1d',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      className="hover:bg-red-950/60 hover:border-red-500 hover:text-white"
                      title="Delete message"
                    >
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Sender Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#151515',
                      border: '1px solid #262626',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#888888',
                        marginBottom: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Email
                    </span>
                    <a
                      href={`mailto:${msg.work_email}`}
                      style={{
                        color: '#ffffff',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                      }}
                      className="hover:underline hover:text-blue-300"
                    >
                      {msg.work_email}
                    </a>
                  </div>

                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#151515',
                      border: '1px solid #262626',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#888888',
                        marginBottom: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Phone
                    </span>
                    {msg.phone ? (
                      <a
                        href={`tel:${msg.phone}`}
                        style={{
                          color: '#ffffff',
                          fontSize: '13px',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                        }}
                        className="hover:underline"
                      >
                        {msg.phone}
                      </a>
                    ) : (
                      <span
                        style={{
                          color: '#666666',
                          fontSize: '13px',
                          fontFamily: 'var(--font-mono)',
                          fontStyle: 'italic',
                        }}
                      >
                        Not provided
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#151515',
                      border: '1px solid #262626',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#888888',
                        marginBottom: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Company & Role
                    </span>
                    <span
                      style={{
                        color: '#ffffff',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {msg.company}
                      {msg.job_title ? ` · ${msg.job_title}` : ''}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#151515',
                      border: '1px solid #262626',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#888888',
                        marginBottom: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Location & Method
                    </span>
                    <span
                      style={{
                        color: '#ffffff',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {msg.country || 'USA-Canada'} · via {msg.preferred_contact_method || 'email'}
                    </span>
                  </div>
                </div>

                {/* Interested Services Pills */}
                {Array.isArray(msg.interested_services) && msg.interested_services.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#888888',
                        marginRight: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Services Requested:
                    </span>
                    {msg.interested_services.map((srv: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#181818',
                          border: '1px solid #333333',
                          color: '#e2e2e2',
                        }}
                      >
                        {srv.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Content */}
                <div
                  style={{
                    padding: '18px 22px',
                    borderRadius: '8px',
                    backgroundColor: '#141414',
                    border: '1px solid #262626',
                    borderLeft: '4px solid #ffffff',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#999999',
                      marginBottom: '8px',
                      fontWeight: 700,
                    }}
                  >
                    Direct Message
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: '#eeeeee',
                      lineHeight: 1.6,
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
